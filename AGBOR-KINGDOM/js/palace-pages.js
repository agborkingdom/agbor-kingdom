

/* =========================================
   PALACE PAGES
========================================= */

const palacePagesGrid =
    document.getElementById("palacePagesGrid");

const palacePagesLoading =
    document.getElementById("palacePagesLoading");

const palacePagesEmpty =
    document.getElementById("palacePagesEmpty");


/* =========================================
   LOAD PALACE PAGES
========================================= */

async function loadPalacePages() {

    if (!palacePagesGrid) {
        return;
    }

    try {

        if (palacePagesLoading) {
            palacePagesLoading.hidden = false;
        }

        if (palacePagesEmpty) {
            palacePagesEmpty.hidden = true;
        }


        /* =====================================
           LOAD PAGE
        ====================================== */

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase

            .from("kingdom_pages")

            .select("*")

            .eq("slug", "palace-pages")

            .eq("is_published", true)

            .single();


        if (pageError) {
            throw pageError;
        }


        if (!page) {

            showPalacePagesEmpty();

            return;
        }


        console.log(
            "PALACE PAGE:",
            page
        );


        /* =====================================
           PAGE HEADER
        ====================================== */

        const title =
            document.getElementById(
                "palacePagesSectionTitle"
            );

        const description =
            document.getElementById(
                "palacePagesSectionDescription"
            );


        if (title) {

            title.textContent =
                page.title ||
                "Palace Pages";

        }


        if (description) {

            description.textContent =
                page.subtitle ||
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


        console.log(
            "PALACE PAGE SECTIONS:",
            sections
        );


        /* =====================================
           RENDER
        ====================================== */

        renderPalacePages(
            sections || []
        );


    } catch (error) {

        console.error(
            "Palace Pages loading failed:",
            error
        );

        showPalacePagesEmpty();

    }

}


/* =========================================
   RENDER PALACE PAGE CARDS
========================================= */

function renderPalacePages(sections) {

    if (!palacePagesGrid) {
        return;
    }

    if (palacePagesLoading) {
        palacePagesLoading.hidden = true;
    }

    if (!sections.length) {
        showPalacePagesEmpty();
        return;
    }


    palacePagesGrid.innerHTML = sections
        .map((section) => {

            const title =
                escapePalaceText(
                    section.title ||
                    "Palace Page"
                );

            const subtitle =
                escapePalaceText(
                    section.subtitle ||
                    ""
                );

            const content =
                escapePalaceText(
                    section.content ||
                    ""
                );

            const label =
                escapePalaceText(
                    section.label ||
                    "ROYAL PALACE"
                );

            const image =
                section.image_url ||
                "";


            return `
                <article class="palace-page-card">

                    ${
                        image
                            ? `
                                <div class="palace-page-card-image">

                                    <img
                                        src="${escapePalaceText(image)}"
                                        alt="${title}"
                                        loading="lazy"
                                    >

                                </div>
                              `
                            : `
                                <div class="palace-page-card-image palace-page-card-placeholder">

                                    <span>
                                        AGBOR
                                    </span>

                                </div>
                              `
                    }


                    <div class="palace-page-card-content">

                        <span class="palace-page-role">
                            ${label}
                        </span>

                        <h3>
                            ${title}
                        </h3>

                        ${
                            subtitle
                                ? `
                                    <h4>
                                        ${subtitle}
                                    </h4>
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
   EMPTY STATE
========================================= */

function showPalacePagesEmpty() {

    if (palacePagesLoading) {
        palacePagesLoading.hidden = true;
    }


    if (palacePagesGrid) {
        palacePagesGrid.innerHTML = "";
    }


    if (palacePagesEmpty) {

        palacePagesEmpty.hidden = false;

    }

}


/* =========================================
   ESCAPE TEXT
========================================= */

function escapePalaceText(text) {

    return String(text || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   START PALACE PAGES
========================================= */

loadPalacePages();

