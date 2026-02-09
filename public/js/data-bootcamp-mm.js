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
                            title: "0.1: Introduction to the Coding Boot Camp", 
                            type: "article", 
                            path: "/content/bootcamp-mm/foundation/mod0/l1:intro.html"
                        },
                        { title: "0.2: Boot Camp Overview", type: "article", path: "/content/bootcamp-mm/foundation/mod0/l2:overview.html" },
                        { title: "0.3: Roadmap", type: "article", path: "/content/bootcamp-mm/foundation/mod0/l3:roadmap.html" },
                        { title: "0.4: Up and Running", type: "article", path: "/content/bootcamp-mm/foundation/mod0/l4:up-and-running.html" }
                    ]
                },
                {
                    moduleTitle: "Module 1: HTML CSS and Git",
                    lessons: [
                        { title: "1: Introduction to Module 1", type: "article", path: "/content/bootcamp-mm/foundation/mod1/intro.html" },
                        { title: "1.1: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l1:set-up-project.html" },
                        { title: "1.2: Build the Header and Footer", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l2:header-footer.html" },
                        { title: "1.3: Create the Hero", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l3:create-hero.html" },
                        { title: "1.4: Build the Two Main Content Sections", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l4:main-content-sections.html" },
                        { title: "1.5: Meet the Trainers", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l5:meet-trainers.html" },
                        { title: "1.6: Build the Contact Section", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l6:contact-section.html" },
                        { title: "1.7: Add a Privacy Policy", type: "article", path: "/content/bootcamp-mm/foundation/mod1/l7:privacy-policy.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod1/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod1/mod1.json" }
                    ]
                },
                {
                    moduleTitle: "Module 2: Advanced CSS",
                    lessons: [
                        { title: "2: Introduction to Module 2", type: "article", path: "/content/bootcamp-mm/foundation/mod2/intro.html" },
                        { title: "2.1: Set Up the Git Workflow", type: "article", path: "/content/bootcamp-mm/foundation/mod2/l1:set-up-git-workflow.html" },
                        { title: "2.2: Flex Our Muscles", type: "article", path: "/content/bootcamp-mm/foundation/mod2/l2:flex-muscles.html" },
                        { title: "2.3: Go Mobile", type: "article", path: "/content/bootcamp-mm/foundation/mod2/l3:go-mobile.html" },
                        { title: "2.4: Add Visual Enhancements", type: "article", path: "/content/bootcamp-mm/foundation/mod2/l4:add-visual-enhancements.html" },
                        { title: "2.5: Complete Visual Enhancements and Deploy", type: "article", path: "/content/bootcamp-mm/foundation/mod2/l5:complete-visual-enhancements-deploy.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod2/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod2/mod2.json" }
                    ]
                },
                {
                    moduleTitle: "Module 3: JavaScript",
                    lessons: [
                        { title: "3: Introduction to Module 3", type: "article", path: "/content/bootcamp-mm/foundation/mod3/intro.html" },
                        { title: "3.1: JavaScript Basics", type: "article", path: "/content/bootcamp-mm/foundation/mod3/l1:javascript-basics.html" },
                        { title: "3.2: Use Loops to Enable Multiple Battle Rounds", type: "article", path: "/content/bootcamp-mm/foundation/mod3/l2:use-loops-multiple-battle-rounds.html" },
                        { title: "3.3: Expand Game Logic into Multiple Functions", type: "article", path: "/content/bootcamp-mm/foundation/mod3/l3:multiple-functions.html" },
                        { title: "3.4: Optimize the Code with Objects", type: "article", path: "/content/bootcamp-mm/foundation/mod3/l4:optimize-objects.html" },
                        { title: "3.5: Resolve Bugs and Add Final Enhancements", type: "article", path: "/content/bootcamp-mm/foundation/mod3/l5:resolve-bugs-final-enhancements.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod3/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod3/mod3.json" }
                    ]
                },
                {
                    moduleTitle: "Module 4: Web APIs",
                    lessons: [
                        { title: "4: Introduction to Module 4", type: "article", path: "/content/bootcamp-mm/foundation/mod4/intro.html" },
                        { title: "4.1: The DOM", type: "article", path: "/content/bootcamp-mm/foundation/mod4/l1:the-dom.html" },
                        { title: "4.2: Work with Forms", type: "article", path: "/content/bootcamp-mm/foundation/mod4/l2:work-forms.html" },
                        { title: "4.3: Edit and Delete Tasks", type: "article", path: "/content/bootcamp-mm/foundation/mod4/l3:edit-delete-tasks.html" },
                        { title: "4.4: Add Task Persistance", type: "article", path: "/content/bootcamp-mm/foundation/mod4/l4:add-task-persistence.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod4/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod4/mod4.json" }
                    ]
                },
                {
                    moduleTitle: "Module 5: Third-Party APIs",
                    lessons: [
                        { title: "5: Introduction to Module 5", type: "article", path: "/content/bootcamp-mm/foundation/mod5/intro.html" },
                        { title: "5.1: Updating Tasks with jQuery", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l1:update-tasks-jquery.html" },
                        { title: "5.2: Bootstrapped", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l2:bootstrapped.html" },
                        { title: "5.3: Drag and Drop with jQuery UI", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l3:drag-drop-jquery-ui.html" },
                        { title: "5.4: A Matter of Time", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l4:a-matter-of-time.html" },
                        { title: "5.5: Final UI/UX Improvements", type: "article", path: "/content/bootcamp-mm/foundation/mod5/l5:final-ui-ux-improvements.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod5/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod5/mod5.json" }
                    ]
                },
                {
                    moduleTitle: "Module 6: Server-Side APIs",
                    lessons: [
                        { title: "6: Introduction to Module 6", type: "article", path: "/content/bootcamp-mm/foundation/mod6/intro.html" },
                        { title: "6.1: Get Started with Requests", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l1:get-started-requests.html" },
                        { title: "6.2: Display API Response Data", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l2:display-api-response.html" },
                        { title: "6.3: Display Issues for Single Repositories", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l3:display-issues-single-repo.html" },
                        { title: "6.4: Query Parameters", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l4:query-parameters.html" },
                        { title: "6.5: Adding Complex Queries", type: "article", path: "/content/bootcamp-mm/foundation/mod6/l5:adding-complex-queries.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod6/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod6/mod6.json" }
                    ]
                },
                {
                    moduleTitle: "Module 7: Project 1 Week 1",
                    lessons: [
                        { title: "7.1: Introduction to Module 7", type: "article", path: "/content/bootcamp-mm/foundation/mod7/intro-to-mod7.html" },
                        { title: "7.2: Interactive Front-End Project", type: "article", path: "/content/bootcamp-mm/foundation/mod7/front-end-project.html" },
                        { title: "7.3: Project Overview", type: "article", path: "/content/bootcamp-mm/foundation/mod7/project-overview.html" },
                        { title: "7.4: Roadmap", type: "article", path: "/content/bootcamp-mm/foundation/mod7/roadmap.html" },
                        { title: "7.5: Getting Ready for Class", type: "article", path: "/content/bootcamp-mm/foundation/mod7/getting-ready-for-class.html" }
                    ]
                },
                {
                    moduleTitle: "Module 8: Project 1 Week 2",
                    lessons: [
                        { title: "8.1: Introduction to Module 8", type: "article", path: "/content/bootcamp-mm/foundation/mod8/intro-to-mod8.html" },
                        { title: "8.2: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod8/project1.html" },
                        { title: "8.3: Reflection and Retrieval", type: "article", path: "/content/bootcamp-mm/foundation/mod8/reflection-and-retrieval.html" },
                        { title: "8.4: Career Connection", type: "article", path: "/content/bootcamp-mm/foundation/mod8/career-connection.html" }
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