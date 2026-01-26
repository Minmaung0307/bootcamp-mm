const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');
const closeBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');

function openNav() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
}

function closeNav() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

toggleBtn.addEventListener('click', openNav);
closeBtn.addEventListener('click', closeNav);
overlay.addEventListener('click', closeNav); // Main page ကို နှိပ်ရင် ပိတ်မယ်