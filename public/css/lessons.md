# (က) REWIND သို့မဟုတ် NERD NOTE ထည့်ရန်
```<div class="callout-box">
    <div class="callout-icon bg-rewind">
        <i class="fas fa-backward"></i>
    </div>
    <div class="callout-content">
        <h4>REWIND</h4>
        <p>အရင်သင်ခန်းစာက လေ့လာခဲ့တဲ့ index.html အကြောင်းကို ပြန်စဉ်းစားကြည့်ပါ။</p>
    </div>
</div>
```

# (ခ) SHOW HINT (နှိပ်မှ အဖြေပေါ်မည့်ပုံစံ)
```<div class="lms-accordion" onclick="toggleAccordion('hint-1')">
    <i class="fas fa-comment-dots"></i>
    <span style="font-weight:bold; color:#004d85; text-decoration:underline;">SHOW HINT</span>
</div>
<div id="hint-1" class="accordion-body">
    <p>HTML elements တွေကို indent (နေရာချန်) ရေးတာဟာ ကုဒ်တွေကို ဖတ်ရလွယ်ကူစေဖို့ ဖြစ်ပါတယ်။</p>
</div>
```

# (ဂ) DEEP DIVE (အသေးစိတ် လေ့လာရန်)
```<div class="deep-dive-btn" onclick="toggleAccordion('deep-dive-1')">
    DEEP DIVE <i class="fas fa-chevron-down"></i>
</div>
<div id="deep-dive-1" class="accordion-body">
    <p>ဒီနေရာမှာ HTML5 ရဲ့ Semantic Elements တွေအကြောင်း အသေးစိတ် ရှင်းလင်းချက်တွေ ထည့်သွင်းနိုင်ပါတယ်။</p>
</div>
```

# (ဃ) Code Block ထည့်ရန်
```<div class="code-window">
    <pre>
&lt;header&gt;
    &lt;h1&gt;RUN BUDDY&lt;/h1&gt;
&lt;/header&gt;
    </pre>
</div>
```

# app.js တွင် Accordion အလုပ်လုပ်စေရန် Helper Function ထည့်ပါ
```// Accordion ပိတ်/ဖွင့် လုပ်ပေးမည့် function
function toggleAccordion(id) {
    const el = document.getElementById(id);
    if (el.style.display === "block") {
        el.style.display = "none";
    } else {
        el.style.display = "block";
    }
}
```

# ဆရာများအတွက် အကြံပြုချက် (စုံစုံလင်လင် ဖြစ်စေရန်)
၁။ External Icons: Link တွေရဲ့ ဘေးမှာ ပုံထဲကလို box လေးနဲ့ မြှားပုံလေး ပေါ်ချင်ရင် fas fa-external-link-alt ဆိုတဲ့ FontAwesome icon ကို သုံးပါ။
၂။ Video Player: ပုံထဲကလို Video တွေ ထည့်ချင်ရင် YouTube Embed ကုဒ်ကို သုံးပြီး video-box class ထဲမှာ ထည့်ပါ။
၃။ Pro Tip: "LEGACY LORE" လိုမျိုး Badge လေးတွေကို စာပိုဒ်ရဲ့ အပေါ်ထောင့်မှာ ကပ်ထားချင်ရင် position: absolute ကို သုံးပြီး အလှဆင်နိုင်ပါတယ်။
အခုပေးလိုက်တဲ့ Component တွေနဲ့ဆိုရင် သင့်ရဲ့ သင်ခန်းစာတွေဟာ Columbia Bootcamp က စာမျက်နှာတွေအတိုင်း Professional ကျကျနဲ့ အလွန်ကြည့်ကောင်းသွားမှာ ဖြစ်ပါတယ်! အဆင်မပြေတာရှိရင် ထပ်မေးနိုင်ပါတယ်ခင်ဗျာ။

# HTML ပုံစံ (သင်ခန်းစာဖိုင်ထဲမှာ ထည့်ရန်)
href ထဲမှာ ဖိုင်ရှိတဲ့ လမ်းကြောင်းကို ထည့်ပါ၊ download attribute ထည့်ထားရင် ကျောင်းသားက နှိပ်လိုက်တာနဲ့ browser က ဖိုင်ကို တန်းပြီး download ချပေးပါလိမ့်မယ်။
```<div class="virtual-class-section">
    <h3>Virtual Class 1</h3>
    <p>အတန်းမစတင်မီ အောက်ပါ ဖိုင်များကို download ရယူထားပါ -</p>
    
    <ul class="download-links">
        <li>
            <a href="/content/files/01-HTML.zip" download>
                01-HTML <i class="fas fa-external-link-alt"></i>
            </a>
        </li>
        <li>
            <a href="/content/files/02-Attributes.zip" download>
                02-Attributes <i class="fas fa-external-link-alt"></i>
            </a>
        </li>
        <li>
            <a href="/content/files/git-guide.pdf" download>
                Git Guide <i class="fas fa-external-link-alt"></i>
            </a>
        </li>
    </ul>
</div>
```

# သိထားသင့်တဲ့ အချက်များ
၁။ ဖိုင်သိမ်းဆည်းမည့်နေရာ: Download ပေးမယ့် .zip ဒါမှမဟုတ် .pdf ဖိုင်တွေကို သင့်ရဲ့ public/content/files/ ဆိုတဲ့ folder ထဲမှာ စနစ်တကျ ထည့်ထားပေးဖို့ လိုပါတယ်။
၂။ အိုင်ကွန်: ပုံထဲက မြှားပုံစံ အိုင်ကွန်လေးက FontAwesome ရဲ့ fas fa-external-link-alt ဖြစ်ပါတယ်။ ကျွန်တော်တို့ အရင်က ထည့်ထားတဲ့ FontAwesome link ကြောင့် ဒါက အလိုအလျောက် အလုပ်လုပ်ပါလိမ့်မယ်။
၃။ အကြံပြုချက်: ဖိုင်တွေက အရမ်းများလာရင် (ဥပမာ- တစ်တန်းလုံးစာ Activity files တွေဆိုရင်) တစ်ခုချင်းစီ ပေးမယ့်အစား .zip တစ်ခုတည်း ချုပ်ပြီး ပေးတာက ကျောင်းသားအတွက် ပိုအဆင်ပြေပါတယ်။
ဒီနည်းအတိုင်း သင့်ရဲ့ content/*.html ဖိုင်တွေထဲမှာ ထည့်သွင်းအသုံးပြုနိုင်ပါပြီခင်ဗျာ။ အဆင်မပြေတာရှိရင် ထပ်မေးနိုင်ပါတယ်။

# သင်ခန်းစာ HTML ဖိုင်ထဲတွင် အသုံးပြုပုံ (content/*.html)
သင်ခန်းစာဖိုင်အသစ်တိုင်းရဲ့ အပေါ်ဆုံးမှာ ဒီ HTML ကုဒ်လေးကို ကူးထည့်ပေးရုံပါပဲ။ အိုင်ကွန်လေးတွေကို FontAwesome သုံးပြီး စိတ်ကြိုက်ပြောင်းလဲနိုင်ပါတယ်။

```<div class="lesson-banner no-print">
    <!-- နောက်ခံ Icon များ -->
    <div class="banner-bg-icons">
        <div class="icon-circle"><i class="fas fa-code"></i></div>
        <div class="icon-circle" style="opacity: 0.4;"><i class="fas fa-drafting-compass"></i></div>
        <div class="icon-circle"><i class="fas fa-code-branch"></i></div>
        <div class="icon-circle" style="opacity: 0.6;"><i class="fas fa-laptop-code"></i></div>
        <div class="icon-circle"><i class="fas fa-project-diagram"></i></div>
    </div>

    <!-- ရှေ့က Bar လေး -->
    <div class="lesson-info-bar">
        <div class="lesson-id-badge">1.1.4</div>
        <div class="lesson-banner-title">Add a Little HTML</div>
    </div>
</div>

<!-- ဒီအောက်မှာမှ သင်ခန်းစာ စာသားများ ဆက်ရေးပါ -->
<p>HTML အကြောင်းကို အခုမှ စတင်လေ့လာကြရအောင်...</p>
```

# ဒါကို ဘယ်လို အကျိုးရှိရှိ သုံးမလဲ?
၁။ Dynamic ဖြစ်ချင်ရင်: အကယ်၍ သင်ခန်းစာတိုင်းမှာ ဒီ Header ကို ကိုယ်တိုင်လိုက်မရေးချင်ဘူးဆိုရင် app.js ထဲက renderLessonContent မှာ အလိုအလျောက် ပေါင်းထည့်ခိုင်းလို့ရပါတယ်။ ဒါပေမယ့် ပုံထဲကအတိုင်း Icon လေးတွေက တစ်ခန်းနဲ့တစ်ခန်း မတူဘဲ ပြောင်းချင်ရင်တော့ HTML ဖိုင်ထဲမှာပဲ ရေးတာက ပိုပြီး စိတ်ကြိုက်ပြင်လို့ ရပါတယ်။
၂။ Icons များ:
<i class="fas fa-code"></i> (ကုဒ်သင်္ကေတ)
<i class="fas fa-drafting-compass"></i> (ဒီဇိုင်း/ပေတံသင်္ကေတ)
<i class="fas fa-code-branch"></i> (Git branch သင်္ကေတ)
အစရှိသဖြင့် FontAwesome ကနေ ရှာပြီး icon-circle ထဲမှာ အစားထိုးနိုင်ပါတယ်။
၃။ Responsive: အခု CSS က Mobile မှာကြည့်ရင် စာသားတွေ ဆံ့အောင် အလိုအလျောက် ညှိပေးပါလိမ့်မယ်။
ဒီ Banner လေး ပါဝင်သွားတာနဲ့ သင့်ရဲ့ သင်ခန်းစာစာမျက်နှာတွေဟာ Columbia Bootcamp က စာမျက်နှာတွေအတိုင်း High-end UI ဖြစ်သွားပါလိမ့်မယ်။ အဆင်မပြေတာရှိရင် ထပ်မေးနိုင်ပါတယ်ခင်ဗျာ။

# Icon လေးတွေကို Box တစ်ခုရဲ့ ဘောင် (Border) ပေါ်မှာ ဒါမှမဟုတ် စိတ်ကြိုက်နေရာတွေမှာ တိတိကျကျ တင်ချင်ရင် CSS ရဲ့ "Absolute Positioning" စနစ်ကို သုံးရပါတယ်။
အဓိက နည်းလမ်းကတော့ -
Parent (အုပ်ထိန်းသူ Box) ကို position: relative; ပေးရမယ်။ (ဒါမှ Icon က ဒီ Box ထဲကနေ ထွက်မသွားမှာပါ)
Child (Icon လေး) ကို position: absolute; ပေးပြီး top, left, right, bottom တန်ဖိုးတွေနဲ့ နေရာချရပါတယ်။

## ၁။ REWIND Box ပုံစံ (Icon ကို ဘေးဘောင်ပေါ် တင်ခြင်း)
ဒီပုံစံမှာ Icon က Box ရဲ့ ဘယ်ဘက်ဘောင်ပေါ်မှာ တည့်တည့် တင်နေတာဖြစ်လို့ left တန်ဖိုးကို Negative (အနှုတ်) သုံးပြီး အပြင်ကို ထုတ်ရပါတယ်။
```<div class="rewind-box">
    <div class="rewind-icon">
        <i class="fas fa-backward"></i>
    </div>
    <div class="content">
        <h4>REWIND</h4>
        <hr>
        <p>သင်ခန်းစာဟောင်းကို ပြန်လည်အမှတ်ရစေဖို့ ဖြစ်ပါတယ်။</p>
    </div>
</div>
```

```
.rewind-box {
    position: relative; /* အဓိက အချက် */
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 20px 20px 20px 40px; /* ဘယ်ဘက်မှာ Icon အတွက် နေရာချန်ထားခြင်း */
    margin: 40px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.rewind-icon {
    position: absolute; /* အဓိက အချက် */
    left: -25px; /* Icon ရဲ့ width တစ်ဝက်လောက်ကို အပြင်ထုတ်လိုက်တာပါ */
    top: 50%;
    transform: translateY(-50%); /* ဒေါင်လိုက် အလယ်တည့်တည့်ဖြစ်အောင် ညှိခြင်း */
    
    width: 50px;
    height: 50px;
    background: #58a65c; /* အစိမ်းရောင် */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
}
```

## ၂။ CONNECT THE DOTS ပုံစံ (Icon ကို ထောင့်စွန်း သို့မဟုတ် အပေါ်ဘောင်မှာ တင်ခြင်း)
ဒီပုံစံမှာ Icon ကို top မှာ အနှုတ်တန်ဖိုးပေးပြီး အပေါ်ဘောင်ပေါ် တင်ပါမယ်။

```<div class="connect-box">
    <div class="dot-icon"></div>
    <h4>CONNECT THE DOTS</h4>
    <p>အချက်အလက်များကို ချိတ်ဆက်စဉ်းစားကြည့်ပါ။</p>
</div>
```

```
.connect-box {
    position: relative;
    background: #f1f5f9;
    border-left: 10px solid #58a65c; /* ဘယ်ဘက်ဘောင်အထူး */
    padding: 30px 20px;
    margin-top: 50px; /* အပေါ်က Icon ထွက်နေဖို့ နေရာချန်ရမည် */
}

.dot-icon {
    position: absolute;
    top: -20px; /* အပေါ်ဘောင်ပေါ် တင်လိုက်ခြင်း */
    left: -20px; /* ဘယ်ဘက်ဘောင်နဲ့ တည့်အောင် ညှိခြင်း */
    
    width: 40px;
    height: 40px;
    background: white;
    border: 6px solid #58a65c;
    border-radius: 50%;
}
```

## နေရာချထားခြင်းဆိုင်ရာ လမ်းညွှန် (Cheat Sheet)
သင်က Icon ကို ဘယ်နေရာမှာ ထားချင်သလဲဆိုတာပေါ် မူတည်ပြီး ဒီတန်ဖိုးတွေကို ကစားကြည့်ပါ-
ဘယ်ဘက်အလယ် (Center-Left): left: -25px; top: 50%; transform: translateY(-50%);
ညာဘက်အပေါ်ထောင့် (Top-Right): right: -15px; top: -15px;
အပေါ်အလယ်တည့်တည့် (Top-Center): top: -25px; left: 50%; transform: translateX(-50%);
အောက်ဘက် (Bottom-Right): bottom: -20px; right: 20px;
အရေးကြီးတဲ့ အချက်
Icon ကို အပြင်ဘက်ကို အနှုတ်တန်ဖိုးနဲ့ ထုတ်လိုက်တဲ့အခါ Box ရဲ့ ဘေးမှာရှိတဲ့ စာသားတွေနဲ့ သွားမထပ်အောင် Box ရဲ့ margin တန်ဖိုးကို (ဥပမာ margin-left: 40px;) လုံလောက်အောင် ပေးထားဖို့ လိုအပ်ပါတယ်။
ဒီနည်းလမ်းကို သုံးပြီး သင်ခန်းစာArticle ထဲက Callout Box လေးတွေကို Columbia Bootcamp ပုံစံအတိုင်း စိတ်ကြိုက် နေရာချနိုင်ပါပြီ။ အဆင်မပြေတာရှိရင် ထပ်မေးပါဦးခင်ဗျာ။

# ဒီလိုဒီဇိုင်းမျိုးကို "Floating Label Box" လို့ ခေါ်ပါတယ်။ 
အဓိက နည်းစနစ်က Box အကြီးကို position: relative ပေးပြီး၊ ခေါင်းစဉ် (Label) လေးကို position: absolute နဲ့ အပေါ်ထောင့်ကို တင်လိုက်တာပါ။ ခေါင်းစဉ်ရဲ့နောက်ခံကို အဖြူရောင် (သို့မဟုတ် Box ရဲ့ အပြင်ဘက်အရောင်) ပေးထားရင် ဘောင်ကို ဖြတ်သွားတဲ့ ပုံစံမျိုး ထွက်လာပါလိမ့်မယ်။

```<div class="lore-box">
    <!-- Floating Label -->
    <div class="lore-title">LEGACY LORE</div>
    
    <!-- Content Area -->
    <div class="lore-content">
        Historically, the most common name for the main body of a codebase has been <code>master</code>. 
        Recently, however, <code>main</code> has been gaining in popularity. In fact, GitHub now uses 
        <code>main</code> as the default name for its repositories...
    </div>
</div>
```

```
/* --- Lore Box Style --- */
.lore-box {
    position: relative; /* Label ကို နေရာချရန် အခြေခံ */
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 30px 25px 20px 25px; /* အပေါ်ဘက်တွင် Label အတွက် padding ပိုပေးထားသည် */
    margin: 40px 0;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); /* ပုံထဲကလို shadow အိအိလေး */
}

/* Floating Title Label */
.lore-title {
    position: absolute;
    top: -15px;      /* အပေါ်ဘောင်ကို ဖြတ်တက်ရန် */
    left: 10px;      /* ဘယ်ဘက်မှ အနည်းငယ် ခွာရန် */
    background-color: white; /* အဓိကအချက်: ဘောင်ကို ဖုံးသွားစေရန် */
    padding: 5px 15px;
    color: #0073b1;  /* Columbia Blue ပုံစံ */
    font-weight: bold;
    font-size: 0.9rem;
    letter-spacing: 1px;
    border: 1px solid var(--border-color);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.05);
}

/* Dark Mode အတွက် ချိန်ညှိခြင်း */
body.dark-theme .lore-title {
    background-color: var(--card-bg);
    color: var(--primary);
}

/* --- Inline Code Style (master, main စာသားလေးများအတွက်) --- */
code {
    background-color: #fdf2f2;
    color: #c0392b;
    border: 1px solid #f5c6cb;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9rem;
}

body.dark-theme code {
    background-color: #442727;
    color: #ff8787;
    border-color: #633;
}
```

## ဒီဇိုင်းရဲ့ ထူးခြားချက်များ
၁။ Top Offset (top: -15px): ဒါက ခေါင်းစဉ်လေးကို အပေါ်ဘောင်ရဲ့ အလယ်တည့်တည့်မှာ တင်ပေးလိုက်တာပါ။
၂။ Background Color: ခေါင်းစဉ်မှာ background-color: white (သို့မဟုတ် Dark mode မှာ var(--card-bg)) ထည့်ထားတဲ့အတွက် အနောက်က Box ရဲ့ ဘောင် (Border) စာကြောင်းကို ကွယ်သွားစေပြီး "ချိုင့်ဝင်နေတဲ့" ပုံစံကို ရစေတာပါ။
၃။ Inline Code: <code> tag ကို သုံးပြီး master, main စာသားလေးတွေကို ပုံထဲကအတိုင်း ပန်းရောင်သန်းတဲ့ ဘောင်လေးတွေနဲ့ ဖြစ်အောင် လုပ်ထားပါတယ်။
အခုနည်းလမ်းက Columbia Bootcamp မှာသုံးတဲ့ Callout Box တွေအတိုင်း တိတိကျကျ ထွက်လာပါလိမ့်မယ်။ နောက်ထပ် ပုံစံဆန်းတွေ လိုချင်ရင်လည်း ထပ်မေးနိုင်ပါတယ်ခင်ဗျာ။

# အခုလို Terminal (Command Prompt) ပုံစံမျိုးကို CSS နဲ့ အရမ်းတူအောင် လုပ်လို့ရပါတယ်။ 
ပုံထဲမှာပါတဲ့ အမည်းရောင်နောက်ခံ၊ စာလုံးအဖြူနဲ့ git status ရိုက်ရင်ပေါ်လာတဲ့ ဖိုင်နာမည်အနီရောင်တွေကိုပါ စနစ်တကျ ဖန်တီးနည်းကို ရေးပေးလိုက်ပါတယ်။

```<div class="terminal-window">
    <div class="terminal-content">
<span class="t-prompt">$</span><span class="t-command">git status</span>
On branch main

No commits yet

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)

        <span class="t-red">index.html</span>

nothing added to commit but untracked files present (use "git add" to track)
    </div>
</div>
```

```
/* --- Terminal Window Style --- */
.terminal-window {
    background-color: #000000; /* အနက်ရောင်နောက်ခံ */
    border: 2px solid #333;
    border-radius: 6px;
    padding: 20px;
    margin: 25px 0;
    font-family: 'Courier New', Courier, monospace; /* Terminal စာလုံးပုံစံ */
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    position: relative;
    overflow: hidden;
}

/* ပုံထဲကလို Double Border ပုံစံဖြစ်အောင် အထဲက box တစ်ခုထပ်ထည့်ခြင်း */
.terminal-content {
    border: 1px solid #ffffff; /* အတွင်းက အဖြူရောင်ဘောင်လေး */
    padding: 15px;
    color: #ffffff; /* စာလုံးအဖြူရောင် */
    line-height: 1.6;
    font-size: 0.95rem;
    white-space: pre-wrap; /* Whitespace တွေကို ထိန်းသိမ်းရန် */
}

/* Terminal ထဲက အရောင်ခွဲခြားမှုများ */
.t-command { color: #ffffff; font-weight: bold; } /* Command စာသား */
.t-red { color: #e74c3c; } /* ဖိုင်နာမည် အနီရောင် (Untracked files) */
.t-gray { color: #95a5a6; } /* မှတ်ချက်စာသားများ */

/* ပုံထဲကလို $ sign လေးကို ခွဲခြားချင်ရင် */
.t-prompt { color: #ffffff; margin-right: 8px; }
```

# IMPORTANT Box (ပုံရဲ့ အောက်ခြေမှာ ပါတဲ့ပုံစံ)
ပုံထဲမှာပါတဲ့ အပြာရောင်ဘောင်နဲ့ IMPORTANT box လေးကိုလည်း အပိုလက်ဆောင်အနေနဲ့ ရေးပေးလိုက်ပါတယ်။

```<div class="important-callout">
    <div class="important-label">IMPORTANT</div>
    <div class="important-text">
        macOS users, if you see a <code>.DS_Store</code> file in there as well, ignore it for now. 
        You'll learn more about this file later in this lesson.
    </div>
</div>
```

```
.important-callout {
    display: flex;
    margin: 30px 0;
    border-left: 5px solid #3498db;
    background-color: #f8fbff;
}

.important-label {
    background-color: transparent;
    border: 2px solid #3498db;
    color: #3498db;
    padding: 5px 15px;
    font-weight: bold;
    font-size: 0.85rem;
    height: fit-content;
    margin: 15px;
    text-transform: uppercase;
}

.important-text {
    padding: 15px 15px 15px 0;
    color: #2c3e50;
    line-height: 1.6;
}
```

## အကြံပြုချက်-
Whitespace: <div class="terminal-content"> ရဲ့ အောက်မှာ စာကို ရိုက်တဲ့အခါ tab ဒါမှမဟုတ် space တွေက အရေးကြီးပါတယ်။ <pre> tag ကို မသုံးဘဲ white-space: pre-wrap သုံးထားတာကြောင့် စာရိုက်တဲ့အတိုင်း ပုံပေါ်မှာပါ။
Copy Button: နောက်ပိုင်းမှာ ကျောင်းသားတွေ ကုဒ်ကို လွယ်လွယ်ကူကူ ကူးလို့ရအောင် Terminal window ရဲ့ ညာဘက်အပေါ်ထောင့်မှာ "Copy" ဆိုတဲ့ ခလုတ်လေး တစ်ခု ထည့်ပေးထားရင် ပိုပြီး Professional ဆန်သွားပါလိမ့်မယ်။
အခုပေးလိုက်တဲ့ ဒီဇိုင်းတွေက သင့်ရဲ့ Bootcamp ကို တကယ့် developer environment တစ်ခုလို ခံစားရစေမှာပါ! အဆင်မပြေတာရှိရင် ပြန်ပြောပေးပါဦး။

# ဒီလိုမျိုး စာသားလေးတွေကို စာကြောင်းတွေရဲ့ ကြားထဲမှာပဲ (Inline) ပုံစံထုတ်တာကို "Inline Code Snippets" လို့ ခေါ်ပါတယ်။ 
ဒါကို HTML ရဲ့ <code> tag ကို သုံးပြီး CSS နဲ့ အခုလို အလှဆင်လို့ ရပါတယ်။

```<p>
    ကျွန်တော်တို့ အခုပဲ <code>index.html</code> ဖိုင်ကို ဆောက်လိုက်ပါပြီ။
    ပြီးရင်တော့ <code>run-buddy</code> ဆိုတဲ့ folder ကို VS Code နဲ့ ဖွင့်လိုက်ပါ။
    Command line မှာဆိုရင် <code>code .</code> လို့ ရိုက်ပြီး ဖွင့်နိုင်ပါတယ်။
</p>
```

```
/* --- Inline Code Style (စာကြောင်းကြားထဲက ကုဒ်များအတွက်) --- */
code {
    background-color: #fdf2f2; /* နောက်ခံ ပန်းရောင်နုလေး */
    color: #c0392b;           /* စာသား အနီရောင်ရင့် */
    border: 1px solid #f5c6cb; /* ဘောင်လေး ခတ်ထားခြင်း */
    padding: 2px 6px;          /* ဘေးပတ်ပတ်လည် နေရာချန်ခြင်း */
    border-radius: 4px;        /* ထောင့်လေးတွေ အနည်းငယ်ဝိုင်းရန် */
    font-family: 'Courier New', Courier, monospace; /* ကုဒ်စာလုံးပုံစံ */
    font-size: 0.9rem;
    word-break: break-word;    /* စာကြောင်းရှည်ရင် အဆင်ပြေစေရန် */
}

/* --- Dark Mode အတွက် ပြင်ဆင်ချက် --- */
body.dark-theme code {
    background-color: #442727; /* ပိုမှောင်သော အနီရောင်နောက်ခံ */
    color: #ff8787;           /* ပိုလင်းသော အနီရောင်စာသား */
    border-color: #633;        /* ဘောင်အရောင်ကိုလည်း မှောင်ပေးရမည် */
}
```

# နောက်ထပ် ပုံစံဆန်း (External Link အိုင်ကွန်လေးပါ ထည့်ချင်ရင်)
ပုံထဲက "article on launching..." ဆိုတဲ့နေရာမှာ ဘေးက box လေးနဲ့ မြှားပုံစံ အိုင်ကွန်လေးကို link တစ်ခုချင်းစီမှာ လိုက်မထည့်ချင်ရင် CSS နဲ့ အလိုအလျောက် ထည့်ခိုင်းလို့ ရပါတယ်။

```<a href="#" class="external-link">article on launching VS Code from the command line</a>
```

```
.external-link {
    color: var(--primary);
    text-decoration: underline;
}

/* Link ရဲ့ အနောက်မှာ အိုင်ကွန်ကို အလိုအလျောက် ပေါင်းထည့်ခြင်း */
.external-link::after {
    content: "\f35d"; /* FontAwesome ရဲ့ external link icon code */
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
    margin-left: 5px;
    font-size: 0.8rem;
    text-decoration: none;
    display: inline-block;
}
```

## အနှစ်ချုပ် ရှင်းလင်းချက်
<code> tag: စာကြောင်းကြားထဲမှာ တတန်းတည်း (Inline) ပေါ်စေဖို့ သုံးပါတယ်။
border-radius: ထောင့်တွေကို ချောမွေ့သွားစေပါတယ်။
padding: စာသားနဲ့ ဘောင်ကို မကပ်သွားအောင် နေရာလွတ် ပေးထားတာပါ။
အခု ဒီ CSS ကို style.css ထဲ ထည့်လိုက်တာနဲ့ သင့်ရဲ့ သင်ခန်းစာတွေဟာ Columbia Bootcamp က စာမျက်နှာတွေအတိုင်း စနစ်တကျနဲ့ ဖတ်ရတာ အရမ်းကောင်းသွားပါလိမ့်မယ်။

# ဗီဒီယိုသင်ခန်းစာတွေကို နာမည်တံဆိပ် (Label) လေးတွေနဲ့ စနစ်တကျ ပြသနိုင်ဖို့အတွက် Video Wrapper ပုံစံမျိုးကို HTML/CSS နဲ့ ဖန်တီးရပါမယ်။
ကျောင်းသားတွေအနေနဲ့ ဗီဒီယိုခေါင်းစဉ်ကို ကြည့်ပြီး ဘာအကြောင်းအရာလဲဆိုတာ ချက်ချင်းသိနိုင်အောင်နဲ့ နှိပ်လိုက်ရင် တန်းပွင့်လာအောင် အောက်ပါအတိုင်း ပြုလုပ်နိုင်ပါတယ်။

```<div class="video-lesson-container">
    <p>အောက်ပါ <span class="video-tag-label"><i class="fas fa-video"></i> Git Guide</span> ဗီဒီယိုကို ကြည့်ရှုပြီး လိုက်နာဆောင်ရွက်ပါ။</p>
    
    <div class="video-wrapper">
        <!-- YouTube Embed Link ကို ဒီနေရာတွင် ထည့်ပါ -->
        <iframe 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Video lesson" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    </div>
</div>
```

```
/* --- Video Section Styling --- */
.video-lesson-container {
    margin: 30px 0;
}

/* ဗီဒီယိုအပေါ်က နာမည်တံဆိပ် (Label) လေး */
.video-tag-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: #cbd5e1; /* ခဲရောင်ဖျော့ */
    color: #475569;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid #94a3b8;
    margin-bottom: 15px;
}

/* Dark Mode အတွက် Label အရောင်ပြောင်းရန် */
body.dark-theme .video-tag-label {
    background-color: #334155;
    color: #f1f5f9;
    border-color: #475569;
}

/* ဗီဒီယိုဘောင် (Aspect Ratio 16:9 ဖြစ်စေရန်) */
.video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 ratio */
    height: 0;
    overflow: hidden;
    border-radius: 12px;
    background: #000;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15); /* Shadow လေးထည့်ထားသည် */
}

.video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
}
```

## ဒီစနစ်ရဲ့ ထူးခြားချက်များ
၁။ Video Label: ပုံထဲကအတိုင်း video-tag-label ဆိုတဲ့ class က ဗီဒီယိုနာမည်လေးကို box လေးနဲ့ သေသပ်စွာ ပြပေးပါမယ်။ fas fa-video icon က ပိုပြီး ပညာရှင်ဆန်စေပါတယ်။
၂။ Aspect Ratio: video-wrapper က ဗီဒီယိုကို ကွန်ပျူတာမှာကြည့်ကြည့်၊ ဖုန်းမှာကြည့်ကြည့် ဘေးမမည်းဘဲ (သို့မဟုတ်) အချိုးမပျက်ဘဲ ၁၆:၉ (Wide Screen) အချိုးအတိုင်း အမြဲတမ်း ရှင်းလင်းစွာ ပြပေးမှာပါ။
၃။ User Interaction: ကျောင်းသားက ဗီဒီယိုပေါ်က Play ခလုတ်ကို နှိပ်လိုက်တာနဲ့ စာမျက်နှာထဲမှာတင် တန်းပွင့်လာမှာဖြစ်လို့ သင်ယူမှု အရှိန်မပြတ်စေပါဘူး။
၄။ Shadow Effect: ဗီဒီယိုဘောင်မှာ Shadow (အရိပ်) ထည့်ထားတဲ့အတွက် သင်ခန်းစာ စာသားတွေကြားမှာ ဗီဒီယိုက ပိုပြီး ပေါ်လွင်နေပါလိမ့်မယ်။

အကယ်၍ သင့်ဗီဒီယိုတွေကို YouTube မှာ မတင်ဘဲ ကိုယ်ပိုင် Server (Firebase Storage) ပေါ်မှာ တင်ထားတာဆိုရင် <iframe> အစား အောက်ပါအတိုင်း <video> tag ကို သုံးနိုင်ပါတယ်-
```<div class="video-wrapper">
    <video controls poster="assets/video-thumbnail.jpg">
        <source src="your-firebase-video-link.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
</div>
```