// Firebase initialize လုပ်ပြီးသားကို ခေါ်သုံးခြင်း
const db = firebase.firestore();
const auth = firebase.auth();

// Global User State
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    isLoggedIn: false,
    name: "Mg Mg",
    photo: "https://placehold.co/150x150/003087/white?text=User",
    role: "Student", // 'Student' သို့မဟုတ် 'Teacher'
    skills: ["HTML", "CSS"],
    github: "", portfolio: "", linkedin: "", facebook: "", youtube: "", tiktok: "", instagram: "", email: "student@example.com",
    notes: "",
    isPaid: true
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
    
    // Sidebar ပိတ်မည် (Sidebar ပွင့်နေမှ ပိတ်မည်)
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        toggleNav();
    }

    if (section === 'dashboard') {
        title.innerText = "Dashboard";
        renderDashboard(); // <--- အပေါ်မှာ သတ်မှတ်ထားတဲ့ function ကို ခေါ်လိုက်တာပါ
    } else if (section === 'courses') {
        title.innerText = filterCat ? `${filterCat} သင်ခန်းစာများ` : "သင်ခန်းစာများအားလုံး";
        renderCourseTree(filterCat);
    } else if (section === 'messages') {
        title.innerText = "စာတိုပေးပို့ခြင်း";
        showMessages(); 
    } else if (section === 'profile') {
        title.innerText = "ကျောင်းသား Profile";
        renderProfile();
    }
    renderAuthFooter();
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

    // Role အလိုက် Badge အရောင်ခွဲခြားခြင်း
    const roleBadgeColor = currentUser.role === 'Teacher' ? 'background:#ef4444' : 'background:#e2e8f0';

    body.innerHTML = `
        <div class="profile-card-pro fade-in">
            <div class="profile-cover"></div>
            <div class="profile-header-main">
                <img src="${currentUser.photo}" class="profile-large-avatar">
                <div class="profile-info-text">
                    <h2>${currentUser.name} <span class="badge-verify"><i class="fas fa-check-circle"></i></span></h2>
                    <span class="u-role-tag" style="${roleBadgeColor}; color:${currentUser.role === 'Teacher' ? 'white' : 'black'}">${currentUser.role}</span>
                    
                    <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="save-btn" onclick="renderEditProfile()"><i class="fas fa-user-edit"></i> Profile ပြင်ဆင်မည်</button>

                    <!-- ဆရာဖြစ်မှသာ Admin Panel (ကျောင်းသားစီမံခန့်ခွဲမှု) ခလုတ် ပေါ်လာမည် -->
                    ${currentUser.role === 'Teacher' ? `<button class="menu-btn" style="background:#000; color:white;" onclick="renderAdminPanel()"><i class="fas fa-user-shield"></i> Admin Panel (ကျောင်းသားစာရင်းစစ်ရန်)</button>` : ''}
                </div>
            </div>
        </div>
            
            <div class="profile-content-grid">
                <div class="profile-side-info">
                    <div class="content-card">
                        <h4><i class="fas fa-link"></i> Connect with me</h4>
                        <div class="social-links-grid">
                            ${currentUser.portfolio ? `<a href="${currentUser.portfolio}" target="_blank" title="Portfolio"><i class="fas fa-globe"></i></a>` : ''}
                            ${currentUser.github ? `<a href="${currentUser.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
                            ${currentUser.linkedin ? `<a href="${currentUser.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
                            ${currentUser.facebook ? `<a href="${currentUser.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>` : ''}
                            ${currentUser.youtube ? `<a href="${currentUser.youtube}" target="_blank" title="YouTube"><i class="fab fa-youtube"></i></a>` : ''}
                            ${currentUser.tiktok ? `<a href="${currentUser.tiktok}" target="_blank" title="TikTok"><i class="fab fa-tiktok"></i></a>` : ''}
                            ${currentUser.instagram ? `<a href="${currentUser.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
                            ${currentUser.email ? `<a href="mailto:${currentUser.email}" title="Email"><i class="fas fa-envelope"></i></a>` : ''}
                        </div>
                    </div>
                    <div class="content-card">
                        <h4>Skills</h4>
                        <div class="skills-flex">
                            ${currentUser.skills.map(s => `<span class="s-tag">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="profile-main-data">
                    <!-- Academic Status (Read-Only) -->
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
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="content-card animate-up" style="max-width: 800px; margin: 0 auto;">
            <h3 style="margin-bottom:20px;"><i class="fas fa-id-card"></i> Profile ပြင်ဆင်ခြင်း</h3>
            
            <div class="edit-grid">
                <div class="edit-section">
                    <label>Profile Photo URL</label>
                    <input type="text" id="edit-photo" class="edit-input" value="${currentUser.photo}" placeholder="ပုံ၏ Link ကိုထည့်ပါ">
                    <label>အမည်</label>
                    <input type="text" id="edit-name" class="edit-input" value="${currentUser.name}">
                    <label>Portfolio Website</label>
                    <input type="text" id="edit-portfolio" class="edit-input" value="${currentUser.portfolio || ''}" placeholder="https://...">
                </div>
                
                <div class="edit-section">
                    <label>Social Links (Link အပြည့်အစုံထည့်ပါ)</label>
                    <div class="social-input-group">
                        <i class="fab fa-linkedin"></i> <input type="text" id="edit-linkedin" value="${currentUser.linkedin || ''}" placeholder="LinkedIn Link">
                        <i class="fab fa-facebook"></i> <input type="text" id="edit-facebook" value="${currentUser.facebook || ''}" placeholder="Facebook Link">
                        <i class="fab fa-youtube"></i> <input type="text" id="edit-youtube" value="${currentUser.youtube || ''}" placeholder="Youtube Link">
                        <i class="fab fa-tiktok"></i> <input type="text" id="edit-tiktok" value="${currentUser.tiktok || ''}" placeholder="TikTok Link">
                        <i class="fab fa-instagram"></i> <input type="text" id="edit-instagram" value="${currentUser.instagram || ''}" placeholder="Instagram Link">
                        <i class="fas fa-envelope"></i> <input type="text" id="edit-email" value="${currentUser.email || ''}" placeholder="Email Address">
                        <i class="fab fa-github"></i> <input type="text" id="edit-github" value="${currentUser.github || ''}" placeholder="GitHub Link">
                    </div>
                </div>
            </div>

            <label>Skills (ကော်မာခြားပါ)</label>
            <input type="text" id="edit-skills" class="edit-input" value="${currentUser.skills.join(', ')}">
            <label>Bio / Notes</label>
            <textarea id="edit-notes" class="edit-input" rows="3">${currentUser.notes || ''}</textarea>
            
            <div style="margin-top:20px;">
                <button class="save-btn" onclick="updateProfileData()">Save Profile</button>
                <button class="menu-btn" style="background:#64748b" onclick="renderProfile()">Cancel</button>
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

function updateProfileData() {
    currentUser.name = document.getElementById('edit-name').value;
    currentUser.photo = document.getElementById('edit-photo').value;
    currentUser.portfolio = document.getElementById('edit-portfolio').value;
    currentUser.linkedin = document.getElementById('edit-linkedin').value;
    currentUser.facebook = document.getElementById('edit-facebook').value;
    currentUser.youtube = document.getElementById('edit-youtube').value;
    currentUser.tiktok = document.getElementById('edit-tiktok').value;
    currentUser.instagram = document.getElementById('edit-instagram').value;
    currentUser.email = document.getElementById('edit-email').value;
    currentUser.github = document.getElementById('edit-github').value;
    currentUser.notes = document.getElementById('edit-notes').value;
    currentUser.skills = document.getElementById('edit-skills').value.split(',').map(s => s.trim());

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert("အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။");
    renderProfile();
    renderAuthFooter();
}

// အစမ်းသုံးရန် ကျောင်းသားစာရင်း Data (တကယ်တမ်းတွင် Firestore မှ ဆွဲယူမည်)
let studentsList = [
    { uid: "st001", name: "Aung Aung", batchId: "Batch-05", attendance: "90%", grade: "B+", isPaid: true },
    { uid: "st002", name: "Su Su", batchId: "Batch-05", attendance: "95%", grade: "A", isPaid: true },
    { uid: "st003", name: "Kyaw Kyaw", batchId: "Batch-06", attendance: "80%", grade: "C", isPaid: false }
];

// --- Admin Panel (Teacher သာ ဝင်နိုင်မည်) ---
// --- ဆရာအတွက် Admin Panel (Academic Status ပြင်ဆင်ရန်) ---
function renderAdminPanel() {
    const body = document.getElementById('dynamic-body');
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
    filterStudentsByBatch('All'); // စဖွင့်ချင်း အကုန်ပြမည်
}

// Batch အလိုက် Filter လုပ်ပြီး Table ထုတ်ပေးခြင်း
function filterStudentsByBatch(batchId) {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = '';
    
    const filtered = batchId === 'All' ? studentsList : studentsList.filter(s => s.batchId === batchId);

    filtered.forEach(student => {
        const row = document.createElement('tr');
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
    const student = studentsList.find(s => s.uid === studentUid);
    const body = document.getElementById('dynamic-body');
    
    // ဘာသာရပ်စာရင်း (မာတိကာမှ ယူနိုင်သည် သို့မဟုတ် ပုံသေထားနိုင်သည်)
    const subjects = ["HTML", "CSS", "JavaScript", "React", "NodeJS", "Database"];
    
    let subjectInputs = subjects.map(sub => `
        <div class="academic-item">
            <span class="label-grey">${sub}:</span>
            <input type="number" id="grade-${sub.toLowerCase()}" class="edit-input" style="width:80px" value="${student.grades?.[sub.toLowerCase()] || 0}">
        </div>
    `).join('');

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
    const body = document.getElementById('dynamic-body');
    const grades = currentUser.grades || {};
    
    let total = 0;
    let count = 0;
    let rows = Object.entries(grades).map(([sub, score]) => {
        total += score;
        count++;
        return `<tr><td>${sub.toUpperCase()}</td><td>${score}</td><td>${score >= 50 ? 'Pass' : 'Fail'}</td></tr>`;
    }).join('');

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
                    <p>Result: <strong style="color:green">${average >= 75 ? 'Distinction' : 'Passed'}</strong></p>
                </div>
                <div style="margin-top:20px">
                    <button class="save-btn" onclick="window.print()"><i class="fas fa-print"></i> Print Transcript</button>
                    ${average >= 75 ? `<button class="menu-btn" style="background:#f59e0b" onclick="generateCertificate()"><i class="fas fa-award"></i> View Certificate</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

// --- Certificate Template (အလှပြရန်) ---
function generateCertificate() {
    const body = document.getElementById('dynamic-body');
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

// --- Messaging Section ---
// လက်ရှိ ဘယ်သူနဲ့ Chat နေသလဲ ဆိုတာ သိမ်းရန်
let activeChatId = "Batch-05"; // Default ကို Group Chat ထားမယ်
let activeChatName = "Group: Batch-05";

// Messaging Section ပြသခြင်း
function showMessages(targetUid = null, targetName = null) {
    const title = document.getElementById('page-title');
    const body = document.getElementById('dynamic-body');
    
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
                    <div class="chat-item ${activeChatId.includes('Batch') ? 'active' : ''}" onclick="switchChat('Batch-05', 'Group: Batch-05')">
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
    document.getElementById('active-chat-title').innerText = name;
    loadMessages();
}

// Firestore မှ Message များ Real-time ဖတ်ခြင်း
function loadMessages() {
    const chatDisplay = document.getElementById('chat-display');
    chatDisplay.innerHTML = '<div class="loader">Loading messages...</div>';

    let query;
    if (activeChatId.includes('Batch')) {
        query = db.collection('messages').where('batchId', '==', activeChatId).orderBy('timestamp', 'asc');
    } else {
        const combinedId = [currentUser.uid, activeChatId].sort().join("_");
        query = db.collection('messages').where('convoId', '==', combinedId).orderBy('timestamp', 'asc');
    }

    query.onSnapshot(snapshot => {
        chatDisplay.innerHTML = '';
        snapshot.forEach(doc => {
            const m = doc.data();
            const msgId = doc.id;
            const isMe = m.senderId === currentUser.uid;
            
            // ဆရာဖြစ်လျှင် သို့မဟုတ် ကိုယ်တိုင်ပို့ထားသောစာဖြစ်လျှင် Edit/Delete ခလုတ်ပြမည်
            const canEdit = (currentUser.role === 'Teacher' || isMe);

            chatDisplay.innerHTML += `
                <div class="message-bubble ${isMe ? 'me' : 'other'}">
                    <div class="msg-header">
                        <span class="msg-sender">${isMe ? 'You' : m.senderName}</span>
                        ${canEdit ? `
                            <div class="msg-actions">
                                <i class="fas fa-edit" onclick="editMessage('${msgId}', '${m.text}')" title="Edit"></i>
                                <i class="fas fa-trash" onclick="deleteMessage('${msgId}')" title="Delete"></i>
                            </div>
                        ` : ''}
                    </div>
                    <div class="msg-text">${m.text}</div>
                </div>
            `;
        });
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }, error => {
        console.error("Message error:", error);
    });
}

function renderDashboard() {
    const body = document.getElementById('dynamic-body');
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
                <span class="explore-btn">လေ့လာမည် <i class="fas fa-arrow-right"></i></span>
            </div>
            <div class="topic-card" onclick="showSection('courses', 'Technical')">
                <div class="card-icon"><i class="fas fa-code"></i></div>
                <h3>Technical</h3>
                <p>JavaScript, Algorithms</p>
                <span class="explore-btn">လေ့လာမည် <i class="fas fa-arrow-right"></i></span>
            </div>
            <div class="topic-card" onclick="showSection('courses', 'Full-Stack')">
                <div class="card-icon"><i class="fas fa-server"></i></div>
                <h3>Full-Stack</h3>
                <p>Node.js, Express, Firebase</p>
                <span class="explore-btn">လေ့လာမည် <i class="fas fa-arrow-right"></i></span>
            </div>
        </div>
    `;
}

// --- Message ဖျက်ရန် Function ---
async function deleteMessage(id) {
    if (confirm("ဤစာကို ဖျက်ရန် သေချာပါသလား?")) {
        try {
            await db.collection('messages').doc(id).delete();
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
            await db.collection('messages').doc(id).update({
                text: newText,
                edited: true,
                editedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            alert("Error updating message: " + error.message);
        }
    }
}

// Message ပို့ခြင်း
function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

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
        // Direct Message (UID နှစ်ခုကို စီပြီး ID တစ်ခုတည်းအဖြစ် ပြောင်းလဲခြင်း)
        const combinedId = [currentUser.uid, activeChatId].sort().join("_");
        msgData.convoId = combinedId; 
        msgData.type = "direct";
    }

    db.collection('messages').add(msgData);
    input.value = '';
}

// Admin Table ထဲက Message ခလုတ်ကို ပြင်ခြင်း
function openDirectMessage(uid) {
    const student = studentsList.find(s => s.uid === uid);
    showMessages(uid, student.name); // Chat section သို့ တန်းသွားမည်
}

async function updateGrades(studentUid) {
    // UI ထဲက ရိုက်ထားတဲ့ အမှတ်တွေကို ယူမယ်
    const subjects = ["html", "css", "javascript", "react", "nodejs", "database"];
    let newGrades = {};
    
    subjects.forEach(sub => {
        newGrades[sub] = parseInt(document.getElementById('grade-' + sub).value) || 0;
    });

    try {
        // Firestore ထဲ တိုက်ရိုက် Update လုပ်ခြင်း
        await db.collection('users').doc(studentUid).update({
            grades: newGrades
        });
        alert("အမှတ်စာရင်းကို Database ထဲသို့ အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။");
        renderAdminPanel(); // Admin စာမျက်နှာကို ပြန်သွားမယ်
    } catch (error) {
        alert("Error updating grades: " + error.message);
    }
}

// Real-time မှာ Message များ ဖတ်ခြင်း
function loadGroupChat() {
    db.collection('messages')
      .where('batchId', '==', 'Batch-05')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
          const chatBox = document.getElementById('chat-box');
          chatBox.innerHTML = '';
          snapshot.forEach(doc => {
              const msg = doc.data();
              const isMe = msg.senderId === currentUser.uid;
              chatBox.innerHTML += `
                <div class="msg-bubble ${isMe ? 'me' : 'other'}">
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
    academicInfo.examDate = document.getElementById('adm-exam').value;
    academicInfo.overallGrade = document.getElementById('adm-grade').value;
    academicInfo.attendance = document.getElementById('adm-att').value;
    academicInfo.batchName = document.getElementById('adm-batch').value;
    
    alert("ကျောင်းသား၏ Academic Status ကို ပြင်ဆင်ပြီးပါပြီ။");
    renderProfile();
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

// Firebase Auth Login Function
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // ၁။ Firebase Auth ဖြင့် Login ဝင်ခြင်း
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // ၂။ Firestore ထဲက ကျောင်းသား/ဆရာ အချက်အလက်ကို သွားယူခြင်း
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (userDoc.exists) {
            const userData = userDoc.data();

            // ၃။ ရရှိလာတဲ့ Data ကို currentUser ထဲ ထည့်သိမ်းမယ်
            currentUser = {
                uid: user.uid,
                isLoggedIn: true,
                name: userData.name || "Unknown User",
                photo: userData.photo || "https://placehold.co/150x150/003087/white?text=User",
                role: userData.role, // "Teacher" သို့မဟုတ် "Student"
                isPaid: userData.isPaid,
                email: email,
                // အခြား social links များ
                github: userData.github || "",
                portfolio: userData.portfolio || "",
                skills: userData.skills || []
            };

            // LocalStorage မှာ သိမ်းမယ်
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // UI ပြောင်းလဲခြင်း
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('app-wrapper').style.display = 'flex';
            
            // Dashboard သို့ သွားမည်
            showSection('dashboard');
            alert("မင်္ဂလာပါ " + currentUser.role + " " + currentUser.name);
            
        } else {
            alert("Database ထဲတွင် အချက်အလက် ရှာမတွေ့ပါ။ Admin ကို ဆက်သွယ်ပါ။");
        }
    } catch (error) {
        alert("Login မှားယွင်းနေပါသည်: " + error.message);
    }
}

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