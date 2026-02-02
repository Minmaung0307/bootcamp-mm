const allCourses = {
    "web": {
        id: "web", 
        title: "Full-Stack Web Development", 
        description: "Front-end မှ Back-end အထိ Website တစ်ခုလုံးကို စနစ်တကျ တည်ဆောက်နည်း။",
        benefits: ["React & Node.js Mastery", "Portfolio Project ၅ ခု", "Job Placement Support"],
        price: "50,000 MMK", 
        icon: "fa-code",
        data: [
            {
                category: "Foundations",
                modules: [
                    {
                        moduleTitle: "Module 0: Getting Started",
                        lessons: [
                            { title: "0.1.1: Welcome", 
                                type: "article", 
                                path: "/content/foundations/mod0/0.1.1-welcome.html" },
                            { title: "0.1.2: Basic Quiz", 
                                type: "quiz", 
                                path: "/content/foundations/mod0/0.1.2-quiz.json" },
                            { title: "0.1.3: Assignment 1", 
                                type: "assignment", 
                                path: "/content/foundations/mod0/0.1.3-assignment.html" },
                            { title: "Module 0 Project", 
                                type: "project", 
                                path: "/content/foundations/mod0/0.1.4-project.html" }
                        ]
                    }
                ]
            },
            { category: "Technical", modules: [ /* ... modules ... */ ] },
            { category: "Full-Stack", modules: [ /* ... modules ... */ ] }
        ]
    },
    "python": {
        id: "python", 
        title: "Python for Data Science", 
        description: "Data များအား ခွဲခြမ်းစိတ်ဖြာခြင်းနှင့် AI အခြေခံများကို လေ့လာလိုသူများအတွက်။",
        benefits: ["Data Visualization", "Automation Scripts", "Machine Learning Basics"],
        price: "60,000 MMK", 
        icon: "fa-python",
        data: [
            {
                category: "Foundations",
                modules: [
                    {
                        moduleTitle: "Module 1: Python Basics",
                        lessons: [
                            { title: "1.1.1: Intro to Python", 
                                type: "article", 
                                path: "/content/python/mod1/intro.html" },
                            { title: "Python Quiz 1", 
                                type: "quiz", 
                                path: "/content/python/mod1/quiz1.json" },
                            { title: "Python Logic Assignment", 
                                type: "assignment", 
                                path: "/content/python/mod1/assign1.html" }
                        ]
                    }
                ]
            }
        ]
    },
    "design": {
        id: "design", 
        title: "UI/UX Professional Design", 
        description: "အသုံးပြုသူ စိတ်ကျေနပ်မှုရှိစေမည့် Website နှင့် App ဒီဇိုင်းများ ဖန်တီးနည်း။",
        benefits: ["Figma Advanced Tools", "User Research Method", "High-fidelity Prototyping"],
        price: "45,000 MMK", 
        icon: "fa-palette",
        data: [
            {
                category: "Technical",
                modules: [
                    {
                        moduleTitle: "Module 1: Figma Masterclass",
                        lessons: [
                            { title: "1.1.1: Auto Layout", 
                                type: "article", 
                                path: "/content/design/mod1/autolayout.html" },
                            { title: "Design Project 1", 
                                type: "project", 
                                path: "/content/design/mod1/project1.html" }
                        ]
                    }
                ]
            }
        ]
    }
};