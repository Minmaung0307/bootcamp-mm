// Firebase initialize လုပ်ပြီးသားကို ခေါ်သုံးခြင်း
const db = firebase.firestore();
const auth = firebase.auth();

// Global User State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    isLoggedIn: false,
    name: "Mg Mg",
    photo: "https://placehold.co/100x100/003087/white?text=User",
    role: "Student",
    skills: ["HTML", "CSS"],
    github: "github.com/student",
    isPaid: true,
    notes: ""
};

function handleLogin() {
    currentUser.isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    location.reload(); 
}

function handleLogout() {
    if (confirm("Logout ထွက်မှာ သေချာပါသလား?")) {
        currentUser.isLoggedIn = false;
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

// Sidebar Footer Render (User Info & Logout)
function renderAuthFooter() {
    const authDiv = document.getElementById('auth-section');
    if (!authDiv) return;
    authDiv.innerHTML = `
        <div class="sidebar-user-info">
            <img src="${currentUser.photo}" alt="user" class="sidebar-avatar" onclick="showSection('profile')">
            <div class="user-details" onclick="showSection('profile')">
                <p class="u-name">${currentUser.name}</p>
                <small class="u-role">${currentUser.role}</small>
            </div>
            <button class="logout-mini-btn" onclick="handleLogout()" title="Logout">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        </div>
    `;
}

// window.onload = () => { if(!currentUser.isLoggedIn) document.getElementById('login-page').style.display = 'flex'; };

window.onload = () => {
    if (currentUser.isLoggedIn) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app-wrapper').style.display = 'flex';
        showSection('dashboard');
    } else {
        document.getElementById('login-page').style.display = 'flex';
    }
};

function closeAnnouncement() {
    document.getElementById('announcement-bar').style.display = 'none';
}

function showSection(section, filterCat = null) {
    const title = document.getElementById('page-title');
    const body = document.getElementById('dynamic-body');
    
    // Sidebar ပွင့်နေရင် ပြန်ပိတ်မယ် (Mobile/Desktop အားလုံးအတွက်)
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('open')) {
        toggleNav();
    }

    if (section === 'dashboard') {
        title.innerText = "Dashboard";
        body.innerHTML = `
            <div class="welcome-banner">
                <h2>မင်္ဂလာပါ ${currentUser.name}! <span class="wave">👋</span></h2>
                <p>ယနေ့ သင်ခန်းစာသစ်များကို ဆက်လက်လေ့လာလိုက်ပါ။</p>
            </div>
            <div class="dashboard-grid">
                <div class="topic-card" onclick="showSection('courses', 'Foundations')">
                    <div class="card-icon"><i class="fas fa-cubes"></i></div>
                    <h3>Foundations</h3>
                    <p>အခြေခံ HTML, CSS, Git</p>
                </div>
                <div class="topic-card" onclick="showSection('courses', 'Technical')">
                    <div class="card-icon"><i class="fas fa-code"></i></div>
                    <h3>Technical</h3>
                    <p>JavaScript, Algorithms</p>
                </div>
                <div class="topic-card" onclick="showSection('courses', 'Full-Stack')">
                    <div class="card-icon"><i class="fas fa-server"></i></div>
                    <h3>Full-Stack</h3>
                    <p>Node.js, Express, Firebase</p>
                </div>
            </div>
        `;
    } else if (section === 'courses') {
        title.innerText = filterCat ? `${filterCat} သင်ခန်းစာများ` : "သင်ခန်းစာများအားလုံး";
        renderCourseTree(filterCat);
    } else if (section === 'profile') {
        title.innerText = "User Profile";
        renderProfile();
    }
    renderAuthFooter(); // Sidebar အောက်ခြေက data ကို update လုပ်မယ်
}

// Course Tree with Filtering
function renderCourseTree(filterCat) {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = '<div id="course-outline"></div>';
    const container = document.getElementById('course-outline');
    const filteredData = filterCat ? courseData.filter(c => c.category.toLowerCase() === filterCat.toLowerCase()) : courseData;

    if (filteredData.length === 0) {
        container.innerHTML = `<div class="empty-msg">ဤကဏ္ဍတွင် သင်ခန်းစာများ မရှိသေးပါ။</div>`;
        return;
    }

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
                const originalCatIdx = courseData.findIndex(c => c.category === cat.category);
                item.onclick = () => renderLessonContent(originalCatIdx, modIdx, lesIdx);
                list.appendChild(item);
            });
        });
    });
}

// Module Accordion Toggle Function
function toggleModuleAccordion(header, targetId) {
    const content = document.getElementById(targetId);
    header.classList.toggle('active');
    content.classList.toggle('show');
}

// ဆရာမှ သတ်မှတ်ပေးမည့် ပြင်လို့မရသော အချက်အလက်များ (Database မှ လာမည်)
let academicInfo = {
    examDate: "ဖေဖော်ဝါရီ ၁၅၊ ၂၀၂၄",
    attendance: "92%",
    overallGrade: "A-",
    batchName: "Batch-05 (Night Class)",
    startDate: "ဇန်နဝါရီ ၁၊ ၂၀၂၄"
};

// Profile ပြသခြင်း (View Mode & Academic Info)
function renderProfile() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="profile-card-pro">
            <div class="profile-cover"></div>
            <div class="profile-header-main">
                <img src="${currentUser.photo}" class="profile-large-avatar">
                <div class="profile-info-text">
                    <h2>${currentUser.name} <span class="badge-verify"><i class="fas fa-check-circle"></i></span></h2>
                    <button class="menu-btn" onclick="renderEditProfile()"><i class="fas fa-edit"></i> Edit Profile</button>
                </div>
            </div>
            
            <div class="profile-content-grid">
                <!-- ကျောင်းသားပြင်လို့ရသော အပိုင်း -->
                <div class="profile-side-info">
                    <div class="content-card">
                        <h4>ကိုယ်ရေးအချက်အလက်</h4>
                        <p><i class="fab fa-github"></i> ${currentUser.github || "မရှိသေးပါ"}</p>
                        <p><i class="fas fa-link"></i> ${currentUser.portfolio || "Portfolio လင့်ခ်"}</p>
                        <div class="skills-flex" style="margin-top:10px;">
                            ${currentUser.skills.map(s => `<span class="s-tag">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <!-- ဆရာပဲပြင်လို့ရသော အပိုင်း (Read-Only) -->
                <div class="profile-main-data">
                    <div class="content-card">
                        <h4 style="color: #e11d48;"><i class="fas fa-university"></i> Academic Status (Read-Only)</h4>
                        <div class="academic-box">
                            <div class="academic-item"><span class="label-grey">စာမေးပွဲရက်:</span> <span class="value-blue">${academicInfo.examDate}</span></div>
                            <div class="academic-item"><span class="label-grey">တက်ရောက်မှု:</span> <span class="value-blue">${academicInfo.attendance}</span></div>
                            <div class="academic-item"><span class="label-grey">စုစုပေါင်းရမှတ်:</span> <span class="value-blue">${academicInfo.overallGrade}</span></div>
                            <div class="academic-item"><span class="label-grey">သင်တန်းစတင်ရက်:</span> <span class="value-blue">${academicInfo.startDate}</span></div>
                            <div class="academic-item"><span class="label-grey">Batch:</span> <span class="value-blue">${academicInfo.batchName}</span></div>
                        </div>
                        <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 10px;">* ဤအချက်အလက်များကို ပြင်ဆင်လိုပါက သင်တန်းဌာနသို့ ဆက်သွယ်ပါ။</p>
                    </div>

                    <div class="content-card">
                        <h4>ကိုယ့်ကိုယ်ကိုယ် မိတ်ဆက်ခြင်း / မှတ်စု</h4>
                        <p>${currentUser.notes || "မှတ်စုများ မရှိသေးပါ။"}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ကျောင်းသားအတွက် Profile ပြင်ဆင်သည့် Form (Edit Mode)
function renderEditProfile() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="content-card" style="max-width: 600px; margin: 0 auto;">
            <h3>Edit Your Profile</h3>
            <p style="color: #64748b; margin-bottom: 20px;">ကျောင်းသားများမှ ပြင်ဆင်နိုင်သော အချက်အလက်များ</p>
            
            <div class="form-group">
                <label>အမည်</label>
                <input type="text" id="edit-name" class="edit-input" value="${currentUser.name}">
            </div>
            <div class="form-group">
                <label>GitHub URL</label>
                <input type="text" id="edit-github" class="edit-input" value="${currentUser.github}">
            </div>
            <div class="form-group">
                <label>Skills (ကော်မာလေးများခြားပြီး ရေးပါ)</label>
                <input type="text" id="edit-skills" class="edit-input" value="${currentUser.skills.join(', ')}">
            </div>
            <div class="form-group">
                <label>ကိုယ်ရေးမှတ်စု / Portfolio Description</label>
                <textarea id="edit-notes" class="edit-input" rows="4">${currentUser.notes || ""}</textarea>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="save-btn" onclick="saveProfile()">Save Changes</button>
                <button class="menu-btn" style="background: #94a3b8;" onclick="renderProfile()">Cancel</button>
            </div>
        </div>
    `;
}

// အချက်အလက်များကို သိမ်းဆည်းခြင်း
function saveProfile() {
    currentUser.name = document.getElementById('edit-name').value;
    currentUser.github = document.getElementById('edit-github').value;
    currentUser.notes = document.getElementById('edit-notes').value;
    currentUser.skills = document.getElementById('edit-skills').value.split(',').map(s => s.trim());

    // LocalStorage မှာသိမ်းမယ် (နောင်တွင် Firebase Firestore တွင်သိမ်းရန်)
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    alert("Profile အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။");
    renderProfile();
    renderAuthFooter();
}

function toggleEditMode(isEdit) {
    document.getElementById('profile-view').style.display = isEdit ? 'none' : 'block';
    document.getElementById('profile-edit').style.display = isEdit ? 'block' : 'none';
}

function renderAuthSection() {
    const authDiv = document.getElementById('auth-section');
    authDiv.innerHTML = `
        <div class="user-brief" onclick="showSection('profile')">
            <img src="${currentUser.photo}" alt="user">
            <div><p>${currentUser.name}</p><small>${currentUser.role}</small></div>
        </div>
    `;
}

function toggleNav() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

function toggleElement(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

window.onscroll = function() {
    const btn = document.getElementById('back-to-top');
    if (document.documentElement.scrollTop > 300) btn.style.display = "block";
    else btn.style.display = "none";
};

// Firebase Auth ကို သုံးပြီး Login ဝင်ခြင်း
// async function handleLogin() {
//     const email = document.getElementById('login-email').value;
//     const password = document.getElementById('login-password').value;

//     try {
//         // အဆင့် (၁) - Auth ဝင်ခြင်း
//         const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
//         const user = userCredential.user;
//         console.log("Auth Success, UID:", user.uid);

//         // အဆင့် (၂) - Firestore ထဲက Data ယူခြင်း
//         const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
//         if (userDoc.exists) {
//             const userData = userDoc.data();
//             console.log("User Data found:", userData);

//             if (userData.isPaid) {
//                 currentUser = { ...currentUser, ...userData, isLoggedIn: true };
//                 document.getElementById('login-page').style.display = 'none';
//                 document.getElementById('app-wrapper').style.display = 'flex';
//                 showSection('dashboard');
//             } else {
//                 alert("သင်တန်းကြေး မပေးရသေးပါ။");
//             }
//         } else {
//             // Error ဒီမှာ တက်နေတာ ဖြစ်နိုင်ပါတယ်
//             alert("Login အောင်မြင်သော်လည်း Database ထဲတွင် အချက်အလက် မရှိသေးပါ။ (UID မကိုက်ခြင်း သို့မဟုတ် Doc မရှိခြင်း)");
//             console.error("No Firestore document found for UID:", user.uid);
//         }
//     } catch (error) {
//         console.error("Login Error:", error);
//         alert("Login မှားယွင်းနေပါသည်: " + error.message);
//     }
// }

// ကျောင်းသားသစ် အကောင့်ဖွင့်ပေးခြင်း (ဆရာသုံးရန်)
async function createStudentAccount(email, password, name) {
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;

        // Firestore ထဲမှာ ကျောင်းသားရဲ့ အချက်အလက်ကို သိမ်းမယ်
        await db.collection('users').doc(uid).set({
            uid: uid,
            name: name,
            email: email,
            role: "Student",
            isPaid: true, // ဆရာကိုယ်တိုင် ဆောက်ပေးတာမို့ true ထားလိုက်မယ်
            skills: [],
            notes: "",
            photo: "https://via.placeholder.com/100"
        });
        
        alert("ကျောင်းသားအကောင့် အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ။");
    } catch (error) {
        console.error("Error creating student:", error);
    }
}

// --- သင်ခန်းစာ အကြောင်းအရာကို ပြသပေးမည့် Function ---
function renderLessonContent(catIdx, modIdx, lesIdx) {
    const body = document.getElementById('dynamic-body');
    const lesson = courseData[catIdx].modules[modIdx].lessons[lesIdx];
    document.getElementById('page-title').innerText = lesson.title;
    
    body.innerHTML = `
        <article class="article-content">
            <div class="lesson-body">${lesson.content}</div>
            <div class="pagination">
                <button class="menu-btn" onclick="goToLesson(${catIdx}, ${modIdx}, ${lesIdx - 1})" ${lesIdx === 0 ? 'disabled style="background:grey"' : ''}>Prev</button>
                <button class="menu-btn" onclick="goToLesson(${catIdx}, ${modIdx}, ${lesIdx + 1})" ${lesIdx === courseData[catIdx].modules[modIdx].lessons.length - 1 ? 'disabled style="background:grey"' : ''}>Next</button>
            </div>
        </article>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Pagination အတွက် ကူညီပေးမည့် function
function goToLesson(catIdx, modIdx, lesIdx) {
    if (lesIdx >= 0 && lesIdx < courseData[catIdx].modules[modIdx].lessons.length) {
        renderLessonContent(catIdx, modIdx, lesIdx);
    }
}

async function renderLessonContent(catIdx, modIdx, lesIdx) {
    const body = document.getElementById('dynamic-body');
    const cat = courseData[catIdx];
    const mod = cat.modules[modIdx];
    const lesson = mod.lessons[lesIdx];
    
    document.getElementById('page-title').innerText = lesson.title;
    body.innerHTML = '<div class="loader">သင်ခန်းစာကို ဖတ်နေသည်...</div>';

    const breadcrumbs = `
        <div class="breadcrumbs">
            <span onclick="showSection('dashboard')">Home</span> / 
            <span onclick="showSection('courses', '${cat.category}')">${cat.category}</span> / 
            <span onclick="showSection('courses', '${cat.category}')">${mod.moduleTitle}</span>
        </div>
    `;

    try {
        const response = await fetch(lesson.path);
        if (!response.ok) throw new Error('File not found');
        const htmlContent = await response.text();

        body.innerHTML = `
            ${breadcrumbs}
            <article class="article-content">
                <div class="lesson-body">${htmlContent}</div>
                <div class="pagination">
                    <button class="menu-btn" onclick="goToLesson(${catIdx}, ${modIdx}, ${lesIdx - 1})" ${lesIdx === 0 ? 'disabled' : ''}>Prev</button>
                    <button class="menu-btn" onclick="goToLesson(${catIdx}, ${modIdx}, ${lesIdx + 1})" ${lesIdx === mod.lessons.length - 1 ? 'disabled' : ''}>Next</button>
                </div>
            </article>
        `;
    } catch (error) {
        body.innerHTML = `${breadcrumbs} <div class="error-msg">Error: ဖိုင်ကို ရှာမတွေ့ပါ။ (${lesson.path})</div>`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Quiz Engine နမူနာ
function renderQuiz(data) {
    let quizHtml = '<h3>Module Quiz</h3>';
    data.questions.forEach((item, index) => {
        quizHtml += `
            <div class="quiz-card">
                <p><strong>Q${index+1}: ${item.q}</strong></p>
                ${item.options.map((opt, i) => `
                    <label><input type="radio" name="q${index}" value="${i}"> ${opt}</label><br>
                `).join('')}
            </div>
        `;
    });
    quizHtml += '<br><button class="menu-btn" onclick="checkQuiz()">အဖြေစစ်မည်</button>';
    document.getElementById('dynamic-body').innerHTML = quizHtml;
}