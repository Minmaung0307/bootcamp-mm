// ==========================================
// ၁။ Initializations & Variables
// ==========================================

// Firebase initialize လုပ်ပြီးသားကို ခေါ်သုံးခြင်း
const db = firebase.firestore();
const auth = firebase.auth();

// Global User State
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
  isLoggedIn: false,
  uid: "",
  name: "Guest",
  role: "Student",
  photo: "https://placehold.co/150x150/003087/white?text=User",
  skills: ["HTML", "CSS"],
  notes: "",
  isPaid: true,
  github: "",
  portfolio: "",
  linkedin: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  instagram: "",
  email: "",
  quizAttempts: {},
  completedLessons: [],
  grades: {},
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
        
        const doneLessons = currentUser.completedLessons.filter(l => {
            // ကျောင်းသားပြီးထားတဲ့ သင်ခန်းစာက ဒီ category ထဲမှာရှိမရှိ စစ်မယ်
            return categoryData.modules.some(m => m.lessons.some(les => les.title === l));
        }).length;

        return Math.round((doneLessons / totalLessons) * 100) || 0;
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
  // Safety check: currentUser ထဲမှာ quizAttempts မရှိသေးရင် အသစ်ဆောက်မယ်
  if (!currentUser.quizAttempts) {
    currentUser.quizAttempts = {};
  }

  // Attempt ကို ဖတ်မယ် (မရှိရင် ၀ လို့ သတ်မှတ်မယ်)
  const attempts = currentUser.quizAttempts[data.id] || 0;

  if (attempts >= 3 && currentUser.role !== "Teacher") {
    document.getElementById("dynamic-body").innerHTML = `
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
                <p><strong>${i + 1}. ${q.q}</strong></p>
                <div class="options-area">`;

    if (q.type === "single") {
      q.options.forEach((opt, oi) => {
        html += `<label class="quiz-opt"><input type="radio" name="q${i}" value="${oi}"> ${opt}</label>`;
      });
    } else if (q.type === "short") {
      html += `<input type="text" name="q${i}" class="edit-input" placeholder="အဖြေရိုက်ပါ" style="margin-top:10px; width:100%;">`;
    }

    html += `</div>
                <div id="f-${i}" class="feedback-area" style="margin-top:10px; font-weight:bold;"></div>
            </div>`;
  });

  html += `</form>
            <div style="margin-top:20px;">
                <button class="save-btn" onclick="checkQuizResult('${data.id}', ${JSON.stringify(data).replace(/"/g, "&quot;")}, ${c}, ${m}, ${l})">
                    <i class="fas fa-check-circle"></i> Submit Quiz
                </button>
            </div>
        </div>`;
  document.getElementById("dynamic-body").innerHTML = html;
}

function checkQuizResult(quizId, quizData, c, m, l) {
    let score = 0;
    const questions = quizData.questions;

    // ၁။ Safety Checks: currentUser ထဲမှာ လိုအပ်တဲ့ field တွေ မရှိရင် အသစ်ဆောက်မယ်
    if (!currentUser.quizAttempts) currentUser.quizAttempts = {};
    if (!currentUser.completedLessons) currentUser.completedLessons = [];

    const currentAttempt = (currentUser.quizAttempts[quizId] || 0) + 1;

    // ၂။ အဖြေစစ်ဆေးခြင်း (UI ပေါ်မှာ အမှားအမှန်အရောင်ပြခြင်း)
    questions.forEach((q, i) => {
        const feedbackEl = document.getElementById(`f-${i}`);
        const qBox = document.getElementById(`q-box-${i}`);
        const input = document.getElementsByName(`q${i}`);
        let isCorrect = false;

        if (q.type === "single") {
            const sel = Array.from(input).find((r) => r.checked);
            if (sel && parseInt(sel.value) === q.correct) isCorrect = true;
        } else if (q.type === "short") {
            if (input[0].value.trim().toLowerCase() === q.correct.toLowerCase())
                isCorrect = true;
        }

        if (isCorrect) {
            score++;
            feedbackEl.innerHTML = '<span class="text-success"><i class="fas fa-check"></i> Correct</span>';
            if (qBox) qBox.style.borderColor = "#22c55e"; // မှန်ရင် အစိမ်းရောင်
        } else {
            feedbackEl.innerHTML = '<span class="text-danger"><i class="fas fa-times"></i> Wrong</span>';
            if (qBox) qBox.style.borderColor = "#ef4444"; // မှားရင် အနီရောင်
        }
    });

    // ၃။ Attempt (အကြိမ်ရေ) ကို Update လုပ်ပြီး သိမ်းမည်
    currentUser.quizAttempts[quizId] = currentAttempt;

    // ၄။ သင်ခန်းစာ ပြီးမြောက်မှု မှတ်သားခြင်း
    const lessonTitle = courseData[c].modules[m].lessons[l].title;
    // အမှတ်ပြည့်ရရင် သို့မဟုတ် ၃ ကြိမ်ပြည့်ရင် Completed စာရင်းထဲထည့်မယ်
    if (score === questions.length || currentAttempt >= 3) {
        if (!currentUser.completedLessons.includes(lessonTitle)) {
            currentUser.completedLessons.push(lessonTitle);
        }
    }
    
    // LocalStorage မှာ အကုန်ပြန်သိမ်းမယ်
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // ၅။ ရလဒ်အလိုက် အသိပေးချက်ပြသပြီး နောက်သင်ခန်းစာသို့ သွားခြင်း
    setTimeout(() => {
        if (score === questions.length) {
            alert(`ဂုဏ်ယူပါတယ်! အမှတ်ပြည့် (${score}/${questions.length}) ရရှိပါတယ်။`);
            goToNextLesson(c, m, l); // နောက်သင်ခန်းစာသို့ တန်းသွားမည်
        } else if (currentAttempt >= 3) {
            alert(`သင်သည် ၃ ကြိမ်မြောက်ဖြေဆိုပြီးပါပြီ။ သင်၏နောက်ဆုံးရမှတ်မှာ (${score}/${questions.length}) ဖြစ်ပါသည်။`);
            goToNextLesson(c, m, l); // ၃ ကြိမ်ပြည့်ရင်လည်း နောက်သင်ခန်းစာကို လွှတ်လိုက်မည်
        } else {
            const retry = confirm(`သင့်ရမှတ်မှာ (${score}/${questions.length}) ဖြစ်ပါသည်။ အကြိမ်ရေ ${(3 - currentAttempt)} ကြိမ် ကျန်ပါသေးသည်။ ထပ်မံဖြေဆိုလိုပါသလား?`);
            if (retry) {
                renderLessonContent(c, m, l); // Quiz ကို Refresh လုပ်ပြီး ပြန်ဖြေခိုင်းမည်
            } else {
                goToNextLesson(c, m, l); // မဖြေချင်တော့ရင်လည်း နောက်သင်ခန်းစာကို သွားခွင့်ပေးမည်
            }
        }
    }, 500); // 0.5 စက္ကန့် စောင့်ပြီးမှ alert ပြမည် (ဒါမှ ကျောင်းသားက UI မှာ အစိမ်း/အနီ အရောင်တွေကို အရင်မြင်ရမှာပါ)

  // ၃။ Attempt တိုးခြင်း
  currentUser.quizAttempts[quizId] = currentAttempt;

  // ၄။ သင်ခန်းစာ ပြီးမြောက်မှု မှတ်သားခြင်း
  // courseData ရှိမရှိ အရင်စစ်ပါမယ်
  if (
    courseData[c] &&
    courseData[c].modules[m] &&
    courseData[c].modules[m].lessons[l]
  ) {
    const lessonTitle = courseData[c].modules[m].lessons[l].title;

    // အမှတ်ပြည့်ရရင် သို့မဟုတ် ၃ ကြိမ်ပြည့်ရင် Completed စာရင်းထဲ ထည့်မယ်
    if (score === questions.length || currentAttempt >= 3) {
      if (!currentUser.completedLessons.includes(lessonTitle)) {
        currentUser.completedLessons.push(lessonTitle);
      }
    }
  }

  // ၅။ LocalStorage တွင် သိမ်းဆည်းခြင်း
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  // ၆။ အသိပေးချက် ပြသခြင်း
  setTimeout(() => {
    if (score === questions.length) {
      alert(
        `ဂုဏ်ယူပါတယ်! အမှတ်ပြည့် (${score}/${questions.length}) ရရှိပါတယ်။`,
      );
      showSection("courses");
    } else if (currentAttempt >= 3) {
      alert(
        `၃ ကြိမ်ဖြေဆိုမှု ပြီးဆုံးပါပြီ။ သင်၏နောက်ဆုံးရမှတ်မှာ (${score}/${questions.length}) ဖြစ်ပါသည်။`,
      );
      showSection("courses");
    } else {
      if (
        confirm(
          `ရမှတ်: ${score}/${questions.length} ဖြစ်ပါသည်။ အကြိမ်ရေ ${3 - currentAttempt} ကြိမ် ကျန်ပါသေးသည်။ ထပ်ဖြေမလား?`,
        )
      ) {
        renderLessonContent(c, m, l);
      } else {
        showSection("courses");
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

  // Role အလိုက် Badge အရောင်ခွဲခြားခြင်း
  const isTeacher = currentUser.role === "Teacher";
  const roleBadgeStyle = isTeacher
    ? "background:#ef4444; color:white;"
    : "background:#e2e8f0; color:black;";

  body.innerHTML = `
        <div class="profile-card-pro fade-in">
            <div class="profile-cover"></div>
            <div class="profile-header-main">
                <img src="${currentUser.photo}" class="profile-large-avatar">
                <div class="profile-info-text">
                    <h2>${currentUser.name} <span class="badge-verify"><i class="fas fa-check-circle"></i></span></h2>
                    <span class="u-role-tag" style="${roleBadgeStyle}">${currentUser.role}</span>
                    
                    <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="save-btn" onclick="renderEditProfile()"><i class="fas fa-user-edit"></i> Profile ပြင်ဆင်မည်</button>
                        ${isTeacher ? `<button class="menu-btn" style="background:#000; color:white;" onclick="renderAdminPanel()"><i class="fas fa-user-shield"></i> Admin Panel (ကျောင်းသားစာရင်းစစ်ရန်)</button>` : ""}
                    </div>
                </div>
            </div>
            
            <div class="profile-content-grid">
                <div class="profile-side-info">
                    <div class="content-card">
                        <h4><i class="fas fa-link"></i> Connect with me</h4>
                        <div class="social-links-grid">
                            ${currentUser.portfolio ? `<a href="${currentUser.portfolio}" target="_blank" title="Portfolio"><i class="fas fa-globe"></i></a>` : ""}
                            ${currentUser.github ? `<a href="${currentUser.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>` : ""}
                            ${currentUser.linkedin ? `<a href="${currentUser.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ""}
                            ${currentUser.facebook ? `<a href="${currentUser.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>` : ""}
                            ${currentUser.youtube ? `<a href="${currentUser.youtube}" target="_blank" title="YouTube"><i class="fab fa-youtube"></i></a>` : ""}
                            ${currentUser.tiktok ? `<a href="${currentUser.tiktok}" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>` : ""}
                            ${currentUser.instagram ? `<a href="${currentUser.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>` : ""}
                            ${currentUser.email ? `<a href="mailto:${currentUser.email}" title="Email"><i class="fas fa-envelope"></i></a>` : ""}
                        </div>
                    </div>
                    <div class="content-card">
                        <h4>Skills</h4>
                        <div class="skills-flex">
                            ${currentUser.skills.map((s) => `<span class="s-tag">${s}</span>`).join("")}
                        </div>
                    </div>
                </div>

                <div class="profile-main-data">
                    <div class="content-card academic-card">
                        <h4><i class="fas fa-university"></i> Academic Status</h4>
                        <div class="academic-box">
                            <div class="academic-item"><span>ကျောင်းဝင်မှတ်ပုံတင်:</span> <strong>${academicInfo.batchName}</strong></div>
                            <div class="academic-item"><span>တက်ရောက်မှု:</span> <strong>${academicInfo.attendance}</strong></div>
                            <div class="academic-item"><span>Grade:</span> <strong style="color:green">${academicInfo.overallGrade}</strong></div>
                            <div class="academic-item"><span>စာမေးပွဲရက်:</span> <strong style="color:red">${academicInfo.examDate}</strong></div>
                        </div>
                    </div>
                    <div class="content-card">
                        <h4>Personal Notes / Bio</h4>
                        <p>${currentUser.notes || "မှတ်စုများ မရှိသေးပါ။"}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
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
  if (!authDiv) return;
  authDiv.innerHTML = `
        <button onclick="toggleDarkMode()" class="theme-toggle-btn">
            <i class="fas ${isDark ? 'fa-sun' : 'fa-moon'}"></i> 
            <span>${isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div class="sidebar-user-info">
            <img src="${currentUser.photo}" class="sidebar-avatar" onclick="showSection('profile')">
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

function viewTranscript(uid) {
  alert("Transcript for " + uid);
}
function viewCertificate(uid) {
  alert("Certificate for " + uid);
}

// ==========================================
// ၈။ App Initialization
// ==========================================

window.onload = () => {
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
    grade: "B+",
    isPaid: true,
  },
  {
    uid: "st002",
    name: "Su Su",
    batchId: "Batch-05",
    attendance: "95%",
    grade: "A",
    isPaid: true,
  },
  {
    uid: "st003",
    name: "Kyaw Kyaw",
    batchId: "Batch-06",
    attendance: "80%",
    grade: "C",
    isPaid: false,
  },
];

// --- Admin Panel (Teacher သာ ဝင်နိုင်မည်) ---
// --- ဆရာအတွက် Admin Panel (Academic Status ပြင်ဆင်ရန်) ---
function renderAdminPanel() {
  const body = document.getElementById("dynamic-body");
  body.innerHTML = `
        <div class="admin-container fade-in">
            <div class="admin-header">
                <h3><i class="fas fa-tools"></i> ဆရာများအတွက် စီမံခန့်ခွဲမှုအပိုင်း</h3>
                <div class="batch-filter">
                    <span>Batch ရွေးချယ်ရန်: </span>
                    <select id="batch-select" onchange="filterStudentsByBatch(this.value)">
                        <option value="All">All Batches</option>
                        <option value="Batch-05">Batch-05</option>
                        <option value="Batch-06">Batch-06</option>
                    </select>
                </div>
            </div>

            <div class="content-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3>Admin Panel</h3>
                    <button class="save-btn" onclick="renderSubmissions()"><i class="fas fa-file-signature"></i> Review Assignments</button>
                </div>
                <hr><br>
                <table class="admin-table">
                    <thead><tr><th>Student Name</th><th>Batch</th><th>Actions</th></tr></thead>
                    <tbody id="admin-list"></tbody>
                </table>
            </div>

            <div class="content-card">
                <h4>ကျောင်းသားစာရင်း</h4>
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
                            <!-- ကျောင်းသားစာရင်း ဤနေရာတွင် ပေါ်လာမည် -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
  filterStudentsByBatch("All"); // စဖွင့်ချင်း အကုန်ပြမည်
}

// Batch အလိုက် Filter လုပ်ပြီး Table ထုတ်ပေးခြင်း
function filterStudentsByBatch(batchId) {
  const tableBody = document.getElementById("student-table-body");
  tableBody.innerHTML = "";

  const filtered =
    batchId === "All"
      ? studentsList
      : studentsList.filter((s) => s.batchId === batchId);

  filtered.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><strong>${student.name}</strong></td>
            <td>${student.batchId}</td>
            <td>${student.attendance}</td>
            <td><span class="s-tag">${student.grade}</span></td>
            <td>
                <button class="action-btn msg" onclick="openDirectMessage('${student.uid}')" title="Message ပို့ရန်"><i class="fas fa-comment"></i></button>
                <button class="action-btn edit" onclick="openGradeModal('${student.uid}')" title="အမှတ်သွင်းရန်"><i class="fas fa-edit"></i></button>
            </td>
        `;
    tableBody.appendChild(row);
  });
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

window.onscroll = function () {
  const btn = document.getElementById("back-to-top");
  if (document.documentElement.scrollTop > 300) btn.style.display = "block";
  else btn.style.display = "none";
};

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