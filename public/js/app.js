// Firebase initialize လုပ်ပြီးသားကို ခေါ်သုံးခြင်း
const db = firebase.firestore();
const auth = firebase.auth();

// User State
let currentUser = {
    name: "Mg Mg",
    photo: "https://via.placeholder.com/100",
    role: "Student",
    skills: ["HTML", "CSS", "JS"],
    github: "github.com/mgmg",
    portfolio: "mgmg.dev",
    notes: "လေ့လာစရာများ စုစည်းရန်...",
    isLoggedIn: false
};

function handleLogin() {
    currentUser.isLoggedIn = true;
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-wrapper').style.display = 'flex';
    showSection('dashboard');
}

function closeAnnouncement() {
    document.getElementById('announcement-bar').style.display = 'none';
}

function showSection(section, filterCat = null) {
    const title = document.getElementById('page-title');
    const body = document.getElementById('dynamic-body');
    if (window.innerWidth < 1024 && document.getElementById('sidebar').classList.contains('open')) toggleNav();

    if (section === 'dashboard') {
        title.innerText = "Dashboard";
        body.innerHTML = `
            <div class="dashboard-grid">
                <div class="topic-card" onclick="showSection('courses', 'Foundation')"><i class="fas fa-layer-group"></i><h3>Foundations</h3><p>အခြေခံ HTML, CSS, Git</p></div>
                <div class="topic-card" onclick="showSection('courses', 'Technical')"><i class="fas fa-laptop-code"></i><h3>Technical</h3><p>JS, Algorithms</p></div>
                <div class="topic-card" onclick="showSection('courses', 'Full-Stack')"><i class="fas fa-server"></i><h3>Full-Stack</h3><p>Backend & Database</p></div>
            </div>
        `;
    } else if (section === 'courses') {
        title.innerText = filterCat ? `${filterCat} သင်ခန်းစာများ` : "သင်ခန်းစာများအားလုံး";
        renderCourseTree(filterCat);
    } else if (section === 'profile') {
        title.innerText = "Profile Setup";
        renderProfile();
    }
    renderAuthSection();
}

// Course Tree with Filtering
function renderCourseTree(filterCat) {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = '<div id="course-outline"></div>';
    const container = document.getElementById('course-outline');

    // Category Filter Logic
    const filteredData = filterCat ? courseData.filter(c => c.category === filterCat) : courseData;

    filteredData.forEach((cat, catIdx) => {
        const catDiv = document.createElement('div');
        catDiv.innerHTML = `
            <div class="category-header" onclick="toggleElement('cat-${catIdx}')">
                <i class="fas fa-folder-open"></i> ${cat.category}
            </div>
            <div id="cat-${catIdx}" style="display:block; padding-left:20px;"></div>
        `;
        container.appendChild(catDiv);
        const modContainer = document.getElementById(`cat-${catIdx}`);

        cat.modules.forEach((mod, modIdx) => {
            const modTitle = document.createElement('h4');
            modTitle.style.margin = "10px 0";
            modTitle.innerText = mod.moduleTitle;
            modContainer.appendChild(modTitle);

            mod.lessons.forEach((les, lesIdx) => {
                const item = document.createElement('div');
                item.className = 'lesson-item';
                item.innerHTML = `<i class="far fa-file-alt"></i> ${les.title}`;
                item.onclick = () => renderLessonContent(catIdx, modIdx, lesIdx);
                modContainer.appendChild(item);
            });
        });
    });
}

// Profile Rendering with Edit Functionality
function renderProfile() {
    const body = document.getElementById('dynamic-body');
    body.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-img-container">
                    <img src="${currentUser.photo}" class="profile-img" id="prof-img">
                </div>
            </div>
            <div class="profile-body">
                <div id="profile-view">
                    <h2>${currentUser.name} <button class="menu-btn" onclick="toggleEditMode(true)">Edit Profile</button></h2>
                    <p>${currentUser.github} | ${currentUser.portfolio}</p>
                    <div class="dashboard-grid">
                        <div class="card"><h4>Skills</h4>${currentUser.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>
                        <div class="card"><h4>Learning Notes</h4><p>${currentUser.notes}</p></div>
                    </div>
                </div>
                <div id="profile-edit" style="display:none;">
                    <h3>Edit Profile</h3>
                    <input type="text" id="edit-name" class="edit-input" value="${currentUser.name}" placeholder="အမည်">
                    <input type="text" id="edit-github" class="edit-input" value="${currentUser.github}" placeholder="GitHub URL">
                    <input type="text" id="edit-skills" class="edit-input" value="${currentUser.skills.join(',')}" placeholder="Skills (comma နဲ့ ခြားပါ)">
                    <textarea id="edit-notes" class="edit-input" rows="4">${currentUser.notes}</textarea>
                    <br><br>
                    <button class="save-btn" onclick="saveProfile()">Save Changes</button>
                    <button class="menu-btn" style="background:grey;" onclick="toggleEditMode(false)">Cancel</button>
                </div>
            </div>
        </div>
    `;
}

function toggleEditMode(isEdit) {
    document.getElementById('profile-view').style.display = isEdit ? 'none' : 'block';
    document.getElementById('profile-edit').style.display = isEdit ? 'block' : 'none';
}

function saveProfile() {
    currentUser.name = document.getElementById('edit-name').value;
    currentUser.github = document.getElementById('edit-github').value;
    currentUser.skills = document.getElementById('edit-skills').value.split(',');
    currentUser.notes = document.getElementById('edit-notes').value;
    renderProfile();
    renderAuthSection();
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
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

function toggleElement(id) {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// Firebase Auth ကို သုံးပြီး Login ဝင်ခြင်း
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        // အဆင့် (၁) - Auth ဝင်ခြင်း
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log("Auth Success, UID:", user.uid);

        // အဆင့် (၂) - Firestore ထဲက Data ယူခြင်း
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log("User Data found:", userData);

            if (userData.isPaid) {
                currentUser = { ...currentUser, ...userData, isLoggedIn: true };
                document.getElementById('login-page').style.display = 'none';
                document.getElementById('app-wrapper').style.display = 'flex';
                showSection('dashboard');
            } else {
                alert("သင်တန်းကြေး မပေးရသေးပါ။");
            }
        } else {
            // Error ဒီမှာ တက်နေတာ ဖြစ်နိုင်ပါတယ်
            alert("Login အောင်မြင်သော်လည်း Database ထဲတွင် အချက်အလက် မရှိသေးပါ။ (UID မကိုက်ခြင်း သို့မဟုတ် Doc မရှိခြင်း)");
            console.error("No Firestore document found for UID:", user.uid);
        }
    } catch (error) {
        console.error("Login Error:", error);
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