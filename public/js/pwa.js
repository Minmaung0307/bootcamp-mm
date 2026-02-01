// ၁။ Service Worker Register လုပ်ခြင်း
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(() => console.log("Service Worker Registered"));
}

// ၂။ Install Prompt စီမံခြင်း
let deferredPrompt;
const installArea = document.getElementById('install-area');
const btnInstall = document.getElementById('btn-install');

window.addEventListener('beforeinstallprompt', (e) => {
    // Chrome 80 အောက် ဗားရှင်းများအတွက် အလိုအလျောက် ပေါ်တာကို တားဆီးရန်
    e.preventDefault();
    deferredPrompt = e;
    // Install လုပ်လို့ရပြီဖြစ်ကြောင်း ခလုတ်ကို ပြမည်
    if (installArea) installArea.style.display = 'block';
});

if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            installArea.style.display = 'none';
        }
    });
}

// ၃။ Install လုပ်ပြီးသားဖြစ်ပါက ခလုတ်ဖျောက်ထားရန်
window.addEventListener('appinstalled', () => {
    installArea.style.display = 'none';
    console.log('PWA was installed');
});