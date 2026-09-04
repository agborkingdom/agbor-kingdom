console.log("Agbor Monarchs JS loaded");

/* =========================================
   MONARCHS PAGE
========================================= */

const monarchsPageSlug = "agbor-monarchs";

const monarchsHero =
    document.querySelector(".monarchs-hero");
    

const monarchsHeroTitle =
    document.getElementById("monarchsHeroTitle");

const monarchsHeroSubtitle =
    document.getElementById("monarchsHeroSubtitle");
/* =========================================
   PAGE ELEMENTS
========================================= */

const monarchsGrid =
    document.getElementById("monarchsGrid");

const monarchsLoading =
    document.getElementById("monarchsLoading");


/* =========================================
   ESCAPE HTML
========================================= */

function escapeMonarchHTML(value) {

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

function formatMonarchContent(content) {

    if (!content) {
        return "";
    }

    return String(content)
        .split(/\n\s*\n/)
        .map(paragraph => {

            const clean =
                escapeMonarchHTML(
                    paragraph.trim()
                );

            return clean
                ? `<p>${clean}</p>`
                : "";

        })
        .join("");
}


/* =========================================
   LOAD MONARCHS PAGE
========================================= */

async function loadMonarchsPage() {

    if (!monarchsGrid) {
        return;
    }

    if (typeof kingdomSupabase === "undefined") {

        console.error(
            "Agbor Monarchs: kingdomSupabase is not available."
        );

        if (monarchsLoading) {
            monarchsLoading.innerHTML = `
                <p>
                    Unable to connect to the kingdom database.
                </p>
            `;
        }

        return;
    }


    try {

        /* =====================================
           LOAD PAGE
        ===================================== */

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase

            .from("kingdom_pages")

            .select("*")

            .eq("slug", monarchsPageSlug)

            .eq("is_published", true)

            .maybeSingle();


        if (pageError) {
            throw pageError;
        }


        if (!page) {

            console.warn(
                "Agbor Monarchs page was not found."
            );

            if (monarchsGrid) {

                monarchsGrid.innerHTML = `
                    <div class="monarchs-loading">
                        <p>
                            Monarch information is currently unavailable.
                        </p>
                    </div>
                `;

            }

            return;
        }


        console.log(
            "AGBOR MONARCHS PAGE:",
            page
        );

        /* =====================================
   LOAD HERO
===================================== */

if (monarchsHero && page.hero_image) {

    monarchsHero.style.backgroundImage =
        `url("${page.hero_image}")`;
}


if (monarchsHeroTitle) {

    monarchsHeroTitle.textContent =
        page.title ||
        "Agbor Kingdom Monarchs";
}


if (monarchsHeroSubtitle) {

    monarchsHeroSubtitle.textContent =
        page.subtitle ||
        "";
}
 /* =====================================
           LOAD MONARCH SECTIONS
        ===================================== */

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
            "AGBOR MONARCHS SECTIONS:",
            sections
        );


        renderMonarchs(
            sections || []
        );


        document.title =
            `${page.title} | Agbor Kingdom`;


    } catch (error) {

        console.error(
            "Agbor Monarchs page loading failed:",
            error
        );


        if (monarchsGrid) {

            monarchsGrid.innerHTML = `
                <div class="monarchs-loading">

                    <p>
                        Monarch information is currently unavailable.
                    </p>

                </div>
            `;

        }

    }

}


/* =========================================
   RENDER MONARCHS
========================================= */

function renderMonarchs(sections) {

    if (!monarchsGrid) {
        return;
    }


    if (monarchsLoading) {
        monarchsLoading.remove();
    }


    if (!sections.length) {

        monarchsGrid.innerHTML = `
            <div class="monarchs-loading">

                <p>
                    No monarch information is currently available.
                </p>

            </div>
        `;

        return;
    }


    monarchsGrid.innerHTML = sections

        .map((monarch, index) => {

            const number =
                String(index + 1)
                    .padStart(2, "0");


            const label =
                escapeMonarchHTML(
                    monarch.label ||
                    "DEIN OF AGBOR"
                );


            const name =
                escapeMonarchHTML(
                    monarch.title ||
                    "Monarch Name"
                );


            const period =
                escapeMonarchHTML(
                    monarch.subtitle ||
                    "Historical Period"
                );


            const description =
                formatMonarchContent(
                    monarch.content ||
                    ""
                );


            const image =
                monarch.image_url
                    ? `
                        <img
                            src="${escapeMonarchHTML(
                                monarch.image_url
                            )}"
                            alt="${name}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div class="monarch-image-placeholder">
                            <span>
                                AGBOR KINGDOM
                            </span>
                        </div>
                    `;


            return `

                <article class="monarch-card">

                    <div class="monarch-image">

                        ${image}

                        <span class="monarch-number">
                            ${number}
                        </span>

                    </div>


                    <div class="monarch-content">

                        <span class="monarch-label">
                            ${label}
                        </span>

                        <h3>
                            ${name}
                        </h3>

                        <span class="monarch-period">
                            ${period}
                        </span>

                        <div class="monarch-description">
                            ${description}
                        </div>

                    </div>

                </article>

            `;

        })

        .join("");
}


/* =========================================
   START
========================================= */

loadMonarchsPage();