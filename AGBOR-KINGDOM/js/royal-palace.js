/* =========================================
   ROYAL PALACE PAGE
========================================= */

const palacePageSlug = "royal-palace";


/* =========================================
   PAGE ELEMENTS
========================================= */

const palaceHeroTitle =
    document.getElementById("palaceHeroTitle");

const palaceHeroSubtitle =
    document.getElementById("palaceHeroSubtitle");

const palaceIntroTitle =
    document.getElementById("palaceIntroTitle");

const palaceIntroContent =
    document.getElementById("palaceIntroContent");

const palaceSectionsGrid =
    document.getElementById("palaceSectionsGrid");

const palaceLoading =
    document.getElementById("palaceLoading");

const palaceHeritageImage =
    document.getElementById("palaceHeritageImage");

const palaceImagePlaceholder =
    document.getElementById("palaceImagePlaceholder");

const palaceHeritageTitle =
    document.getElementById("palaceHeritageTitle");

const palaceHeritageContent =
    document.getElementById("palaceHeritageContent");

const palaceRoleTitle =
    document.getElementById("palaceRoleTitle");

const palaceRoleContent =
    document.getElementById("palaceRoleContent");


/* =========================================
   ESCAPE HTML
========================================= */

function escapePalaceHTML(value) {

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

function formatPalaceContent(content) {

    if (!content) {
        return "";
    }

    return String(content)
        .split(/\n\s*\n/)
        .map(paragraph => {

            const clean =
                escapePalaceHTML(
                    paragraph.trim()
                );

            return clean
                ? `<p>${clean}</p>`
                : "";

        })
        .join("");

}


/* =========================================
   LOAD ROYAL PALACE PAGE
========================================= */

async function loadRoyalPalacePage() {

    /*
       IMPORTANT:
       We use the same kingdomSupabase
       variable created by supabase.js.
    */

    if (typeof kingdomSupabase === "undefined") {

        console.error(
            "Royal Palace: kingdomSupabase is not available."
        );

        return;
    }


    try {

        /* =====================================
           LOAD PAGE
        ====================================== */

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase

            .from("kingdom_pages")

            .select("*")

            .eq("slug", palacePageSlug)

            .eq("is_published", true)

            .maybeSingle();


        if (pageError) {

            throw pageError;

        }


        if (!page) {

            console.warn(
                "Royal Palace page was not found."
            );

            if (palaceLoading) {
                palaceLoading.style.display = "none";
            }

            return;

        }


        console.log(
            "ROYAL PALACE PAGE:",
            page
        );


        /* =====================================
           BASIC PAGE CONTENT
        ====================================== */

        if (palaceHeroTitle) {

            palaceHeroTitle.textContent =
                page.title ||
                "Royal Palace";

        }


        if (palaceHeroSubtitle) {

            palaceHeroSubtitle.textContent =
                page.subtitle ||
                "";

        }


        if (palaceIntroTitle) {

            palaceIntroTitle.textContent =
                page.intro_title ||
                "The Royal Palace of Agbor";

        }


        if (palaceIntroContent) {

            palaceIntroContent.innerHTML =
                formatPalaceContent(
                    page.intro_content ||
                    ""
                );

        }


        /* =====================================
           HERO IMAGE
        ====================================== */

        if (page.hero_image) {

            const palaceHero =
                document.querySelector(
                    ".palace-hero"
                );


            if (palaceHero) {

                palaceHero.style.backgroundImage =
                    `linear-gradient(
                        rgba(20, 15, 10, 0.62),
                        rgba(20, 15, 10, 0.72)
                    ),
                    url("${escapePalaceHTML(
                        page.hero_image
                    )}")`;

            }

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


        console.log(
            "ROYAL PALACE SECTIONS:",
            sections
        );


        /* =====================================
           RENDER NORMAL SECTIONS
        ====================================== */

        renderPalaceSections(
            sections || []
        );


        /* =====================================
           RENDER SPECIAL SECTIONS
        ====================================== */

        populatePalaceSpecialSections(
            sections || []
        );


        /* =====================================
           PAGE TITLE
        ====================================== */

        document.title =
            `${page.title || "Royal Palace"} | Agbor Kingdom`;


    } catch (error) {

        console.error(
            "Royal Palace page loading failed:",
            error
        );


        if (palaceLoading) {

            palaceLoading.style.display =
                "none";

        }


        if (palaceSectionsGrid) {

            palaceSectionsGrid.innerHTML = `

                <div class="palace-loading">

                    <p>
                        Royal Palace information
                        is currently unavailable.
                    </p>

                </div>

            `;

        }

    }

}


/* =========================================
   RENDER PALACE SECTIONS
========================================= */

function renderPalaceSections(sections) {

    if (!palaceSectionsGrid) {

        return;

    }


    /* Remove loading */

    if (palaceLoading) {

        palaceLoading.remove();

    }


    /* No sections */

    if (!sections.length) {

        palaceSectionsGrid.innerHTML = "";

        return;

    }


    /* Render sections */

    palaceSectionsGrid.innerHTML =

        sections

            .map(section => {

                const title =
                    escapePalaceHTML(
                        section.title ||
                        "Royal Palace"
                    );


                const subtitle =
                    escapePalaceHTML(
                        section.subtitle ||
                        "ROYAL INSTITUTION"
                    );


                const content =
                    formatPalaceContent(
                        section.content ||
                        ""
                    );


                const image =
                    section.image_url

                        ? `

                            <div class="palace-section-card-image">

                                <img
                                    src="${escapePalaceHTML(
                                        section.image_url
                                    )}"
                                    alt="${title}"
                                    loading="lazy"
                                >

                            </div>

                        `

                        : "";


                return `

                    <article
                        class="palace-section-card"
                    >

                        ${image}

                        <div class="palace-section-card-content">

                            <span>
                                ${subtitle}
                            </span>

                            <h3>
                                ${title}
                            </h3>

                            <div>
                                ${content}
                            </div>

                        </div>

                    </article>

                `;

            })

            .join("");

}


/* =========================================
   SPECIAL PALACE SECTIONS
========================================= */

function populatePalaceSpecialSections(
    sections
) {

    sections.forEach(section => {

        const type =
            String(
                section.section_type || ""
            )
                .toLowerCase()
                .trim();


        /* =================================
           PALACE HERITAGE
        ================================= */

        if (
            type === "heritage" ||
            type === "palace_heritage"
        ) {

            if (palaceHeritageTitle) {

                palaceHeritageTitle.textContent =
                    section.title ||
                    "A Place of Royal Heritage";

            }


            if (palaceHeritageContent) {

                palaceHeritageContent.innerHTML =
                    formatPalaceContent(
                        section.content ||
                        ""
                    );

            }


            if (
                palaceHeritageImage &&
                section.image_url
            ) {

                palaceHeritageImage.src =
                    section.image_url;

                palaceHeritageImage.alt =
                    section.title ||
                    "Royal Palace of Agbor Kingdom";

                palaceHeritageImage.style.display =
                    "block";


                if (palaceImagePlaceholder) {

                    palaceImagePlaceholder.style.display =
                        "none";

                }

            }

        }


        /* =================================
           PALACE ROLE
        ================================= */

        if (
            type === "role" ||
            type === "palace_role"
        ) {

            if (palaceRoleTitle) {

                palaceRoleTitle.textContent =
                    section.title ||
                    "The Role of the Palace";

            }


            if (palaceRoleContent) {

                palaceRoleContent.innerHTML =
                    formatPalaceContent(
                        section.content ||
                        ""
                    );

            }

        }

    });

}


/* =========================================
   START ROYAL PALACE
========================================= */

loadRoyalPalacePage();