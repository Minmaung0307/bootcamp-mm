const bootcampMMData = {
    id: "bootcamp-mm",
    title: "BootCamp-MM (Full-Stack)",
    instructor: "Ashin Panna",
    description: "Foundation မှ Full-Stack အထိ စနစ်တကျ သင်ကြားပေးမည့် Bootcamp",
    benefits: ["25+ Modules", "LMS Access", "Transcript & Certificate"],
    price: "70,000 MMK",
    icon: "fa-graduation-cap",
    transcriptSubjects: ["html", "css", "javascript", "react", "nodejs", "python"],
    
    resources: {
        "Foundations": [
            { name: "Git & GitHub Guide", url: "/content/files/git-guide.pdf", icon: "fa-git-alt" },
            { name: "HTML5 Elements List", url: "https://developer.mozilla.org/...", icon: "fa-html5" }
        ],
        "Technical": [
            { name: "JS ES6+ Cheat Sheet", url: "/content/files/js-cheatsheet.pdf", icon: "fa-js" },
            { name: "CSS Grid Interactive", url: "https://cssgrid-generator.netlify.app/", icon: "fa-border-all" }
        ],
        "Full-Stack": [
            { name: "Express.js Documentation", url: "https://expressjs.com/", icon: "fa-server" },
            { name: "Firebase Rules Guide", url: "https://firebase.google.com/docs/rules", icon: "fa-shield-alt" }
        ]
    },

    // 🔥 သင်ရိုးမာတိကာ (၃ ပိုင်းခွဲထားသည်)
    data: [
        {
            category: "Foundations", // Module 0 to 8
            modules: [
                {
                    moduleTitle: "Module 0: Getting Started",
                    lessons: [
                        { 
                            title: "0.1: Welcome", 
                            type: "article", 
                            path: "/content/bootcamp-mm/foundation/mod0/l1:intro.html"
                        },
                        { title: "0.2: Overview", type: "article", path: "/content/bootcamp-mm/foundation/mod0/l2:overview.html" },
                        { title: "0.3: Roadmap", type: "article", path: "/content/bootcamp-mm/foundation/mod0/l3:roadmap.html" },
                        { title: "0.4: Welcome", type: "article", path: "/content/bootcamp-mm/foundation/mod0/l4:up&running.html" },
                        { title: "0.1.2: Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod0/0.1.2.json" }
                    ]
                },
                {
                    moduleTitle: "Module 1: HTML CSS and Git",
                    lessons: [
                        { title: "0.1: Introduction to HTML", type: "article", path: "/content/bootcamp-mm/foundation/mod1/intro.html" },
                        { title: "0.2: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l1:set-up-project.html" },
                        { title: "0.3: Header and Footer", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l2:header-footer.html" },
                        { title: "0.4: Create Hero Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l3:create-hero.html" },
                        { title: "0.5: Main Content Sections", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l4:main-content-sections.html" },
                        { title: "0.6: Meet the Trainers", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l5:meet-trainers.html" },
                        { title: "0.7: Create Contact Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l6:contact-section.html" },
                        { title: "0.8: Create Privacy Policy", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l7:privacy-policy.html" },
                        { title: "0.9: Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod1/weekly-challenge.html" },
                        { title: "0.10: Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod1/0.1.2.json" }
                    ]
                },
                {
                    moduleTitle: "Module 1: HTML CSS and Git",
                    lessons: [
                        { title: "0.1: Introduction to HTML", type: "article", path: "/content/bootcamp-mm/foundation/mod1/intro.html" },
                        { title: "0.2: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l1:set-up-project.html" },
                        { title: "0.3: Header and Footer", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l2:header-footer.html" },
                        { title: "0.4: Create Hero Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l3:create-hero.html" },
                        { title: "0.5: Main Content Sections", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l4:main-content-sections.html" },
                        { title: "0.6: Meet the Trainers", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l5:meet-trainers.html" },
                        { title: "0.7: Create Contact Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l6:contact-section.html" },
                        { title: "0.8: Create Privacy Policy", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l7:privacy-policy.html" },
                        { title: "0.9: Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod1/weekly-challenge.html" },
                        { title: "0.10: Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod1/0.1.2.json" }
                    ]
                },
                {
                    moduleTitle: "Module 1: HTML CSS and Git",
                    lessons: [
                        { title: "0.1: Introduction to HTML", type: "article", path: "/content/bootcamp-mm/foundation/mod1/intro.html" },
                        { title: "0.2: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l1:set-up-project.html" },
                        { title: "0.3: Header and Footer", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l2:header-footer.html" },
                        { title: "0.4: Create Hero Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l3:create-hero.html" },
                        { title: "0.5: Main Content Sections", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l4:main-content-sections.html" },
                        { title: "0.6: Meet the Trainers", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l5:meet-trainers.html" },
                        { title: "0.7: Create Contact Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l6:contact-section.html" },
                        { title: "0.8: Create Privacy Policy", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l7:privacy-policy.html" },
                        { title: "0.9: Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod1/weekly-challenge.html" },
                        { title: "0.10: Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod1/0.1.2.json" }
                    ]
                },
                {
                    moduleTitle: "Module 1: HTML CSS and Git",
                    lessons: [
                        { title: "0.1: Introduction to HTML", type: "article", path: "/content/bootcamp-mm/foundation/mod1/intro.html" },
                        { title: "0.2: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l1:set-up-project.html" },
                        { title: "0.3: Header and Footer", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l2:header-footer.html" },
                        { title: "0.4: Create Hero Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l3:create-hero.html" },
                        { title: "0.5: Main Content Sections", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l4:main-content-sections.html" },
                        { title: "0.6: Meet the Trainers", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l5:meet-trainers.html" },
                        { title: "0.7: Create Contact Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l6:contact-section.html" },
                        { title: "0.8: Create Privacy Policy", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l7:privacy-policy.html" },
                        { title: "0.9: Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod1/weekly-challenge.html" },
                        { title: "0.10: Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod1/0.1.2.json" }
                    ]
                },
                {
                    moduleTitle: "Module 5: Third-Party APIs",
                    lessons: [
                        { title: "0.5: Introduction to Module 5", type: "article", path: "/content/bootcamp-mm/foundation/mod5/intro.html" },
                        { title: "0.5: Updating Tasks with jQuery", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l1:update-tasks-jquery.html" },
                        { title: "0.5: Bootstrapped", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l2:bootstrapped.html" },
                        { title: "0.5: Drag and Drop with jQuery UI", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l3:drag-drop-jquery-ui.html" },
                        { title: "0.5: A Matter of Time", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l4:a-matter-of-time.html" },
                        { title: "0.5: Final UI/UX Improvements", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l5:final-ui-ux-improvements.html" },
                        { title: "0.5: Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod5/weekly-challenge.html" }
                    ]
                },
                {
                    moduleTitle: "Module 6: Server-Side APIs",
                    lessons: [
                        { title: "0.6: Introduction to Module 6", type: "article", path: "/content/bootcamp-mm/foundation/mod6/intro.html" },
                        { title: "0.6: Get Started with Requests", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l1:get-started-requests.html" },
                        { title: "0.6: Display API Response Data", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l2:display-api-response.html" },
                        { title: "0.6: Display Issues for Single Repositories", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l3:display-issues-single-repo.html" },
                        { title: "0.6: Query Parameters", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l4:query-parameters.html" },
                        { title: "0.6: Adding Complex Queries", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l5:adding-complex-queries.html" },
                        { title: "0.6: Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod6/weekly-challenge.html" }
                    ]
                },
                {
                    moduleTitle: "Module 7: Project 1 Week 1",
                    lessons: [
                        { title: "0.7: Introduction to Module 7", type: "article", path: "/content/bootcamp-mm/foundation/mod7/intro-to-mod7.html" },
                        { title: "0.7: Interactive Front-End Project", type: "article", path: "/content/bootcamp-mm/foundation/mod7/front-end-project.html" },
                        { title: "0.7: Project Overview", type: "article", path: "/content/bootcamp-mm/foundation/mod7/project-overview.html" },
                        { title: "0.7: Roadmap", type: "article", path: "/content/bootcamp-mm/foundation/mod7/roadmap.html" },
                        { title: "0.7: Getting Ready for Class", type: "article", path: "/content/bootcamp-mm/foundation/mod7/getting-ready-for-class.html" }
                    ]
                },
                {
                    moduleTitle: "Module 8: Project 1 Week 2",
                    lessons: [
                        { title: "0.8: Introduction to Module 8", type: "article", path: "/content/bootcamp-mm/foundation/mod8/intro-to-mod8.html" },
                        { title: "0.8: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod8/project1.html" },
                        { title: "0.8: Reflection and Retrieval", type: "article", path: "/content/bootcamp-mm/foundation/mod8/reflection-retrieval.html" },
                        { title: "0.8: Career Connection", type: "article", path: "/content/bootcamp-mm/foundation/mod8/career-connection.html" }
                    ]
                },
                // Module 1 to 8 ကို ဒီအောက်မှာ ဆက်ထည့်ပါ
            ]
        },
        {
            category: "Technical", // Module 9 to 17
            modules: [
                {
                    moduleTitle: "Module 9: Advanced Logic",
                    lessons: [
                        { title: "9.1.1: JavaScript ES6", type: "article", path: "/content/bootcamp-mm/technical/mod9/9.1.1.html" }
                    ]
                }
                // Module 10 to 17 ကို ဒီအောက်မှာ ဆက်ထည့်ပါ
            ]
        },
        {
            category: "Full-Stack", // Module 18 to 25
            modules: [
                {
                    moduleTitle: "Module 18: Node.js Integration",
                    lessons: [
                        { title: "18.1.1: Express Setup", type: "article", path: "/content/bootcamp-mm/fullstack/mod18/18.1.1.html" }
                    ]
                }
                // Module 19 to 25 ကို ဒီအောက်မှာ ဆက်ထည့်ပါ
            ]
        }
    ]
};