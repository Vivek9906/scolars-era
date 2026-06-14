const fs = require('fs');

const baseHtmlStart = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | Scolars Lift</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css?v=${Date.now()}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="icon" type="image/png" href="/assets/images/favicon.png">
</head>
<body>
    <div id="header-placeholder"></div>

    <section class="editorial-header">
        <div class="editorial-container">
            <div class="editorial-eyebrow"><a href="javascript:history.back()">SERVICES &middot; {{UPPER_TITLE}}</a></div>
            <h1 class="editorial-title">{{TITLE}}</h1>
            <p class="editorial-subtitle">{{SUBTITLE}}</p>
        </div>
    </section>

    <section class="uni-editorial-list">
        <div class="container global-layout">
`;

const baseHtmlEnd = `
        </div>
    </section>

    <div id="footer-placeholder"></div>

    <script src="/assets/js/components.js"></script>
    <script src="/assets/js/main.js"></script>
</body>
</html>`;

const services = {
    "publication-support.html": {
        title: "Publication Support",
        upperTitle: "PUBLICATION SUPPORT",
        subtitle: "From first draft to accepted manuscript, we are with you the whole way. Getting published requires more than just good writing.",
        content: `
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Journal Selection</h3>
                    <p class="editorial-desc">We analyze your manuscript's scope, methodology, and impact to identify the highest probability targets among respected Q1/Q2 journals, avoiding predatory publications entirely.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Manuscript Formatting</h3>
                    <p class="editorial-desc">Every journal has strict guidelines. We handle the tedious process of formatting citations, abstracts, and figures to perfectly align with your target journal's specific author guidelines.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Submission Strategy</h3>
                    <p class="editorial-desc">Crafting a compelling cover letter to the editor is crucial. We help you articulate the novelty and significance of your findings to pass the initial editorial desk reject phase.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Peer Review Response</h3>
                    <p class="editorial-desc">When "Revise and Resubmit" is offered, we assist in formulating polite, comprehensive, and scientifically rigorous responses to each reviewer's critique.</p>
                </div>
            </div>
        `
    },
    "phd-guidance.html": {
        title: "PhD Guidance",
        upperTitle: "PHD GUIDANCE",
        subtitle: "A Doctorate is a marathon, not a sprint. Expert mentorship to help you cross the finish line.",
        content: `
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Topic Selection & Proposal Writing</h3>
                    <p class="editorial-desc">Identify a unique research gap and formulate a compelling proposal that wins committee approval and funding.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Literature Review Strategy</h3>
                    <p class="editorial-desc">Master the art of synthesizing existing research to establish the theoretical foundation of your dissertation.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Methodology Design</h3>
                    <p class="editorial-desc">Choose and justify the optimal qualitative, quantitative, or mixed-methods approach for your specific research questions.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Data Analysis & Interpretation</h3>
                    <p class="editorial-desc">Expert guidance on analyzing your data sets and drawing robust, defensible conclusions.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Defense Preparation</h3>
                    <p class="editorial-desc">Rigorous mock viva sessions to ensure you can confidently articulate and defend your research findings to your committee.</p>
                </div>
            </div>
        `
    },
    "research-support.html": {
        title: "Research Support",
        upperTitle: "RESEARCH SUPPORT",
        subtitle: "Elevating the quality, integrity, and impact of your academic research across all disciplines.",
        content: `
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Methodological Integrity</h3>
                    <p class="editorial-desc">We review your research design, sampling methods, and data collection tools to ensure your findings will stand up to intense academic scrutiny. Flawed methodology cannot be fixed in the writing phase; we ensure your foundation is solid.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Analytical Precision</h3>
                    <p class="editorial-desc">From qualitative thematic analysis to complex quantitative statistical modeling, our experts assist in interpreting your data accurately, helping you draw robust, defensible conclusions.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Publication Readiness</h3>
                    <p class="editorial-desc">Translating raw data into a compelling academic narrative. We provide structural editing, ensuring your arguments flow logically and adhere to the strict stylistic guidelines of your target discipline.</p>
                </div>
            </div>
        `
    },
    "ug-pg-admissions.html": {
        title: "UG & PG Admissions",
        upperTitle: "UG & PG ADMISSIONS",
        subtitle: "Strategic guidance to secure your place at top global universities for Undergraduate and Postgraduate programs.",
        content: `
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Profile Evaluation & University Selection</h3>
                    <p class="editorial-desc">We conduct a comprehensive audit of your academic record, extracurriculars, and career goals to shortlist universities where you have the highest probability of acceptance and success.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Application Strategy</h3>
                    <p class="editorial-desc">From selecting early decision versus regular decision, to mapping out application timelines and requirements, we craft a personalized roadmap for your admission journey.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Statement of Purpose (SOP) & Essays</h3>
                    <p class="editorial-desc">Your story matters. We help you brainstorm, structure, and refine essays that capture your unique voice and demonstrate your fit for top-tier programs.</p>
                </div>
            </div>
            <div class="uni-editorial-item">
                <div class="editorial-accent"></div>
                <div class="editorial-content">
                    <h3 class="editorial-name">Interview Preparation</h3>
                    <p class="editorial-desc">Through specialized mock interviews, we build your confidence to articulate your goals and handle challenging questions from admission committees.</p>
                </div>
            </div>
        `
    }
};

for (const [file, data] of Object.entries(services)) {
    const path = 'frontend/services/' + file;
    
    let html = baseHtmlStart
        .replace(/{{TITLE}}/g, data.title)
        .replace(/{{UPPER_TITLE}}/g, data.upperTitle)
        .replace(/{{SUBTITLE}}/g, data.subtitle)
        + data.content + baseHtmlEnd;
        
    fs.writeFileSync(path, html);
    console.log("Unified " + file);
}
