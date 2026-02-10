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
            { name: "Git & GitHub Guide", url: "/content/files/git-guide.pdf", icon: "fa-git-alt", description: "Git အခြေခံ Command များနှင့် GitHub သုံးစွဲပုံ အဆင့်ဆင့် လမ်းညွှန်" },
            { name: "HTML5 Elements List", url: "https://developer.mozilla.org/...", icon: "fa-html5", description: "အသုံးအများဆုံး HTML Tags များကို လွယ်ကူစွာ ရှာဖွေနိုင်မည့် စာရင်း" },
            { name: "CSS Flexbox Layout Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", icon: "fa-css3", description: "မင်္ဂလာပါ! CSS Flexbox ကို လေ့လာရန် အကောင်းဆုံး လမ်းညွှန်စာမျက်နှာ" },
            { name: "HTML5 Elements List", url: "https://youtu.be/2KL-z9A56SQ?si=Iub9AI1GziZPS4nn", icon: "fa-question", description: "HTML5 Elements များကို လေ့လာရန် အကောင်းဆုံး ဗီဒီယိုလမ်းညွှန်" }
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
            ]
        },
        {
            category: "Technical", // Module 9 to 17
            modules: [
                {
                    moduleTitle: "Module 9: Node.js",
                    lessons: [
                        { title: "9: Introduction to Module 9", type: "article", path: "/content/bootcamp-mm/foundation/mod9/intro.html" },
                        { title: "9.1: Introduction to Node.js", type: "article", path: "/content/bootcamp-mm/foundation/mod9/l1:intro-to-node.html" },
                        { title: "9.2: Generate a Webpage", type: "article", path: "/content/bootcamp-mm/foundation/mod9/l2:generate-webpage.html" },
                        { title: "9.3: Node Package Manager", type: "article", path: "/content/bootcamp-mm/foundation/mod9/l3:node-package-manager.html" },
                        { title: "9.4: Finish Portfolio HTML Output", type: "article", path: "/content/bootcamp-mm/foundation/mod9/l4:finish-portfolio-html-output.html" },
                        { title: "9.5: Handle Node.js Asynchronicity", type: "article", path: "/content/bootcamp-mm/foundation/mod9/l5:handle-asynchronicity.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod9/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod9/mod9.json" }
                    ]
                },
                {
                    moduleTitle: "Module 10: Object-Oriented Programming",
                    lessons: [
                        { title: "10: Introduction to Module 10", type: "article", path: "/content/bootcamp-mm/foundation/mod10/intro.html" },
                        { title: "10.1: Jest and Constructors", type: "article", path: "/content/bootcamp-mm/foundation/mod10/l1:jest-constructors.html" },
                        { title: "10.2: Methods and Mocks", type: "article", path: "/content/bootcamp-mm/foundation/mod10/l2:methods-mocks.html" },
                        { title: "10.3: Player and Enemy Methods", type: "article", path: "/content/bootcamp-mm/foundation/mod10/l3:player-enemy-methods.html" },
                        { title: "10.4: Build the Game Logic", type: "article", path: "/content/bootcamp-mm/foundation/mod10/l4:build-game-logic.html" },
                        { title: "10.5: Inheritance", type: "article", path: "/content/bootcamp-mm/foundation/mod10/l5:inheritance.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod10/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod10/mod10.json" }
                    ]
                },
                {
                    moduleTitle: "Module 11: Express.js",
                    lessons: [
                        { title: "11: Introduction to Module 11", type: "article", path: "/content/bootcamp-mm/foundation/mod11/intro.html" },
                        { title: "11.1: Set Up Express.js Server and GET Routes", type: "article", path: "/content/bootcamp-mm/foundation/mod11/l1:setup-server-get-routes.html" },
                        { title: "11.2: Create Data Using POST Routes", type: "article", path: "/content/bootcamp-mm/foundation/mod11/l2:create-data-post-routes.html" },
                        { title: "11.3: Serving a Front End", type: "article", path: "/content/bootcamp-mm/foundation/mod11/l3:serve-front-end.html" },
                        { title: "3.4: Add Zookeeper Endpoints and Modularize the Code", type: "article", path: "/content/bootcamp-mm/foundation/mod3/l4:add-zookeeper-endpoints-modularize-code.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod11/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod11/mod11.json" }
                    ]
                },
                {
                    moduleTitle: "Module 12: SQL",
                    lessons: [
                        { title: "12: Introduction to Module 12", type: "article", path: "/content/bootcamp-mm/foundation/mod12/intro.html" },
                        { title: "12.1: Introduction to SQL", type: "article", path: "/content/bootcamp-mm/foundation/mod12/l1:intro-to-sql.html" },
                        { title: "12.2: Create Candidate Routes", type: "article", path: "/content/bootcamp-mm/foundation/mod12/l2:create-candidate-routes.html" },
                        { title: "12.3: Join with Parties Table", type: "article", path: "/content/bootcamp-mm/foundation/mod12/l3:join-parties-table.html" },
                        { title: "12.4: Create Voter Table and Routes", type: "article", path: "/content/bootcamp-mm/foundation/mod12/l4:create-voter-table-routes.html" },
                        { title: "12.5: Populate and Tally Votes", type: "article", path: "/content/bootcamp-mm/foundation/mod12/l5:populate-tally-votes.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod12/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod12/mod12.json" }
                    ]
                },
                {
                    moduleTitle: "Module 13: Objective-Relational Mapping (ORM)",
                    lessons: [
                        { title: "13: Introduction to Module 13", type: "article", path: "/content/bootcamp-mm/foundation/mod13/intro.html" },
                        { title: "13.1: Set Up a User Model", type: "article", path: "/content/bootcamp-mm/foundation/mod13/l1:set-up-user-model.html" },
                        { title: "13.2: Create the Login Route", type: "article", path: "/content/bootcamp-mm/foundation/mod13/l2:create-login-route.html" },
                        { title: "13.3: Create a Post Model", type: "article", path: "/content/bootcamp-mm/foundation/mod13/l3:create-post-model.html" },
                        { title: "13.4: Implement a Voting System", type: "article", path: "/content/bootcamp-mm/foundation/mod13/l4:implement-voting-system.html" },
                        { title: "13.5: Create the Comment Model and Deploy to Heroku", type: "article", path: "/content/bootcamp-mm/foundation/mod13/l5:create-comment-model-heroku.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod13/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod13/mod13.json" }
                    ]
                },
                {
                    moduleTitle: "Module 14: Model-View-Controller (MVC)",
                    lessons: [
                        { title: "14: Introduction to Module 14", type: "article", path: "/content/bootcamp-mm/foundation/mod14/intro.html" },
                        { title: "14.1: Create the Homepage View", type: "article", path: "/content/bootcamp-mm/foundation/mod14/l1:create-homepage-view.html" },
                        { title: "14.2: Create the User Login", type: "article", path: "/content/bootcamp-mm/foundation/mod14/l2:create-user-login.html" },
                        { title: "14.3: Create the Single-Post View", type: "article", path: "/content/bootcamp-mm/foundation/mod14/l3:create-single-post-view.html" },
                        { title: "14.4: Partials and Helpers", type: "article", path: "/content/bootcamp-mm/foundation/mod14/l4:partials-and-helpers.html" },
                        { title: "14.5: Create the Dashboard View", type: "article", path: "/content/bootcamp-mm/foundation/mod14/l5:create-dashboard-view.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod14/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod14/mod14.json" }
                    ]
                },
                {
                    moduleTitle: "Module 15: Project 2 Week 1",
                    lessons: [
                        { title: "15.1: Introduction to Module 15", type: "article", path: "/content/bootcamp-mm/foundation/mod15/intro-to-mod15.html" },
                        { title: "15.2: Interactive Full-Stack Project", type: "article", path: "/content/bootcamp-mm/foundation/mod15/full-stack-project.html" },
                        { title: "15.3: Project Overview", type: "article", path: "/content/bootcamp-mm/foundation/mod15/project-overview.html" },
                        { title: "15.4: Roadmap", type: "article", path: "/content/bootcamp-mm/foundation/mod15/roadmap.html" }
                    ]
                },
                {
                    moduleTitle: "Module 16: Project 2 Week 2",
                    lessons: [
                        { title: "16.1: Introduction to Module 16", type: "article", path: "/content/bootcamp-mm/foundation/mod16/intro-to-mod16.html" },
                        { title: "16.4: Career Connection", type: "article", path: "/content/bootcamp-mm/foundation/mod16/career-connection.html" },
                        { title: "16.2: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod16/project2.html" },
                        { title: "16.3: Reflection and Retrieval", type: "article", path: "/content/bootcamp-mm/foundation/mod16/reflection-and-retrieval.html" },
                    ]
                },
            ]
        },
        {
            category: "Full-Stack", // Module 17 to 25
            modules: [
                {
                    moduleTitle: "Module 17: Computer Science for JavaScript",
                    lessons: [
                        { title: "17: Introduction to Module 17", type: "article", path: "/content/bootcamp-mm/foundation/mod17/intro.html" },
                        { title: "17.1: What Is JavaScript?", type: "article", path: "/content/bootcamp-mm/foundation/mod17/l1:what-is-javascript.html" },
                        { title: "17.2: Functional Programming", type: "article", path: "/content/bootcamp-mm/foundation/mod17/l2:functional-programming.html" },
                        { title: "17.3: Search Algorithms", type: "article", path: "/content/bootcamp-mm/foundation/mod17/l3:search-algorithms.html" },
                        { title: "17.4: Sort Algorithms", type: "article", path: "/content/bootcamp-mm/foundation/mod17/l4:sort-algorithms.html" },
                        { title: "17.5: Interview Practice", type: "article", path: "/content/bootcamp-mm/foundation/mod17/l5:interview-practice.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod17/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod17/mod17.json" }
                    ]
                },
                {
                    moduleTitle: "Module 18: NoSQL",
                    lessons: [
                        { title: "18: Introduction to Module 18", type: "article", path: "/content/bootcamp-mm/foundation/mod18/intro.html" },
                        { title: "18.1: Set Up the User Model", type: "article", path: "/content/bootcamp-mm/foundation/mod18/l1:setup-user-model.html" },
                        { title: "18.2: Add Comments", type: "article", path: "/content/bootcamp-mm/foundation/mod18/l2:add-comments.html" },
                        { title: "18.3: Set Up Replies", type: "article", path: "/content/bootcamp-mm/foundation/mod18/l3:setup-replies.html" },
                        { title: "18.4: Add Mongoose Validation", type: "article", path: "/content/bootcamp-mm/foundation/mod18/l4:add-mongoose-validation.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod18/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod18/mod18.json" }
                    ]
                },
                {
                    moduleTitle: "Module 19: Progressive Web Applications (PWA)",
                    lessons: [
                        { title: "19: Introduction to Module 19", type: "article", path: "/content/bootcamp-mm/foundation/mod19/intro.html" },
                        { title: "19.1: Implementing the Client-Server Model", type: "article", path: "/content/bootcamp-mm/foundation/mod19/l1:implementing-client-server-model.html" },
                        { title: "19.2: webpack", type: "article", path: "/content/bootcamp-mm/foundation/mod19/l2:webpack.html" },
                        { title: "19.3: Add IndexedDB", type: "article", path: "/content/bootcamp-mm/foundation/mod19/l3:add-indexeddb.html" },
                        { title: "19.4: Add a Service Worker", type: "article", path: "/content/bootcamp-mm/foundation/mod19/l4:add-service-worker.html" },
                        { title: "19.5: Add Installability", type: "article", path: "/content/bootcamp-mm/foundation/mod19/l5:add-installability.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod19/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod19/mod19.json" }
                    ]
                },
                {
                    moduleTitle: "Module 20: React",
                    lessons: [
                        { title: "20: Introduction to Module 20", type: "article", path: "/content/bootcamp-mm/foundation/mod20/intro.html" },
                        { title: "20.1: Create React Components", type: "article", path: "/content/bootcamp-mm/foundation/mod20/l1:create-react-components.html" },
                        { title: "20.2: Run Unit Tests Using the React Testing Library", type: "article", path: "/content/bootcamp-mm/foundation/mod20/l2:run-unit-tests-react-testing-library.html" },
                        { title: "20.3: Add Conditional Rendering to the Gallery", type: "article", path: "/content/bootcamp-mm/foundation/mod20/l3:conditional-rendering-gallery.html" },
                        { title: "20.4: Add a Contact Form", type: "article", path: "/content/bootcamp-mm/foundation/mod20/l4:add-contact-form.html" },
                        { title: "20.5: Add a Photo Modal", type: "article", path: "/content/bootcamp-mm/foundation/mod20/l5:add-photo-modal.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod20/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod20/mod20.json" }
                    ]
                },
                {
                    moduleTitle: "Module 21: MERN",
                    lessons: [
                        { title: "21: Introduction to Module 21", type: "article", path: "/content/bootcamp-mm/foundation/mod21/intro.html" },
                        { title: "21.1: Set Up Apollo Server", type: "article", path: "/content/bootcamp-mm/foundation/mod21/l1:set-up-apollo-server.html" },
                        { title: "21.2: GraphQL Mutations", type: "article", path: "/content/bootcamp-mm/foundation/mod21/l2:graphql-mutations.html" },
                        { title: "21.3: Integrate the Client", type: "article", path: "/content/bootcamp-mm/foundation/mod21/l3:integrate-client.html" },
                        { title: "21.4: Using React Router", type: "article", path: "/content/bootcamp-mm/foundation/mod21/l4:using-react-router.html" },
                        { title: "21.5: Add Front-End User Authentication", type: "article", path: "/content/bootcamp-mm/foundation/mod21/l5:add-front-end-user-authentication.html" },
                        { title: "21.6: Add More Forms and Buttons", type: "article", path: "/content/bootcamp-mm/foundation/mod21/l6:add-more-forms-buttons.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod21/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod21/mod21.json" }
                    ]
                },
                {
                    moduleTitle: "Module 22: State",
                    lessons: [
                        { title: "22: Introduction to Module 22", type: "article", path: "/content/bootcamp-mm/foundation/mod22/intro.html" },
                        { title: "22.1: Create a Global Store", type: "article", path: "/content/bootcamp-mm/foundation/mod22/l1:create-global-store.html" },
                        { title: "22.2: Build the Shopping Cart UI", type: "article", path: "/content/bootcamp-mm/foundation/mod22/l2:create-shopping-cart-ui.html" },
                        { title: "22.3: Add Shopping Cart Persistence with IndexedDB", type: "article", path: "/content/bootcamp-mm/foundation/mod22/l3:add-shopping-cart-persistence-indexeddb.html" },
                        { title: "22.4: Add Checkout with Stripe", type: "article", path: "/content/bootcamp-mm/foundation/mod22/l4:add-checkout-with-stripe.html" },
                        { title: "Weekly Challenge", type: "article", path: "/content/bootcamp-mm/foundation/mod22/weekly-challenge.html" },
                        { title: "Quiz", type: "quiz", path: "/content/bootcamp-mm/foundation/mod22/mod22.json" }
                    ]
                },
                {
                    moduleTitle: "Module 23: Project 3 Week 1",
                    lessons: [
                        { title: "23.1: Introduction to Module 23", type: "article", path: "/content/bootcamp-mm/foundation/mod23/intro-to-mod23.html" },
                        { title: "23.2: Interactive MERN SPA Project", type: "article", path: "/content/bootcamp-mm/foundation/mod23/mern-spa-project.html" },
                        { title: "23.3: Project Overview", type: "article", path: "/content/bootcamp-mm/foundation/mod23/project-overview.html" },
                        { title: "23.4: Roadmap", type: "article", path: "/content/bootcamp-mm/foundation/mod23/roadmap.html" }
                    ]
                },
                {
                    moduleTitle: "Module 24: Project 3 Week 2",
                    lessons: [
                        { title: "24.1: Introduction to Module 24", type: "article", path: "/content/bootcamp-mm/foundation/mod24/intro-to-mod24.html" },
                        { title: "24.2: Set Up Project", type: "article", path: "/content/bootcamp-mm/foundation/mod24/project3.html" },
                        { title: "24.3: Reflection and Retrieval", type: "article", path: "/content/bootcamp-mm/foundation/mod24/reflection-and-retrieval.html" },
                        { title: "24.4: Career Connection", type: "article", path: "/content/bootcamp-mm/foundation/mod24/career-connection.html" }
                    ]
                },
                {
                    moduleTitle: "Module 25: Continuation Courses",
                    lessons: [
                        { title: "25.1: Continuation Courses Invitation", type: "article", path: "/content/bootcamp-mm/foundation/mod25/continuation-courses-invitation.html" }
                    ]
                }
            ]
        }
    ]
};