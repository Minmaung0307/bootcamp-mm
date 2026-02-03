const designCourseData = {
    id: "design",
    title: "UI/UX Professional Design",
    instructor: "Ko Design",
    transcriptSubjects: ["design_theory", "figma_basics", "prototyping", "user_research", "portfolio"],
    description: "အသုံးပြုသူ စိတ်ကျေနပ်မှုရှိစေမည့် Website နှင့် App ဒီဇိုင်းများ ဖန်တီးနည်း။",
    benefits: ["Figma Mastery", "Real-world Case Studies", "Design Portfolio Building"],
    price: "45,000 MMK",
    icon: "fa-palette",
    resources: [
        { name: "Figma Keyboard Shortcuts", url: "https://help.figma.com/hc/en-us/articles/360040328273", icon: "fa-keyboard" },
        { name: "Google Material Design 3", url: "https://m3.material.io/", icon: "fa-google" },
        { name: "Color Palette Generator", url: "https://coolors.co/", icon: "fa-tint" }
    ],
    data: [
        {
            category: "Technical",
            modules: [
                {
                    moduleTitle: "Module 1: Figma Masterclass",
                    lessons: [
                        { title: "1.1.1: Auto Layout Pro", type: "article", path: "/content/design/technical/mod1/autolayout.html" },
                        { title: "Layout Grid Quiz", type: "quiz", path: "/content/design/technical/mod1/quiz1.json" },
                        { title: "Landing Page Project", type: "project", path: "/content/design/technical/mod1/project1.html" }
                    ]
                }
            ]
        }
    ]
};