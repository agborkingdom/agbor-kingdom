
/* =========================================
   POLITICAL ACHIEVEMENTS / ILLUSTRIOUS
   SONS & DAUGHTERS
========================================= */

const achievementsPageSlug = "political-achievements";


/* =========================================
   PAGE ELEMENTS
========================================= */

const achievementsHeroTitle =
    document.getElementById("achievementsHeroTitle");

const achievementsHeroSubtitle =
    document.getElementById("achievementsHeroSubtitle");

const achievementsIntroTitle =
    document.getElementById("achievementsIntroTitle");

const achievementsIntroContent =
    document.getElementById("achievementsIntroContent");

const illustriousPeopleGrid =
    document.getElementById("illustriousPeopleGrid");

const illustriousPeopleLoading =
    document.getElementById("illustriousPeopleLoading");

const achievementsTimeline =
    document.getElementById("achievementsTimeline");


/* =========================================
   ESCAPE HTML
========================================= */

function escapeAchievementsHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   FORMAT CONTENT
========================================= */

function formatAchievementsContent(content) {

    if (!content) {
        return "";
    }

    return String(content)
        .split(/\n\s*\n/)
        .map(paragraph => {

            const clean =
                escapeAchievementsHTML(
                    paragraph.trim()
                );

            return clean
                ? `<p>${clean.replace(/\n/g, "<br>")}</p>`
                : "";

        })
        .join("");
}


/* =========================================
   CREATE IMAGE URL
========================================= */

function getAchievementImage(imageUrl) {

    if (!imageUrl) {
        return "images/monarch-placeholder.jpg";
    }

    return imageUrl;
}


/* =========================================
   LOAD PAGE
========================================= */

async function loadPoliticalAchievementsPage() {

    if (typeof kingdomSupabase === "undefined") {

        console.error(
            "Political Achievements: kingdomSupabase is not available."
        );

        if (illustriousPeopleGrid) {

            illustriousPeopleGrid.innerHTML = `
                <div class="achievements-loading">
                    <p>
                        Supabase connection is not available.
                    </p>
                </div>
            `;

        }

        return;
    }


    try {

        console.log(
            "Loading Political Achievements page..."
        );


        /* =====================================
           LOAD KINGDOM PAGE
        ====================================== */

        const {
            data: page,
            error: pageError
        } = await 
        kingdomSupabase
    .from("illustrious_sons_daughters")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
        if (pageError) {
            throw pageError;
        }


        if (!page) {

            console.warn(
                "Political Achievements page was not found."
            );

        } else {

            console.log(
                "POLITICAL ACHIEVEMENTS PAGE:",
                page
            );


            /* =================================
               HERO
            ================================== */

            if (achievementsHeroTitle) {

                achievementsHeroTitle.textContent =
                    page.title ||
                    "Illustrious Sons & Daughters";

            }


            if (achievementsHeroSubtitle) {

                achievementsHeroSubtitle.textContent =
                    page.subtitle ||
                    "Celebrating distinguished sons and daughters of Agbor Kingdom.";

            }


            /* =================================
               INTRODUCTION
            ================================== */

            if (achievementsIntroTitle) {

                achievementsIntroTitle.textContent =
                    page.intro_title ||
                    "Our Illustrious Sons & Daughters";

            }


            if (achievementsIntroContent) {

                achievementsIntroContent.innerHTML =
                    formatAchievementsContent(
                        page.intro_content ||
                        ""
                    );

            }


            /* =================================
               PAGE TITLE
            ================================== */

            document.title =
                `${page.title || "Illustrious Sons & Daughters"} | Agbor Kingdom`;

        }


        /* =====================================
           LOAD ILLUSTRIOUS PEOPLE
        ====================================== */

        await loadIllustriousPeople();


    } catch (error) {

        console.error(
            "Political Achievements page loading failed:",
            error
        );


        if (illustriousPeopleGrid) {

            illustriousPeopleGrid.innerHTML = `
                <div class="achievements-loading">
                    <p>
                        Information is currently unavailable.
                        Please try again later.
                    </p>
                </div>
            `;

        }

    }

}


/* =========================================
   LOAD ILLUSTRIOUS SONS & DAUGHTERS
========================================= */

async function loadIllustriousPeople() {

    if (!illustriousPeopleGrid) {
        return;
    }


    try {

        console.log(
            "Loading illustrious sons and daughters..."
        );


        const {
            data: people,
            error
        } = await kingdomSupabase

            .from("illustrious_sons_daughters")

            .select("*")

            .eq("is_active", true)

            .order("sort_order", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        console.log(
            "ILLUSTRIOUS SONS & DAUGHTERS:",
            people
        );


        renderIllustriousPeople(
            people || []
        );


    } catch (error) {

        console.error(
            "Error loading illustrious sons and daughters:",
            error
        );


        illustriousPeopleGrid.innerHTML = `
            <div class="achievements-loading">
                <p>
                    Distinguished sons and daughters
                    could not be loaded.
                </p>
            </div>
        `;

    }

}


/* =========================================
   RENDER PEOPLE
========================================= */

function renderIllustriousPeople(people) {

    if (!illustriousPeopleGrid) {
        return;
    }


    if (illustriousPeopleLoading) {
        illustriousPeopleLoading.remove();
    }


    if (!people.length) {

        illustriousPeopleGrid.innerHTML = `
            <div class="achievements-loading">
                <p>
                    No distinguished sons or daughters
                    have been added yet.
                </p>
            </div>
        `;

        return;
    }


    illustriousPeopleGrid.innerHTML = people
        .map((person, index) => {

            const number =
                String(index + 1).padStart(2, "0");


            const name =
                escapeAchievementsHTML(
                    person.name ||
                    person.full_name ||
                    "Distinguished Son or Daughter"
                );


            const title =
                escapeAchievementsHTML(
                    person.title ||
                    person.position ||
                    person.role ||
                    "Distinguished Son/Daughter of Agbor"
                );


            const category =
                escapeAchievementsHTML(
                    person.category ||
                    person.field ||
                    "ILLUSTRIOUS SON / DAUGHTER"
                );


            const biography =
                formatAchievementsContent(
                    person.description ||
                    person.biography ||
                    person.content ||
                    ""
                );


            const image =
                getAchievementImage(
                    person.image_url ||
                    person.image ||
                    person.photo_url
                );


            const imageAlt =
                escapeAchievementsHTML(
                    person.image_alt ||
                    person.name ||
                    "Illustrious Son or Daughter of Agbor Kingdom"
                );


            return `

                <article class="achievement-card">

                    <div class="achievement-image">

                        <img
                            src="${escapeAchievementsHTML(image)}"
                            alt="${imageAlt}"
                            loading="lazy"
                        >

                        <span class="achievement-number">
                            ${number}
                        </span>

                    </div>


                    <div class="achievement-icon">
                        ◆
                    </div>


                    <div class="achievement-content">

                        <span class="achievement-label">
                            ${category}
                        </span>

                        <h3>
                            ${name}
                        </h3>

                        <span class="achievement-period">
                            ${title}
                        </span>

                        ${
                            biography
                                ? biography
                                : `
                                    <p>
                                        Information about
                                        this distinguished
                                        son or daughter of
                                        Agbor Kingdom will
                                        appear here.
                                    </p>
                                `
                        }

                    </div>

                </article>

            `;

        })
        .join("");

}


/* =========================================
   LOAD PAGE SECTIONS / TIMELINE
========================================= */

async function loadAchievementSections(pageId) {

    if (!pageId || !achievementsTimeline) {
        return;
    }


    try {

        const {
            data: sections,
            error
        } = await kingdomSupabase

            .from("page_sections")

            .select("*")

            .eq("page_id", pageId)

            .eq("is_active", true)

            .order("sort_order", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        console.log(
            "POLITICAL ACHIEVEMENT SECTIONS:",
            sections
        );


        if (!sections || !sections.length) {
            return;
        }


        renderAchievementTimeline(
            sections
        );


    } catch (error) {

        console.error(
            "Error loading achievement sections:",
            error
        );

    }

}


/* =========================================
   RENDER TIMELINE
========================================= */

function renderAchievementTimeline(sections) {

    if (!achievementsTimeline) {
        return;
    }


    achievementsTimeline.innerHTML =
        sections
            .map((section, index) => {

                const number =
                    String(index + 1).padStart(2, "0");


                const period =
                    escapeAchievementsHTML(
                        section.subtitle ||
                        section.period ||
                        section.section_type ||
                        "KINGDOM MILESTONE"
                    );


                const title =
                    escapeAchievementsHTML(
                        section.title ||
                        "Kingdom Achievement"
                    );


                const content =
                    formatAchievementsContent(
                        section.content ||
                        ""
                    );


                return `

                    <div class="timeline-item">

                        <div class="timeline-marker">
                            ${number}
                        </div>

                        <div class="timeline-content">

                            <span>
                                ${period}
                            </span>

                            <h3>
                                ${title}
                            </h3>

                            ${
                                content ||
                                `
                                    <p>
                                        Information about
                                        this milestone will
                                        appear here.
                                    </p>
                                `
                            }

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================
   LOAD EVERYTHING
========================================= */

async function initializePoliticalAchievements() {

    if (typeof kingdomSupabase === "undefined") {

        console.error(
            "Political Achievements: kingdomSupabase is not available."
        );

        return;
    }


    try {

        /* ================================
           LOAD PAGE FIRST
        ================================= */

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase

            .from("kingdom_pages")

            .select("*")

            .eq("slug", achievementsPageSlug)

            .eq("is_published", true)

            .maybeSingle();


        if (pageError) {
            throw pageError;
        }


        if (!page) {

            console.warn(
                `No published kingdom page found for slug: ${achievementsPageSlug}`
            );

        } else {

            console.log(
                "Political Achievements kingdom page:",
                page
            );


            if (achievementsHeroTitle) {

                achievementsHeroTitle.textContent =
                    page.title ||
                    "Illustrious Sons & Daughters";

            }


            if (achievementsHeroSubtitle) {

                achievementsHeroSubtitle.textContent =
                    page.subtitle ||
                    "";

            }


            if (achievementsIntroTitle) {

                achievementsIntroTitle.textContent =
                    page.intro_title ||
                    "Our Illustrious Sons & Daughters";

            }


            if (achievementsIntroContent) {

                achievementsIntroContent.innerHTML =
                    formatAchievementsContent(
                        page.intro_content ||
                        ""
                    );

            }


            if (page.hero_image && document.querySelector(".achievements-hero")) {

                const hero =
                    document.querySelector(
                        ".achievements-hero"
                    );

                hero.style.backgroundImage =
                    `url("${page.hero_image}")`;

            }


            document.title =
                `${page.title || "Illustrious Sons & Daughters"} | Agbor Kingdom`;


            /* ================================
               PAGE SECTIONS
            ================================= */

            await loadAchievementSections(
                page.id
            );

        }


        /* ================================
           PEOPLE
        ================================= */

        await loadIllustriousPeople();


    } catch (error) {

        console.error(
            "Political Achievements initialization failed:",
            error
        );

    }

}


/* =========================================
   START PAGE
========================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializePoliticalAchievements
    );

} else {

    initializePoliticalAchievements();

}

