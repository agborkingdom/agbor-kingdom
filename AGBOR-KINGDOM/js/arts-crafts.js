/* =========================================
   ARTS & CRAFTS PAGE
========================================= */

const artsCraftsPageSlug = "arts-crafts";

const artsCraftsSections =
    document.getElementById("artsCraftsSections");

const artsCraftsLoading =
    document.getElementById("artsCraftsLoading");


/* =========================================
   LOAD PAGE
========================================= */

async function loadArtsCraftsPage() {

    if (!artsCraftsSections) {
        return;
    }

    try {

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase
            .from("kingdom_pages")
            .select("*")
            .eq("slug", artsCraftsPageSlug)
            .eq("is_published", true)
            .maybeSingle();


        if (pageError) {
            throw pageError;
        }


        if (!page) {

            showArtsCraftsMessage(
                "Arts & Crafts Page Not Found",
                "Information about the arts and crafts of Agbor Kingdom will appear here."
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
                "Arts & Crafts of Agbor Kingdom";
        }


        if (pageSubtitle) {

            pageSubtitle.textContent =
                page.subtitle ||
                "";
        }


        if (introTitle) {

            introTitle.textContent =
                page.intro_title ||
                "The Creative Heritage of Agbor";
        }


        if (introContent) {

            introContent.textContent =
                page.intro_content ||
                "";
        }


        /* =====================================
           HERO IMAGE
        ====================================== */
        const hero = document.querySelector(".arts-crafts-hero");

if (hero && page.hero_image) {
    hero.style.backgroundImage = `
        linear-gradient(
            rgba(20, 15, 10, 0.55),
            rgba(20, 15, 10, 0.70)
        ),
        url("${escapeArtsCraftsText(page.hero_image)}")
    `;
}
        /* =====================================
           PAGE SECTIONS
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


        if (artsCraftsLoading) {

            artsCraftsLoading.style.display =
                "none";
        }


        renderArtsCraftsSections(
            sections || []
        );


    } catch (error) {

        console.error(
            "Arts & Crafts page loading failed:",
            error
        );


        if (artsCraftsLoading) {

            artsCraftsLoading.style.display =
                "none";
        }


        showArtsCraftsMessage(
            "Unable to Load Arts & Crafts",
            "Please try again later."
        );
    }
}


/* =========================================
   RENDER SECTIONS
========================================= */

function renderArtsCraftsSections(sections) {

    if (!artsCraftsSections) {
        return;
    }


    if (!sections.length) {

        showArtsCraftsMessage(
            "Content Coming Soon",
            "Information about the arts and crafts of Agbor Kingdom will appear here."
        );

        return;
    }


    artsCraftsSections.innerHTML = sections
        .map((section, index) => {

            const title =
                escapeArtsCraftsText(
                    section.title ||
                    "Arts & Crafts"
                );


            const subtitle =
                escapeArtsCraftsText(
                    section.subtitle ||
                    ""
                );


           const content =
    formatArtsCraftsContent(
        section.content || ""
    );


            const label =
                escapeArtsCraftsText(
                    section.label ||
                    "ARTS & CRAFTS"
                );


            const imageUrl =
                section.image_url
                    ? escapeArtsCraftsText(
                        section.image_url
                    )
                    : "";


            const imageHTML = imageUrl
                ? `
                    <div class="arts-crafts-section-image">

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
                    ? "arts-crafts-section"
                    : "arts-crafts-section arts-crafts-section-reverse";


            return `

                <article class="${layoutClass}">

                    ${imageHTML}

                    <div class="arts-crafts-section-content">

                        <span class="arts-crafts-label">
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

                        
                        <div class="arts-crafts-text">
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

function showArtsCraftsMessage(
    title,
    message
) {

    if (!artsCraftsSections) {
        return;
    }


    artsCraftsSections.innerHTML = `

        <div class="arts-crafts-message">

            <div class="arts-crafts-message-icon">
                ✦
            </div>

            <h3>
                ${escapeArtsCraftsText(title)}
            </h3>

            <p>
                ${escapeArtsCraftsText(message)}
            </p>

        </div>

    `;
}

function formatArtsCraftsContent(content) {

    if (!content) {
        return "";
    }

    return escapeArtsCraftsText(content)
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

function escapeArtsCraftsText(text) {

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

loadArtsCraftsPage();