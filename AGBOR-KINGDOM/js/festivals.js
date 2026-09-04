const festivalsPageSlug = "festivals";

const festivalSections =
    document.getElementById("festivalSections");

const festivalLoading =
    document.getElementById("festivalLoading");


/* =========================================
   LOAD FESTIVALS PAGE
========================================= */

async function loadFestivalsPage() {

    if (!festivalSections) {
        return;
    }

    try {

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase
            .from("kingdom_pages")
            .select("*")
            .eq("slug", festivalsPageSlug)
            .eq("is_published", true)
            .maybeSingle();

        if (pageError) {
            throw pageError;
        }

        if (!page) {

            showFestivalMessage(
                "Festivals page not found.",
                "The Festivals page has not been published yet."
            );

            return;
        }


        const hero = document.querySelector(".page-hero");

if (hero && page.hero_image) {
    hero.style.backgroundImage = `
        linear-gradient(
            rgba(20, 15, 10, 0.55),
            rgba(20, 15, 10, 0.70)
        ),
        url("${escapeFestivalText(page.hero_image)}")
    `;
}



        /* =====================================
           PAGE HERO / INTRO
        ====================================== */

        const pageTitle =
            document.getElementById("pageTitle");

        const pageSubtitle =
            document.getElementById("pageSubtitle");

        const introTitle =
            document.getElementById("introTitle");

        const introContent =
            document.getElementById("introContent");


        if (pageTitle && page.title) {
            pageTitle.textContent = page.title;
        }

        if (pageSubtitle && page.subtitle) {
            pageSubtitle.textContent = page.subtitle;
        }

        if (introTitle) {
            introTitle.textContent =
                page.intro_title ||
                page.title ||
                "Festivals of Agbor Kingdom";
        }

        if (introContent) {
            introContent.textContent =
                page.intro_content ||
                "";
        }


        /* =====================================
           LOAD PAGE SECTIONS
        ====================================== */

        const {
            data: sections,
            error: sectionsError
        } = await kingdomSupabase
            .from("page_sections")
            .select("*")
            .eq("page_id", page.id)
            .eq("is_active", true)
            .order("sort_order", {
                ascending: true
            });

        if (sectionsError) {
            throw sectionsError;
        }


        if (festivalLoading) {
            festivalLoading.style.display = "none";
        }


        renderFestivalSections(
            sections || []
        );

    } catch (error) {

        console.error(
            "Festivals page loading failed:",
            error
        );

        if (festivalLoading) {
            festivalLoading.style.display = "none";
        }

        showFestivalMessage(
            "Unable to Load Festivals",
            "Please try again later."
        );
    }
}


/* =========================================
   RENDER FESTIVAL SECTIONS
========================================= */

function renderFestivalSections(sections) {

    if (!festivalSections) {
        return;
    }

    if (!sections.length) {

        showFestivalMessage(
            "No Festival Information Yet",
            "Festival information will appear here."
        );

        return;
    }


    festivalSections.innerHTML = sections
        .map((section, index) => {

            const title =
                escapeFestivalText(
                    section.title ||
                    "Agbor Kingdom Festival"
                );

            const subtitle =
                escapeFestivalText(
                    section.subtitle ||
                    ""
                );

            const content =
    formatFestivalContent(
        section.content || ""
    );

            const label =
                escapeFestivalText(
                    section.label ||
                    "FESTIVALS"
                );

            const imageUrl =
                section.image_url
                    ? escapeFestivalText(
                        section.image_url
                    )
                    : "";


            const imageHTML = imageUrl
                ? `
                    <div class="festival-section-image">
                        <img
                            src="${imageUrl}"
                            alt="${title}"
                            loading="lazy"
                        >
                    </div>
                  `
                : "";


            const layoutClass =
                index % 2 === 0
                    ? "festival-section"
                    : "festival-section festival-section-reverse";


            return `

                <article class="${layoutClass}">

                    ${imageHTML}

                    <div class="festival-section-content">

                        <span class="festival-label">
                            ${label}
                        </span>

                        <h2>
                            ${title}
                        </h2>

                        ${
                            subtitle
                                ? `
                                    <h3>
                                        ${subtitle}
                                    </h3>
                                  `
                                : ""
                        }

                       <div class="festival-text">
                        ${content}
                    </div>

                    </div>

                </article>

            `;

        })
        .join("");
}


/* =========================================
   MESSAGE
========================================= */

function showFestivalMessage(
    title,
    message
) {

    if (!festivalSections) {
        return;
    }

    festivalSections.innerHTML = `

        <div class="festival-message">

            <div class="festival-message-icon">
                ✦
            </div>

            <h3>
                ${escapeFestivalText(title)}
            </h3>

            <p>
                ${escapeFestivalText(message)}
            </p>

        </div>

    `;
}
function formatFestivalContent(content) {

    if (!content) {
        return "";
    }

    return escapeFestivalText(content)
        .split(/\n\s*\n/)
        .map(paragraph => `
            <p>
                ${paragraph.replace(/\n/g, "<br>")}
            </p>
        `)
        .join("");
}

/* =========================================
   ESCAPE TEXT
========================================= */

function escapeFestivalText(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   START
========================================= */

loadFestivalsPage();