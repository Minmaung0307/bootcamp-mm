const webCourseData = {
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
                        { title: "0.1.1: Welcome", type: "article", path: "/content/web/foundations/mod0/0.1.1-welcome.html" },
                        { title: "0.1.2: Quiz", type: "quiz", path: "/content/web/foundations/mod0/0.1.2-quiz.json" },
                        { title: "0.1.3: Assignment 1", type: "assignment", path: "/content/web/foundations/mod0/0.1.3-assignment.html" },
                        { title: "Module 0 Project", type: "project", path: "/content/web/foundations/mod0/0.1.4-project.html" },
                    ]
                }
            ]
        },
        {
            category: "Technical",
            modules: [
                {
                    moduleTitle: "Module 1: Advanced CSS",
                    lessons: [
                        { title: "1.1.1: Flexbox Deep Dive", type: "article", path: "/content/web/technical/mod1/1.1.1-flex.html" }
                    ]
                }
            ]
        },
        {
            category: "Full-Stack",
            modules: [
                {
                    moduleTitle: "Module 10: Node.js",
                    lessons: [
                        { title: "10.1.1: Backend Intro", type: "article", path: "/content/web/fullstack/mod10/10.1.1-intro.html" }
                    ]
                }
            ]
        }
    ]
};