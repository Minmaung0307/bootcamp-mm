# ၁။ Smart Tooltip (နည်းပညာဝေါဟာရများ ရှင်းလင်းချက်)
စာသားထဲမှာပါတဲ့ ခက်ခဲတဲ့ စကားလုံးတွေအပေါ် Mouse တင်လိုက်ရင် ရှင်းလင်းချက်လေး ပေါ်လာတဲ့ပုံစံပါ။

```<p>ယနေ့သင်ခန်းစာမှာ <span class="tooltip">API<span class="tooltiptext">Application Programming Interface ဆိုသည်မှာ ဆော့ဖ်ဝဲလ်တစ်ခုနှင့်တစ်ခု ချိတ်ဆက်ပေးသော စနစ်ဖြစ်သည်။</span></span> အကြောင်းကို လေ့လာပါမည်။</p>
```

```
.tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 2px dotted var(--primary); /* စာသားအောက်မှာ အစက်လေးတွေဖော်ရန် */
    cursor: help;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 200px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* စာသားရဲ့အပေါ်မှာ ပေါ်ရန် */
    left: 50%;
    margin-left: -100px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 0.8rem;
    line-height: 1.4;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}
```

# ၂။ Immersive Mode (အာရုံစူးစိုက်ဖတ်ရှုရန် Focus Mode)
ဘေးက Sidebar နဲ့ Header တွေကို ဖျောက်ထားပြီး စာကိုပဲ အာရုံစိုက်ဖတ်နိုင်တဲ့ Mode ပါ။

```
function toggleImmersiveMode() {
    const wrapper = document.getElementById('wrapper');
    const sidebar = document.getElementById('sidebar');
    const btn = document.getElementById('immersive-btn');
    
    wrapper.classList.toggle('immersive-active');
    
    if (wrapper.classList.contains('immersive-active')) {
        btn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> Exit Focus';
    } else {
        btn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> Focus Mode';
    }
}
```

```
.immersive-active .sidebar { width: 0; overflow: hidden; opacity: 0; }
.immersive-active .main-content { margin-left: 0; width: 100%; }
.immersive-active .top-nav { display: none; }
```

# ၃။ Text-to-Speech (စာဖတ်ပြသည့်စနစ်)
ကျောင်းသားက စာမဖတ်ချင်ဘဲ နားထောင်ချင်တဲ့အခါ browser ကနေ မြန်မာလို (သို့မဟုတ် အင်္ဂလိပ်လို) ဖတ်ပြပေးမယ့် စနစ်ပါ။

```
<div class="audio-controls">
    <button onclick="speakLesson()" class="menu-btn"><i class="fas fa-play"></i> Listen</button>
    <button onclick="stopSpeaking()" class="menu-btn" style="background:#e11d48"><i class="fas fa-stop"></i> Stop</button>
</div>
```

```
function speakLesson() {
    const lessonText = document.getElementById('dynamic-body').innerText;
    const msg = new SpeechSynthesisUtterance();
    msg.text = lessonText;
    msg.lang = 'en-US'; // မြန်မာသံထွက် browser ပေါ်မူတည်၍ ရနိုင်သည်
    window.speechSynthesis.speak(msg);
}

function stopSpeaking() {
    window.speechSynthesis.cancel();
}
```

# ၄။ Learning Roadmap Stepper (အဆင့်ဆင့်ပြသသည့် စနစ်)
Assignment သို့မဟုတ် Project တစ်ခုကို လုပ်တဲ့အခါ အဆင့်ဘယ်လောက်ရောက်ပြီလဲဆိုတာ ပြပေးတာပါ။

```
<div class="stepper">
    <div class="step completed"><i class="fas fa-check"></i></div>
    <div class="step active">2</div>
    <div class="step">3</div>
    <div class="step">4</div>
</div>
```

```
.stepper {
    display: flex;
    justify-content: space-between;
    margin: 30px 0;
    position: relative;
}
.stepper::before {
    content: "";
    position: absolute;
    top: 15px; left: 0; width: 100%; height: 2px;
    background: #e2e8f0; z-index: 0;
}
.step {
    background: white;
    border: 2px solid #e2e8f0;
    width: 35px; height: 35px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    z-index: 1; font-weight: bold;
}
.step.active { border-color: var(--primary); color: var(--primary); }
.step.completed { background: var(--primary); color: white; border-color: var(--primary); }
```

# ၅။ Celebration Confetti (အောင်မြင်မှု ဂုဏ်ပြုလွှာ)
Quiz ဖြေပြီးတာနဲ့ ဒါမှမဟုတ် Assignment တင်ပြီးတာနဲ့ Screen ပေါ်မှာ စက္ကူပန်းလေးတွေ ကြဲပေးမယ့် စနစ်ပါ။ (ဒါက ကျောင်းသားကို အရမ်းပျော်ရွှင်စေပါတယ်)။

Installation:
index.html ရဲ့ <head> ထဲမှာ ဒီ Library လေး ထည့်လိုက်ပါ-

```
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
```

```
function celebrateSuccess() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}
```

# 💡 ဆရာများအတွက် ထပ်မံအကြံပြုချက် - "Reading Progress Indicator"
စာမျက်နှာကို အောက်ကို scroll ဆွဲသွားတဲ့အခါ အပေါ်ဆုံးမှာ စာဘယ်လောက် ရာခိုင်နှုန်းဖတ်ပြီးပြီလဲဆိုတာ ပြပေးတဲ့ Progress Bar လေးတစ်ခု ထည့်ထားရင် ကျောင်းသားက စာဘယ်လောက် ကျန်သေးလဲဆိုတာ သိနိုင်ပါတယ်။

```
window.onscroll = function() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
};
```

```
.progress-container-top {
  position: fixed; top: 0; left: 0; width: 100%; height: 4px; background: transparent; z-index: 3000;
}
.progress-bar-top {
  height: 4px; background: #22c55e; width: 0%;
}
```