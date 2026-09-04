
/* =========================================
   TRADITIONS PAGE
========================================= */

const traditionsHero =
    document.getElementById("traditionsHero");

const traditionsTitle =
    document.getElementById("traditionsTitle");

const traditionsSubtitle =
    document.getElementById("traditionsSubtitle");

const traditionsIntroTitle =
    document.getElementById("traditionsIntroTitle");

const traditionsIntroContent =
    document.getElementById("traditionsIntroContent");

const traditionsSections =
    document.getElementById("traditionsSections");


/* =========================================
   LOAD TRADITIONS PAGE
========================================= */

async function loadTraditionsPage() {

    if (!traditionsSections) {
        return;
    }

    try {

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase

            .from("kingdom_pages")

            .select("*")

            .eq("slug", "traditions")

            .eq("is_published", true)

            .single();


        if (pageError) {
            throw pageError;
        }


        if (!page) {
            showTraditionsError();
            return;
        }


        renderTraditionsPage(page);


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


        renderTraditionSections(
            sections || []
        );


        console.log(
            "TRADITIONS PAGE:",
            page
        );


        console.log(
            "TRADITIONS SECTIONS:",
            sections
        );


    } catch (error) {

        console.error(
            "Traditions page loading failed:",
            error
        );

        showTraditionsError();

    }

}


/* =========================================
   RENDER PAGE
========================================= */

function renderTraditionsPage(page) {

    if (traditionsTitle) {

        traditionsTitle.textContent =
            page.title ||
            "Traditions of Agbor Kingdom";

    }


    if (traditionsSubtitle) {

        traditionsSubtitle.textContent =
            page.subtitle ||
            "";

    }


    if (traditionsIntroTitle) {

        traditionsIntroTitle.textContent =
            page.intro_title ||
            "Our Traditions";

    }


    if (traditionsIntroContent) {

        traditionsIntroContent.innerHTML =
            formatTraditionsContent(
                page.intro_content ||
                ""
            );

    }


    if (
        traditionsHero &&
        page.hero_image
    ) {

        traditionsHero.style.backgroundImage =
            `linear-gradient(
                rgba(0, 0, 0, 0.48),
                rgba(0, 0, 0, 0.62)
            ),
            url("${page.hero_image}")`;

    }

}


/* =========================================
   RENDER CONTENT SECTIONS
========================================= */

function renderTraditionSections(
    sections
) {

    if (!traditionsSections) {
        return;
    }


    if (!sections.length) {

        traditionsSections.innerHTML = "";

        return;

    }


    traditionsSections.innerHTML =
        sections
            .map((section, index) => {

                const title =
                    escapeTraditionsText(
                        section.title ||
                        ""
                    );


                const subtitle =
                    escapeTraditionsText(
                        section.subtitle ||
                        ""
                    );


                const content =
                    formatTraditionsContent(
                        section.content ||
                        ""
                    );


                const image =
                    section.image_url
                        ? escapeTraditionsText(
                            section.image_url
                        )
                        : "";


                const label =
                    escapeTraditionsText(
                        section.label ||
                        "TRADITION & HERITAGE"
                    );


                const reverse =
                    index % 2 !== 0
                        ? "reverse"
                        : "";


                return `

                    <article
                        class="traditions-section ${reverse}"
                    >

                        ${
                            image

                            ? `

                                <div
                                    class="traditions-section-image"
                                >

                                    <img
                                        src="${image}"
                                        alt="${title}"
                                        loading="lazy"
                                    >

                                </div>

                              `

                            : ""
                        }


                        <div
                            class="traditions-section-content"
                        >

                            <span
                                class="section-label"
                            >
                                ${label}
                            </span>


                            ${
                                title
                                    ? `
                                        <h2>
                                            ${title}
                                        </h2>
                                      `
                                    : ""
                            }


                            ${
                                subtitle
                                    ? `
                                        <p>
                                            <strong>
                                                ${subtitle}
                                            </strong>
                                        </p>
                                      `
                                    : ""
                            }


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
   FORMAT CONTENT
========================================= */

function formatTraditionsContent(
    content
) {

    if (!content) {
        return "";
    }


    return String(content)
        .split(/\n\s*\n/)
        .map(paragraph => {

            const clean =
                escapeTraditionsText(
                    paragraph.trim()
                );


            if (!clean) {
                return "";
            }


            return `<p>${clean}</p>`;

        })
        .join("");

}


/* =========================================
   ESCAPE TEXT
========================================= */

function escapeTraditionsText(text) {

    return String(text || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   ERROR
========================================= */

function showTraditionsError() {

    if (!traditionsSections) {
        return;
    }


    traditionsSections.innerHTML = `

        <div
            class="traditions-empty"
        >

            <h2>
                Traditions Content Unavailable
            </h2>

            <p>
                We are currently updating the
                traditions and cultural heritage
                section of Agbor Kingdom.
            </p>

        </div>

    `;

}


/* =========================================
   START
========================================= */

loadTraditionsPage();

