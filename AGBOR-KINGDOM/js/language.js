/* =========================================
   LANGUAGE PAGE
========================================= */

const languagePageSlug = "language";

const languageSections =
    document.getElementById("languageSections");

const languageLoading =
    document.getElementById("languageLoading");


/* =========================================
   LOAD LANGUAGE PAGE
========================================= */

async function loadLanguagePage() {

    if (!languageSections) {
        return;
    }

    try {

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase
            .from("kingdom_pages")
            .select("*")
            .eq("slug", languagePageSlug)
            .eq("is_published", true)
            .maybeSingle();

        if (pageError) {
            throw pageError;
        }


        if (!page) {

            showLanguageMessage(
                "Language Page Not Found",
                "Information about the language and linguistic heritage of Agbor Kingdom will appear here."
            );

            return;
        }


        /* =====================================
           PAGE INFORMATION
        ====================================== */

        const pageTitle =
            document.getElementById("pageTitle");

        const pageSubtitle =
            document.getElementById("pageSubtitle");

        const introTitle =
            document.getElementById("introTitle");

        const introContent =
            document.getElementById("introContent");


        if (pageTitle) {
            pageTitle.textContent =
                page.title ||
                "Language";
        }

        if (pageSubtitle) {
            pageSubtitle.textContent =
                page.subtitle ||
                "";
        }

        if (introTitle) {
            introTitle.textContent =
                page.intro_title ||
                "The Language of Agbor Kingdom";
        }

        if (introContent) {
            introContent.textContent =
                page.intro_content ||
                "";
        }


        /* =====================================
           HERO IMAGE
        ====================================== */
/* =====================================
   HERO BACKGROUND IMAGE
====================================== */

const languageHero =
    document.querySelector(".language-hero");

if (
    languageHero &&
    page.hero_image
) {
    languageHero.style.backgroundImage =
        `url("${page.hero_image}")`;
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


        if (languageLoading) {
            languageLoading.style.display =
                "none";
        }


        renderLanguageSections(
            sections || []
        );


    } catch (error) {

        console.error(
            "Language page loading failed:",
            error
        );


        if (languageLoading) {
            languageLoading.style.display =
                "none";
        }


        showLanguageMessage(
            "Unable to Load Language Page",
            "Please try again later."
        );
    }
}


/* =========================================
   RENDER LANGUAGE SECTIONS
========================================= */

function renderLanguageSections(sections) {

    if (!languageSections) {
        return;
    }


    if (!sections.length) {

        showLanguageMessage(
            "Language Information Coming Soon",
            "Information about the language, expressions and linguistic heritage of Agbor Kingdom will appear here."
        );

        return;
    }


    languageSections.innerHTML = sections
        .map((section, index) => {

            const title =
                escapeLanguageText(
                    section.title ||
                    "Language & Heritage"
                );

            const subtitle =
                escapeLanguageText(
                    section.subtitle ||
                    ""
                );

            const content =
                escapeLanguageText(
                    section.content ||
                    ""
                );

            const label =
                escapeLanguageText(
                    section.label ||
                    "LANGUAGE"
                );

            const imageUrl =
                section.image_url
                    ? escapeLanguageText(
                        section.image_url
                    )
                    : "";


            const imageHTML = imageUrl
                ? `
                    <div class="language-section-image">

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
                    ? "language-section"
                    : "language-section language-section-reverse";


            return `

                <article class="${layoutClass}">

                    ${imageHTML}

                    <div class="language-section-content">

                        <span class="language-label">
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

                        <p>
                            ${content}
                        </p>

                    </div>

                </article>

            `;

        })
        .join("");
}


/* =========================================
   EMPTY / ERROR MESSAGE
========================================= */

function showLanguageMessage(
    title,
    message
) {

    if (!languageSections) {
        return;
    }


    languageSections.innerHTML = `

        <div class="language-message">

            <div class="language-message-icon">
                ✦
            </div>

            <h3>
                ${escapeLanguageText(title)}
            </h3>

            <p>
                ${escapeLanguageText(message)}
            </p>

        </div>

    `;
}


/* =========================================
   ESCAPE TEXT
========================================= */

function escapeLanguageText(text) {

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

loadLanguagePage();