// ==========================================
// ၁။ Initializations & Variables
// ==========================================

// Firebase initialize လုပ်ပြီးသားကို ခေါ်သုံးခြင်း
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// let currentZoomLink = "https://zoom.us/j/your_meeting_id"; // ဒီမှာ ကိုယ့် Link ထည့်ပါ
let currentZoomLink = ""; // ပုံသေမထားတော့ဘဲ Database မှယူမည်
let nextClassTime = null;
let activeChatId = "Batch-05"; // Default ကို Group Chat ထားမယ်
let activeChatName = "Group: Batch-05";

// Global User State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    isLoggedIn: false, 
    uid: "", 
    name: "", 
    role: "Student",
    enrolledCourses: [], // 🔥 ဥပမာ - ["web", "python"] (ပိုက်ဆံပေးပြီးသော ID များ)
    selectedCourseId: "", // 🔥 လက်ရှိ ဝင်ရောက်ကြည့်ရှုနေသော သင်တန်း ID
    photo: "https://placehold.co/150x150/003087/white?text=User",
    skills: [], 
    notes: "", 
    isPaid: false, // 🔥 အစပိုင်းမှာ false ဖြစ်ရပါမည်
    github: "", 
    portfolio: "", 
    linkedin: "", facebook: "", youtube: "", tiktok: "", instagram: "", email: "",
    quizAttempts: {}, 
    
    // ပြီးမြောက်ထားသော သင်ခန်းစာ ၅ ခု (Certificate ပွင့်ရန် လိုအပ်ချက်)
    completedLessons: [], 
    
    // ဘာသာရပ်အလိုက် အမှတ်စာရင်း (GPA 75 ကျော်စေရန်)
    grades: {},
};

// ဆရာမှ သတ်မှတ်ပေးမည့် ပြင်လို့မရသော အချက်အလက်များ (Database မှ လာမည်)
let academicInfo = {
  examDate: "-",
  attendance: "0%",
  overallGrade: "-",
  batchName: "-",
  startDate: "-"
};

// app.js ရဲ့ variables တွေထားတဲ့ နေရာမှာ ထည့်ပါ
let isAudioUnlocked = false;
const notiSound = new Audio('assets/noti-sound.mp3');

// Browser အားလုံးမှာ အသံဖွင့်ခွင့်ရအောင် user က ပထမဆုံး click တဲ့အချိန်မှာ unlock လုပ်မည်
window.addEventListener('click', () => {
    if (!isAudioUnlocked) {
        // အသံတိတ် (mute) နဲ့ ခဏဖွင့်ပြီး ပြန်ရပ်လိုက်ခြင်းဖြင့် အသံစနစ်ကို ပွင့်သွားစေပါသည်
        notiSound.muted = true;
        notiSound.play().then(() => {
            notiSound.pause();
            notiSound.muted = false;
            isAudioUnlocked = true;
            console.log("Audio system unlocked for Safari/Firefox/Chrome");
        });
    }
}, { once: true });

// ၁။ Dark Mode (ညဘက်လေ့လာသူများအတွက်)
function toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    const isDarkNow = document.body.classList.contains('dark-theme');
    localStorage.setItem('dark-mode', isDarkNow); // Browser မှာ မှတ်ထားမည်
    renderAuthFooter(); // Sidebar ခလုတ် icon ပြောင်းရန်
}

// ၂။ Firestore Sync (Cloud Backup)
async function syncProgressToCloud() {
    if (!currentUser.uid || !currentUser.isLoggedIn) return;

    try {
        await db.collection('users').doc(currentUser.uid).set({
            completedLessons: currentUser.completedLessons || [],
            quizAttempts: currentUser.quizAttempts || {},
            lastLesson: currentUser.lastLesson || null
        }, { merge: true }); // merge: true က ရှိပြီးသား data တွေကို မဖျက်ဘဲ အသစ်ပေါင်းထည့်ပေးတာပါ
        
        console.log("Progress synced to Cloud!");
    } catch (error) {
        console.error("Cloud Sync Error:", error);
    }
}

// Database မှ Zoom Link နှင့် အတန်းချိန်ကို အမြဲစောင့်ကြည့်နေမည့် function
function syncZoomConfig() {
    db.collection('settings').doc('zoom_config').onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            currentZoomLink = data.url || ""; // Link မရှိလျှင် empty string ထားမည်
            if (data.startTime) {
                nextClassTime = data.startTime.toDate();
            }
            
            // 🔥 အကယ်၍ အခုလက်ရှိ Dashboard ကို ကြည့်နေတာဆိုရင် ချက်ချင်း UI ပြန်ဆွဲခိုင်းမည်
            const title = document.getElementById('page-title');
            if (title && title.innerText === "Dashboard") {
                renderDashboard();
            }
        }
    }, err => console.warn("Zoom config sync restricted"));
}

// ==========================================
// ၂။ Sidebar & Navigation Logic
// ==========================================

function toggleNav() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}


function showSection(section, filterCat = null) {
    const title = document.getElementById('page-title');
    const body = document.getElementById('dynamic-body');
    const sidebar = document.getElementById('sidebar');

    if (!title || !body) return;

    // ၁။ 🔥 ပိုက်ဆံမသွင်းရသေးသူ (သို့မဟုတ်) သင်တန်းမရှိသေးသူများကို တားဆီးရန် Logic
    const restrictedSections = ['courses', 'messages', 'resources', 'profile'];
    
    // ကျောင်းသားဖြစ်ပြီး ဘယ်သင်တန်းမှ မဝယ်ရသေးရင် (enrolledCourses အလွတ်ဖြစ်နေရင်) တားပါမယ်
    const hasNoCourse = !currentUser.enrolledCourses || currentUser.enrolledCourses.length === 0;

    if (restrictedSections.includes(section) && currentUser.role !== 'Teacher' && hasNoCourse) {
        alert("⚠️ ဤကဏ္ဍများကို အသုံးပြုရန် သင်တန်းအနည်းဆုံးတစ်ခု အရင်အပ်နှံရန် လိုအပ်ပါသည်။");
        renderCourseSelection(); // သင်တန်းရွေးချယ်မှုစာမျက်နှာသို့ ပြန်ပို့မည်
        return; 
    }

    // Sidebar ပိတ်မည်
    if (sidebar && sidebar.classList.contains('open')) toggleNav();

    // Section Switching logic များ (Dashboard, Courses, Profile စသည် - အရင်အတိုင်းထားပါ)
    if (section === 'dashboard') {
        title.innerText = "Dashboard";
        renderDashboard();
    } else if (section === 'courses') {
        renderCourseTree(filterCat);
    } else if (section === 'courses_all') {
        renderCourseSelection();
    } else if (section === 'messages') {
        showMessages();
    } else if (section === 'profile') {
        renderProfile();
    } else if (section === 'resources') {
        renderResources();
    } else if (section === 'about') {
        renderAbout();
    } else if (section === 'privacy') {
        renderPrivacy();
    }
    
    renderAuthFooter();
}
// function showSection(section, filterCat = null) {

//     // 🔥 အရေးကြီးသည် - 'သင်တန်းများအားလုံး' ခလုတ်အတွက်
//     if (section === 'courses_all') {
//         title.innerText = "သင်တန်းများ ရွေးချယ်ရန်";
//         renderCourseSelection();
//         return;
//     }

//     // ၁။ Gatekeeper စစ်ဆေးခြင်း (သင်တန်းမရွေးရသေးဘဲ Dashboard/Lessons ဝင်ခိုင်းခြင်းကို တားဆီးရန်)
//     if ((section === 'dashboard' || section === 'courses') && !currentUser.selectedCourseId && currentUser.role !== 'Teacher') {
//         renderCourseSelection();
//         return;
//     }

//     if (section === 'dashboard') {
//         title.innerText = "Dashboard";
//         renderDashboard();
//     } else if (section === 'courses') {
//         // 🔥 လက်ရှိရွေးထားတဲ့ သင်တန်းရှိမှ သင်ခန်းစာမာတိကာပြမည်
//         if (currentUser.selectedCourseId) {
//             title.innerText = filterCat ? `${filterCat} သင်ခန်းစာများ` : "သင်ခန်းစာများအားလုံး";
//             renderCourseTree(filterCat);
//         } else {
//             renderCourseSelection();
//         }
//     } else if (section === 'messages') {
//         title.innerText = "Messages";
//         showMessages();
//     } else if (section === 'profile') {
//         title.innerText = "My Profile";
//         renderProfile();
//     } else if (section === 'resources') {
//         renderResources();
//     }
    
//     renderAuthFooter();
// }

function renderResources() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="dashboard-grid animate-up">
            <div class="content-card">
                <h4><i class="fab fa-git-alt"></i> Git Cheat Sheet</h4>
                <p>အသုံးများသော Git Commands များ</p>
                <button class="save-btn" onclick="window.open('https://education.github.com/git-cheat-sheet-education.pdf', '_blank')">Download</button>
            </div>
            <div class="content-card">
                <h4><i class="fab fa-html5"></i> HTML Reference</h4>
                <p>MDN Web Docs - HTML Elements</p>
                <button class="save-btn" onclick="window.open('https://developer.mozilla.org/en-US/docs/Web/HTML/Element', '_blank')">View Online</button>
            </div>
            <div class="content-card">
                <h4><i class="fab fa-css3-alt"></i> CSS Grid Guide</h4>
                <p>A Complete Guide to Grid</p>
                <button class="save-btn" onclick="window.open('https://css-tricks.com/snippets/css/complete-guide-grid/', '_blank')">Read Guide</button>
            </div>
        </div>
    `;
}

// ==========================================
// ၃။ Dashboard Rendering
// ==========================================

function renderDashboard() {
    const body = document.getElementById('dynamic-body');
    if (!body) return;

    // ၁။ လက်ရှိရွေးထားတဲ့ သင်တန်းရှိမရှိ စစ်ဆေးခြင်း
    const currentCourse = allCourses[currentUser.selectedCourseId];
    if (!currentCourse) {
        renderCourseSelection(); // သင်တန်းမရွေးရသေးရင် ရွေးခိုင်းမည်
        return;
    }

    // ၂။ ပြီးစီးမှု ရာခိုင်နှုန်းတွက်ချက်သည့် Helper
    const getPercent = (catName) => {
        const categoryData = currentCourse.data.find(c => c.category.toLowerCase() === catName.toLowerCase());
        if (!categoryData) return 0;
        
        let totalLessons = 0;
        categoryData.modules.forEach(m => totalLessons += m.lessons.length);
        
        const doneList = currentUser.completedLessons || []; 
        const doneCount = doneList.filter(l => {
            return categoryData.modules.some(m => m.lessons.some(les => les.title === l));
        }).length;

        return Math.round((doneCount / totalLessons) * 100) || 0;
    };

    // ၃။ Live Class Card (Link ရှိမှ တည်ဆောက်မည်)
    let liveClassHtml = "";
    if (currentZoomLink && currentZoomLink.trim() !== "") {
        liveClassHtml = `
            <div class="live-countdown animate-up">
                <h4><i class="fas fa-video"></i> Next Live Class</h4>
                <div class="timer-grid" id="live-timer">Loading...</div>
                <button class="save-btn" style="margin-top:10px; background:#f59e0b;" 
                        onclick="window.open('${currentZoomLink}', '_blank')">
                    <i class="fas fa-video"></i> Join via Zoom
                </button>
            </div>
        `;
    }

    // ၄။ သင်တန်းထဲမှာ ရှိသမျှ Category Cards များကို Dynamic ထုတ်ယူခြင်း
    let categoryCardsHtml = "";
    currentCourse.data.forEach(cat => {
        const percent = getPercent(cat.category);
        categoryCardsHtml += `
            <div class="topic-card animate-up" onclick="showSection('courses', '${cat.category}')">
                <div class="card-icon"><i class="fas fa-layer-group"></i></div>
                <h3>${cat.category}</h3>
                <div class="progress-container"><div class="progress-bar" style="width:${percent}%"></div></div>
                <small>${percent}% Completed</small>
            </div>
        `;
    });

    // ၅။ ဆရာဖြစ်လျှင် Leaderboard ထည့်မည်
    let leaderboardHtml = "";
    if (currentUser.role === 'Teacher') {
        leaderboardHtml = `
            <div class="content-card animate-up" style="grid-column: span 1;">
                <h4><i class="fas fa-trophy" style="color:gold"></i> Top Students</h4>
                <div id="leaderboard-content" style="margin-top:10px;">
                    <div class="loader">Loading...</div>
                </div>
            </div>
        `;
    }

    // ၆။ အားလုံးကို စုစည်းပြီး တစ်ခါတည်း Render လုပ်ခြင်း
    body.innerHTML = `
        ${liveClassHtml}

        <div class="welcome-banner fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
                <div>
                    <h2>မင်္ဂလာပါ ${currentUser.name}! 👋</h2>
                    <p>လက်ရှိသင်တန်း- <strong>${currentCourse.title}</strong></p>
                </div>
                <button class="menu-btn" style="background:rgba(255,255,255,0.2); border:1px solid white;" onclick="renderCourseSelection()">
                    <i class="fas fa-exchange-alt"></i> သင်တန်းပြောင်းရန်
                </button>
            </div>
        </div>

        <div class="dashboard-grid">
            ${categoryCardsHtml}
            ${leaderboardHtml}
        </div>

        <div class="content-card animate-up" style="margin-top:25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4><i class="fas fa-sticky-note"></i> My Personal Notebook</h4>
                <small id="char-counter" style="color:var(--text-main)">
                    ${(currentUser.personalNote || "").length} / 10000 characters
                </small>
            </div>
            <textarea id="personal-note" class="edit-input" rows="6" 
                      oninput="handleNoteInput()" 
                      placeholder="ဒီနေ့ ဘာတွေသင်ယူခဲ့သလဲ? မှတ်သားထားပါ...">${currentUser.personalNote || ""}</textarea>
            <div style="display:flex; justify-content:space-between; margin-top:5px;">
                <small id="note-status" style="color:#22c55e">Cloud auto-sync active</small>
                <button class="menu-btn" style="padding:4px 12px; font-size:0.75rem;" onclick="downloadNotes()">
                    <i class="fas fa-download"></i> Download as Text
                </button>
            </div>
        </div>
    `;

    // ၇။ Logic ပြီးမှ Leaderboard ဆွဲခိုင်းမည်
    if (currentUser.role === 'Teacher') fetchLeaderboard();
}

// Input ကို စစ်ဆေးပြီး Auto-save လုပ်မည့် function
function handleNoteInput() {
    const textarea = document.getElementById('personal-note');
    const counter = document.getElementById('char-counter');
    
    if (!textarea || !counter) return;

    const currentLength = textarea.value.length;

    // စာလုံးရေကို UI မှာ ချက်ချင်း Update လုပ်ခြင်း
    counter.innerText = `${currentLength} / 10000 characters`;

    // ၅၀၀၀ ထက်ကျော်မကျော် စစ်ဆေးခြင်း
    if (currentLength > 10000) {
        // ၅၀၀၀ ထက်ပိုတဲ့စာတွေကို ဖြတ်ထုတ်မည်
        textarea.value = textarea.value.substring(0, 10000);
        counter.innerText = `10000 / 10000 characters`;
        counter.style.color = "red";
        alert("မှတ်စုကို စာလုံးရေ ၁၀၀၀၀ အထိသာ ကန့်သတ်ထားပါသည်။");
    } else {
        counter.style.color = "var(--text-main)";
        saveNoteToCloud(); // Cloud ပေါ်သိမ်းမည့် function ကို ခေါ်မည်
    }
}

// ကျောင်းသားက သူ့မှတ်စုကို သူပြန်သိမ်းချင်ရင် (Computer ထဲသို့ ဒေါင်းလုဒ်ဆွဲခြင်း)
function downloadNotes() {
    const text = document.getElementById('personal-note').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = `my-bootcamp-notes.txt`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
}

let noteTimeout;
function saveNoteToCloud() {
    const text = document.getElementById('personal-note').value;
    // စာလုံးရေ ၅၀၀၀ ထက်ကျော်ရင် တားမြစ်ခြင်း
    if (text.length > 5000) {
        alert("မှတ်စုကို စာလုံးရေ ၅၀၀၀ အထိသာ ကန့်သတ်ထားပါသည်။");
        return;
    }

    const status = document.getElementById('note-status');
    status.innerText = "Saving...";

    // ခဏခဏ save မနေစေရန် (Debouncing)
    clearTimeout(noteTimeout);
    noteTimeout = setTimeout(async () => {
        currentUser.personalNote = text;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        if (currentUser.uid) {
            await db.collection('users').doc(currentUser.uid).update({
                personalNote: text
            });
        }
        status.innerText = "All changes saved!";
    }, 1000);
}

function changeFontSize(size) {
    const body = document.getElementById('dynamic-body');
    if (size === 'plus') body.style.fontSize = "1.2rem";
    else if (size === 'minus') body.style.fontSize = "0.9rem";
    else body.style.fontSize = "1rem";
}

async function fetchLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard-content');
    if (!leaderboardDiv) return;

    try {
        // Firestore: အမှတ်အများဆုံး ကျောင်းသား ၅ ယောက်ကို ဆွဲယူမည်
        const snapshot = await db.collection('users')
            .where('role', '==', 'Student')
            .orderBy('overallGrade', 'desc') // Grade အလိုက်စီမည်
            .limit(5)
            .get();

        let html = '<ul style="list-style:none; padding:0;">';
        let rank = 1;

        snapshot.forEach(doc => {
            const student = doc.data();
            html += `<li style="padding:8px 0; border-bottom:1px solid #eee;">
                        ${rank}. <strong>${student.name}</strong> - ${student.overallGrade || '0'} pts
                     </li>`;
            rank++;
        });

        html += '</ul>';
        leaderboardDiv.innerHTML = snapshot.empty ? "ကျောင်းသားစာရင်း မရှိသေးပါ။" : html;

    } catch (error) {
        console.error("Leaderboard Error:", error);
        leaderboardDiv.innerHTML = "Leaderboard ဖတ်လို့မရပါ။ Index လိုအပ်နိုင်ပါသည်။";
    }
}

// Lesson Discussion (အမေးအဖြေကဏ္ဍ)
async function renderDiscussion(lessonId) {
    const area = document.getElementById('discussion-area');
    area.innerHTML = `
        <div class="content-card" style="margin-top:40px;">
            <h4><i class="fas fa-comments"></i> သင်ခန်းစာ အမေးအဖြေ (Q&A)</h4>
            <div id="comments-list" style="margin:20px 0; max-height:400px; overflow-y:auto;"></div>
            <div class="chat-input-box">
                <input type="text" id="comment-input" placeholder="မရှင်းတာရှိရင် ဒီမှာမေးမြန်းနိုင်ပါတယ်...">
                <button onclick="postComment('${lessonId}')"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    loadComments(lessonId);
}

// ၁။ Comment တင်သည့် Function (userId မပါလျှင် Rule က လက်မခံပါ)
function postComment(lessonId) {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text) return;

    db.collection('discussions').add({
        lessonId: lessonId,
        userId: currentUser.uid,   // <--- အရေးကြီးသည်
        userName: currentUser.name,
        text: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        input.value = '';
    }).catch(err => {
        alert("Comment ပေးပို့လို့မရပါ- " + err.message);
    });
}

// ၂။ Comment များ ပြန်ဖတ်သည့် Function
function loadComments(lessonId) {
    db.collection('discussions').where('lessonId', '==', lessonId).orderBy('timestamp', 'asc').onSnapshot(snap => {
        const list = document.getElementById('comments-list');
        list.innerHTML = '';
        snap.forEach(doc => {
            const c = doc.data();
            const isMe = c.userId === currentUser.uid;
            const canManage = isMe || currentUser.role === 'Teacher';
              list.innerHTML += `
                <div class="comment-bubble">
                    <div style="display:flex; justify-content:space-between;">
                        <small><strong>${c.userName}</strong></small>
                        ${canManage ? `
                            <div class="msg-actions">
                                <i class="fas fa-edit" onclick="editContent('discussions', '${doc.id}', '${c.text.replace(/'/g, "\\'")}')"></i>
                                <i class="fas fa-trash" onclick="deleteContent('discussions', '${doc.id}')"></i>
                            </div>` : ''}
                    </div>
                    <p>${c.text}</p>
                </div>`;
          });
      }, error => {
          // Error တက်ခဲ့လျှင် ဤနေရာတွင် သိနိုင်သည်
          console.error("Comment load error:", error);
          if (error.code === 'permission-denied') {
              list.innerHTML = `<small style="color:grey">Comment များကို ဖတ်ရန် ခွင့်ပြုချက်မရှိပါ။</small>`;
          }
      });
}

// Teacher's Grade Review Panel (ဆရာအတွက် စာစစ်ရန်)
async function viewSubmissionDetail(id) {
    const doc = await db.collection('submissions').doc(id).get();
    const data = doc.data();
    const body = document.getElementById('dynamic-body');

    body.innerHTML = `
        <div class="content-card animate-up">
            <h3>Grading: ${data.studentName}</h3>
            <p>Lesson: ${data.lessonTitle}</p>
            <hr>
            <div style="background:#f8fafc; padding:20px; margin:20px 0; border-radius:10px;">${data.content}</div>
            
            <label>ပေးမည့်အမှတ် (Score)</label>
            <input type="number" id="grade-input" class="edit-input" placeholder="0-100">
            <button class="save-btn" onclick="submitFinalGrade('${data.studentId}', '${id}')">Submit Grade</button>
        </div>
    `;
}

// အမျိုးစုံသုံး (Universal) Edit/Delete Functions
async function deleteContent(collection, id) {
    if (confirm("ဤစာကို ဖျက်ရန် သေချာပါသလား?")) {
        await db.collection(collection).doc(id).delete();
    }
}

async function editContent(collection, id, oldText) {
    const newText = prompt("စာသားကို ပြင်ဆင်ပါ:", oldText);
    if (newText && newText !== oldText) {
        await db.collection(collection).doc(id).update({
            text: newText,
            edited: true
        });
    }
}

async function submitFinalGrade(studentId, subId, subjectName) {
    const scoreInput = document.getElementById('grade-input');
    const score = parseInt(scoreInput.value);
    const feedback = document.getElementById('teacher-feedback').value;

    // Validation: အမှတ်မရိုက်ရသေးရင် တားမယ်
    if (isNaN(score) || score < 0 || score > 100) {
        return alert("ကျေးဇူးပြု၍ မှန်ကန်သော အမှတ် (၀ မှ ၁၀၀ ကြား) ရိုက်ထည့်ပါ။");
    }

    try {
        // ၁။ ကျောင်းသားရဲ့ grades ထဲမှာ ဘာသာရပ်အမည်နဲ့ သွားသိမ်းမယ်
        // subjectName က ဥပမာ - 'html', 'javascript' ဖြစ်ရပါမယ်
        await db.collection('users').doc(studentId).set({
            grades: { [subjectName.toLowerCase()]: score } 
        }, { merge: true });

        // ၂။ Submission status ကို 'graded' ပြောင်းပြီး မှတ်ချက်ပါ သိမ်းမယ်
        await db.collection('submissions').doc(subId).update({ 
            status: 'graded',
            score: score,
            teacherFeedback: feedback
        });

        // ၃။ ကျောင်းသားဆီကို System Noti (Direct Message) ပို့မယ်
        await db.collection('messages').add({
            text: `🔔 အသိပေးချက်: သင်၏ ${subjectName} assignment အတွက် အမှတ်ထွက်ပါပြီ။ (ရမှတ်: ${score})။ Transcript တွင် စစ်ဆေးနိုင်ပါသည်။`,
            senderId: currentUser.uid,
            senderName: "LMS System",
            receiverId: studentId,
            type: "direct",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("အမှတ်ပေးခြင်း အောင်မြင်ပါသည်။ ကျောင်းသားထံသို့ Noti ပို့ပြီးပါပြီ။");
        renderAdminPanel(); // Panel သို့ ပြန်သွားမည်

    } catch (error) {
        console.error("Grading error:", error);
        alert("အမှားတစ်ခု ဖြစ်သွားပါသည်- " + error.message);
    }
}

// Gamification (Badges)
function checkBadges() {
    const doneCount = currentUser.completedLessons.length;
    if (doneCount >= 1 && !currentUser.badges?.includes('First Step')) {
        awardBadge('First Step');
    }
    if (doneCount >= 10 && !currentUser.badges?.includes('HTML Ninja')) {
        awardBadge('HTML Ninja');
    }
}

async function awardBadge(name) {
    if(!currentUser.badges) currentUser.badges = [];
    currentUser.badges.push(name);
    alert(`🎊 ဂုဏ်ယူပါတယ်! သင် "${name}" Badge ရရှိသွားပါပြီ။`);
    await db.collection('users').doc(currentUser.uid).update({ badges: currentUser.badges });
}

// ==========================================
// ၄။ Course Tree & Content Engine
// ==========================================

// --- သင်ခန်းစာမာတိကာကို Database ပါ ဖတ်နိုင်အောင် ပြင်ဆင်ခြင်း ---
async function renderCourseTree(filterCat) {
    const body = document.getElementById('dynamic-body');
    if (!body) return;

    body.innerHTML = '<div id="course-outline"></div>';
    const container = document.getElementById('course-outline');

    // ၁။ အခြေခံ သင်ရိုးများ (Local data.js မှ)
    let filteredData = filterCat ? 
        courseData.filter(c => c.category.toLowerCase() === 
        filterCat.toLowerCase()) : 
        courseData;

    // ၂။ Database ထဲမှ အသစ်တိုးထားသော သင်ခန်းစာများကို ဆွဲယူမည်
    try {
        const dynamicSnap = await db.collection('course_structure').get();
        const dynamicLessons = [];
        dynamicSnap.forEach(doc => dynamicLessons.push(doc.data()));

        // Local data ထဲကို Dynamic data တွေ ပေါင်းထည့်မယ်
        // (မှတ်ချက် - Category နဲ့ Module နာမည် တူရပါမယ်)
        dynamicLessons.forEach(dl => {
            let catIndex = filteredData.findIndex(c => c.category === dl.category);
            if (catIndex !== -1) {
                let modIndex = filteredData[catIndex].modules.findIndex(m => m.moduleTitle === dl.module);
                if (modIndex !== -1) {
                    // ရှိပြီးသား Module ထဲကို lesson အသစ် ထည့်မယ်
                    filteredData[catIndex].modules[modIndex].lessons.push({
                        title: dl.title, path: dl.path, type: dl.type
                    });
                }
            }
        });
    } catch (e) { console.warn("Dynamic content load failed."); }

    // ၃။ Rendering Logic (ယခင်အတိုင်း ဆက်လက်လုပ်ဆောင်မည်)
    filteredData.forEach((cat, catIdx) => {
        const catH = document.createElement('div');
        catH.className = 'category-header';
        catH.innerHTML = `<i class="fas fa-folder"></i> ${cat.category}`;
        container.appendChild(catH);

        cat.modules.forEach((mod, modIdx) => {
            const modId = `mod-${catIdx}-${modIdx}`;
            const group = document.createElement('div');
            group.className = 'module-group';
            group.innerHTML = `
                <div class="module-title-header" onclick="toggleModuleAccordion(this, '${modId}')">
                    <span><i class="fas fa-chevron-right"></i> ${mod.moduleTitle}</span>
                </div>
                <div id="${modId}" class="lessons-list"></div>
            `;
            container.appendChild(group);

            const list = document.getElementById(modId);
            mod.lessons.forEach((les, lesIdx) => {
                const item = document.createElement('div');
                item.className = 'lesson-item';
                item.innerHTML = `<i class="far fa-file-alt"></i> ${les.title}`;
                item.onclick = () => renderLessonContent(catIdx, modIdx, lesIdx);
                list.appendChild(item);
            });
        });
    });
}

async function renderLessonContent(catIdx, modIdx, lesIdx) {
  const body = document.getElementById("dynamic-body");
  const cat = courseData[catIdx],
    mod = cat.modules[modIdx],
    lesson = mod.lessons[lesIdx];
  document.getElementById("page-title").innerText = lesson.title;
  body.innerHTML = '<div class="loader">Loading content...</div>';

  const bc = `<div class="breadcrumbs"><span onclick="showSection('dashboard')">Home</span> / <span onclick="showSection('courses', '${cat.category}')">${cat.category}</span> / <span>${mod.moduleTitle}</span></div>`;

  try {
    // အရေးကြီးသည်- lesson.path ကို တိုက်ရိုက် သုံးပါမည်
    const res = await fetch(`${lesson.path}?t=${new Date().getTime()}`);

    console.log("Fetching Path:", lesson.path); // Debug စစ်ရန်
    console.log("Response Status:", res.status);

    if (!res.ok) {
      throw new Error(`File not found (Status: ${res.status})`);
    }

    if (lesson.type === "quiz") {
      const res = await fetch(lesson.path);
      const quizData = await res.json();
      renderQuizUI(quizData, bc, catIdx, modIdx, lesIdx);
    } else if (lesson.type === "assignment") {
      renderAssignmentUI(catIdx, modIdx, lesIdx, bc);
    } else if (lesson.type === "project") {
      renderProjectUI(catIdx, modIdx, lesIdx, bc);
    } else {
      const html = await res.text();
      body.innerHTML = `${bc}<article class="content-card animate-up"><div class="lesson-body">${html}</div>
                <div class="pagination">
                    <button class="menu-btn" onclick="goToLesson(${catIdx}, ${modIdx}, ${lesIdx - 1})" ${lesIdx === 0 ? "disabled" : ""}>Prev</button>
                    <button class="menu-btn" onclick="goToLesson(${catIdx}, ${modIdx}, ${lesIdx + 1})" ${lesIdx === mod.lessons.length - 1 ? "disabled" : ""}>Next</button>
                </div></article>`;
        // 🔥 ARTICLE ဖြစ်မှသာ ဖွင့်ကြည့်ရုံနဲ့ Completed ထဲထည့်မည်
        markLessonAsDone(lesson.title); 
    }

    if (lesson.type === 'article') {
        const discussionDiv = document.createElement('div');
        discussionDiv.id = "discussion-area";
        body.appendChild(discussionDiv);
        renderDiscussion(lesson.title); // Comment တွေပြမယ့် function
    }

  } catch (e) {
    console.error("Fetch Error:", e);
    body.innerHTML = `${bc} <div class="error-msg">
            <h4>သင်ခန်းစာဖိုင်ကို ရှာမတွေ့ပါ။</h4>
            <p>လမ်းကြောင်း: <code>${lesson.path}</code></p>
            <p>အကြောင်းရင်း: Folder အမည် သို့မဟုတ် ဖိုင်အမည် မှားယွင်းနေနိုင်ပါသည်။</p>
        </div>`;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 🔥 ထပ်ခါတလဲလဲ မရေးရအောင် Helper function တစ်ခု ဆောက်လိုက်ပါ
async function markLessonAsDone(lessonTitle) {
    // Safety check: array မရှိသေးရင် အသစ်ဆောက်မယ်
    if (!currentUser.completedLessons) currentUser.completedLessons = [];
    
    if (!currentUser.completedLessons.includes(lessonTitle)) {
        currentUser.completedLessons.push(lessonTitle);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Cloud Sync လုပ်မယ်
        await syncProgressToCloud();
    }
}

// Pagination အတွက် ကူညီပေးမည့် function
function goToLesson(catIdx, modIdx, lesIdx) {
  if (
    lesIdx >= 0 &&
    lesIdx < courseData[catIdx].modules[modIdx].lessons.length
  ) {
    renderLessonContent(catIdx, modIdx, lesIdx);
  }
}

// Module Accordion Toggle Function
function toggleModuleAccordion(header, targetId) {
  const content = document.getElementById(targetId);
  header.classList.toggle("active");
  content.classList.toggle("show");
}

// ==========================================
// ၅။ Quiz, Assignment & Project Logic
// ==========================================

function renderQuizUI(data, bc, c, m, l) {
    if (!currentUser.quizAttempts) currentUser.quizAttempts = {};
    const attempts = currentUser.quizAttempts[data.id] || 0;
    
    // အကြိမ်ရေ ၃ ကြိမ်ပြည့်/မပြည့် စစ်ဆေးခြင်း
    if(attempts >= 3 && currentUser.role !== 'Teacher') {
        document.getElementById('dynamic-body').innerHTML = `
            ${bc}
            <div class="content-card error-msg animate-up">
                <h3><i class="fas fa-lock"></i> Quiz ပိတ်သွားပါပြီ</h3>
                <p>သင်သည် ဤ Quiz ကို ၃ ကြိမ်ဖြေဆိုပြီး ဖြစ်သောကြောင့် ထပ်မံဖြေဆိုခွင့် မရှိတော့ပါ။</p>
                <button class="menu-btn" style="margin-top:15px" onclick="showSection('courses')">သင်ခန်းစာများသို့ ပြန်သွားရန်</button>
            </div>`;
        return;
    }

    let html = `${bc}
        <div class="content-card animate-up">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #eee; padding-bottom:15px; margin-bottom:20px;">
                <h3 style="margin:0;">${data.title}</h3>
                <span class="badge-type" style="background:#f1f5f9; color:#475569; padding: 5px 10px; border-radius: 5px;">Attempt: ${attempts + 1} / 3</span>
            </div>
            <form id="quiz-form">`;

    data.questions.forEach((q, i) => {
        html += `
            <div class="quiz-question-box" id="q-box-${i}">
                <p><strong>${i + 1}. ${q.q}</strong></p>`;
        
        // --- ၁။ ပုံပါဝင်လျှင် ပြသရန် ---
        if (q.image) {
            html += `<div class="quiz-image-container"><img src="${q.image}" class="quiz-img"></div>`;
        }

        html += `<div class="options-area">`;
        
        if (q.type === 'single') {
            q.options.forEach((opt, oi) => {
                html += `<label class="quiz-opt"><input type="radio" name="q${i}" value="${oi}"> ${opt}</label>`;
            });
        } else if (q.type === 'multiple') {
            // --- ၂။ Multiple Choice (Checkboxes) ---
            q.options.forEach((opt, oi) => {
                html += `<label class="quiz-opt"><input type="checkbox" name="q${i}" value="${oi}"> ${opt}</label>`;
            });
        } else if (q.type === 'short') {
            html += `<input type="text" name="q${i}" class="edit-input" placeholder="အဖြေရိုက်ပါ" style="margin-top:10px; width:100%;">`;
        }

        html += `</div>
                <div id="f-${i}" class="feedback-area" style="margin-top:10px; font-weight:bold;"></div>
            </div>`;
    });

    html += `</form>
            <div style="margin-top:20px;">
                <button class="save-btn" onclick="checkQuizResult('${data.id}', ${JSON.stringify(data).replace(/"/g, '&quot;')}, ${c}, ${m}, ${l})">
                    <i class="fas fa-check-circle"></i> Submit Quiz
                </button>
            </div>
        </div>`;
    document.getElementById('dynamic-body').innerHTML = html;
}

async function checkQuizResult(quizId, quizData, c, m, l) {
    let score = 0;
    const questions = quizData.questions;

    if (!currentUser.quizAttempts) currentUser.quizAttempts = {};
    if (!currentUser.completedLessons) currentUser.completedLessons = [];

    const currentAttempt = (currentUser.quizAttempts[quizId] || 0) + 1;

    // အဖြေစစ်ဆေးခြင်း
    questions.forEach((q, i) => {
        const feedbackEl = document.getElementById(`f-${i}`);
        const qBox = document.getElementById(`q-box-${i}`);
        const inputs = document.getElementsByName(`q${i}`);
        let isCorrect = false;

        if (q.type === 'single') {
            const sel = Array.from(inputs).find(r => r.checked);
            if (sel && parseInt(sel.value) === q.correct) isCorrect = true;
        } else if (q.type === 'multiple') {
            // Multiple Choice စစ်ဆေးခြင်း (Array တိုက်စစ်သည်)
            const selected = Array.from(inputs).filter(cb => cb.checked).map(cb => parseInt(cb.value));
            const correctAnswers = q.correct.sort().toString();
            if (selected.sort().toString() === correctAnswers) isCorrect = true;
        } else if (q.type === 'short') {
            if (inputs[0].value.trim().toLowerCase() === q.correct.toLowerCase()) isCorrect = true;
        }

        if (isCorrect) {
            score++;
            feedbackEl.innerHTML = '<span class="text-success"><i class="fas fa-check"></i> Correct</span>';
            if (qBox) qBox.style.borderColor = "#22c55e";
        } else {
            feedbackEl.innerHTML = '<span class="text-danger"><i class="fas fa-times"></i> Wrong</span>';
            if (qBox) qBox.style.borderColor = "#ef4444";
        }
    });

    // ဒေတာ သိမ်းဆည်းခြင်း
    currentUser.quizAttempts[quizId] = currentAttempt;
    const lessonTitle = courseData[c].modules[m].lessons[l].title;
    
    if (score === questions.length || currentAttempt >= 3) {
        if (!currentUser.completedLessons.includes(lessonTitle)) {
            currentUser.completedLessons.push(lessonTitle);
        }
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    await syncProgressToCloud(); // <--- Cloud ပေါ် တန်းပို့မည်

    // အသိပေးချက်နှင့် Redirection
    setTimeout(() => {
        const total = questions.length;
        if (score === total) {
            alert(`ဂုဏ်ယူပါတယ်! အမှတ်ပြည့် (${score}/${total}) ရရှိပါတယ်။`);
            goToNextLesson(c, m, l);
        } else if (currentAttempt >= 3) {
            alert(`၃ ကြိမ်ဖြေဆိုမှု ပြီးဆုံးပါပြီ။ သင်၏နောက်ဆုံးရမှတ်မှာ (${score}/${total}) ဖြစ်ပါသည်။`);
            goToNextLesson(c, m, l);
        } else {
            if (confirm(`ရမှတ်: ${score}/${total} ဖြစ်ပါသည်။ အကြိမ်ရေ ${3 - currentAttempt} ကြိမ် ကျန်ပါသေးသည်။ ထပ်ဖြေမလား?`)) {
                renderLessonContent(c, m, l);
            } else {
                goToNextLesson(c, m, l);
            }
        }
    }, 500);
}

function renderAssignmentUI(catIdx, modIdx, lesIdx, bc) {
  const lesson = courseData[catIdx].modules[modIdx].lessons[lesIdx];
  document.getElementById("dynamic-body").innerHTML = `
        ${bc}
        <div class="content-card animate-up">
            <h3>Assignment: ${lesson.title}</h3>
            <p class="academic-box">စာလုံးရေ ၅၀ ကျော်အောင် ကိုယ်တိုင်ရေးသားပေးပါ။ Copy/Paste လုပ်ခြင်းကို ခွင့်မပြုပါ။</p>
            <textarea id="atxt" class="edit-input" rows="10" onpaste="alert('ကူးယူခြင်းကို ခွင့်မပြုပါ!'); return false;" placeholder="ဤနေရာတွင် စတင်ရေးသားပါ..."></textarea>
            <div style="text-align:right; margin-bottom:10px;"><small id="word-count">0 words</small></div>
            
            <!-- Submit ခလုတ်မှာ catIdx, modIdx, lesIdx တွေကို သေချာထည့်ပေးထားပါတယ် -->
            <button class="save-btn" onclick="submitAssignmentDB(${catIdx}, ${modIdx}, ${lesIdx})">
                <i class="fas fa-paper-plane"></i> Submit Assignment
            </button>
        </div>`;

  // စာလုံးရေတွက်သည့် Logic
  document.getElementById("atxt").addEventListener("input", (e) => {
    const words = e.target.value
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    document.getElementById("word-count").innerText = words + " words";
  });
}

function renderProjectUI(catIdx, modIdx, lesIdx, bc) {
  const lesson = courseData[catIdx].modules[modIdx].lessons[lesIdx];
  document.getElementById("dynamic-body").innerHTML = `
        ${bc}
        <div class="content-card project-card animate-up">
            <h3><i class="fas fa-tasks"></i> Project Submission</h3>
            <p style="color:grey; margin-bottom:15px;">${lesson.title}</p>
            <label>GitHub Repository Link</label>
            <input type="url" id="plink" class="edit-input" placeholder="https://github.com/user/repo">
            <label style="margin-top:15px; display:block;">Team Members (Names & UIDs)</label>
            <textarea id="pmembers" class="edit-input" rows="2" placeholder="Mg Mg (st001), Aye Aye (st002)"></textarea>
            
            <button class="save-btn" style="margin-top:20px" onclick="submitProjectDB(${catIdx}, ${modIdx}, ${lesIdx})">
                <i class="fas fa-upload"></i> Submit Project
            </button>
        </div>`;
}

// --- Project Submit Logic (GitHub Link တင်ရန်) ---
async function submitProjectDB(catIdx, modIdx, lesIdx) {
  const link = document.getElementById("plink").value.trim();
  const members = document.getElementById("pmembers").value.trim();
  const lesson = courseData[catIdx].modules[modIdx].lessons[lesIdx];

  // Validation: GitHub Link ဟုတ်မဟုတ် စစ်ဆေးခြင်း
  if (!link.includes("github.com")) {
    return alert(
      "ကျေးဇူးပြု၍ မှန်ကန်သော GitHub Repository Link ကို ထည့်ပေးပါ။",
    );
  }

  try {
    // ၁။ Firestore: 'submissions' collection ထဲသို့ ပို့မည်
    await db.collection("submissions").add({
      type: "project",
      studentId: currentUser.uid,
      studentName: currentUser.name,
      lessonTitle: lesson.title,
      category: courseData[catIdx].category,
      githubLink: link,
      teamMembers: members,
      status: "pending",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // ၂။ ပြီးမြောက်ကြောင်း မှတ်သားမည်
    if (!currentUser.completedLessons.includes(lesson.title)) {
      currentUser.completedLessons.push(lesson.title);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    alert("Project ကို အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။");

    // ၃။ နောက်စာမျက်နှာကို တန်းသွားမည်
    goToNextLesson(catIdx, modIdx, lesIdx);
  } catch (error) {
    alert("Error submitting project: " + error.message);
  }
}

// ==========================================
// ၆။ Messaging Logic (Real-time)
// ==========================================

// Messaging Section ပြသခြင်း
async function showMessages(targetUid = null, targetName = null) {
    if (targetUid) { 
        activeChatId = targetUid; 
        activeChatName = "Chat: " + targetName; 
    }
    
    // ၁။ နောက်ဆုံးရ ကျောင်းသား/ဆရာ စာရင်းကို Database မှ ဆွဲယူမည်
    await fetchStudentsFromDB(); // ဤ function ထဲတွင် ဆရာများကိုပါ ဆွဲယူရန် အောက်တွင် ပြင်ပေးထားပါသည်

    const body = document.getElementById('dynamic-body');
    const isTeacher = currentUser.role === 'Teacher';

    // ၂။ --- Groups Filtering ---
    // ဆရာဆိုလျှင် ရှိသမျှ Batch အကုန်ပြမည်၊ ကျောင်းသားဆိုလျှင် မိမိ Batch တစ်ခုတည်းသာ ပြမည်
    const allBatches = [...new Set(studentsList.map(s => s.batchId))].sort();
    const myBatchList = isTeacher ? allBatches : [currentUser.batchId];

    // ၃။ --- DM List Filtering ---
    const visibleDMList = studentsList.filter(s => {
        if (isTeacher) {
            // ဆရာမြင်ကွင်း: မိမိမဟုတ်သော ကျောင်းသားအားလုံးကို ပြမည်
            return s.role === 'Student';
        } else {
            // ကျောင်းသားမြင်ကွင်း: မိမိ Batch တူသူများကိုသာ ပြမည် (ကျော်ကျော်ကို Su Su မြင်ရတော့မည်မဟုတ်)
            return s.batchId === currentUser.batchId && s.uid !== currentUser.uid;
        }
    });

    // ၄။ --- ဆရာနှင့် စကားပြောရန် (ကျောင်းသားများအတွက်သာ) ---
    const teachers = allUsersList.filter(u => u.role === 'Teacher' && u.uid !== currentUser.uid);

    body.innerHTML = `
        <div class="messaging-layout fade-in">
            <div class="chat-sidebar">
                <div class="chat-list-header">Messenger</div>
                <div class="chat-list">
                    
                    <div class="chat-list-divider">Class Groups</div>
                    ${myBatchList.map(bid => `
                        <div class="chat-item ${activeChatId === bid ? 'active' : ''}" onclick="switchChat('${bid}', 'Group: ${bid}')">
                            <i class="fas fa-users"></i> ${bid}
                        </div>
                    `).join('')}

                    ${!isTeacher ? `
                        <div class="chat-list-divider">Contact Tutor</div>
                        ${teachers.map(t => `
                            <div class="chat-item ${activeChatId === t.uid ? 'active' : ''}" onclick="switchChat('${t.uid}', 'Tutor: ${t.name}')">
                                <i class="fas fa-user-tie"></i> ${t.name} (Teacher)
                            </div>
                        `).join('')}
                    ` : ''}

                    <div class="chat-list-divider">Direct Messages</div>
                    ${visibleDMList.length > 0 ? visibleDMList.map(s => `
                        <div class="chat-item ${activeChatId === s.uid ? 'active' : ''}" onclick="switchChat('${s.uid}', 'Chat: ${s.name}')">
                            <i class="fas fa-user-circle"></i> 
                            <div style="display:flex; flex-direction:column;">
                                <span>${s.name}</span>
                                ${isTeacher ? `<small style="font-size:0.6rem; opacity:0.6;">${s.batchId}</small>` : ''}
                            </div>
                        </div>
                    `).join('') : '<p style="padding:15px; font-size:0.8rem; color:grey;">စကားပြောရန် လူမရှိသေးပါ။</p>'}
                </div>
            </div>
            
            <div class="chat-window">
                <div class="chat-window-header">${activeChatName}</div>
                <div class="chat-display" id="chat-display"></div>
                <div class="chat-input-box">
                    <input type="text" id="chat-input" placeholder="စာရိုက်ပါ..." onkeypress="if(event.key==='Enter') sendMessage()">
                    <button onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>`;
    loadMessages();
}


// Chat ပြောင်းခြင်း (Group မှ DM သို့ သို့မဟုတ် အပြန်အလှန်)
function switchChat(id, name) {
    activeChatId = id;
    activeChatName = name;
    
    // UI တစ်ခုလုံးကို ပြန်ဆွဲခိုင်းမှ Sidebar မှာ Active ဖြစ်တာ မှန်ပါမယ်
    showMessages(); 
}

// Firestore မှ Message များ Real-time ဖတ်ခြင်း
function loadMessages() {
    const display = document.getElementById('chat-display');
    if (!display) return;
    
    // 🔥 ၃ ရက်စာတွက်ချက်ခြင်း ( 3 days * 24 hours * 60 min * 60 sec * 1000 ms )
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    // Safety Check: ID မရှိရင် Query မလုပ်ပါ
    if (!activeChatId || !currentUser.uid) {
        console.warn("Chat ID သို့မဟုတ် User ID မရှိသေးပါ။");
        display.innerHTML = '<div class="empty-msg">စာတိုများ ဖတ်ရန် အရင်ရွေးချယ်ပါ။</div>';
        return;
    }
    
    let query;

    // Group Chat Query
    if (activeChatId.includes('Batch')) {
        query = db.collection('messages')
                  .where('batchId', '==', activeChatId)
                  .where('type', '==', 'group')
                  .where('timestamp', '>=', threeDaysAgo) // ၃ ရက်ထက် ပိုဟောင်းတာတွေကို မယူတော့ပါ
                  .orderBy('timestamp', 'asc');
    } 
    // Direct Message Query
    else {
        const combinedId = [currentUser.uid, activeChatId].sort().join("_");
        query = db.collection('messages')
                  .where('convoId', '==', combinedId)
                  .where('type', '==', 'direct')
                  .where('timestamp', '>=', threeDaysAgo) // ၃ ရက်ထက် ပိုဟောင်းတာတွေကို မယူတော့ပါ
                  .orderBy('timestamp', 'asc');
    }

    query.onSnapshot(snap => {
        display.innerHTML = '';
        if (snap.empty) {
            display.innerHTML = '<div style="text-align:center; padding:20px; color:grey; font-size:0.8rem;">ယခင် ၃ ရက်အတွင်း ပေးပို့ထားသော စာများ မရှိပါ။</div>';
            return;
        }

        snap.forEach(doc => {
            const m = doc.data();
            const isMe = m.senderId === currentUser.uid;
            const canManage = isMe || currentUser.role === 'Teacher';

            display.innerHTML += `
                <div class="message-bubble ${isMe ? 'me' : 'other'}">
                    <div class="msg-header" style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.7rem; opacity:0.8;">${isMe ? 'You' : m.senderName}</span>
                        ${canManage ? `
                            <div class="msg-actions" style="margin-left:10px; display:flex; gap:8px; font-size:0.7rem; opacity:0.5;">
                                <i class="fas fa-edit" style="cursor:pointer;" onclick="editMsg('${doc.id}', '${m.text.replace(/'/g, "\\'")}')" title="ပြင်မည်"></i>
                                <i class="fas fa-trash-alt" style="cursor:pointer;" onclick="deleteMsg('${doc.id}')" title="ဖျက်မည်"></i>
                            </div>
                        ` : ''}
                    </div>
                    <div class="msg-text">${m.text}</div>
                </div>`;
        });
        display.scrollTop = display.scrollHeight;
    }, error => {
        // အကယ်၍ Index အသစ်ဆောက်ရန် လိုအပ်ပါက console မှာ link ပေါ်လာပါမည်
        console.error("Snapshot error:", error);
        if (error.code === 'failed-precondition') {
            display.innerHTML = '<div class="error-msg">Firebase Console တွင် Index အသစ်တစ်ခု ဆောက်ရန် လိုအပ်နေပါသည်။ Console (F12) ရှိ Link ကို နှိပ်ပေးပါ။</div>';
        }
    });
}

// Message ပို့ခြင်း
function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || !currentUser.uid) return;

    const msgData = {
        text: text,
        senderId: currentUser.uid,
        senderName: currentUser.name,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (activeChatId.includes('Batch')) {
        // Group Chat
        msgData.batchId = activeChatId;
        msgData.type = "group";
    } else {
        // Direct Message
        msgData.receiverId = activeChatId; // လက်ခံသူ UID
        msgData.type = "direct";
        // convoId ကို UID ၂ ခုစီပြီး ဆက်မည်
        msgData.convoId = [currentUser.uid, activeChatId].sort().join("_");
    }

    db.collection('messages').add(msgData).then(() => {
        console.log("Sent success!");
    }).catch(e => alert("Error: " + e.message));

    input.value = '';
}

async function deleteMsg(id) {
    if (confirm("ဤစာတိုကို အပြီးဖျက်ရန် သေချာပါသလား?")) {
        try {
            await db.collection('messages').doc(id).delete();
        } catch (e) { alert("Error: " + e.message); }
    }
}

// --- စာတို ပြင်ဆင်ရန် Function ---
async function editMsg(id, oldText) {
    const newText = prompt("စာသားကို ပြင်ဆင်ပါ:", oldText);
    if (newText && newText.trim() !== "" && newText !== oldText) {
        try {
            await db.collection('messages').doc(id).update({
                text: newText,
                isEdited: true,
                editedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) { alert("Error: " + e.message); }
    }
}

// ==========================================
// ၇။ Profile, Admin & Auth Logic
// ==========================================

// Profile ပြသခြင်း (View Mode & Academic Info)
function renderProfile() {
  const body = document.getElementById("dynamic-body");

  const grades = currentUser.grades || {};
  const completedCount = Object.keys(grades).length;
  let totalScore = 0;
  Object.values(grades).forEach(s => totalScore += s);
  const gpa = completedCount > 0 ? (totalScore / completedCount).toFixed(2) : 0;

  const isEligible = completedCount >= 5 && gpa >= 75;
  const roleBadgeStyle = currentUser.role === "Teacher" ? "background:#ef4444; color:white;" : "background:#e2e8f0; color:black;";

  // 🔥 ပြင်ဆင်ချက်: Alert Box ကို Variable ထဲ အရင်ထည့်မည်
  let unpaidAlert = "";
  // အကယ်၍ အကောင့်ဝင်ထားသူသည် ဆရာမဟုတ်ဘဲ၊ ဝယ်ထားသောသင်တန်းလည်း တစ်ခုမှ မရှိလျှင် (enrolledCourses အလွတ်ဖြစ်လျှင်)
  const hasNoEnrolledCourses = !currentUser.enrolledCourses || currentUser.enrolledCourses.length === 0;

  if (currentUser.role !== 'Teacher' && hasNoEnrolledCourses) {
    unpaidAlert = `
        <div class="tip-box animate-up" style="background:#fffbeb; border:1px solid #f59e0b; color:#92400e; margin-bottom:20px; padding:15px; border-radius:8px;">
            <i class="fas fa-info-circle"></i> သင်၏ Profile ကို ပြင်ဆင်နိုင်ပါသည်။ သင်ခန်းစာများ စတင်လေ့လာရန် သင်တန်းကြေးပေးသွင်းရန် လိုအပ်ပါသည်။ 
            <button class="save-btn" style="padding:4px 12px; margin-left:10px; font-size:0.8rem;" onclick="renderCourseSelection()">သင်တန်းအပ်ရန်</button>
        </div>
    `;
  }

  // အားလုံးပေါင်းပြီး တစ်ခါတည်း innerHTML ထဲ ထည့်မည် (overwrite မဖြစ်တော့ပါ)
  body.innerHTML = `
    ${unpaidAlert}
    <div class="profile-card-pro fade-in">
        <div class="profile-cover"></div>
        <div class="profile-header-main">
            <img src="${currentUser.photo}" class="profile-large-avatar" onerror="this.src='https://placehold.co/150x150/003087/white?text=User'">
            <div class="profile-info-text">
                <h2>${currentUser.name} <span class="badge-verify"><i class="fas fa-check-circle"></i></span></h2>
                <span class="u-role-tag" style="${roleBadgeStyle}">${currentUser.role}</span>
                <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
                    <button class="save-btn" onclick="renderEditProfile()"><i class="fas fa-user-edit"></i> Edit Profile</button>
                    ${currentUser.role === "Teacher" ? `<button class="menu-btn" style="background:#000; color:white;" onclick="renderAdminPanel()"><i class="fas fa-user-shield"></i> Admin Panel</button>` : ""}
                </div>
            </div>
        </div>
        
        <div class="profile-content-grid">
            <div class="profile-side-info">
                <div class="content-card">
                    <h4>Connect with me</h4>
                    <div class="social-links-grid">
                        ${currentUser.portfolio ? `<a href="${currentUser.portfolio}" target="_blank"><i class="fas fa-globe"></i></a>` : ""}
                        ${currentUser.github ? `<a href="${currentUser.github}" target="_blank"><i class="fab fa-github"></i></a>` : ""}
                        ${currentUser.linkedin ? `<a href="${currentUser.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ""}
                        ${currentUser.email ? `<a href="mailto:${currentUser.email}"><i class="fas fa-envelope"></i></a>` : ""}
                    </div>
                </div>
            </div>

            <div class="profile-main-data">
                <div class="content-card academic-card">
                    <h4><i class="fas fa-university"></i> Academic Achievement</h4>
                    <div class="academic-box">
                        <div class="academic-item"><span>Batch:</span> <strong>${currentUser.batchId || "-"}</strong></div>
                        <div class="academic-item"><span>တက်ရောက်မှု:</span> <strong>${currentUser.attendance || "0%"}</strong></div>
                        <div class="academic-item"><span>Grade:</span> <strong style="color:green">${currentUser.overallGrade || "-"}</strong></div>
                        <div class="academic-item"><span>စာမေးပွဲရက်:</span> <strong style="color:red">${currentUser.examDate || "-"}</strong></div>
                        <div class="academic-item"><span>GPA:</span> <strong style="color:green">${gpa}</strong></div>
                        <div class="academic-item"><span>Completed Modules:</span> <strong>${completedCount}</strong></div>
                    </div>
                    
                    <div style="margin-top:20px; display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="menu-btn" onclick="viewTranscript('${currentUser.uid}')">
                            <i class="fas fa-file-invoice"></i> Transcript
                        </button>
                        <button class="menu-btn" style="background:#0ea5e9; color:white;" onclick="renderMySubmissions()">
                            <i class="fas fa-folder-open"></i> Submissions
                        </button>
                        <button class="menu-btn ${isEligible ? 'cert-gold' : 'disabled-btn'}" 
                                onclick="${isEligible ? `viewCertificate('${currentUser.uid}')` : "alert('သင်တန်းမပြီးသေးပါ သို့မဟုတ် ရမှတ်မလုံလောက်ပါ')"}">
                            <i class="fas fa-award"></i> Certificate
                        </button>
                    </div>
                </div>

                <div class="content-card">
                    <h4>Personal Notes / Bio</h4>
                    <p>${currentUser.notes || "မှတ်စုများ မရှိသေးပါ။"}</p>
                </div>
            </div>
        </div>
    </div>`;
}

// ကျောင်းသားအတွက် Profile ပြင်ဆင်သည့် Form (Edit Mode)
function renderEditProfile() {
    const body = document.getElementById("dynamic-body");
    
    // Safety check: currentUser ရှိမရှိ အရင်စစ်မည်
    if (!currentUser) return alert("User not logged in!");

    body.innerHTML = `
        <div class="content-card animate-up" style="max-width: 800px; margin: 0 auto;">
            <h3 style="margin-bottom:20px;"><i class="fas fa-id-card"></i> Profile ပြင်ဆင်ခြင်း</h3>
            
            <div class="edit-grid">
                <div class="edit-section">
                    <label>Profile Photo URL</label>
                    <input type="text" id="edit-photo" class="edit-input" value="${currentUser.photo || ''}">
                    <label>အမည်</label>
                    <input type="text" id="edit-name" class="edit-input" value="${currentUser.name || ''}">
                    <label>Portfolio Website</label>
                    <input type="text" id="edit-portfolio" class="edit-input" value="${currentUser.portfolio || ""}">
                    <label>GitHub Link</label>
                    <input type="text" id="edit-github" class="edit-input" value="${currentUser.github || ""}">
                </div>
                
                <div class="edit-section">
                    <label>Social Links</label>
                    <div class="social-input-group">
                        <i class="fab fa-linkedin"></i> <input type="text" id="edit-linkedin" value="${currentUser.linkedin || ""}" placeholder="LinkedIn">
                        <i class="fab fa-facebook"></i> <input type="text" id="edit-facebook" value="${currentUser.facebook || ""}" placeholder="Facebook">
                        <i class="fab fa-youtube"></i> <input type="text" id="edit-youtube" value="${currentUser.youtube || ""}" placeholder="Youtube">
                        <i class="fab fa-tiktok"></i> <input type="text" id="edit-tiktok" value="${currentUser.tiktok || ""}" placeholder="TikTok">
                        <i class="fab fa-instagram"></i> <input type="text" id="edit-instagram" value="${currentUser.instagram || ""}" placeholder="Instagram">
                        <i class="fas fa-envelope"></i> <input type="text" id="edit-email" value="${currentUser.email || ""}" placeholder="Email Address">
                    </div>
                </div>
            </div>

            <label>Skills (ကော်မာခြားပါ)</label>
            <input type="text" id="edit-skills" class="edit-input" value="${(currentUser.skills || []).join(", ")}">
            <label>Bio / Notes</label>
            <textarea id="edit-notes" class="edit-input" rows="3">${currentUser.notes || ""}</textarea>
            
            <div style="margin-top:20px; display:flex; gap:10px;">
                <button class="save-btn" onclick="saveProfile()"><i class="fas fa-save"></i> Save Changes</button>
                <button class="menu-btn" style="background:#64748b; color:white;" onclick="renderProfile()">Cancel</button>
            </div>
        </div>
    `;
}

// သိမ်းဆည်းရန် Function တစ်ခုတည်းသာ ထားပါမည်
async function saveProfile() {
    const updatedData = {
        name: document.getElementById("edit-name").value,
        photo: document.getElementById("edit-photo").value,
        portfolio: document.getElementById("edit-portfolio").value,
        linkedin: document.getElementById("edit-linkedin").value,
        facebook: document.getElementById("edit-facebook").value,
        youtube: document.getElementById("edit-youtube").value,
        tiktok: document.getElementById("edit-tiktok").value,
        instagram: document.getElementById("edit-instagram").value,
        email: document.getElementById("edit-email").value,
        github: document.getElementById("edit-github").value,
        notes: document.getElementById("edit-notes").value,
        skills: document.getElementById("edit-skills").value.split(",").map(s => s.trim()).filter(s => s !== "")
    };

    try {
        // ၁။ Firebase Cloud (Firestore) ထဲ သိမ်းမည်
        if (currentUser.uid) {
            await db.collection("users").doc(currentUser.uid).update(updatedData);
            console.log("Cloud Update Success!");
        }

        // ၂။ လက်ရှိ App ထဲက variable ကို update လုပ်မည်
        currentUser = { ...currentUser, ...updatedData };

        // ၃။ LocalStorage ထဲ သိမ်းမည်
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        alert("အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။");
        renderProfile();
        renderAuthFooter();

    } catch (error) {
        console.error("Save Error:", error);
        alert("အချက်အလက်သိမ်းဆည်းရာတွင် အမှားတက်နေပါသည်- " + error.message);
    }
}

// Sidebar Footer Render (User Info & Logout)
function renderAuthFooter() {
    const authDiv = document.getElementById('auth-section');
    if(!authDiv) return;
    const isDark = document.body.classList.contains('dark-theme');
    
    // ပုံမရှိခဲ့ရင် ပြပေးမယ့် default icon တစ်ခု ထားပေးထားပါတယ်
    const userImg = currentUser.photo || "https://placehold.co/100x100/003087/white?text=User";

    authDiv.innerHTML = `
        <button onclick="toggleDarkMode()" class="theme-toggle-btn">
            <i class="fas ${isDark ? 'fa-sun' : 'fa-moon'}"></i> 
            <span>${isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div class="sidebar-user-info">
            <!-- <img> tag ထဲမှာ currentUser.photo ကို ထည့်လိုက်ပါပြီ -->
            <img src="${userImg}" class="sidebar-avatar" onclick="showSection('profile')" 
                 onerror="this.src='https://placehold.co/100x100/003087/white?text=User'">
            <div class="user-details" onclick="showSection('profile')">
                <p class="u-name">${currentUser.name}</p>
                <small class="u-role">${currentUser.role}</small>
            </div>
            <button class="logout-mini-btn" onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i></button>
        </div>
    `;
}

// Firebase Auth Login Function
async function handleLogin() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) return alert("Email နှင့် Password ဖြည့်စွက်ပေးပါ။");

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        const userDoc = await db.collection("users").doc(user.uid).get();

        if (userDoc.exists) {
            const userData = userDoc.data();

            // Cloud ကလာတဲ့ Data အကုန်လုံးကို ပေါင်းစပ်မည်
            currentUser = {
                ...currentUser,   
                ...userData,      
                uid: user.uid,
                isLoggedIn: true,
                email: email
            };

            // ၁။ LocalStorage တွင် အရင်သိမ်းမည်
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            // ၂။ UI ကို အရင်ပြောင်းမည်
            document.getElementById("login-page").style.display = "none";
            document.getElementById("app-wrapper").style.display = "flex";

            // ၃။ သင်တန်းအခြေအနေအလိုက် လမ်းကြောင်းခွဲမည်
            if (currentUser.enrolledCourses && currentUser.enrolledCourses.length > 0 || currentUser.role === 'Teacher') {
                showSection("dashboard");
                alert("မင်္ဂလာပါ " + currentUser.name);
            } else {
                renderPaymentPage();
                document.getElementById('page-title').innerText = "သင်တန်းအပ်နှံရန်";
            }

            // ၄။ Cloud Settings များကို Sync လုပ်မည်
            syncLMSSettings();   
            startLiveCountdown();

            // ၅။ 🔥 Page ကို Reload လုပ်ချင်တယ်ဆိုရင် အားလုံးပြီးမှ လုပ်ရပါမယ် 
            // (သို့မဟုတ်) Reload မလုပ်ဘဲ အပေါ်က UI ပြောင်းတဲ့အတိုင်းပဲ ထားတာက ပို smooth ဖြစ်ပါတယ်
            // location.reload(); 

        } else {
            alert("Database ထဲတွင် အချက်အလက် ရှာမတွေ့ပါ။ Admin ကို ဆက်သွယ်ပါ။");
        }
    } catch (error) {
        alert("Login မှားယွင်းနေပါသည်: " + error.message);
    }
}

async function handleLogout() {
    if (confirm("Logout ထွက်မှာ သေချာပါသလား?")) {
        try {
            await auth.signOut(); // 🔥 Firebase Auth ကပါ SignOut လုပ်မည်
            localStorage.removeItem('currentUser');
            localStorage.removeItem('dark-mode');
            location.reload(); 
        } catch (e) {
            console.error("Sign out error", e);
        }
    }
}

// --- Transcript ပြသခြင်း ---
function viewTranscript(uid, isAdminPreview = false) {
    const student = (uid === currentUser.uid) ? currentUser : studentsList.find(s => s.uid === uid);
    if (!student) return alert("Student not found!");

    const body = document.getElementById('dynamic-body');
    const backFunc = isAdminPreview ? `previewStudentAchievements('${uid}')` : "showSection('profile')";
    
    const grades = student.grades || {};
    let totalScore = 0;
    let subjectCount = lmsSettings.subjects.length;

    let rows = lmsSettings.subjects.map(sub => {
        const score = grades[sub.toLowerCase()] || 0;
        totalScore += score;
        const status = score >= 50 ? '<span class="text-success" style="font-weight:bold;">Pass</span>' : '<span class="text-danger" style="font-weight:bold;">Fail</span>';
        return `<tr><td style="text-transform:uppercase; text-align:left; padding:12px;">${sub}</td><td style="padding:12px;">${score}</td><td style="padding:12px;">${status}</td></tr>`;
    }).join('');

    const gpa = subjectCount > 0 ? (totalScore / subjectCount).toFixed(2) : 0;
    const issueDate = new Date().toLocaleDateString('en-GB');

    body.innerHTML = `
        <div class="transcript-outer-container animate-up">
            <div class="no-print" style="margin-bottom:20px;">
                <button class="menu-btn" onclick="${backFunc}"><i class="fas fa-arrow-left"></i> Back</button>
            </div>

            <div class="transcript-paper shadow-lg">
                <div class="transcript-header" style="text-align:center; margin-bottom:30px;">
                    <h2 style="color:#003087; text-transform:uppercase; margin:0; font-size: 2rem;">Myanmar Full-Stack Bootcamp</h2>
                    <p style="color:#64748b; font-weight: bold; margin:5px 0;">OFFICIAL STUDENT RECORD</p>
                </div>

                <!-- 🔥 ဘယ်/ညာ တိတိကျကျ ခွဲထားသော အချက်အလက်များ 🔥 -->
                <div class="academic-info-grid" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:25px; margin-bottom:30px; -webkit-print-color-adjust: exact;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span><strong>Student Name:</strong> ${student.name}</span>
                        <span><strong>Course Title:</strong> ${lmsSettings.courseTitle}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span><strong>Student ID:</strong> ${student.uid.substring(0, 8).toUpperCase()}</span>
                        <span><strong>Date Issued:</strong> ${issueDate}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span><strong>Batch:</strong> ${student.batchId || academicInfo.batchName}</span>
                        <span><strong>Average GPA:</strong> <span style="color:#003087; font-weight:bold; font-size:1.2rem;">${gpa}</span></span>
                    </div>
                </div>

                <!-- 🔥 ဇယားကို ညာဘက်အစွန်ထိ အပြည့်ချဲ့ခြင်း 🔥 -->
                <table class="transcript-table" style="width:100%; border-collapse:collapse; border: 1px solid #ddd;">
                    <thead>
                        <tr style="background:#003087 !important; color:white !important; -webkit-print-color-adjust: exact;">
                            <th style="padding:15px; text-align:left; border: 1px solid #ddd;">SUBJECT / MODULE</th>
                            <th style="padding:15px; text-align:center; border: 1px solid #ddd; width:120px;">SCORE</th>
                            <th style="padding:15px; text-align:center; border: 1px solid #ddd; width:120px;">RESULT</th>
                        </tr>
                    </thead>
                    <tbody style="text-align:center;">
                        ${rows || '<tr><td colspan="3" style="padding:30px;">အမှတ်စာရင်း မရှိသေးပါ။</td></tr>'}
                    </tbody>
                </table>

                <div class="transcript-footer" style="margin-top:80px; display:flex; justify-content:space-between; align-items:flex-end;">
                    <div style="font-size:0.85rem; color:#64748b; text-align:left; line-height:1.6;">
                        * This is a computer-generated official transcript.<br>
                        * Minimum passing score for each module is 50.
                    </div>
                    <div style="text-align:center; width:250px;">
                        <div style="border-bottom:1.5px solid #333; height:45px; font-family:'Dancing Script', cursive; font-size:1.5rem; display:flex; align-items:center; justify-content:center; color:#000;">
                            ${lmsSettings.instructorName}
                        </div>
                        <p style="margin-top:10px; font-weight:bold; font-size:0.9rem; text-transform:uppercase; color:#000;">Registrar Office</p>
                    </div>
                </div>
            </div>

            <div class="no-print" style="margin-top:40px; text-align:center;">
                <button class="save-btn" onclick="window.print()" style="padding:12px 50px; font-size: 1.1rem;"><i class="fas fa-print"></i> Print Transcript</button>
            </div>
        </div>
    `;
}

// --- ၁။ Global Settings Variables ---
let lmsSettings = {
    courseTitle: "Full-Stack Web Development",
    instructorName: "Ashin",
    announcement: "",
    subjects: [] // ဘာသာရပ်များကို ဤနေရာတွင် စီမံမည်
};

// Database မှ Settings များကို Sync လုပ်ခြင်း
function syncLMSSettings() {
    // ၁။ Announcement Sync - စာသားရှိမှ Bar ကို ပြမည်
    db.collection('settings').doc('announcement').onSnapshot(doc => {
        const bar = document.getElementById('announcement-bar');
        if (doc.exists && doc.data().text && doc.data().text.trim() !== "") {
            lmsSettings.announcement = doc.data().text;
            const annoEl = document.getElementById('announcement-text');
            if (annoEl) annoEl.innerText = lmsSettings.announcement;
            if (bar) bar.style.display = 'flex'; // စာသားရှိလျှင် ပြမည်
        } else {
            if (bar) bar.style.display = 'none'; // စာသားမရှိလျှင် တစ်ခုလုံး ဖျောက်မည်
        }
    }, err => console.warn("Announcement access restricted"));

    // ၂။ Course Info Sync
    if (currentUser.isLoggedIn) {
        db.collection('settings').doc('course_info').onSnapshot(doc => {
            if (doc.exists) {
                lmsSettings = { ...lmsSettings, ...doc.data() };
                renderAuthFooter(); 
            }
        }, err => console.warn("Settings access restricted"));
    }
}

// --- ၂။ Admin Panel: Announcement & Course Settings ပြင်သည့် UI ---
function renderLMSEditor() {
    const body = document.getElementById('dynamic-body');
    
    // Zoom Time ကို input format ပြောင်းရန်
    const dateStr = nextClassTime ? nextClassTime.toISOString().slice(0, 16) : "";

    body.innerHTML = `
        <div class="content-card animate-up" style="max-width: 800px; margin: auto;">
            <h3><i class="fas fa-cogs"></i> LMS စနစ် အလုံးစုံ စီမံခန့်ခွဲမှု</h3>
            <p style="color:var(--text-muted)">ဤနေရာတွင် Announcement၊ Zoom Link နှင့် ဘာသာရပ်များကို ပြင်ဆင်နိုင်သည်။</p>
            <hr><br>
            
            <!-- ၁။ Announcement Section -->
            <label>📢 Announcement (အပေါ်ဆုံးတွင် ပြသမည့်စာသား)</label>
            <textarea id="adm-anno" class="edit-input" rows="2">${lmsSettings.announcement}</textarea>
            
            <div class="edit-grid" style="margin-top:20px;">
                <!-- ၂။ Course Info Section -->
                <div>
                    <label>🎓 သင်တန်းဘွဲ့အမည် (Certificate Title)</label>
                    <input type="text" id="adm-course" class="edit-input" value="${lmsSettings.courseTitle}">
                    
                    <label style="margin-top:15px; display:block;">✍️ သင်တန်းဆရာအမည် (Instructor)</label>
                    <input type="text" id="adm-instructor" class="edit-input" value="${lmsSettings.instructorName}">
                </div>

                <!-- ၃။ Zoom Config Section -->
                <div>
                    <label>📹 Zoom / Meet Meeting Link</label>
                    <input type="url" id="adm-zoom-url" class="edit-input" value="${currentZoomLink}" placeholder="https://...">
                    
                    <label style="margin-top:15px; display:block;">⏰ နောက်လာမည့် အတန်းချိန်</label>
                    <input type="datetime-local" id="adm-zoom-time" class="edit-input" value="${dateStr}">
                </div>
            </div>

            <!-- ၄။ Subjects Section -->
            <label style="margin-top:20px; display:block;">📚 Transcript ဘာသာရပ်စာရင်း (comma ခြား၍ ရေးပါ)</label>
            <input type="text" id="adm-subjects" class="edit-input" value="${lmsSettings.subjects.join(', ')}">
            
            <div style="margin-top:30px; display:flex; gap:10px;">
                <button class="save-btn" onclick="saveLMSSettings()">
                    <i class="fas fa-save"></i> Save All Changes
                </button>
                <button class="menu-btn" onclick="renderAdminPanel()">Back</button>
            </div>
        </div>
    `;
}

// Settings အားလုံးကို Database ထဲသို့ တစ်ပြိုင်နက် သိမ်းဆည်းခြင်း
async function saveLMSSettings() {
    const anno = document.getElementById('adm-anno').value;
    const course = document.getElementById('adm-course').value;
    const instructor = document.getElementById('adm-instructor').value;
    const zoomUrl = document.getElementById('adm-zoom-url').value;
    const zoomTime = document.getElementById('adm-zoom-time').value;
    const subjects = document.getElementById('adm-subjects').value.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== "");

    try {
        // အဆင့် ၁ - Firestore ထဲ သွားသိမ်းမည်
        await db.collection('settings').doc('announcement').set({ text: anno });
        await db.collection('settings').doc('course_info').set({
            courseTitle: course,
            instructorName: instructor,
            subjects: subjects
        });
        await db.collection('settings').doc('zoom_config').set({
            url: zoomUrl,
            startTime: firebase.firestore.Timestamp.fromDate(new Date(zoomTime))
        });

        // အဆင့် ၂ - Local Variable များကိုပါ ချက်ချင်း Update လုပ်မည်
        lmsSettings.announcement = anno;
        lmsSettings.instructorName = instructor;
        lmsSettings.courseTitle = course;
        lmsSettings.subjects = subjects;
        currentZoomLink = zoomUrl;
        nextClassTime = new Date(zoomTime);

        alert("အောင်မြင်စွာ Update လုပ်ပြီးပါပြီ။");
        
        // အဆင့် ၃ - Dashboard သို့ ပြန်သွားပြီး UI အားလုံးကို Update ဖြစ်စေမည်
        showSection('dashboard');

    } catch (error) {
        console.error("Save Error:", error);
        alert("Error: " + error.message);
    }
}

// --- ၃။ Dynamic Certificate (ID နှင့် Date ပါဝင်ခြင်း) ---
function viewCertificate(uid, isAdminPreview = false) {
    const student = (uid === currentUser.uid) ? currentUser : studentsList.find(s => s.uid === uid);
    if (!student) return alert("Student not found!");

    const body = document.getElementById('dynamic-body');
    const backFunc = isAdminPreview ? `previewStudentAchievements('${uid}')` : "showSection('profile')";
    
    const issueDate = new Date().toLocaleDateString('en-GB');
    const certId = `CERT-2026-${student.uid.substring(0, 5).toUpperCase()}`;
    const instructor = lmsSettings.instructorName || "Ashin";

    body.innerHTML = `
        <div class="certificate-page-wrapper animate-up">
            <div class="certificate-frame shadow-lg">
                <div class="cert-border">
                    <div style="position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                        
                        <div>
                            <h1 style="font-family: 'Times New Roman', serif; font-size: 3.5rem; color: #1e293b; margin: 0;">CERTIFICATE</h1>
                            <p style="letter-spacing: 8px; font-weight: bold; color: #64748b; margin-bottom: 30px;">OF COMPLETION</p>
                            
                            <p style="font-size: 1.2rem; color: #334155;">This is to certify that</p>
                            <h2 style="font-family: 'Georgia', serif; font-size: 3rem; color: #003087; border-bottom: 2px solid #e2e8f0; display: inline-block; padding: 0 40px; margin: 15px 0;">
                                ${student.name}
                            </h2>
                            
                            <p style="font-size: 1.1rem; color: #334155; margin-top: 20px;">
                                has successfully completed the Professional Bootcamp in
                            </p>
                            <h3 style="color: #003087; font-size: 1.8rem; margin: 15px 0; text-transform: uppercase;">
                                ${lmsSettings.courseTitle || "Full-Stack Web Development"}
                            </h3>
                            <p style="color: #64748b; font-size: 1rem;">Given under our seal on this day, <strong>${issueDate}</strong></p>
                        </div>

                        <!-- 🔥 Gold Seal (ရွှေရောင်တံဆိပ်) -->
                        <div class="cert-seal-wrapper">
                            <div class="gold-seal">
                                <!-- ဝိုင်းနေသော စာသား -->
                                <svg class="seal-text-svg" viewBox="0 0 100 100">
                                    <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                    <text class="seal-text-path">
                                        <textPath xlink:href="#circlePath">
                                            Myanmar Full-Stack Bootcamp • Official Seal •
                                        </textPath>
                                    </text>
                                </svg>
                                
                                <!-- အလယ်က ဘွဲ့ဦးထုပ်နှင့် သပြေခက် အမှတ်အသား -->
                                <div class="seal-icon-inner">
                                    <i class="fas fa-graduation-cap"></i>
                                    <div style="font-size: 1rem; margin-top: -5px;">
                                        <i class="fas fa-certificate"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-around; align-items: flex-end; margin-bottom: 20px;">
                            <div style="text-align: center;">
                                <p style="font-family: 'Dancing Script', cursive; font-size: 1.8rem; color: #1e293b; margin-bottom: 5px;">
                                    ${instructor}
                                </p>
                                <div style="border-top: 2px solid #334155; width: 200px; padding-top: 5px; font-weight: bold; font-size: 0.8rem;">LEAD INSTRUCTOR</div>
                            </div>
                            <div style="text-align: center;">
                                <p style="font-weight: bold; font-size: 1.1rem; color: #1e293b; margin-bottom: 12px;">${certId}</p>
                                <div style="border-top: 2px solid #334155; width: 200px; padding-top: 5px; font-weight: bold; font-size: 0.8rem;">CERTIFICATE ID</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="no-print cert-action-buttons">
                <button class="save-btn" onclick="window.print()">
                    <i class="fas fa-print"></i> Print Official Certificate
                </button>
                <button class="menu-btn" style="background:#64748b; color:white;" onclick="${backFunc}">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
        </div>
    `;
}

// ==========================================
// ၈။ App Initialization
// ==========================================

window.onload = () => {
    // ၁။ အခြေခံ UI Setup (Auth နဲ့ မဆိုင်တာတွေကို အရင်လုပ်မည်)
    const yearEl = document.getElementById('current-year'); 
    if(yearEl) yearEl.innerText = new Date().getFullYear();
    if (localStorage.getItem('dark-mode') === 'true') document.body.classList.add('dark-theme');

    // ၂။ 🔥 Firebase Auth အခြေအနေကို စောင့်ကြည့်ခြင်း (အဓိက ဂိတ်ဝ)
    auth.onAuthStateChanged((user) => {
        if (user) {
            // --- လူရှိလျှင် (Logged In) ---
            currentUser.uid = user.uid;
            currentUser.isLoggedIn = true;

            // Cloud Data များကို စတင် Sync လုပ်မည်
            syncLMSSettings(); 
            syncZoomConfig();
            initNotifications();
            startLiveCountdown();

            // UI ကို အရင်ဖော်မည်
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('app-wrapper').style.display = 'flex';

            // ၃။ 🔥 Enrollment & Role အလိုက် လမ်းကြောင်းခွဲခြင်း
            const enrolled = currentUser.enrolledCourses || [];
            const isTeacher = currentUser.role === 'Teacher';

            if (!isTeacher && enrolled.length === 0) {
                // (က) ကျောင်းသားဖြစ်ပြီး ဘယ်သင်တန်းမှ မရှိသေးလျှင် - Lock ချပြီး ရွေးခိုင်းမည်
                lockMenus();
                renderCourseSelection();
                document.getElementById('page-title').innerText = "သင်တန်းများ ရွေးချယ်ရန်";
            } 
            else if (currentUser.selectedCourseId) {
                // (ခ) သင်တန်းရှိပြီးသားဖြစ်ပြီး တစ်ခုခုကို ရွေးထားလျှင် - Dashboard သို့ တိုက်ရိုက်သွားမည်
                // အရေးကြီးသည်- courseData ကို load အရင်လုပ်ပေးရမည်
                if (allCourses[currentUser.selectedCourseId]) {
                    courseData = allCourses[currentUser.selectedCourseId].data;
                    showSection('dashboard');
                } else {
                    renderCourseSelection();
                }
            } 
            else {
                // (ဂ) သင်တန်းရှိသော်လည်း လက်ရှိလေ့လာမည့်သင်တန်း မရွေးရသေးလျှင်
                renderCourseSelection();
            }

        } else {
            // --- လူမရှိလျှင် (Logged Out) ---
            currentUser.isLoggedIn = false;
            document.getElementById('login-page').style.display = 'flex';
            document.getElementById('app-wrapper').style.display = 'none';
        }
    });
};

// Menu များကို Lock ချသည့် Function
function lockMenus() {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        const text = link.innerText.toLowerCase();
        // သင်ခန်းစာ၊ စာတို နှင့် resources တို့ကို lock class ထည့်မည်
        if (text.includes('သင်ခန်းစာ') || text.includes('စာတို') || text.includes('resources') || text.includes('profile')) {
            link.classList.add('nav-locked');
        }
    });
}

// စာမျက်နှာ အောက်ကို ၃၀၀ pixel ရောက်မှ ခလုတ်ပေါ်စေရန်
window.onscroll = function() {
    const btn = document.getElementById('back-to-top');
    if (btn) {
        // စာမျက်နှာကို အောက်ကို ၃၀၀ pixel ကျော် ဆွဲလိုက်သလား စစ်ဆေးခြင်း
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            btn.style.display = "block"; // ပေါ်လာစေရန်
        } else {
            btn.style.display = "none";  // ပြန်ပျောက်သွားစေရန်
        }
    }
};

// Global Helpers
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeAnnouncement() {
  document.getElementById("announcement-bar").style.display = "none";
}

// ==========================================
// ၉။ Genreral Admin Panel Logic
// ==========================================

// အစမ်းသုံးရန် ကျောင်းသားစာရင်း Data (တကယ်တမ်းတွင် Firestore မှ ဆွဲယူမည်)
let studentsList = [];

// --- Admin Panel (Teacher သာ ဝင်နိုင်မည်) ---
// --- ဆရာအတွက် Admin Panel (Academic Status ပြင်ဆင်ရန်) ---
async function renderAdminPanel() {
    await fetchStudentsFromDB(); // Database မှ အရင်ဆွဲမည်

  const body = document.getElementById("dynamic-body");

  // ရှိသမျှ Batch များကို စုစည်းပြီး Dropdown ပြုလုပ်ခြင်း
    const batchOptions = [...new Set(studentsList.map(s => s.batchId))].sort();
  
  // Header အပိုင်းမှာ ခလုတ်တွေကို စုစည်းထားပြီး Table ကို တစ်ခုတည်းပဲ ထားလိုက်ပါမယ်
  body.innerHTML = `
        <div class="admin-container fade-in">
            <!-- အပေါ်ဆုံး ခေါင်းစီးနှင့် အဓိက ခလုတ်များ -->
            <div class="admin-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:15px;">

                <h3 style="margin:0;"><i class="fas fa-user-shield"></i> Admin Control Panel</h3>

                <div style="display:flex; gap:10px; flex-wrap:wrap; width:100%; justify-content: flex-end;" class="admin-btn-group">
                    <!-- 🔥 ဒီခလုတ်က အရေးကြီးဆုံးပါ၊ Editor ဆီသွားပါမယ် -->
                    <button class="save-btn" onclick="renderSubmissions()">
                        <i class="fas fa-file-signature"></i> Review
                    </button>
                    <button class="menu-btn" style="background:#f59e0b; color:white;" onclick="renderLMSEditor()">
                        <i class="fas fa-cog"></i> Settings
                    </button>

                    <button class="menu-btn" style="background:#0ea5e9; color:white;" onclick="renderContentEditor()">
                        <i class="fas fa-plus"></i> Add
                    </button>

                    <button class="menu-btn" style="background:#f59e0b" onclick="renderZoomEditor()">
                        <i class="fas fa-video"></i> Zoom
                    </button>

                    <button class="menu-btn" style="background:#10b981" onclick="renderPaymentRequests()">
                        <i class="fas fa-receipt"></i> ပိုက်ဆံသွင်းထားသူများ
                    </button>

                    <button class="menu-btn" style="background:#4b5563; color:white;" onclick="renderLMSGuide()">
                        <i class="fas fa-book"></i> Guide
                    </button>
                </div>
            </div>

            <!-- Batch Filter အပိုင်း -->
            <div class="content-card" style="margin-bottom:20px; padding:15px;">
                <div class="batch-filter">
                    <span><strong>Batch ရွေးချယ်ရန်: </strong></span>
                    <select id="batch-select" class="edit-input" style="width:auto; display:inline-block; margin-left:10px;" onchange="filterStudentsByBatch(this.value)">
                        <option value="All">All Batches</option>
                    ${batchOptions.map(b => `<option value="${b}">${b}</option>`).join('')}
                    </select>
                </div>
            </div>

            <!-- ကျောင်းသားစာရင်း ဇယား (Table) -->
            <div class="content-card">
                <h4 style="margin-bottom:15px;"><i class="fas fa-users"></i> ကျောင်းသားစာရင်း</h4>
                <div class="table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>အမည်</th>
                                <th>Batch</th>
                                <th>တက်ရောက်မှု</th>
                                <th>Grade</th>
                                <th>လုပ်ဆောင်ချက်</th>
                            </tr>
                        </thead>
                        <tbody id="student-table-body">
                            <!-- filterStudentsByBatch() ကနေ ဒီမှာ လာဖြည့်ပေးပါလိမ့်မယ် -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

  // ဇယားထဲမှာ data တွေဝင်လာအောင် function ကို ပြန်ခေါ်ပေးရပါမယ်
  filterStudentsByBatch("All"); 
}

// --- Firestore ထဲက ကျောင်းသားအားလုံးကို ဆွဲယူပြီး studentsList ထဲ ထည့်ခြင်း ---
let allUsersList = []; // Global variable အသစ်

async function fetchStudentsFromDB() {
    try {
        const snapshot = await db.collection('users').get();
        studentsList = [];
        allUsersList = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const userObj = {
                uid: doc.id,
                name: data.name || "No Name",
                batchId: data.batchId || "General",
                role: data.role || "Student",
                photo: data.photo || "https://placehold.co/50"
            };
            
            allUsersList.push(userObj);
            if (data.role === 'Student') studentsList.push(userObj);
        });
    } catch (e) { console.error("Fetch Error:", e); }
}

function renderLMSGuide() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="content-card animate-up" style="max-width: 900px; margin: 0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3><i class="fas fa-book"></i> LMS Admin User Guide</h3>
                <button class="menu-btn" onclick="renderAdminPanel()"><i class="fas fa-arrow-left"></i> Back to Panel</button>
            </div>
            
            <div class="guide-scroll-area" style="line-height:1.8; color:var(--text-main); max-height:75vh; overflow-y:auto; padding-right:15px;">

                <!-- ၁။ ငွေပေးချေမှု အတည်ပြုခြင်း -->
                <div class="academic-box" style="border-left-color: #10b981;">
                    <h4 style="color:#059669;"><i class="fas fa-receipt"></i> ၁။ ပိုက်ဆံသွင်းထားသူများ (Payment Requests)</h4>
                    <p>ကျောင်းသားသစ်များ သင်တန်းအပ်နှံမှုအား ဤနေရာတွင် အဓိက စစ်ဆေးရမည်။</p>
                    <ul>
                        <li>ကျောင်းသားတင်ထားသော <strong>KPay/Wave Screenshot</strong> ကို သေချာစွာ စစ်ဆေးပါ။</li>
                        <li>အချက်အလက်မှန်ကန်ပါက <strong>Approve</strong> ကို နှိပ်ပါ။ ၎င်းသည် ကျောင်းသား၏ <code>isPaid</code> status ကို အလိုအလျောက် <code>true</code> ပြောင်းပေးပြီး သင်ခန်းစာအားလုံးကို ပွင့်သွားစေမည်။</li>
                        <li>Approve လုပ်ပြီးနောက် ကျောင်းသားထံသို့ "သင်တန်းဝင်ခွင့်ရပြီ" ဟူသော <strong>Real-time Notification</strong> အလိုအလျောက် ရောက်ရှိမည်။</li>
                    </ul>
                </div>

                <!-- ၂။ အိမ်စာနှင့် ပရောဂျက် စစ်ဆေးခြင်း -->
                <div class="academic-box" style="border-left-color: #3b82f6; margin-top:20px;">
                    <h4 style="color:#2563eb;"><i class="fas fa-file-signature"></i> ၂။ Review Submissions (စာစစ်ခြင်း)</h4>
                    <p>ကျောင်းသားများ ပေးပို့ထားသော Assignment နှင့် Project များကို စစ်ဆေးသည့်နေရာ ဖြစ်သည်။</p>
                    <ul>
                        <li>ကျောင်းသား၏ ရေးသားချက် သို့မဟုတ် <strong>GitHub Link</strong> ကို ဖတ်ရှုစစ်ဆေးပါ။</li>
                        <li>ပေးလိုသော အမှတ် (Score 0-100) ကို ရိုက်ထည့်ပြီး <strong>Teacher Feedback</strong> (မှတ်ချက်) ပေးနိုင်ပါသည်။</li>
                        <li>Submit Grade နှိပ်လိုက်သည်နှင့် ကျောင်းသား၏ <strong>Transcript</strong> တွင် အမှတ်စာရင်း အလိုအလျောက် ပေါင်းထည့်ပြီးသား ဖြစ်သွားမည်။</li>
                    </ul>
                </div>

                <!-- ၃။ စနစ်တစ်ခုလုံး၏ Settings များ -->
                <div class="academic-box" style="border-left-color: #f59e0b; margin-top:20px;">
                    <h4 style="color:#d97706;"><i class="fas fa-cog"></i> ၃။ System Settings & Zoom (စနစ်ထိန်းချုပ်မှု)</h4>
                    <p>LMS ၏ ပင်မအချက်အလက်များကို ကုဒ်ပြင်စရာမလိုဘဲ ဤနေရာတွင် ပြင်ဆင်နိုင်သည်။</p>
                    <ul>
                        <li><strong>Announcement:</strong> ကြေညာချက်စာသားကို ပြင်လိုက်သည်နှင့် ကျောင်းသားအားလုံး၏ အပေါ်ဘားတွင် ချက်ချင်း ပြောင်းလဲသွားမည်။</li>
                        <li><strong>Zoom/Meet Link:</strong> Link ထည့်သွင်းထားမှသာ ကျောင်းသား Dashboard တွင် "Join via Zoom" ခလုတ် ပေါ်လာမည်။</li>
                        <li><strong>Class Time:</strong> အချိန်သတ်မှတ်ပေးပါက Dashboard တွင် Countdown Timer (အချိန်ပြောင်းပြန်ရေတွက်မှု) အလိုအလျောက် ပေါ်နေမည်။</li>
                        <li><strong>Course Title & Instructor:</strong> ဤနေရာတွင် ပြင်သမျှသည် <strong>Transcript နှင့် Certificate</strong> များတွင် တိုက်ရိုက် သက်ရောက်မည်။</li>
                    </ul>
                </div>

                <!-- ၄။ သင်ခန်းစာအသစ်များ ထည့်သွင်းခြင်း -->
                <div class="academic-box" style="border-left-color: #0ea5e9; margin-top:20px;">
                    <h4 style="color:#0284c7;"><i class="fas fa-plus"></i> ၄။ Add Content (သင်ခန်းစာ တိုးချဲ့ခြင်း)</h4>
                    <ul>
                        <li>သင်ခန်းစာအသစ်များကို Database ထဲသို့ တိုက်ရိုက်ထည့်နိုင်သည်။</li>
                        <li><strong>Category & Type:</strong> Foundations, Technical စသည်ဖြင့် ရွေးချယ်နိုင်သလို အသစ်လည်း ရိုက်ထည့်နိုင်သည်။</li>
                        <li><strong>Path:</strong> <code>public/content/</code> ထဲတွင် သင်အရင် တည်ဆောက်ထားသော HTML/JSON ဖိုင်လမ်းကြောင်းကို တိကျစွာ ထည့်သွင်းပါ။</li>
                    </ul>
                </div>

                <!-- ၅။ အောင်လက်မှတ်နှင့် အမှတ်စာရင်း -->
                <div class="academic-box" style="border-left-color: #d4af37; margin-top:20px;">
                    <h4 style="color:#b8860b;"><i class="fas fa-award"></i> ၅။ Transcript & Official Certificate</h4>
                    <ul>
                        <li><strong>Preview (မျက်လုံးပုံစံ):</strong> ကျောင်းသားအကောင့်သို့ ဝင်စရာမလိုဘဲ ၎င်း၏ Transcript နှင့် Certificate ထွက်လာမည့် ပုံစံကို Demo ကြည့်နိုင်သည်။</li>
                        <li><strong>Gold Seal:</strong> GPA 75 ကျော်မှသာ ကျောင်းသား Profile တွင် အောင်လက်မှတ်ခလုတ် ပွင့်မည်ဖြစ်သော်လည်း ဆရာအနေဖြင့် အချိန်မရွေး Preview ကြည့်နိုင်သည်။</li>
                    </ul>
                </div>

                <!-- အရေးကြီးသတိပေးချက် -->
                <div class="error-msg" style="margin-top:30px; text-align:left; background:#fff1f2; border:1px solid #fda4af; color:#9f1239; padding:20px; border-radius:12px;">
                    <h5 style="margin-bottom:10px;"><i class="fas fa-exclamation-triangle"></i> Maintenance Checklist (သတိပြုရန်)</h5>
                    <p>၁။ <strong>Case Sensitivity:</strong> Folder အမည်များနှင့် File အမည်များကို အမြဲတမ်း <strong>စာလုံးအသေး (lowercase)</strong> သာ သုံးပါ။</p>
                    <p>၂။ <strong>Real-time Messaging:</strong> Chat သို့မဟုတ် Comment မပေါ်ပါက Firebase Console တွင် <strong>Indexes</strong> များ 'Enabled' ဖြစ်မဖြစ် စစ်ဆေးပါ။</p>
                    <p>၃။ <strong>Storage Limit:</strong> ကျောင်းသားတင်သော Screenshot ပုံများကို 2MB ထက် မကျော်စေရန် စနစ်မှ ကန့်သတ်ထားပါသည်။</p>
                </div>

                <div class="academic-box style="border-left-color: #10b981;">
                    <h4 style="color:var(--primary)"><i class="fas fa-info-circle"></i> ၁။ စနစ်၏ တည်ဆောက်ပုံ</h4>
                    <p>သင်ရိုးမာတိကာများကို <code>js/data.js</code> တွင် စီမံရမည်ဖြစ်ပြီး၊ သင်ခန်းစာဖိုင်များကို <code>public/content/</code> folder အောက်တွင် ခွဲခြားသိမ်းဆည်းရမည်။</p>
                </div>

                <ul>
                    <li><strong>public/index.html: </strong>ပင်မစာမျက်နှာ။</li>
                    <li><strong>public/js/data.js: </strong>သင်ရိုးမာတိကာ သိမ်းဆည်းရာ (နောင်တွင် သင်ခန်းစာအသစ်ထည့်ရန် ဤနေရာတွင် ပြင်ရမည်)။</li>
                    <li><strong>public/content/: </strong>သင်ခန်းစာ HTML, JSON, Assignment ဖိုင်များ အစစ်အမှန်ရှိရာနေရာ။</li>
                    <li><strong>firebase.json: </strong>Server rules နှင့် Hosting ဆိုင်ရာ သတ်မှတ်ချက်များ။</li>
                </ul>

                <h4 style="margin-top:20px;"><i class="fas fa-users-cog"></i> ၂။ ကျောင်းသား စီမံခန့်ခွဲခြင်း</h4>
                <ul>
                    <li><strong>အမှတ်သွင်းခြင်း:</strong> Edit (ခဲတံပုံ) ကိုနှိပ်၍ ဘာသာရပ်အလိုက် အမှတ်သွင်းနိုင်သည်။ ၎င်းသည် ကျောင်းသား၏ Transcript တွင် ချက်ချင်း Update ဖြစ်မည်။</li>
                    <li><strong>Preview:</strong> မျက်လုံးပုံစံကိုနှိပ်၍ ကျောင်းသား၏ အောင်လက်မှတ်ထွက်လာမည့်ပုံစံကို Demo ကြည့်နိုင်သည်။</li>
                </ul>

                <ul>Admin Panel (Teacher Role ဖြင့်ဝင်မှ ပေါ်မည်) သည် စနစ်၏ နှလုံးသားဖြစ်သည်။
                    <li><strong>(က) Batch အလိုက် စစ်ဆေးခြင်း</strong>
                        <li>Admin Panel ရှိ "Batch ရွေးချယ်ရန်" Dropdown မှတစ်ဆင့် Batch တစ်ခုချင်းစီအလိုက် ကျောင်းသားစာရင်းကို စစ်ထုတ်ကြည့်ရှုနိုင်ပါသည်။</li>
                        <li>ကျောင်းသား၏ အမည်၊ တက်ရောက်မှု (Attendance) နှင့် လက်ရှိ Grade ကို ဇယား (Table) ဖြင့် မြင်တွေ့ရမည်။</li>
                    </li>
                    <li><strong>(ခ) အမှတ်စာရင်း သွင်းခြင်း (Grading System)</strong>
                        <li>ဇယားရှိ Edit (ခဲတံပုံ) ကိုနှိပ်ပါ။</li>
                        <li>ဘာသာရပ်အလိုက် (HTML, CSS, JS စသည်) ရမှတ်များကို ရိုက်ထည့်ပြီး "Update Grades" ကို နှိပ်ပါ။</li>
                        <li>ဤအမှတ်များသည် ကျောင်းသား၏ Transcript တွင် အလိုအလျောက် Update ဖြစ်သွားမည်။</li>
                    </li>
                </ul>

                <h4 style="margin-top:20px;"><i class="fas fa-tasks"></i> ၃။ သင်ခန်းစာများနှင့် Assessment</h4>
                <ul>
                    <li><strong>Quizzes:</strong> ကျောင်းသားတစ်ဦးလျှင် ၃ ကြိမ်သာ ဖြေဆိုခွင့်ရှိသည်။</li>
                    <li><strong>Assignments:</strong> ကျောင်းသားများ Copy/Paste လုပ်၍မရအောင် ပိတ်ထားပြီး စာလုံးရေ ၅၀ ပြည့်မှသာ လက်ခံသည်။</li>
                    <li><strong>Projects:</strong> GitHub Link များကို လက်ခံစစ်ဆေးနိုင်သည်။</li>
                </ul>

                <ol>သင်ခန်းစာ အမျိုးအစား (၄) မျိုး ပါဝင်ပြီး တစ်ခုချင်းစီကို ဂရုစိုက်ရန် လိုအပ်သည်-
                    <li><strong>Articles (HTML): </strong>ရိုးရိုးသင်ခန်းစာ စာဖတ်ရန်။</li>
                    <li><strong>Quizzes (JSON): </strong>
                        <li>ကျောင်းသားတစ်ဦးလျှင် ၃ ကြိမ်သာ ဖြေဆိုခွင့်ရှိသည်။</li>
                        <li>အဖြေမှန်/မှားကို စနစ်မှ ချက်ချင်း ပြပေးမည်။</li>
                    </li>
                    <li><strong>Assignments (Long Form): </strong>
                        <li>ကျောင်းသားများသည် အပြင်မှစာများကို Copy/Paste လုပ်ခွင့်မရှိ (ပိတ်ထားသည်)။</li>
                        <li>အနည်းဆုံး စာလုံးရေ (၅၀) ပြည့်မှသာ Submit လုပ်၍ ရမည်။</li>
                    </li>
                    <li><strong>Module Projects (GitHub): </strong>အုပ်စုလိုက် ပြိုင်ပွဲများအတွက် ကျောင်းသားများက GitHub Link ပေးပို့ရမည်။</li>
                </ol>

                <h4 style="margin-top:20px;"><i class="fas fa-comments"></i> ၄။ စာတိုပေးပို့ခြင်း</h4>
                <p>ကျောင်းသားတစ်ဦးချင်းစီကို <strong>Direct Message</strong> ပို့နိုင်သလို၊ <strong>Messages</strong> ကဏ္ဍမှတစ်ဆင့် <strong>Batch အလိုက် Group Message</strong> ပို့နိုင်သည်။ မဆီလျော်သော စာများကို Admin မှ Delete လုပ်နိုင်သည်။</p>

                <ul>
                    <li><strong>(က) Direct Message (DM)</strong>
                        <li>Admin Table ရှိ Message (Comment icon) ကိုနှိပ်ခြင်းဖြင့် ကျောင်းသားတစ်ဦးချင်းစီကို တိုက်ရိုက်စာပို့နိုင်ပါသည်။</li>
                        <li>Admin သည် ကျောင်းသားများ၏ မဆီလျော်သော စာတိုများကို Delete (ဖျက်ခြင်း) လုပ်ပိုင်ခွင့်ရှိသည်။</li>
                    </li>
                    <li><strong>(ခ) Group Message (GM)</strong>
                        <li>Messages section ရှိ Batch-05 Group စသည်တို့ကို နှိပ်၍ တစ်တန်းလုံးကို ကြေညာချက်များ ပို့နိုင်ပါသည်။</li>
                    </li>
                    <li><strong>(ဂ) Lesson Discussions</strong>
                        <li>သင်ခန်းစာတိုင်း၏ အောက်ခြေတွင် Discussion box ပါရှိသည်။ ကျောင်းသားများ မရှင်းလင်းသည်ကို မေးမြန်းလျှင် Admin မှ ဝင်ရောက်ဖြေကြားပေးရန် လိုအပ်သည်။</li>
                    </li>
                </ul>

                <h4 style="margin-top:20px;"><i class="fas fa-award"></i> ၅။ အောင်လက်မှတ် သတ်မှတ်ချက်</h4>
                <p>ကျောင်းသားတစ်ဦးသည် <strong>Module အားလုံးပြီးစီးပြီး GPA 75 အထက်</strong> ရရှိမှသာ Profile တွင် Certificate ခလုတ် ရွှေရောင်ပြောင်း၍ ပွင့်လာမည်ဖြစ်သည်။</p>

                <ul>
                    <li><strong>Transcript: အမှတ်စာရင်းကို ကျောင်းသားရော Admin ပါ အမြဲကြည့်နိုင်၊ Print ထုတ်နိုင်သည်။</strong>
                    </li>
                    <li><strong>Certificate: </strong>အောက်ပါအချက် (၂) ချက်နှင့် ကိုက်ညီမှသာ ရွှေရောင်ခလုတ် ပွင့်လာမည်။
                        <li>Module အားလုံး ဖြေဆိုပြီးစီးခြင်း (completedLessons)။</li>
                        <li>ပျမ်းမျှရမှတ် (GPA) ၇၅ မှတ်နှင့်အထက် ရရှိခြင်း။</li>
                    </li>
                    <li><strong>Admin သည် Preview (မျက်လုံးပုံစံ) </strong>ကိုနှိပ်၍ ကျောင်းသား၏ အောင်လက်မှတ်ပုံစံကို ကြိုတင်ကြည့်ရှုနိုင်ပါသည်။
                    </li>
                </ul>

                <div class="error-msg" style="margin-top:30px; text-align:left; background:#fffbeb; border:1px solid #f59e0b; color:#92400e;">
                    <strong>⚠️ အရေးကြီးသတိပေးချက်:</strong><br>
                    - Folder/File အမည်များကို အမြဲတမ်း <strong>စာလုံးအသေး (lowercase)</strong> သုံးပါ။<br>
                    - Chat မပေါ်ပါက Firebase Console တွင် <strong>Composite Indexes</strong> ဆောက်ထားခြင်း ရှိမရှိ စစ်ဆေးပါ။

                    <ul>
                    <li><strong>ဖိုင်ရှာမတွေ့ပါ Error: </strong>data.js ထဲက path နှင့် public/content/ ထဲက Folder/File အမည် စာလုံးပေါင်း အကြီးအသေး (Case Sensitive) မှားနေခြင်း ဖြစ်သည်။ အကုန်လုံးကို စာလုံးအသေး သုံးရန် အကြံပြုသည်။
                    </li>
                    <li><strong>ndex Required Error: </strong>Firebase Console ရှိ Firestore > Indexes တွင် messages နှင့် discussions အတွက် Composite Index များ "Enabled" ဖြစ်မဖြစ် စစ်ပါ။
                    </li>
                    <li><strong>403 Access Denied: </strong>content folder သည် project root တွင် ရှိမနေဘဲ public folder ၏ အတွင်းထဲ တွင် ရှိနေရပါမည်။
                    </li>
                </ul>
                </div>

                <ul><strong>Dashboard အသုံးဝင်ပုံ</strong>
                    <li><strong>Progress Bar: </strong>ကျောင်းသားတစ်ဦးချင်းစီ၏ သင်ယူမှု ရာခိုင်နှုန်းကို ပြသသည်။
                    </li>
                    <li><strong>Resume Learning: </strong>ကျောင်းသား နောက်ဆုံးကြည့်ခဲ့သည့် သင်ခန်းစာကို ချက်ချင်းပြန်ဖွင့်ပေးသည်။
                    </li>
                    <li><strong>Leaderboard: </strong>အမှတ်အများဆုံး ကျောင်းသား (Top Students) ကို Dashboard တွင် ဂုဏ်ပြုဖော်ပြထားသဖြင့် ကျောင်းသားများကြားတွင် ယှဉ်ပြိုင်လိုစိတ်ကို မြှင့်တင်ပေးသည်။
                    </li>
                </ul>

                <ul><strong>သင်တန်းကြေးနှင့် အကောင့်ဖွင့်ခြင်း (Access Control)</strong>
                    <li><strong>isPaid: true: </strong>ပိုက်ဆံသွင်းပြီးသူများသာ Dashboard ပွင့်မည်။</li>
                    <li><strong>isPaid: false: </strong>ပိုက်ဆံမသွင်းရသေးသူများကို Login ဝင်ခွင့်ပေးသော်လည်း သင်ခန်းစာများကို Lock (ပိတ်) ထားမည်။</li>
                    <li><strong>Admin အနေဖြင့် </strong>Firebase Firestore ရှိ users collection ထဲတွင် ကျောင်းသား၏ isPaid ကို manually ပြောင်းပေးနိုင်ပါသည်။</li>
                </ul>
            </div>
        </div>
    `;
}

// Batch အလိုက် Filter လုပ်ပြီး Table ထုတ်ပေးခြင်း
function filterStudentsByBatch(batchId) {
  const tableBody = document.getElementById("student-table-body");
  tableBody.innerHTML = "";

  const filtered = batchId === "All" ? studentsList : studentsList.filter((s) => s.batchId === batchId);

  filtered.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><strong>${student.name}</strong></td>
            <td>${student.batchId}</td>
            <td>${student.attendance}</td>
            <td><span class="s-tag">${student.grade || 'A-'}</span></td>
            <td>
                <!-- Preview ခလုတ်အသစ် (မျက်လုံးပုံစံ) -->
                <button class="action-btn preview" onclick="previewStudentAchievements('${student.uid}')" title="Demo ကြည့်ရန်">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn msg" onclick="openDirectMessage('${student.uid}')" title="Message ပို့ရန်">
                    <i class="fas fa-comment"></i>
                </button>
                <button class="action-btn edit" onclick="openGradeModal('${student.uid}')" title="အမှတ်သွင်းရန်">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// ဆရာမှ ကျောင်းသား၏ အောင်မြင်မှုများကို Demo ကြည့်ရန်
function previewStudentAchievements(uid) {
    const student = studentsList.find(s => s.uid === uid);
    if (!student) return alert("ကျောင်းသား ရှာမတွေ့ပါ။");

    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="content-card animate-up">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3><i class="fas fa-user-shield"></i> Admin Preview: ${student.name}</h3>
                <button class="menu-btn" onclick="renderAdminPanel()"><i class="fas fa-arrow-left"></i> Back to Admin</button>
            </div>
            <p style="color:var(--text-muted); margin-top:10px;">ဤကျောင်းသားအတွက် Transcript နှင့် Certificate တို့ကို Demo အနေဖြင့် စစ်ဆေးကြည့်ရှုနိုင်ပါသည်။</p>
            <hr style="margin:20px 0;">
            
            <div class="dashboard-grid">
                <div class="content-card">
                    <h4>Official Transcript</h4>
                    <p>ဘာသာရပ်အလိုက် ရမှတ်များကို Demo ကြည့်ရန်။</p>
                    <button class="save-btn" style="margin-top:15px; width:100%;" onclick="viewTranscript('${uid}', true)">
                        <i class="fas fa-file-invoice"></i> View Transcript Demo
                    </button>
                </div>
                <div class="content-card">
                    <h4>Certificate</h4>
                    <p>အောင်လက်မှတ် ထွက်လာမည့် ပုံစံကို Demo ကြည့်ရန်။</p>
                    <button class="menu-btn cert-gold" style="margin-top:15px; width:100%;" onclick="viewCertificate('${uid}', true)">
                        <i class="fas fa-award"></i> View Certificate Demo
                    </button>
                </div>
            </div>
        </div>
    `;
}

// --- ကျောင်းသားတစ်ဦးချင်းစီကို အမှတ်သွင်းရန် Modal/Form ---
function openGradeModal(studentUid) {
  const student = studentsList.find((s) => s.uid === studentUid);
  const body = document.getElementById("dynamic-body");

  // ဘာသာရပ်စာရင်း (မာတိကာမှ ယူနိုင်သည် သို့မဟုတ် ပုံသေထားနိုင်သည်)
  const subjects = ["HTML", "CSS", "JavaScript", "React", "NodeJS", "Database"];

  let subjectInputs = subjects
    .map(
      (sub) => `
        <div class="academic-item">
            <span class="label-grey">${sub}:</span>
            <input type="number" id="grade-${sub.toLowerCase()}" class="edit-input" style="width:80px" value="${student.grades?.[sub.toLowerCase()] || 0}">
        </div>
    `,
    )
    .join("");

  body.innerHTML = `
        <div class="content-card animate-up" style="max-width: 600px; margin: 20px auto;">
            <h4><i class="fas fa-graduation-cap"></i> ${student.name} ၏ အမှတ်စာရင်းသွင်းရန်</h4>
            <div class="academic-box">${subjectInputs}</div>
            <br>
            <button class="save-btn" onclick="updateGrades('${student.uid}')">အမှတ်စာရင်း သိမ်းဆည်းမည်</button>
            <button class="menu-btn" style="background:#64748b" onclick="renderAdminPanel()">ပြန်ထွက်မည်</button>
        </div>
    `;
}

// --- ကျောင်းသားအတွက်: Transcript နှင့် Certificate ပြသခြင်း ---
function renderAcademicRecords() {
  const body = document.getElementById("dynamic-body");
  const grades = currentUser.grades || {};

  let total = 0;
  let count = 0;
  let rows = Object.entries(grades)
    .map(([sub, score]) => {
      total += score;
      count++;
      return `<tr><td>${sub.toUpperCase()}</td><td>${score}</td><td>${score >= 50 ? "Pass" : "Fail"}</td></tr>`;
    })
    .join("");

  const average = count > 0 ? (total / count).toFixed(2) : 0;

  body.innerHTML = `
        <div class="transcript-container fade-in">
            <div class="content-card">
                <h3>Official Transcript</h3>
                <table class="admin-table">
                    <thead><tr><th>Subject</th><th>Score</th><th>Status</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <div class="academic-box" style="margin-top:20px">
                    <p>Average Score: <strong>${average}</strong></p>
                    <p>Result: <strong style="color:green">${average >= 75 ? "Distinction" : "Passed"}</strong></p>
                </div>
                <div style="margin-top:20px">
                    <button class="save-btn" onclick="window.print()"><i class="fas fa-print"></i> Print Transcript</button>
                    ${average >= 75 ? `<button class="menu-btn" style="background:#f59e0b" onclick="generateCertificate()"><i class="fas fa-award"></i> View Certificate</button>` : ""}
                </div>
            </div>
        </div>
    `;
}

// --- Certificate Template (အလှပြရန်) ---
function generateCertificate() {
  const body = document.getElementById("dynamic-body");
  body.innerHTML = `
        <div class="certificate-frame animate-up">
            <div class="cert-border">
                <div class="cert-content">
                    <h1 class="cert-title">CERTIFICATE</h1>
                    <p>OF COMPLETION</p>
                    <hr>
                    <p>This is to certify that</p>
                    <h2 class="student-name">${currentUser.name}</h2>
                    <p>has successfully completed the Full-Stack Web Development Bootcamp</p>
                    <p>with the grade of <strong>Distinction</strong></p>
                    <div class="cert-footer">
                        <div><p>________________</p><p>Lead Instructor</p></div>
                        <div><p>________________</p><p>Date</p></div>
                    </div>
                </div>
            </div>
            <br>
            <button class="menu-btn" onclick="renderAcademicRecords()">Back</button>
        </div>
    `;
}

// --- Message ဖျက်ရန် Function ---
async function deleteMessage(id) {
  if (confirm("ဤစာကို ဖျက်ရန် သေချာပါသလား?")) {
    try {
      await db.collection("messages").doc(id).delete();
    } catch (error) {
      alert("Error deleting message: " + error.message);
    }
  }
}

// --- Message ပြင်ရန် Function ---
async function editMessage(id, oldText) {
  const newText = prompt("စာသားကို ပြင်ဆင်ပါ:", oldText);
  if (newText !== null && newText.trim() !== "" && newText !== oldText) {
    try {
      await db.collection("messages").doc(id).update({
        text: newText,
        edited: true,
        editedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      alert("Error updating message: " + error.message);
    }
  }
}

// Admin Table ထဲက Message ခလုတ်ကို ပြင်ခြင်း
function openDirectMessage(uid) {
  const student = studentsList.find((s) => s.uid === uid);
  showMessages(uid, student.name); // Chat section သို့ တန်းသွားမည်
}

async function updateGrades(studentUid) {
  // UI ထဲက ရိုက်ထားတဲ့ အမှတ်တွေကို ယူမယ်
  const subjects = ["html", "css", "javascript", "react", "nodejs", "database"];
  let newGrades = {};

  subjects.forEach((sub) => {
    newGrades[sub] =
      parseInt(document.getElementById("grade-" + sub).value) || 0;
  });

  try {
    // Firestore ထဲ တိုက်ရိုက် Update လုပ်ခြင်း
    await db.collection("users").doc(studentUid).update({
      grades: newGrades,
    });
    alert("အမှတ်စာရင်းကို Database ထဲသို့ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။");
    renderAdminPanel(); // Admin စာမျက်နှာကို ပြန်သွားမယ်
  } catch (error) {
    alert("Error updating grades: " + error.message);
  }
}

// Real-time မှာ Message များ ဖတ်ခြင်း
function loadGroupChat() {
  db.collection("messages")
    .where("batchId", "==", "Batch-05")
    .orderBy("timestamp", "asc")
    .onSnapshot((snapshot) => {
      const chatBox = document.getElementById("chat-box");
      chatBox.innerHTML = "";
      snapshot.forEach((doc) => {
        const msg = doc.data();
        const isMe = msg.senderId === currentUser.uid;
        chatBox.innerHTML += `
                <div class="msg-bubble ${isMe ? "me" : "other"}">
                    <small>${msg.senderName}</small>
                    <p>${msg.text}</p>
                </div>
              `;
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}

async function submitGrades(uid) {
    const gradeInput = document.getElementById('new-grade');
    if (!gradeInput) return;
    
    const newGrade = parseInt(gradeInput.value); 
    
    if (isNaN(newGrade)) return alert("ကျေးဇူးပြု၍ အမှတ်ကို ဂဏန်းဖြင့် ရိုက်ထည့်ပါ။");

    try {
        await db.collection('users').doc(uid).update({
            overallGrade: parseInt(newGrade) // String ကို Number အဖြစ် ပြောင်းပြီးမှ သိမ်းမည်
        });
        
        alert("အမှတ်စာရင်း သိမ်းဆည်းပြီးပါပြီ။");
        renderAdminPanel(); // Table ကို refresh လုပ်မည်
    } catch (e) {
        alert("Error: " + e.message);
    }
}

// 🔥 studentUid ကို parameter အဖြစ် လက်ခံခိုင်းပါ
async function saveAcademicStatus(studentUid) { 
  const newStatus = {
        examDate: document.getElementById("adm-exam").value,
        overallGrade: document.getElementById("adm-grade").value,
        attendance: document.getElementById("adm-att").value,
        batchId: document.getElementById("adm-batch").value
    };

    try {
        // Firestore ထဲ တိုက်ရိုက် Update လုပ်မည်
        await db.collection('users').doc(studentUid).update(newStatus);
        
        alert("ကျောင်းသား၏ Academic Status ကို Cloud ပေါ်တွင် သိမ်းဆည်းပြီးပါပြီ။");
        
        // Admin Panel (ကျောင်းသားစာရင်း) သို့ ပြန်သွားမည်
        renderAdminPanel(); 
        
    } catch (e) {
        console.error("Update Error:", e);
        alert("Error: " + e.message);
    }
}

function toggleEditMode(isEdit) {
  document.getElementById("profile-view").style.display = isEdit
    ? "none"
    : "block";
  document.getElementById("profile-edit").style.display = isEdit
    ? "block"
    : "none";
}

function renderAuthSection() {
  const authDiv = document.getElementById("auth-section");
  authDiv.innerHTML = `
        <div class="user-brief" onclick="showSection('profile')">
            <img src="${currentUser.photo}" alt="user">
            <div><p>${currentUser.name}</p><small>${currentUser.role}</small></div>
        </div>
    `;
}

function toggleElement(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

// ကျောင်းသားသစ် အကောင့်ဖွင့်ပေးခြင်း (ဆရာသုံးရန်)
async function createStudentAccount(email, password, name) {
  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // Firestore ထဲမှာ ကျောင်းသားရဲ့ အချက်အလက်ကို သိမ်းမယ်
    await db.collection("users").doc(uid).set({
      uid: uid,
      name: name,
      email: email,
      role: "Student",
      isPaid: true, // ဆရာကိုယ်တိုင် ဆောက်ပေးတာမို့ true ထားလိုက်မယ်
      skills: [],
      notes: "",
      photo: "https://via.placeholder.com/100",
    });

    alert("ကျောင်းသားအကောင့် အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ။");
  } catch (error) {
    console.error("Error creating student:", error);
  }
}

// Quiz Engine နမူနာ
function renderQuiz(data) {
  let quizHtml = "<h3>Module Quiz</h3>";
  data.questions.forEach((item, index) => {
    quizHtml += `
            <div class="quiz-card">
                <p><strong>Q${index + 1}: ${item.q}</strong></p>
                ${item.options
                  .map(
                    (opt, i) => `
                    <label><input type="radio" name="q${index}" value="${i}"> ${opt}</label><br>
                `,
                  )
                  .join("")}
            </div>
        `;
  });
  quizHtml +=
    '<br><button class="menu-btn" onclick="checkQuiz()">အဖြေစစ်မည်</button>';
  document.getElementById("dynamic-body").innerHTML = quizHtml;
}

// --- Assignment Submit Logic ---
async function submitAssignmentDB(catIdx, modIdx, lesIdx) {
  const text = document.getElementById("atxt").value.trim();
  const lesson = courseData[catIdx].modules[modIdx].lessons[lesIdx];

  if (text.split(/\s+/).length < 50) {
    return alert("စာလုံးရေ အနည်းဆုံး ၅၀ ပြည့်အောင် ရေးပေးပါ။");
  }

  try {
    // ၁။ Firestore: 'submissions' collection ထဲသို့ ပို့မည်
    await db.collection("submissions").add({
      studentId: currentUser.uid,
      studentName: currentUser.name,
      lessonTitle: lesson.title,
      category: courseData[catIdx].category,
      content: text,
      status: "pending", // ဆရာမစစ်ရသေးခင် status
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // ၂။ ပြီးမြောက်ကြောင်း မှတ်သားမည်
    if (!currentUser.completedLessons.includes(lesson.title)) {
      currentUser.completedLessons.push(lesson.title);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      await syncProgressToCloud(); // <--- Cloud ပေါ် တန်းပို့မည်
    }

    alert("အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။");

    // ၃။ နောက်စာမျက်နှာကို တန်းသွားမည်
    goToNextLesson(catIdx, modIdx, lesIdx);
  } catch (error) {
    alert("Error submitting: " + error.message);
  }
}

// --- နောက်သင်ခန်းစာသို့ သွားရန် (Helper) ---
function goToNextLesson(catIdx, modIdx, lesIdx) {
  const currentModule = courseData[catIdx].modules[modIdx];

  if (lesIdx + 1 < currentModule.lessons.length) {
    // Module တစ်ခုတည်းမှာပဲ နောက်သင်ခန်းစာ ရှိနေသေးလျှင်
    renderLessonContent(catIdx, modIdx, lesIdx + 1);
  } else {
    // Module ပြီးသွားလျှင် သင်ခန်းစာမာတိကာသို့ ပြန်သွားမည်
    alert(
      "ဂုဏ်ယူပါတယ်။ သင်သည် ဤ Module ရှိ သင်ခန်းစာအားလုံးကို ပြီးမြောက်သွားပါပြီ။",
    );
    showSection("courses");
  }
}

// --- ဆရာအတွက်: ကျောင်းသားများ တင်ထားသော Assignment များကို ဖတ်ရန် ---
async function renderSubmissions() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `<h3><i class="fas fa-file-signature"></i> Reviewing Submissions</h3><div class="loader">Loading...</div>`;
    
    try {
        const snap = await db.collection('submissions').where('status', '==', 'pending').get();
        let html = '<div class="dashboard-grid">';
        
        if (snap.empty) {
            body.innerHTML = `<h3>Reviewing Submissions</h3><div class="content-card">စစ်ဆေးရန် မရှိသေးပါ။</div><br><button class="menu-btn" onclick="renderAdminPanel()">Back</button>`;
            return;
        }

        snap.forEach(doc => {
            const s = doc.data();
            const previewText = (s.content || s.githubLink || "");

            html += `
                <div class="content-card animate-up">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <h5>${s.studentName}</h5>
                        <!-- 🔥 ဖျက်ရန် ခလုတ်လေး ဤနေရာတွင် ပါဝင်ရမည် -->
                        <i class="fas fa-trash-alt" style="color:#ef4444; cursor:pointer; padding:5px;" 
                           onclick="deleteSubmission('${doc.id}')" title="ဖျက်မည်"></i>
                    </div>
                    <small style="color:var(--primary)">${s.lessonTitle}</small>
                    <p style="margin:10px 0; font-size:0.9rem; opacity:0.8;">${previewText.substring(0, 40)}...</p>
                    <button class="save-btn" style="width:100%;" onclick="gradeThisSubmission('${doc.id}')">View & Grade</button>
                </div>`;
        });
        body.innerHTML = html + '</div><br><button class="menu-btn" onclick="renderAdminPanel()">Back</button>';
    } catch (err) { console.error(err); }
}

// 🔥 ဖျက်သည့် Logic ပါဝင်ရမည်
async function deleteSubmission(id) {
    if (confirm("ဤပေးပို့မှုကို အပြီးဖျက်ရန် သေချာပါသလား?")) {
        try {
            await db.collection('submissions').doc(id).delete();
            alert("ဖျက်ပြီးပါပြီ။");
            renderSubmissions(); // စာရင်းပြန် Render လုပ်မည်
        } catch (e) { alert(e.message); }
    }
}

// တစ်ခုချင်းစီကို အမှတ်ပေးရန် UI
async function gradeThisSubmission(docId) {
    const doc = await db.collection('submissions').doc(docId).get();
    const s = doc.data();
    const body = document.getElementById('dynamic-body');

    body.innerHTML = `
        <div class="content-card animate-up" style="max-width:700px; margin:auto;">
            <h3>Grading: ${s.studentName}</h3>
            <p>Module: ${s.lessonTitle}</p>
            <hr><br>
            <div class="academic-box" style="white-space: pre-wrap; font-family:inherit;">
                ${s.content ? s.content : `GitHub Link: <a href="${s.githubLink}" target="_blank">${s.githubLink}</a>`}
            </div>
            <br>
            <label>ပေးမည့်အမှတ် (Score out of 100)</label>
            <input type="number" id="grade-score" class="edit-input" placeholder="အမှတ်ရိုက်ထည့်ပါ">
            <br>
            <label>ဆရာ့မှတ်ချက် (Optional)</label>
            <textarea id="teacher-feedback" class="edit-input" rows="2" placeholder="အကြံပြုချက်ရေးပါ"></textarea>
            
            <div style="margin-top:20px; display:flex; gap:10px;">
                <button class="save-btn" onclick="confirmGrade('${docId}', '${s.studentId}', '${s.lessonTitle}')">Submit Grade</button>
                <button class="menu-btn" onclick="renderSubmissions()">Cancel</button>
            </div>
        </div>
    `;
}

function renderAbout() {
    document.getElementById('dynamic-body').innerHTML = `
        <div class="content-card animate-up" style="max-width: 800px; margin: auto; line-height: 1.8;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3><i class="fas fa-graduation-cap"></i> ကျွန်ုပ်တို့အကြောင်း (About Us)</h3>
                <button class="menu-btn" onclick="showSection('dashboard')"><i class="fas fa-home"></i> Back to Home</button>
            </div>
                <hr><br>
                <p><strong>Myanmar Full-Stack Bootcamp (MM)</strong> သည် မြန်မာနိုင်ငံရှိ လူငယ်များ နိုင်ငံတကာအဆင့်မီ နည်းပညာရပ်များကို မိခင်ဘာသာစကားဖြင့် စနစ်တကျ သင်ယူနိုင်စေရန် ရည်ရွယ်တည်ထောင်ထားခြင်း ဖြစ်ပါသည်။</p>
                <p>ကျွန်ုပ်တို့၏ သင်ရိုးညွှန်းတမ်းသည် ကမ္ဘာကျော် <strong>Columbia University Software Engineering</strong> သင်ကြားမှုစနစ်ကို အခြေခံထားပြီး၊ လက်တွေ့နယ်ပယ်တွင် အမှန်တကယ် အသုံးချနိုင်သော Foundations, Technical နှင့် Full-Stack ဘာသာရပ်များကို အပိုင်းလိုက် ခွဲခြားသင်ကြားပေးနေပါသည်။</p>
                <div class="academic-box">
                    <h4>ကျွန်ုပ်တို့၏ ရည်မှန်းချက်</h4>
                    <ul>
                        <li>မြန်မာ Developer ကောင်းများစွာ ပေါ်ထွက်လာစေရန်။</li>
                        <li>အဆင့်မြင့် နည်းပညာများကို လွယ်ကူစွာ သင်ယူနိုင်သော Platform တစ်ခုဖြစ်စေရန်။</li>
                        <li>ကျောင်းသားနှင့် ဆရာ တိုက်ရိုက် ဆက်သွယ်သင်ကြားနိုင်သော ဝန်းကျင်တစ်ခု ဖန်တီးရန်။</li>
                    </ul>
                </div>
        </div>`;
}

function renderPrivacy() {
    document.getElementById('dynamic-body').innerHTML = `
        <div class="content-card animate-up" style="max-width: 800px; margin: auto; line-height: 1.8;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3><i class="fas fa-user-shield"></i> ကိုယ်ရေးအချက်အလက် မူဝါဒ (Privacy Policy)</h3>
            <button class="menu-btn" onclick="showSection('dashboard')"><i class="fas fa-home"></i> Back to Home</button>
            </div>
            <hr><br>
            <p>ကျောင်းသားများ၏ ကိုယ်ရေးအချက်အလက်များကို Google Firebase တွင် လုံခြုံစွာ သိမ်းဆည်းထားပါသည်။</p>
            
            <h4>၁။ ဒေတာ သိမ်းဆည်းခြင်း</h4>
            <p>ကျောင်းသားများ၏ နာမည်၊ အီးမေးလ်၊ အမှတ်စာရင်းနှင့် သင်ယူမှု အခြေအနေများကို <strong>Google Firebase Cloud</strong> တွင် လုံခြုံစိတ်ချစွာ သိမ်းဆည်းထားပါသည်။</p>

            <h4>၂။ အချက်အလက် အသုံးပြုမှု</h4>
            <p>သင်၏ ဒေတာများကို သင်တန်းတိုးတက်မှု စစ်ဆေးရန်၊ Transcript နှင့် Certificate ထုတ်ပေးရန်နှင့် သင်တန်းနှင့်ပတ်သက်သော အသိပေးချက်များ ပို့ရန်အတွက်သာ အသုံးပြုပါသည်။</p>

            <h4>၃။ တတိယအဖွဲ့အစည်းသို့ မျှဝေခြင်း</h4>
            <p>ကျွန်ုပ်တို့သည် ကျောင်းသားများ၏ မည်သည့် အချက်အလက်ကိုမျှ တခြားသော ကုမ္ပဏီ သို့မဟုတ် တတိယအဖွဲ့အစည်းများထံသို့ ရောင်းချခြင်း၊ မျှဝေခြင်း လုံးဝပြုလုပ်မည် မဟုတ်ပါ။</p>

            <div class="tip-box" style="background:#f0f9ff; border-left: 5px solid #0369a1; padding: 15px; border-radius: 5px;">
                <p style="margin:0; font-size:0.9rem; color:#0369a1;"><strong>မှတ်ချက်:</strong> Dark Mode နှင့် Login အခြေအနေ မှတ်သားထားရန် Browser ၏ Local Storage ကို အသုံးပြုပါသည်။</p>
            </div>
            <br>
            <p style="font-size: 0.8rem; color: grey;">နောက်ဆုံးပြင်ဆင်သည့်ရက်စွဲ - ၂၉ ဇန်နဝါရီ၊ ၂၀၂၆</p>
        </div>`;
}

// --- ၁။ ခေါင်းလောင်း Noti စနစ် (အသေချာဆုံး Version) ---
let unreadNotiCount = 0;

const globalNotiSound = new Audio('assets/noti-sound.mp3');

function initNotifications() {
    if (!currentUser.uid || !currentUser.isLoggedIn) return;

    // 🔥 အချိန်စစ်တဲ့နေရာမှာ Browser အားလုံးကို အလုပ်လုပ်စေဖို့ ၂ မိနစ် ကြိုစစ်ခိုင်းမည်
    const startTime = new Date(Date.now() - 120000); 

    // ၂။ Direct Messages Noti
    db.collection('messages')
        .where('receiverId', '==', currentUser.uid)
        .where('timestamp', '>', startTime)
        .onSnapshot(snap => {
            // Added ဖြစ်တဲ့စာအသစ်တွေကို စစ်မည်
            let newDocs = snap.docChanges().filter(c => c.type === "added");
            if (newDocs.length > 0) {
                triggerNotiUI("DM စာတိုအသစ် ရောက်ရှိလာပါသည်");
            }
        }, err => console.log("DM Noti Restricted"));

    // ၃။ Group Messages Noti
    if (currentUser.batchId) {
        db.collection('messages')
            .where('batchId', '==', currentUser.batchId)
            .where('type', '==', 'group')
            .where('timestamp', '>', startTime)
            .onSnapshot(snap => {
                let newDocs = snap.docChanges().filter(c => c.type === "added");
                newDocs.forEach(change => {
                    if (change.doc.data().senderId !== currentUser.uid) {
                        triggerNotiUI("အုပ်စုစာတိုအသစ် ရောက်ရှိလာပါသည်");
                    }
                });
            }, err => console.log("Group Noti Restricted"));
    }
}

function triggerNotiUI(text) {
    unreadNotiCount++;
    
    // Badge ပြရန်
    const badge = document.getElementById('noti-badge');
    if (badge) {
        badge.innerText = unreadNotiCount;
        badge.style.setProperty('display', 'flex', 'important'); // Safari အတွက် Force display
    }

    // ခေါင်းလောင်း icon ကို အနီရောင်ပြောင်းရန်
    const bell = document.querySelector('.notification-wrapper i');
    if (bell) {
        bell.style.color = "#ef4444";
        bell.classList.add('fa-shake');
    }

    // List ထဲထည့်ရန်
    addNotiToList(text);

    // 🔥 အသံဖွင့်ရန် ကြိုးစားခြင်း
    globalNotiSound.play().catch(e => {
        console.log("Audio play blocked by browser policy. User must interact first.");
    });
}

function processNotiAlert(snap, chatType) {
    snap.docChanges().forEach(change => {
        if (change.type === "added") {
            const msg = change.doc.data();
            if (msg.senderId === currentUser.uid) return;

            unreadNotiCount++;
            updateNotiBadge();
            addNotiToList(`[${chatType}] ${msg.senderName}: ${msg.text.substring(0, 15)}...`);
            
            // 🔥 အသံမြည်စေရန် (Safari compatible logic)
            if (isAudioUnlocked) {
                notiSound.currentTime = 0; // အစကနေ ပြန်ဖွင့်ရန်
                notiSound.play().catch(e => console.log("Sound play error:", e));
            }
        }
    });
}

function handleNotiSnapshot(snap, type) {
    snap.docChanges().forEach(change => {
        if (change.type === "added") {
            const msg = change.doc.data();
            if (msg.senderId === currentUser.uid) return; // ကိုယ့်စာကိုယ် Noti မပေးပါ

            unreadNotiCount++;
            updateNotiBadge();
            addNotiToList(`${msg.senderName}: ${msg.text.substring(0, 15)}...`);
            
            // အသံဖွင့်ရန်
            const audio = new Audio('assets/noti-sound.mp3');
            audio.play().catch(() => {});
        }
    });
}

// Noti တက်လာလျှင် လုပ်ဆောင်မည့် function
function processNotiChanges(snap, type) {
    snap.docChanges().forEach(change => {
        if (change.type === "added") {
            const msg = change.doc.data();
            if (msg.senderId === currentUser.uid) return;

            unreadNotiCount++;
            updateNotiBadge();
            addNotiToList(`[${type}] ${msg.senderName}: ${msg.text.substring(0, 15)}...`);
            
            // 🔥 Safari/Chrome Autoplay Fix:
            const audio = new Audio('assets/noti-sound.mp3');
            let playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play blocked. Click anywhere to enable sound.");
                });
            }
        }
    });
}

function updateNotiBadge() {
    const badge = document.getElementById('noti-badge');
    const bellIcon = document.querySelector('.notification-wrapper i');
    if (!badge) return;

    if (unreadNotiCount > 0) {
        badge.innerText = unreadNotiCount;
        badge.style.display = "flex"; // Safari အတွက် flex ကို သေချာပေးပါ
        if (bellIcon) {
            bellIcon.style.color = "#ef4444"; // ခေါင်းလောင်းနီသွားမည်
            bellIcon.classList.add('fa-shake'); // အသံမြည်စဉ် ခေါင်းလောင်းတုန်ခါမည်
        }
    } else {
        badge.style.display = "none";
        if (bellIcon) {
            bellIcon.style.color = "";
            bellIcon.classList.remove('fa-shake');
        }
    }
}

function addNotiToList(text) {
    const list = document.getElementById('noti-list');
    if (!list) return;
    const item = `<div class="noti-item" onclick="showSection('messages')"><i class="fas fa-comment-dots"></i> ${text}</div>`;
    list.innerHTML = item + list.innerHTML;
}

function showNotiInBell(text) {
    const list = document.getElementById('noti-list');
    const badge = document.getElementById('noti-badge');
    const bellIcon = document.querySelector('.notification-wrapper i');

    if (!list || !badge) return;

    // ၁။ Noti အရေအတွက် တိုးမည်
    unreadNotiCount++;
    badge.innerText = unreadNotiCount;
    badge.style.display = "flex"; // ပြသမည်
    
    // ၂။ ခေါင်းလောင်းကို အရောင်ပြောင်းပြီး တုန်ခါစေမည်
    if (bellIcon) {
        bellIcon.style.color = "#ef4444";
        bellIcon.classList.add('fa-shake'); // FontAwesome shake effect
    }

    // ၃။ Noti List ထဲ ထည့်မည်
    const item = `<div class="noti-item" onclick="toggleNotifications(); showSection('messages');">
                    <i class="fas fa-comment"></i> ${text}
                  </div>`;
    list.innerHTML = item + list.innerHTML;

    // ၄။ အသံဖွင့်မည်
    const audio = new Audio('assets/noti-sound.mp3');
    audio.play().catch(e => console.log("Sound interaction needed"));
}

function toggleNotifications() {
    const dropdown = document.getElementById('noti-dropdown');
    const badge = document.getElementById('noti-badge');
    const bellIcon = document.querySelector('.notification-wrapper i');

    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
        // Noti ဖွင့်ကြည့်ပြီးရင် Badge ကို reset လုပ်မယ်
        unreadNotiCount = 0;
        if (badge) badge.style.display = "none";
        if (bellIcon) {
            bellIcon.style.color = "";
            bellIcon.classList.remove('fa-shake');
        }
    }
}

// --- ၂။ Global Search Logic ---
function handleSearch(query) {
    const dropdown = document.getElementById('search-results');
    if (!query) { dropdown.style.display = "none"; return; }
    
    let results = [];
    courseData.forEach((cat, ci) => {
        cat.modules.forEach((mod, mi) => {
            mod.lessons.forEach((les, li) => {
                if (les.title.toLowerCase().includes(query.toLowerCase())) {
                    results.push({ title: les.title, ci, mi, li });
                }
            });
        });
    });

    if (results.length > 0) {
        dropdown.innerHTML = results.map(r => 
            `<div class="noti-item" onclick="renderLessonContent(${r.ci}, ${r.mi}, ${r.li}); document.getElementById('search-results').style.display='none';">
                <i class="far fa-file-alt"></i> ${r.title}
            </div>`
        ).join('');
        dropdown.style.display = "block";
    } else {
        dropdown.innerHTML = '<div class="noti-item">ရှာမတွေ့ပါ။</div>';
        dropdown.style.display = "block";
    }
}

// --- ၃။ Live Class Countdown Logic ---
function startLiveCountdown() {
    setInterval(() => {
        if (!nextClassTime) return;

        const now = new Date().getTime();
        const diff = nextClassTime - now;
        
        const timerEl = document.getElementById('live-timer');
        if (!timerEl) return;

        if (diff <= 0) {
            timerEl.innerHTML = "<span style='color:#22c55e'>အတန်းချိန် ရောက်ရှိနေပါပြီ။</span>";
            return;
        }

        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        timerEl.innerHTML = `${h}h : ${m}m : ${s}s`;
    }, 1000);
}

// --- ၄။ Admin Content Manager (Teacher Only) ---
function renderContentEditor() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="content-card animate-up">
            <h3><i class="fas fa-plus-circle"></i> သင်ခန်းစာ အသစ်ထည့်သွင်းရန်</h3>
            <hr><br>
            
            <label>Category (Foundations, Technical, Full-Stack သို့မဟုတ် အသစ်ရိုက်ထည့်ပါ)</label>
            <input type="text" id="new-cat" class="edit-input" list="cat-list" placeholder="Category အမည် ရွေးပါ သို့မဟုတ် ရိုက်ထည့်ပါ">
            <datalist id="cat-list">
                <option value="Foundations">
                <option value="Technical">
                <option value="Full-Stack">
            </datalist>

            <label>Module Name</label>
            <input type="text" id="new-mod-name" class="edit-input" placeholder="ဥပမာ- Module 1: Introduction">

            <label>Lesson Title</label>
            <input type="text" id="new-les-title" class="edit-input" placeholder="ဥပမာ- 1.1.1: Hello World">

            <label>File Path</label>
            <input type="text" id="new-les-path" class="edit-input" placeholder="content/foundations/...">

            <label>Type (article, quiz, assignment, project သို့မဟုတ် အသစ်ရိုက်ထည့်ပါ)</label>
            <input type="text" id="new-type" class="edit-input" list="type-list" placeholder="Type ရွေးပါ သို့မဟုတ် ရိုက်ထည့်ပါ">
            <datalist id="type-list">
                <option value="article">
                <option value="quiz">
                <option value="assignment">
                <option value="project">
            </datalist>

            <div style="margin-top:20px;">
                <button class="save-btn" onclick="saveNewLessonToCloud()">Save to Database</button>
                <button class="menu-btn" onclick="renderAdminPanel()">Back</button>
            </div>
        </div>`;
}

async function saveNewLessonToCloud() {
    const data = {
        category: document.getElementById('new-cat').value,
        module: document.getElementById('new-mod-name').value,
        title: document.getElementById('new-les-title').value,
        path: document.getElementById('new-les-path').value,
        type: document.getElementById('new-type').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp() // အချိန်ပါ ထည့်သိမ်းမည်
    };

    try {
        await db.collection('course_structure').add(data);
        alert("သင်ခန်းစာ အသစ်ကို Database ထဲသို့ ထည့်သွင်းပြီးပါပြီ။");
        renderAdminPanel();
    } catch (error) {
        console.error("Save Error:", error);
        alert("Permission Denied: သင်သည် ဆရာ (Teacher) အကောင့် ဖြစ်ရန် လိုအပ်ပါသည်။");
    }
}

function renderZoomEditor() {
    const body = document.getElementById('dynamic-body');
    // လက်ရှိအချိန်ကို input format ပြောင်းရန်
    const dateStr = nextClassTime ? nextClassTime.toISOString().slice(0, 16) : "";

    body.innerHTML = `
        <div class="content-card animate-up" style="max-width: 600px; margin: auto;">
            <h3><i class="fas fa-video"></i> Live Class စီမံခန့်ခွဲမှု</h3>
            <p>ဤနေရာတွင် ပြင်ဆင်လိုက်ပါက ကျောင်းသားအားလုံး၏ Dashboard တွင် ချက်ချင်းပြောင်းလဲသွားမည်။</p>
            <hr><br>
            
            <label>Zoom / Meet Meeting Link</label>
            <input type="url" id="zoom-url-input" class="edit-input" value="${currentZoomLink}" placeholder="https://zoom.us/j/...">
            
            <label style="margin-top:15px; display:block;">နောက်လာမည့် အတန်းချိန် (Class Time)</label>
            <input type="datetime-local" id="zoom-time-input" class="edit-input" value="${dateStr}">
            
            <div style="margin-top:20px; display:flex; gap:10px;">
                <button class="save-btn" onclick="updateZoomToFirebase()">Save Config</button>
                <button class="menu-btn" onclick="renderAdminPanel()">Back</button>
            </div>
        </div>
    `;
}

async function updateZoomToFirebase() {
    const newUrl = document.getElementById('zoom-url-input').value;
    const newTime = document.getElementById('zoom-time-input').value;

    if (!newUrl) return alert("Link ထည့်ပေးပါ");

    try {
        await db.collection('settings').doc('zoom_config').set({
            url: newUrl,
            startTime: firebase.firestore.Timestamp.fromDate(new Date(newTime)),
            updatedBy: currentUser.name
        });
        alert("Zoom Config ကို အောင်မြင်စွာ Update လုပ်ပြီးပါပြီ။");
        renderAdminPanel();
    } catch (e) {
        alert("Error: " + e.message);
    }
}

// --- ဆရာက အမှတ်ပေးခြင်းကို အတည်ပြုသည့် Function ---
async function confirmGrade(docId, studentId, lessonTitle) {
    const scoreInput = document.getElementById('grade-score');
    const feedbackInput = document.getElementById('teacher-feedback');
    
    if (!scoreInput || !scoreInput.value) {
        return alert("ကျေးဇူးပြု၍ အမှတ်အရင်ထည့်ပါ။");
    }

    const score = parseInt(scoreInput.value);
    const feedback = feedbackInput ? feedbackInput.value : "";

    try {
        // ၁။ ကျောင်းသားရဲ့ Document ထဲမှာ အမှတ်သွားထည့်မယ်
        // ဘာသာရပ်အမည်ကို သင်ခန်းစာခေါင်းစဉ်မှ ယူမည် (ဥပမာ- html, css)
        const subjectKey = lessonTitle.toLowerCase().includes('html') ? 'html' : 
                         lessonTitle.toLowerCase().includes('css') ? 'css' : 'javascript';

        await db.collection('users').doc(studentId).set({
            grades: { [subjectKey]: score }
        }, { merge: true });

        // ၂။ Submission status ကို 'graded' ပြောင်းမယ်
        await db.collection('submissions').doc(docId).update({
            status: "graded",
            score: score,
            teacherFeedback: feedback
        });

        // ၃။ ကျောင်းသားဆီ Noti ပို့မယ်
        await db.collection('messages').add({
            text: `🔔 သင်၏ ${lessonTitle} အတွက် အမှတ်ထွက်ပါပြီ။ (ရမှတ်: ${score})`,
            senderId: currentUser.uid,
            senderName: "System (Tutor)",
            receiverId: studentId,
            type: "direct",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("အမှတ်ပေးခြင်း အောင်မြင်ပါသည်။");
        renderAdminPanel(); // Admin Panel သို့ ပြန်သွားမည်

    } catch (error) {
        console.error("Grading Error:", error);
        alert("Error: " + error.message);
    }
}

// ကျောင်းသားကိုယ်တိုင် တင်ထားသမျှ Assignment/Project စာရင်းနှင့် အမှတ်ကိုကြည့်ရန်
async function renderMySubmissions() {
    const body = document.getElementById('dynamic-body');
    if (!currentUser.uid) return alert("ကျေးဇူးပြု၍ အရင် Login ဝင်ပါ။");

    body.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3><i class="fas fa-file-upload"></i> ကျွန်ုပ်၏ ပေးပို့မှုများ</h3>
            <button class="menu-btn" onclick="showSection('profile')"><i class="fas fa-arrow-left"></i> Back</button>
        </div>
        <div id="sub-loading" class="loader">Loading...</div>
    `;

    try {
        const snap = await db.collection('submissions')
                             .where('studentId', '==', currentUser.uid)
                             .orderBy('timestamp', 'desc')
                             .get();

        const loadingDiv = document.getElementById('sub-loading');
        if (loadingDiv) loadingDiv.remove();

        if (snap.empty) {
            body.innerHTML += `<div class="content-card">တင်ထားသော Assignment မရှိသေးပါ။</div>`;
            return;
        }

        let html = '<div class="dashboard-grid">';
        snap.forEach(doc => {
            const s = doc.data();
            const statusClass = s.status === 'graded' ? 'text-success' : 'text-warning';
            const dateStr = s.timestamp ? s.timestamp.toDate().toLocaleDateString() : 'N/A';
            
            html += `
                <div class="content-card animate-up">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <span class="badge-type" style="background:#e0f2fe; color:#0369a1;">${s.category || 'General'}</span>
                        <strong class="${statusClass}" style="font-size:0.8rem;">${s.status.toUpperCase()}</strong>
                    </div>
                    <h4 style="margin:10px 0;">${s.lessonTitle}</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted);">တင်သည့်ရက်: ${dateStr}</p>
                    <hr style="margin:10px 0; border:0; border-top:1px solid #eee;">
                    
                    ${s.status === 'graded' ? `
                        <div class="academic-box" style="background:#f0fdf4; border-left:4px solid #22c55e; padding:10px; border-radius:5px;">
                            <p><strong>ရမှတ်:</strong> <span style="font-size:1.1rem; color:#16a34a;">${s.score} / 100</span></p>
                            <p style="font-size:0.85rem;"><strong>ဆရာ့မှတ်ချက်:</strong> ${s.teacherFeedback || "မှတ်ချက်မရှိပါ။"}</p>
                        </div>
                    ` : `<p style="color:#f59e0b; font-size:0.9rem;"><i class="fas fa-clock"></i> ဆရာမှ စစ်ဆေးနေဆဲဖြစ်ပါသည်။</p>`}
                    
                    <button class="save-btn" style="margin-top:15px; width:100%; font-size:0.85rem;" onclick="viewMySubmissionDetail('${doc.id}')">
                        <i class="fas fa-search-plus"></i> မူရင်းစာသား ပြန်ဖတ်ရန်
                    </button>
                </div>`;
        });
        body.innerHTML += html + '</div>';
    } catch (e) {
        console.error("My Submissions Error:", e);
        body.innerHTML += `<div class="error-msg">Error: ${e.message} <br> (Browser Console မှာ Index Link ပါက နှိပ်ပေးပါ)</div>`;
    }
}

// ခလုတ်နှိပ်ရင် အသေးစိတ်စာသား ပြန်ပြမည့် Function
async function viewMySubmissionDetail(docId) {
    const doc = await db.collection('submissions').doc(docId).get();
    const s = doc.data();
    const body = document.getElementById('dynamic-body');

    body.innerHTML = `
        <div class="content-card animate-up">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>Submission Detail</h3>
                <button class="menu-btn" onclick="renderMySubmissions()">Back</button>
            </div>
            <hr><br>
            <p><strong>သင်ခန်းစာ:</strong> ${s.lessonTitle}</p>
            <div class="academic-box" style="white-space: pre-wrap; background:#f8fafc;">
                ${s.content || `GitHub Link: <a href="${s.githubLink}" target="_blank">${s.githubLink}</a>`}
            </div>
        </div>
    `;
}

// --- ကျောင်းသားကိုယ်တိုင် တင်ထားသော Assignment အသေးစိတ်ကို ပြန်ဖတ်ရန် ---
async function viewMySubmissionDetail(docId) {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = '<div class="loader">စာသားများကို ပြန်လည်ဖတ်ရှုနေသည်...</div>';

    try {
        // Firestore မှ သက်ဆိုင်ရာ Submission ကို ဆွဲယူမည်
        const doc = await db.collection('submissions').doc(docId).get();
        
        if (!doc.exists) {
            alert("ရှာမတွေ့ပါ။");
            renderMySubmissions();
            return;
        }

        const s = doc.data();

        body.innerHTML = `
            <div class="content-card animate-up" style="max-width:850px; margin:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3><i class="fas fa-file-alt"></i> ${s.lessonTitle}</h3>
                    <button class="menu-btn" onclick="renderMySubmissions()">
                        <i class="fas fa-arrow-left"></i> Back to List
                    </button>
                </div>
                <hr><br>
                
                <div class="academic-box" style="background:var(--main-bg); padding:25px; border-radius:12px; line-height:1.8; white-space:pre-wrap;">
                    ${s.content ? s.content : `<strong>GitHub Project Link:</strong> <a href="${s.githubLink}" target="_blank">${s.githubLink}</a>`}
                </div>

                ${s.status === 'graded' ? `
                    <div style="margin-top:30px; padding:20px; border:1px solid #22c55e; border-radius:12px; background:#f0fdf4;">
                        <h4 style="color:#166534; margin-bottom:10px;">ဆရာ့ထံမှ တုံ့ပြန်ချက် (Feedback)</h4>
                        <p><strong>ရမှတ်:</strong> ${s.score} / 100</p>
                        <p><strong>မှတ်ချက်:</strong> ${s.teacherFeedback || "မှတ်ချက်မရှိပါ။"}</p>
                    </div>
                ` : ''}
            </div>
        `;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error("Error loading submission detail:", error);
        alert("ဖတ်မရပါ- " + error.message);
        renderMySubmissions();
    }
}

async function renderPaymentPage(courseId) {
    const body = document.getElementById('dynamic-body');
    const course = allCourses[courseId];

    if (!course) return alert("Course not found!");

    body.innerHTML = '<div class="loader">စစ်ဆေးနေသည်...</div>';

    try {
        // 🔥 နောက်ဆုံးတင်ထားတဲ့ ပေးချေမှုမှတ်တမ်းကို Firestore ကနေ တိုက်ရိုက်သွားစစ်မည်
        const q = await db.collection('payments')
                          .where('studentId', '==', auth.currentUser.uid)
                          .where('courseId', '==', courseId)
                          .orderBy('timestamp', 'desc').limit(1).get();
        
        let statusBanner = "";
        if (!q.empty) {
            const payData = q.docs[0].data();
            if (payData.status === 'pending') {
                statusBanner = `<div class="tip-box animate-up" style="background:#f0f9ff; border-left:5px solid #0ea5e9; padding:15px; margin-bottom:20px;">
                    <i class="fas fa-clock fa-spin"></i> သင်၏ပေးချေမှုကို ဆရာမှ စစ်ဆေးနေဆဲ ဖြစ်ပါသည်။ (Pending)
                </div>`;
            } else if (payData.status === 'rejected') {
                statusBanner = `<div class="error-msg animate-up" style="background:#fff1f2; border:1px solid #fda4af; color:#9f1239; padding:20px; border-radius:12px; margin-bottom:20px;">
                    <h4><i class="fas fa-exclamation-circle"></i> သင်တန်းအပ်နှံမှု အပယ်ခံရပါသည်</h4>
                    <p><strong>အကြောင်းရင်း:</strong> ${payData.rejectReason || "အချက်အလက် မစုံလင်ပါ။"}</p>
                    <small>ကျေးဇူးပြု၍ ပြန်လည်စစ်ဆေးပြီး အသစ်ပြန်တင်ပေးပါ။</small>
                </div>`;
            }
        }

        body.innerHTML = `
            <div class="content-card animate-up" style="max-width: 700px; margin: auto;">
                <h2 style="text-align:center; color:var(--primary);">${course.title} အပ်နှံရန်</h2>
                <p style="text-align:center;">သင်တန်းကြေး - <strong>${course.price}</strong></p>
                <p style="text-align:center;">အောက်ပါ နည်းလမ်းများထဲမှ အဆင်ပြေရာဖြင့် ပေးချေနိုင်ပါသည်။</p>
            
                <br>
                
                <div class="dashboard-grid">
                    <!-- Mobile Banking -->
                    <div class="content-card" style="border: 1px solid #e2e8f0;">
                        <h4><i class="fas fa-mobile-alt"></i> Mobile Banking</h4>
                        <p style="font-size:0.85rem;">Kpay / WavePay<br><strong>09 123 456 789</strong></p>
                    </div>
                    
                    <!-- Credit / Debit Card -->
                    <div class="content-card" style="border: 1px solid #e2e8f0;">
                        <h4><i class="fas fa-credit-card"></i> Credit Card</h4>
                        <p style="font-size:0.85rem;">Visa, Master, JCB<br>Online Payment</p>
                    </div>
                </div>

                <div class="academic-box" style="margin-top:20px;">
                    <label><strong>၁။ ငွေလွှဲပြီးကြောင်း Screenshot တင်ပါ</strong></label>
                    <input type="file" id="payment-file" class="edit-input" accept="image/*" style="padding:10px;">
                    
                    <label style="margin-top:15px; display:block;"><strong>၂။ သို့မဟုတ် ပေးချေမှုလင့်ခ်ကို အသုံးပြုပါ</strong></label>
                    <button class="save-btn" style="background:#000; width:100%;" onclick="handleCardPayment()">
                        <i class="fas fa-credit-card"></i> Pay with Card (Visa/Master/JCB)
                    </button>
                </div>

                <button class="save-btn" id="upload-btn" style="width: 100%; margin-top: 25px; height:50px; font-size:1.1rem;" onclick="handlePaymentUpload('${courseId}')">
                    <i class="fas fa-cloud-upload-alt"></i> စာရင်းသွင်းမှု အတည်ပြုခိုင်းမည်
                </button>

                <button class="menu-btn" style="width:100%; margin-top:10px; background:#64748b;" onclick="renderCourseSelection()">
                    Back to Courses
                </button>
            </div>
        `;
    } catch (e) { console.log(e); }
}

function handleCardPayment() {
    // 🔥 ဒီနေရာမှာ သင့်ရဲ့ တကယ့် Payment Link (ဥပမာ Stripe သို့မဟုတ် တခြား Checkout link) ကို ထည့်ရပါမယ်
    const paymentLink = "https://buy.stripe.com/test_abc123"; // နမူနာ Link
    
    if (paymentLink === "https://buy.stripe.com/test_abc123") {
        alert("Card Payment စနစ်ကို ချိတ်ဆက်နေဆဲဖြစ်ပါသည်။ လက်ရှိတွင် KPay ဖြင့်သာ အရင်ပေးချေပေးပါရန်။");
    } else {
        window.open(paymentLink, '_blank');
    }
}


async function submitPaymentRequest() {
    const url = document.getElementById('payment-screenshot-url').value;
    if (!url) return alert("Screenshot Link ထည့်ပေးပါ။");

    try {
        await db.collection('payments').add({
            studentId: currentUser.uid,
            studentName: currentUser.name,
            screenshot: url,
            status: "pending",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("စာရင်းသွင်းမှု တောင်းဆိုချက် ပို့ပြီးပါပြီ။ ဆရာမှ စစ်ဆေးပြီး ၁ နာရီအတွင်း သင်တန်း ဖွင့်လှစ်ပေးပါမည်။");
        location.reload(); // Status ကို ပြန်စစ်ရန် reload လုပ်မည်
    } catch (e) { alert(e.message); }
}

async function renderPaymentRequests() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `<h3><i class="fas fa-receipt"></i> သင်တန်းကြေး စစ်ဆေးရန်စာရင်း</h3><div class="loader">Loading...</div>`;

    try {
        // Pending ဖြစ်နေတဲ့ ပေးချေမှုတွေကိုပဲ ဆွဲယူမည်
        const snap = await db.collection('payments').where('status', '==', 'pending').get();
        
        if (snap.empty) {
            body.innerHTML = `<h3>စစ်ဆေးရန်စာရင်း မရှိပါ။</h3><button class="menu-btn" onclick="renderAdminPanel()">Back</button>`;
            return;
        }

        let html = '<div class="dashboard-grid">';
        snap.forEach(doc => {
            const p = doc.data();
            html += `
                <div class="content-card animate-up">
                    <h5>${p.studentName}</h5>
                    <small>Course ID: ${p.courseId}</small>
                    <img src="${p.screenshot}" style="width:100%; border-radius:10px; margin:10px 0; cursor:pointer;" onclick="window.open('${p.screenshot}')">
                    <div style="display:flex; gap:10px;">
                        <button class="save-btn" onclick="approveStudent('${doc.id}', '${p.studentId}', '${p.courseId}')">Approve</button>
                        <button class="menu-btn" style="background:red; color:white;" onclick="rejectPayment('${doc.id}')">Reject</button>
                    </div>
                </div>`;
        });
        body.innerHTML = html + '</div><br><button class="menu-btn" onclick="renderAdminPanel()">Back</button>';
    } catch (e) {
        console.error("Payment Request Error:", e);
        body.innerHTML = `<div class="error-msg">Error: ${e.message}</div>`;
    }
}

async function approveStudent(payDocId, studentUid, courseId) {
    try {
        // ၁။ ကျောင်းသား၏ User document တွင် enrolledCourses စာရင်းထဲသို့ ထည့်ပေါင်းမည်
        await db.collection('users').doc(studentUid).update({
            enrolledCourses: firebase.firestore.FieldValue.arrayUnion(courseId)
        });
        
        // ၂။ Payment status ကို Approved ပြောင်းမည်
        await db.collection('payments').doc(payDocId).update({ status: 'approved' });

        alert("သင်တန်းဝင်ခွင့် ပေးလိုက်ပါပြီ။ ကျောင်းသားက အလိုအလျောက် စတင်လေ့လာနိုင်ပါပြီ။");
        renderPaymentRequests(); // List ကို Update လုပ်မည်
    } catch (e) {
        alert("Approve Error: " + e.message);
    }
}

async function handlePaymentUpload(courseId) {
    const fileInput = document.getElementById('payment-file');
    const btn = document.getElementById('upload-btn');
    
    // Safety check: သင်တန်း ID နဲ့ ဖိုင် ပါမပါ စစ်မည်
    if (!courseId || !allCourses[courseId]) return alert("Invalid Course ID!");
    // if (!courseId) return alert("Course ID is missing!");
    if (fileInput.files.length === 0) return alert("ငွေလွှဲပုံ အရင်ရွေးပါ။");

    const file = fileInput.files[0];
    if (file.size > 2 * 1024 * 1024) return alert("ပုံဆိုဒ် 2MB ထက် မကျော်ရပါ။");

    try {
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading... Please wait`;

        // Firebase Storage သို့ တင်ခြင်း
        const storageRef = firebase.storage().ref(`payments/${courseId}_${currentUser.uid}_${Date.now()}`);
        const snapshot = await storageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();

        // Database ထဲသို့ ပို့မည်
        await db.collection('payments').add({
            studentId: currentUser.uid,
            studentName: currentUser.name,
            courseId: courseId, 
            courseTitle: allCourses[courseId].title, // 🔥 အခုဆိုရင် currentId ရှိတဲ့အတွက် title ကို ဖတ်လို့ရပါပြီ
            screenshot: downloadURL,
            status: "pending",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("ပေးချေမှု တင်ပြပြီးပါပြီ။ ဆရာမှ စစ်ဆေးပြီး အတည်ပြုပေးပါမည်။");
        renderCourseSelection(); // အောင်မြင်ရင် သင်တန်းရွေးတဲ့နေရာ ပြန်သွားမည်

    } catch (e) {
        console.error("Upload Error:", e);
        alert("Upload Error: " + e.message);
        // Error တက်ရင် ခလုတ်ကို ပြန်ပွင့်အောင်လုပ်မည်
        btn.disabled = false;
        btn.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> ပြန်လည်ကြိုးစားမည်`;
    }
}

// --- ၁။ Form အပြန်အလှန် ပြောင်းပေးမည့် function ---
function toggleAuthMode(mode) {
    const loginArea = document.getElementById('login-form-area');
    const signupArea = document.getElementById('signup-form-area');
    if (mode === 'signup') {
        loginArea.style.display = 'none';
        signupArea.style.display = 'block';
    } else {
        loginArea.style.display = 'block';
        signupArea.style.display = 'none';
    }
}

// --- ၂။ Sign Up (အကောင့်အသစ်ဖွင့်ခြင်း) Logic ---
async function handleSignUp() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!name || !email || !password) return alert("အချက်အလက်အားလုံး ဖြည့်စွက်ပေးပါ။");
    if (password.length < 6) return alert("Password သည် အနည်းဆုံး ၆ လုံး ရှိရပါမည်။");

    try {
        // 🔥 အရင်က ဒီနေရာမှာ ကုဒ်နှစ်ကြောင်း ထပ်နေပါတယ်၊ အခု တစ်ကြောင်းတည်းပဲ ထားလိုက်ပါပြီ
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Firestore Database ထဲတွင် ကျောင်းသား Profile အစစ်ကို သိမ်းခြင်း
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            name: name,
            email: email,
            role: "Student",   
            isPaid: false,     
            photo: "https://placehold.co/150x150/003087/white?text=" + name.charAt(0),
            skills: [],
            notes: "",
            completedLessons: [],
            quizAttempts: {},
            grades: {},
            batchId: "Batch-Waiting"
        });

        alert("အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။ သင်တန်းကြေးပေးသွင်းရန် အဆင့်သို့ ဆက်သွားပါမည်။");
        
        // LocalStorage ကို Update လုပ်ပြီး Page ကို Refresh လုပ်မည်
        currentUser = { uid: user.uid, name: name, role: "Student", isPaid: false, isLoggedIn: true };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        location.reload(); 

    } catch (error) {
        console.error("SignUp Error:", error);
        alert("Error: " + error.message);
    }
}

function renderCourseSelection() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="welcome-banner fade-in">
            <h2>မင်္ဂလာပါ ${currentUser.name}! 👋</h2>
            <p>သင်တက်ရောက်လိုသော သင်တန်းကို ရွေးချယ်ပါ။</p>
        </div>
        <div class="dashboard-grid animate-up" id="course-grid"></div>
    `;

    const grid = document.getElementById('course-grid');
    
    for (let id in allCourses) {
        const course = allCourses[id];
        const isEnrolled = currentUser.enrolledCourses?.includes(id);
        const isTeacher = currentUser.role === 'Teacher';

        // 🔥 အဓိကအချက်: ဆရာဖြစ်စေ၊ ဝယ်ပြီးသားကျောင်းသားဖြစ်စေ 'Joined' ပဲ ပြမည်
        const hasAccess = isEnrolled || isTeacher;

        const card = document.createElement('div');
        card.className = 'topic-card course-selection-card';
        card.onclick = () => selectCourse(id);
        
        card.innerHTML = `
            <div class="card-icon"><i class="fas ${course.icon || 'fa-graduation-cap'}"></i></div>
            <h3 style="margin-bottom:10px;">${course.title}</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">${course.description}</p>
            
            <ul style="text-align:left; font-size:0.8rem; margin-bottom:15px; padding-left:20px; color:var(--text-main);">
                ${course.benefits.map(b => `<li>${b}</li>`).join('')}
            </ul>

            <div style="font-weight:bold; color:var(--primary); margin-bottom:15px;">${course.price}</div>

            <div class="enroll-status-container">
                ${hasAccess 
                    ? `<button class="course-card-btn btn-joined">
                         တက်ရောက်နေဆဲ <i class="fas fa-check-circle"></i>
                       </button>` 
                    : `<button class="course-card-btn btn-enroll-now">
                         <i class="fas fa-shopping-cart"></i> Enroll Now
                       </button>`
                }
            </div>
        `;
        grid.appendChild(card);
    }
}

function selectCourse(id) {
    // ပိုက်ဆံပေးပြီးသား သို့မဟုတ် ဆရာဖြစ်လျှင် Dashboard ပေးဝင်မည်
    if (currentUser.enrolledCourses?.includes(id) || currentUser.role === 'Teacher') {
        currentUser.selectedCourseId = id;
        
        // 🔥 အရေးကြီးဆုံးအချက် - ရွေးလိုက်တဲ့သင်တန်းရဲ့ data ကို ပင်မ courseData ထဲ ထည့်လိုက်ခြင်း
        courseData = allCourses[id].data; 
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Lock များကို ဖြုတ်မည်
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('nav-locked'));
        
        alert(`${allCourses[id].title} သို့ ဝင်ရောက်နေပါပြီ...`);
        showSection('dashboard');
    } else {
        renderPaymentPage(id);
    }
}

/*
// --- ၁။ Text-to-Speech (စာဖတ်ပြသည့်စနစ်) ---
let speechInstance = null;

function speakLesson() {
    // ၁။ အရင်ဖတ်နေတာရှိရင် ရပ်ပစ်မည်
    window.speechSynthesis.cancel();

    let textToRead = "";
    
    // ၂။ စာသားကို Select ပေးထားသလား စစ်ဆေးခြင်း
    const selectedText = window.getSelection().toString();

    if (selectedText && selectedText.trim().length > 0) {
        // Highlight လုပ်ထားသော စာကို ဖတ်မည်
        textToRead = selectedText;
    } else {
        // Highlight မရှိလျှင် သင်ခန်းစာ body ကို ရှာဖတ်မည်
        // .article-content သို့မဟုတ် .lesson-body ထဲက စာကိုပဲ ယူမည် (Header/Nav များကို ကျော်မည်)
        const lessonContent = document.querySelector('.article-content') || 
                              document.querySelector('.lesson-body') || 
                              document.getElementById('dynamic-body');
        
        if (lessonContent) {
            // မလိုအပ်သော ခလုတ်စာသားများကို ဖယ်ထုတ်ရန် (innerText ၏ copy တစ်ခုယူသည်)
            textToRead = lessonContent.innerText;
        }
    }

    if (textToRead && textToRead.trim().length > 0) {
        const msg = new SpeechSynthesisUtterance(textToRead);
        
        // ဘာသာစကား ရွေးချယ်ခြင်း (အင်္ဂလိပ်စာဆိုရင် en-US)
        msg.lang = 'en-US'; 
        msg.rate = 0.9;  // အနည်းငယ် နှေးနှေးဖတ်ပေးရန်
        msg.pitch = 1;   // အသံနေအသံထား

        window.speechSynthesis.speak(msg);
        
        // ဖတ်နေကြောင်း သိသာစေရန် Alert (Optional)
        console.log("Reading starting...");
    } else {
        alert("ဖတ်စရာ စာသားကို အရင် Select ပေးပါ။");
    }
}

function stopSpeaking() {
    window.speechSynthesis.cancel();
}

// --- ၂။ Focus Mode (Immersive Reader) ---
function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    const isFocus = document.body.classList.contains('focus-mode');
    const btn = document.getElementById('focus-btn');
    
    if (isFocus) {
        btn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i>';
        btn.style.color = '#ef4444';
        alert("Focus Mode ဖွင့်လိုက်ပါပြီ။ စာကိုပဲ အာရုံစိုက်ဖတ်ရှုနိုင်ပါတယ်။");
    } else {
        btn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i>';
        btn.style.color = '';
    }
}
*/