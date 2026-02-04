const pythonCourseData = {
    id: "python",
    title: "Python for Data Science",
    instructor: "Daw Aye Aye",
    transcriptSubjects: ["python_basics", "numpy", "pandas", "visualization", "statistics"], 
    description: "Data ခွဲခြမ်းစိတ်ဖြာခြင်းနှင့် AI အခြေခံများအတွက် Python ကို ကျွမ်းကျင်စွာ အသုံးချနည်း။",
    benefits: ["Data Cleaning Skills", "Automation Scripts", "Machine Learning Basics"],
    price: "60,000 MMK",
    icon: "fa-python",
    resources: [
        { name: "Python 3 Official Docs", url: "https://docs.python.org/3/", icon: "fa-book" },
        { name: "NumPy Cheat Sheet", url: "https://numpy.org/doc/stable/user/absolute_beginners.html", icon: "fa-file-code" },
        { name: "Pandas Reference Guide", url: "https://pandas.pydata.org/docs/", icon: "fa-table" }
    ],
    data: [
        {
            category: "Foundations",
            modules: [
                {
                    moduleTitle: "Module 1: Python Basics",
                    lessons: [
                        { title: "0.1.1: Why Python for Data?", type: "article", path: "/content/python/foundations/mod0/0.1.1-welcome.html" },
                        { title: "0.1.2: Data Types Quiz", type: "quiz", path: "/content/python/foundations/mod0/0.1.2-quiz.json" },
                        { title: "Basic Logic Assignment", type: "assignment", path: "/content/python/foundations/mod0/0.1.3-assignment.html" }
                    ]
                }
            ]
        }
    ]
};