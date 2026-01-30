// ==========================================
// ၁။ Initializations & Variables
// ==========================================

// Firebase initialize လုပ်ပြီးသားကို ခေါ်သုံးခြင်း
const db = firebase.firestore();
const auth = firebase.auth();

// Global User State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    isLoggedIn: false, 
    uid: "student-123", 
    name: "Mg Mg (Sample)", 
    role: "Student",
    photo: "https://placehold.co/150x150/003087/white?text=User",
    skills: ["HTML", "CSS", "JavaScript", "React"], 
    notes: "Bootcamp မှ သင်ခန်းစာများကို အောင်မြင်စွာ လေ့လာပြီးပါပြီ။", 
    isPaid: true,
    github: "https://github.com/mgmg", 
    portfolio: "https://mgmg.dev", 
    linkedin: "", facebook: "", youtube: "", tiktok: "", instagram: "", email: "mgmg@example.com",
    quizAttempts: {}, 
    
    // ပြီးမြောက်ထားသော သင်ခန်းစာ ၅ ခု (Certificate ပွင့်ရန် လိုအပ်ချက်)
    completedLessons: [
        "0.1.1: Welcome Article", 
        "0.1.2: Basic Quiz", 
        "0.1.3: Assignment 1", 
        "Module 0 Project", 
        "1.1.1: Flexbox Deep Dive"
    ], 
    
    // ဘာသာရပ်အလိုက် အမှတ်စာရင်း (GPA 75 ကျော်စေရန်)
    grades: {
        "html": 85,
        "css": 92,
        "javascript": 88,
        "react": 78,
        "nodejs": 80
    }
};

// ဆရာမှ သတ်မှတ်ပေးမည့် ပြင်လို့မရသော အချက်အလက်များ (Database မှ လာမည်)
let academicInfo = {
  examDate: "ဖေဖော်ဝါရီ ၁၅၊ ၂၀၂၄",
  attendance: "92%",
  overallGrade: "A-",
  batchName: "Batch-05 (Night Class)",
  startDate: "ဇန်နဝါရီ ၁၊ ၂၀၂၄",
  uid: "st-001",
};

// --- Messaging Section ---
// လက်ရှိ ဘယ်သူနဲ့ Chat နေသလဲ ဆိုတာ သိမ်းရန်
let activeChatId = "Batch-05"; // Default ကို Group Chat ထားမယ်
let activeChatName = "Group: Batch-05";

// ၁။ Dark Mode (ညဘက်လေ့လာသူများအတွက်)
function toggleDarkMode() {
    document.body.classList.toggle('dark-theme');
    const isDarkNow = document.body.classList.contains('dark-theme');
    localStorage.setItem('dark-mode', isDarkNow); // Browser မှာ မှတ်ထားမည်
    renderAuthFooter(); // Sidebar ခလုတ် icon ပြောင်းရန်
}

// ၂။ Firestore Sync (Cloud Backup)
async function syncProgressToCloud() {
    if (!currentUser.uid) return;
    try {
        await db.collection('users').doc(currentUser.uid).update({
            completedLessons: currentUser.completedLessons,
            quizAttempts: currentUser.quizAttempts,
            lastLesson: currentUser.lastLesson || null
        });
    } catch (e) { console.error("Cloud sync failed", e); }
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
  const title = document.getElementById("page-title");
  // Sidebar ပိတ်မည် (Sidebar ပွင့်နေမှ ပိတ်မည်)
  const sidebar = document.getElementById("sidebar");
  if (sidebar && sidebar.classList.contains("open")) {
    toggleNav();
  }

  if (section === "dashboard") {
    title.innerText = "Dashboard";
    renderDashboard(); // <--- အပေါ်မှာ သတ်မှတ်ထားတဲ့ function ကို ခေါ်လိုက်တာပါ
  } // အသစ်ထည့်ရမည့် အပိုင်း
    else if (section === 'about') {
        title.innerText = "About Us";
        renderAbout();
    } else if (section === 'privacy') {
        title.innerText = "Privacy Policy";
        renderPrivacy();
    } else if (section === "courses") {
    title.innerText = filterCat
      ? `${filterCat} သင်ခန်းစာများ`
      : "သင်ခန်းစာများအားလုံး";
    renderCourseTree(filterCat);
  } else if (section === "messages") {
    title.innerText = "စာတိုပေးပို့ခြင်း";
    showMessages();
  } else if (section === "profile") {
    title.innerText = "ကျောင်းသား Profile";
    renderProfile();
  }
  renderAuthFooter();
}

// ==========================================
// ၃။ Dashboard Rendering
// ==========================================

function renderDashboard() {
    const body = document.getElementById('dynamic-body');
    
    // Progress % တွက်ရန် Helper
    const getPercent = (catName) => {
        // အရင်က ဆောက်ခဲ့တဲ့ courseData ထဲက စုစုပေါင်း သင်ခန်းစာအရေအတွက်ကို တွက်မယ်
        const categoryData = courseData.find(c => c.category.toLowerCase() === catName.toLowerCase());
        if (!categoryData) return 0;
        
        let totalLessons = 0;
        categoryData.modules.forEach(m => totalLessons += m.lessons.length);
        
        // Safety check: completedLessons ရှိမရှိ အရင်စစ်မည်
        const doneList = currentUser.completedLessons || []; 
        
        const doneLessonsCount = doneList.filter(l => {
            return categoryData.modules.some(m => m.lessons.some(les => les.title === l));
        }).length;

        return Math.round((doneLessonsCount / totalLessons) * 100) || 0;
    };

    body.innerHTML = `
        <div class="welcome-banner fade-in">
            <h2>မင်္ဂလာပါ ${currentUser.name}! 👋</h2>
            <p>ယနေ့ သင်ယူမှုခရီးစဉ်ကို ဆက်လက်လျှောက်လှမ်းလိုက်ပါ။</p>
        </div>

        <div class="dashboard-grid">
            <div class="topic-card animate-up" onclick="showSection('courses', 'Foundations')">
                <div class="card-icon"><i class="fas fa-cubes"></i></div>
                <h3>Foundations</h3>
                <div class="progress-container"><div class="progress-bar" style="width:${getPercent('Foundations')}%"></div></div>
                <small>${getPercent('Foundations')}% Completed</small>
            </div>

            <div class="topic-card animate-up" onclick="showSection('courses', 'Technical')">
                <div class="card-icon"><i class="fas fa-code"></i></div>
                <h3>Technical</h3>
                <div class="progress-container"><div class="progress-bar" style="width:${getPercent('Technical')}%"></div></div>
                <small>${getPercent('Technical')}% Completed</small>
            </div>

            <div class="topic-card animate-up" onclick="showSection('courses', 'Full-Stack')">
                <div class="card-icon"><i class="fas fa-server"></i></div>
                <h3>Full-Stack</h3>
                <div class="progress-container"><div class="progress-bar" style="width:${getPercent('Full-Stack')}%"></div></div>
                <small>${getPercent('Full-Stack')}% Completed</small>
            </div>

            <!-- Leaderboard (Top Students) -->
            <div class="content-card animate-up" style="grid-column: span 1;">
                <h4><i class="fas fa-trophy" style="color:gold"></i> Top Students</h4>
                <div id="leaderboard-content" style="margin-top:10px;">
                    <p>1. Aung Aung - 950 pts</p>
                    <p>2. Su Su - 920 pts</p>
                </div>
            </div>
        </div>
    `;
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

function postComment(lessonId) {
    const text = document.getElementById('comment-input').value;
    if(!text) return;
    db.collection('discussions').add({
        lessonId: lessonId,
        userId: currentUser.uid, // <--- ဒါလေး ပါရပါမယ်
        userName: currentUser.name,
        text: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('comment-input').value = '';
}

function loadComments(lessonId) {
    db.collection('discussions')
      .where('lessonId', '==', lessonId)
      .orderBy('timestamp', 'asc')
      .onSnapshot(snap => {
        const list = document.getElementById('comments-list');
        list.innerHTML = '';
        snap.forEach(doc => {
            const c = doc.data();
            list.innerHTML += `
                <div class="comment-bubble">
                    <small><strong>${c.userName}</strong></small>
                    <p>${c.text}</p>
                </div>`;
        });
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

async function submitFinalGrade(studentId, subId) {
    const score = parseInt(document.getElementById('grade-input').value);
    // ၁။ ကျောင်းသားရဲ့ grades ထဲမှာ သွားပေါင်းထည့်မယ်
    await db.collection('users').doc(studentId).set({
        grades: { [new Date().getTime()]: score } // ဘာသာရပ်အလိုက် ပြင်ဆင်ရန်
    }, { merge: true });

    // ၂။ Submission status ကို 'graded' ပြောင်းမယ်
    await db.collection('submissions').doc(subId).update({ status: 'graded' });
    alert("အမှတ်ပေးပြီးပါပြီ။");
    renderAdminPanel();
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

// Course Tree with Filtering
function renderCourseTree(filterCat) {
  const body = document.getElementById("dynamic-body");
  body.innerHTML = '<div id="course-outline"></div>';
  const container = document.getElementById("course-outline");

  const filteredData = filterCat
    ? courseData.filter(
        (c) => c.category.toLowerCase() === filterCat.toLowerCase(),
      )
    : courseData;

  if (filteredData.length === 0) {
    container.innerHTML = `<div class="empty-msg">ဤကဏ္ဍတွင် သင်ခန်းစာများ မရှိသေးပါ။</div>`;
    return;
  }

  filteredData.forEach((cat, catIdx) => {
    const catH = document.createElement("div");
    catH.className = "category-header";
    catH.innerHTML = `<i class="fas fa-folder"></i> ${cat.category}`;
    container.appendChild(catH);

    cat.modules.forEach((mod, modIdx) => {
      const modId = `mod-${catIdx}-${modIdx}`;
      const group = document.createElement("div");
      group.className = "module-group animate-up";
      group.innerHTML = `
                <div class="module-title-header" onclick="toggleModuleAccordion(this, '${modId}')">
                    <span><i class="fas fa-chevron-right"></i> ${mod.moduleTitle}</span>
                </div>
                <div id="${modId}" class="lessons-list"></div>
            `;
      container.appendChild(group);

      const list = document.getElementById(modId);
      const userProgress = currentUser.completedLessons || [];
      mod.lessons.forEach((les, lesIdx) => {
        const isDone = userProgress.includes(les.title);
        const item = document.createElement("div");
        item.className = `lesson-item ${isDone ? "completed" : ""}`;
        item.innerHTML = `<i class="${isDone ? "fas fa-check-circle text-success" : "far fa-file-alt"}"></i> 
                                 ${les.title} <small class="type-tag">${les.type}</small>`;

        const originalCatIdx = courseData.findIndex(
          (c) => c.category === cat.category,
        );
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
    const res = await fetch(lesson.path);

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

function checkQuizResult(quizId, quizData, c, m, l) {
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
function showMessages(targetUid = null, targetName = null) {
  const title = document.getElementById("page-title");
  const body = document.getElementById("dynamic-body");

  title.innerText = "Messages";

  // ဆရာက ကျောင်းသားစာရင်းထဲကနေ DM ပို့ဖို့ နှိပ်လိုက်ရင်
  if (targetUid) {
    activeChatId = targetUid;
    activeChatName = "Direct: " + targetName;
  }

  body.innerHTML = `
        <div class="messaging-layout fade-in">
            <div class="chat-sidebar">
                <div class="chat-list-header">တိုက်ရိုက်စာမျက်နှာ</div>
                <div class="chat-list" id="chat-users-list">
                    <div class="chat-item ${activeChatId.includes("Batch") ? "active" : ""}" onclick="switchChat('Batch-05', 'Group: Batch-05')">
                        <i class="fas fa-users"></i> Batch-05 (Group)
                    </div>
                    <!-- တခြား Direct Message စာရင်းများ ဤနေရာတွင် ပေါ်လာမည် -->
                </div>
            </div>
            
            <div class="chat-window">
                <div class="chat-window-header" id="active-chat-title">${activeChatName}</div>
                <div class="chat-display" id="chat-display">
                    <!-- စာတိုများ ဤနေရာတွင် ပေါ်မည် -->
                </div>
                <div class="chat-input-box">
                    <input type="text" id="chat-input" placeholder="စာရိုက်ပါ..." onkeypress="if(event.key==='Enter') sendMessage()">
                    <button onclick="sendMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
  loadMessages();
}

// Chat ပြောင်းခြင်း (Group မှ DM သို့ သို့မဟုတ် အပြန်အလှန်)
function switchChat(id, name) {
  activeChatId = id;
  activeChatName = name;
  document.getElementById("active-chat-title").innerText = name;
  loadMessages();
  // showMessages();
}

// Firestore မှ Message များ Real-time ဖတ်ခြင်း
function loadMessages() {
  const chatDisplay = document.getElementById("chat-display");
  chatDisplay.innerHTML = '<div class="loader">Loading messages...</div>';

  let query;
  if (activeChatId.includes("Batch")) {
    query = db
      .collection("messages")
      .where("batchId", "==", activeChatId)
      .orderBy("timestamp", "asc");
  } else {
    const combinedId = [currentUser.uid, activeChatId].sort().join("_");
    query = db
      .collection("messages")
      .where("convoId", "==", combinedId)
      .orderBy("timestamp", "asc");
  }

  query.onSnapshot(
    (snapshot) => {
      chatDisplay.innerHTML = "";
      snapshot.forEach((doc) => {
        const m = doc.data();
        const msgId = doc.id;
        const isMe = m.senderId === currentUser.uid;

        // ဆရာဖြစ်လျှင် သို့မဟုတ် ကိုယ်တိုင်ပို့ထားသောစာဖြစ်လျှင် Edit/Delete ခလုတ်ပြမည်
        const canEdit = currentUser.role === "Teacher" || isMe;

        chatDisplay.innerHTML += `
                <div class="message-bubble ${isMe ? "me" : "other"}">
                    <div class="msg-header">
                        <span class="msg-sender">${isMe ? "You" : m.senderName}</span>
                        ${
                          canEdit
                            ? `
                            <div class="msg-actions">
                                <i class="fas fa-edit" onclick="editMessage('${msgId}', '${m.text}')" title="Edit"></i>
                                <i class="fas fa-trash" onclick="deleteMessage('${msgId}')" title="Delete"></i>
                            </div>
                        `
                            : ""
                        }
                    </div>
                    <div class="msg-text">${m.text}</div>
                </div>
            `;
      });
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
    },
    (error) => {
      console.error("Message error:", error);
    },
  );
}

// Message ပို့ခြင်း
function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  const msgData = {
    text: text,
    senderId: currentUser.uid,
    senderName: currentUser.name,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  if (activeChatId.includes("Batch")) {
    // Group Chat
    msgData.batchId = activeChatId;
    msgData.type = "group";
  } else {
    // Direct Message (UID နှစ်ခုကို စီပြီး ID တစ်ခုတည်းအဖြစ် ပြောင်းလဲခြင်း)
    const combinedId = [currentUser.uid, activeChatId].sort().join("_");
    msgData.convoId = combinedId;
    msgData.type = "direct";
  }

  db.collection("messages").add(msgData);
  input.value = "";
}

async function deleteMsg(id) {
  if (confirm("Delete?")) await db.collection("messages").doc(id).delete();
}

// ==========================================
// ၇။ Profile, Admin & Auth Logic
// ==========================================

// Profile ပြသခြင်း (View Mode & Academic Info)
function renderProfile() {
  const body = document.getElementById("dynamic-body");

  // အမှတ်စာရင်း ရှိမရှိ စစ်ဆေးပြီး GPA တွက်မည်
  const grades = currentUser.grades || {};
  const completedCount = Object.keys(grades).length;
  let totalScore = 0;
  Object.values(grades).forEach(s => totalScore += s);
  const gpa = completedCount > 0 ? (totalScore / completedCount).toFixed(2) : 0;

  // အောင်လက်မှတ်ရရန် သတ်မှတ်ချက် (ဥပမာ - ဘာသာရပ် ၅ ခုပြီးရမည်၊ GPA ၇၅ ကျော်ရမည်)
  const isEligible = completedCount >= 5 && gpa >= 75;

  const roleBadgeStyle = currentUser.role === "Teacher" ? "background:#ef4444; color:white;" : "background:#e2e8f0; color:black;";

  body.innerHTML = `
    <div class="profile-card-pro fade-in">
        <div class="profile-cover"></div>
        <div class="profile-header-main">
            <img src="${currentUser.photo}" class="profile-large-avatar">
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
                <!-- Academic Status (ခလုတ်များ ဤနေရာတွင် ရှိသည်) -->
                <div class="content-card academic-card">
                    <h4><i class="fas fa-university"></i> Academic Achievement</h4>
                    <div class="academic-box">
                        <div class="academic-item"><span>GPA:</span> <strong style="color:green">${gpa}</strong></div>
                        <div class="academic-item"><span>Completed Modules:</span> <strong>${completedCount}</strong></div>
                    </div>
                    
                    <div style="margin-top:20px; display:flex; gap:10px;">
                        <button class="menu-btn" onclick="viewTranscript('${currentUser.uid}')">
                            <i class="fas fa-file-invoice"></i> View Transcript
                        </button>
                        
                        <!-- အောင်မြင်မှသာ ရွှေရောင်ခလုတ် ပွင့်မည် -->
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
  body.innerHTML = `
        <div class="content-card animate-up" style="max-width: 800px; margin: 0 auto;">
            <h3 style="margin-bottom:20px;"><i class="fas fa-id-card"></i> Profile ပြင်ဆင်ခြင်း</h3>
            
            <div class="edit-grid">
                <div class="edit-section">
                    <label>Profile Photo URL</label>
                    <input type="text" id="edit-photo" class="edit-input" value="${currentUser.photo}">
                    <label>အမည်</label>
                    <input type="text" id="edit-name" class="edit-input" value="${currentUser.name}">
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
            <input type="text" id="edit-skills" class="edit-input" value="${currentUser.skills.join(", ")}">
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
function saveProfile() {
  // Input များမှ တန်ဖိုးများကို ယူခြင်း
  currentUser.name = document.getElementById("edit-name").value;
  currentUser.photo = document.getElementById("edit-photo").value;
  currentUser.portfolio = document.getElementById("edit-portfolio").value;
  currentUser.linkedin = document.getElementById("edit-linkedin").value;
  currentUser.facebook = document.getElementById("edit-facebook").value;
  currentUser.youtube = document.getElementById("edit-youtube").value;
  currentUser.tiktok = document.getElementById("edit-tiktok").value;
  currentUser.instagram = document.getElementById("edit-instagram").value;
  currentUser.email = document.getElementById("edit-email").value;
  currentUser.github = document.getElementById("edit-github").value;
  currentUser.notes = document.getElementById("edit-notes").value;
  currentUser.skills = document
    .getElementById("edit-skills")
    .value.split(",")
    .map((s) => s.trim())
    .filter((s) => s !== ""); // အလွတ်တွေကို ဖယ်ထုတ်မည်

  // LocalStorage တွင် သိမ်းမည်
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  alert("Profile အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။");
  renderProfile(); // Profile စာမျက်နှာကို ပြန်ပြမည်
  renderAuthFooter(); // Sidebar အောက်ခြေက ပုံနဲ့ နာမည်ကို update လုပ်မည်
}

// Sidebar Footer Render (User Info & Logout)
function renderAuthFooter() {
    const authDiv = document.getElementById('auth-section');
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
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    // ၁။ Firebase Auth ဖြင့် Login ဝင်ခြင်း
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;

    // ၂။ Firestore ထဲက ကျောင်းသား/ဆရာ အချက်အလက်ကို သွားယူခြင်း
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      // ၃။ ရရှိလာတဲ့ Data ကို currentUser ထဲ ထည့်သိမ်းမယ်
      currentUser = {
        uid: user.uid,
        isLoggedIn: true,
        name: userData.name || "Unknown User",
        photo:
          userData.photo ||
          "https://placehold.co/150x150/003087/white?text=User",
        role: userData.role, // "Teacher" သို့မဟုတ် "Student"
        isPaid: userData.isPaid,
        email: email,
        // အခြား social links များ
        github: userData.github || "",
        portfolio: userData.portfolio || "",
        skills: userData.skills || [],
      };

      // LocalStorage မှာ သိမ်းမယ်
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // UI ပြောင်းလဲခြင်း
      document.getElementById("login-page").style.display = "none";
      document.getElementById("app-wrapper").style.display = "flex";

      // Dashboard သို့ သွားမည်
      showSection("dashboard");
      alert("မင်္ဂလာပါ " + currentUser.role + " " + currentUser.name);
    } else {
      alert("Database ထဲတွင် အချက်အလက် ရှာမတွေ့ပါ။ Admin ကို ဆက်သွယ်ပါ။");
    }
  } catch (error) {
    alert("Login မှားယွင်းနေပါသည်: " + error.message);
  }
}

function handleLogout() {
  if (confirm("Logout ထွက်မှာ သေချာပါသလား?")) {
    currentUser.isLoggedIn = false;
    localStorage.removeItem("currentUser");
    location.reload();
  }
}

// --- Transcript ပြသခြင်း ---
function viewTranscript(uid, isAdminPreview = false) {
    // ကျောင်းသားကို ရှာမည်
    const student = (uid === currentUser.uid) ? currentUser : studentsList.find(s => s.uid === uid);
    if (!student) return alert("Student not found!");

    const body = document.getElementById('dynamic-body');
    // Admin ကြည့်တာဆိုရင် Admin Preview ဆီပြန်သွားမယ်၊ ကျောင်းသားဆိုရင် Profile ဆီပြန်သွားမယ်
    const backFunc = isAdminPreview ? `previewStudentAchievements('${uid}')` : "renderProfile()";
    
    const grades = student.grades || {};
    let rows = Object.entries(grades).map(([sub, score]) => `
        <tr>
            <td style="text-transform:uppercase;">${sub}</td>
            <td>${score}</td>
            <td>${score >= 50 ? '<span class="text-success">Pass</span>' : '<span class="text-danger">Fail</span>'}</td>
        </tr>
    `).join('');

    body.innerHTML = `
        <div class="content-card animate-up">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3><i class="fas fa-file-invoice"></i> Official Transcript ${isAdminPreview ? '(Demo)' : ''}</h3>
                <button class="menu-btn" onclick="${backFunc}"><i class="fas fa-arrow-left"></i> Back</button>
            </div>
            <hr><br>
            <div class="academic-box">
                <p><strong>Student Name:</strong> ${student.name}</p>
                <p><strong>Batch:</strong> ${student.batchId || academicInfo.batchName}</p>
            </div>
            <br>
            <table class="admin-table">
                <thead><tr><th>Subject</th><th>Score</th><th>Status</th></tr></thead>
                <tbody>${rows || '<tr><td colspan="3">အမှတ်စာရင်း မရှိသေးပါ။</td></tr>'}</tbody>
            </table>
            <br>
            <button class="save-btn" onclick="window.print()"><i class="fas fa-print"></i> Print Transcript</button>
        </div>`;
}

// --- Certificate ပြသခြင်း ---
function viewCertificate(uid, isAdminPreview = false) {
    const student = (uid === currentUser.uid) ? currentUser : studentsList.find(s => s.uid === uid);
    if (!student) return alert("Student not found!");

    const body = document.getElementById('dynamic-body');
    const backFunc = isAdminPreview ? `previewStudentAchievements('${uid}')` : "renderProfile()";
    
    body.innerHTML = `
        <div class="certificate-frame animate-up">
            <div class="cert-border">
                <div class="cert-content">
                    <h1 class="cert-title">CERTIFICATE</h1>
                    <p style="letter-spacing: 5px; margin-top:10px;">OF COMPLETION</p>
                    <div style="margin: 40px 0;">
                        <p>This is to certify that</p>
                        <h2 class="student-name" style="font-family:serif; font-size:2.5rem; border-bottom:2px solid #333; display:inline-block; padding:0 30px; margin: 15px 0;">
                            ${student.name}
                        </h2>
                        <p style="margin-top:15px;">has successfully completed the Professional Bootcamp in</p>
                        <h3 style="color:#003087; margin: 10px 0;">Full-Stack Web Development</h3>
                        <p>issued on ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div style="display:flex; justify-content:space-around; margin-top:50px;">
                        <div><p>________________</p><p>Lead Instructor</p></div>
                        <div><p>________________</p><p>Date</p></div>
                    </div>
                </div>
            </div>
            <br>
            <div class="no-print" style="display:flex; justify-content:center; gap:10px;">
                <button class="menu-btn" onclick="${backFunc}"><i class="fas fa-arrow-left"></i> Back</button>
                <button class="save-btn" onclick="window.print()"><i class="fas fa-download"></i> Save as PDF</button>
            </div>
        </div>`;
}

// ==========================================
// ၈။ App Initialization
// ==========================================

window.onload = () => {
    // လက်ရှိနှစ်ကို Footer မှာပြရန်
    const yearEl = document.getElementById('current-year');
    if(yearEl) yearEl.innerText = new Date().getFullYear();

    // ၁။ Dark Mode အဟောင်းရှိမရှိ စစ်ဆေးပြီး ပြန်ဖွင့်ပေးခြင်း
    const isDark = localStorage.getItem('dark-mode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-theme');
    }

    // ၂။ Login Status စစ်ဆေးခြင်း
    if (currentUser.isLoggedIn) {
        document.getElementById('app-wrapper').style.display = 'flex';
        document.getElementById('login-page').style.display = 'none';
        showSection('dashboard');
    } else {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('app-wrapper').style.display = 'none';
    }
};

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
let studentsList = [
  {
    uid: "st001",
    name: "Aung Aung",
    batchId: "Batch-05",
    attendance: "90%",
    grades: { html: 85, css: 80, javascript: 75, react: 78, nodejs: 82 },
    grade: "B+", // 80% ဝန်းကျင်
    isPaid: true,
  },
  {
    uid: "st002",
    name: "Su Su",
    batchId: "Batch-05",
    attendance: "95%",
    grades: { html: 95, css: 90, javascript: 88, react: 85, nodejs: 90 },
    grade: "A", // 90% ဝန်းကျင်
    isPaid: true,
  },
  {
    uid: "st003",
    name: "Kyaw Kyaw",
    batchId: "Batch-06",
    attendance: "80%",
    // အမှတ်နည်းတဲ့သူအတွက် နမူနာ (စမ်းသပ်ရန်)
    grades: { html: 45, css: 55, javascript: 50, react: 40, nodejs: 48 }, 
    grade: "C", // 50% အောက်ဆိုရင် Fail ဖြစ်နိုင်သလို C ဆိုရင်တော့ အောင်ရုံပဲရှိမယ်
    isPaid: false, // ပိုက်ဆံမသွင်းရသေးတဲ့သူ
  },
];

// --- Admin Panel (Teacher သာ ဝင်နိုင်မည်) ---
// --- ဆရာအတွက် Admin Panel (Academic Status ပြင်ဆင်ရန်) ---
function renderAdminPanel() {
  const body = document.getElementById("dynamic-body");
  
  // Header အပိုင်းမှာ ခလုတ်တွေကို စုစည်းထားပြီး Table ကို တစ်ခုတည်းပဲ ထားလိုက်ပါမယ်
  body.innerHTML = `
        <div class="admin-container fade-in">
            <!-- အပေါ်ဆုံး ခေါင်းစီးနှင့် အဓိက ခလုတ်များ -->
            <div class="admin-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:15px;">
                <h3 style="margin:0;"><i class="fas fa-user-shield"></i> Admin Control Panel</h3>
                <div style="display:flex; gap:10px;">
                    <button class="menu-btn" style="background:#4b5563; color:white;" onclick="renderLMSGuide()">
                        <i class="fas fa-book"></i> User Guide
                    </button>
                    <button class="save-btn" onclick="renderSubmissions()">
                        <i class="fas fa-file-signature"></i> Review Assignments
                    </button>
                </div>
            </div>

            <!-- Batch Filter အပိုင်း -->
            <div class="content-card" style="margin-bottom:20px; padding:15px;">
                <div class="batch-filter">
                    <span><strong>Batch ရွေးချယ်ရန်: </strong></span>
                    <select id="batch-select" class="edit-input" style="width:auto; display:inline-block; margin-left:10px;" onchange="filterStudentsByBatch(this.value)">
                        <option value="All">All Batches</option>
                        <option value="Batch-05">Batch-05</option>
                        <option value="Batch-06">Batch-06</option>
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

function renderLMSGuide() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="content-card animate-up" style="max-width: 900px; margin: 0 auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3><i class="fas fa-book"></i> LMS Admin User Guide</h3>
                <button class="menu-btn" onclick="renderAdminPanel()"><i class="fas fa-arrow-left"></i> Back to Panel</button>
            </div>
            
            <div class="guide-scroll-area" style="line-height:1.8; color:var(--text-main);">
                <div class="academic-box">
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

// အမှတ်စာရင်းသိမ်းခြင်း (Firestore Logic နေရာ)
function submitGrades(uid) {
  alert("ကျောင်းသား " + uid + " အတွက် အချက်အလက်များ သိမ်းဆည်းပြီးပါပြီ။");
  renderAdminPanel();
}

function saveAcademicStatus() {
  academicInfo.examDate = document.getElementById("adm-exam").value;
  academicInfo.overallGrade = document.getElementById("adm-grade").value;
  academicInfo.attendance = document.getElementById("adm-att").value;
  academicInfo.batchName = document.getElementById("adm-batch").value;

  alert("ကျောင်းသား၏ Academic Status ကို ပြင်ဆင်ပြီးပါပြီ။");
  renderProfile();
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
            body.innerHTML = `<h3>Reviewing Submissions</h3><div class="content-card">စစ်ဆေးရန် ကျန်ရှိသော Assignment များ မရှိသေးပါ။</div><br><button class="menu-btn" onclick="renderAdminPanel()">Back</button>`;
            return;
        }

        snap.forEach(doc => {
            const s = doc.data();
            // content သို့မဟုတ် githubLink မရှိရင် error မတက်အောင် empty string ထားမည်
            const previewText = (s.content || s.githubLink || "");
            const typeLabel = s.content ? "Assignment" : "Project";

            html += `
                <div class="content-card animate-up">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <h5>${s.studentName}</h5>
                        <span class="badge-type">${typeLabel}</span>
                    </div>
                    <small style="color:var(--primary)">${s.lessonTitle}</small>
                    <p style="margin:10px 0; font-size:0.9rem; color:var(--text-color); opacity:0.8;">
                        ${previewText.substring(0, 50)}...
                    </p>
                    <button class="save-btn" style="width:100%;" onclick="gradeThisSubmission('${doc.id}')">View & Grade</button>
                </div>`;
        });
        body.innerHTML = html + '</div><br><button class="menu-btn" onclick="renderAdminPanel()">Back</button>';
    } catch (err) {
        console.error("Grading Error:", err);
        body.innerHTML = "Error loading submissions.";
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
            <h3><i class="fas fa-graduation-cap"></i> ကျွန်ုပ်တို့အကြောင်း (About Us)</h3>
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
            <h3><i class="fas fa-user-shield"></i> ကိုယ်ရေးအချက်အလက် မူဝါဒ (Privacy Policy)</h3>
            <hr><br>
            <p>ကျောင်းသားများ၏ ကိုယ်ရေးအချက်အလက်များကို ကျွန်ုပ်တို့ အလေးထား ကာကွယ်ပေးပါသည်။</p>
            
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