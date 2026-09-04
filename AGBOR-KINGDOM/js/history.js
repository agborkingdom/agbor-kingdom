

/* =========================================
   HISTORY PAGE
========================================= */

const historyHeroTitle =
    document.getElementById("historyHeroTitle");

const historyHeroSubtitle =
    document.getElementById("historyHeroSubtitle");

const historyIntroTitle =
    document.getElementById("historyIntroTitle");

const historyIntroContent =
    document.getElementById("historyIntroContent");

const historyTimeline =
    document.getElementById("historyTimeline");

const historyTimelineLoading =
    document.getElementById("historyTimelineLoading");

const historyHeritageImage =
    document.getElementById("historyHeritageImage");

const historyHeritagePlaceholder =
    document.getElementById(
        "historyHeritagePlaceholder"
    );

const historyHeritageTitle =
    document.getElementById("historyHeritageTitle");

const historyHeritageContent =
    document.getElementById(
        "historyHeritageContent"
    );

const historyHeritageButton =
    document.getElementById(
        "historyHeritageButton"
    );


/* =========================================
   LOAD HISTORY PAGE
========================================= */

async function loadHistoryPage() {

    /*
       Make sure the shared Supabase client
       from main.js is available.
    */

    if (
        typeof kingdomSupabase === "undefined"
    ) {

        console.error(
            "History page: kingdomSupabase is not defined."
        );

        showHistoryError(
            "Unable to connect to the Kingdom database."
        );

        return;
    }


    try {

        console.log(
            "HISTORY: Loading page..."
        );


        /* =====================================
           LOAD MAIN PAGE
        ===================================== */

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase

            .from("kingdom_pages")

            .select("*")

            .eq(
                "slug",
                "history-of-agbor"
            )

            .eq(
                "is_published",
                true
            )

            .maybeSingle();


        if (pageError) {

            throw pageError;

        }


        if (!page) {

            console.warn(
                "HISTORY: Page not found."
            );

            showHistoryError(
                "History of Agbor is currently unavailable."
            );

            return;

        }


        console.log(
            "HISTORY PAGE:",
            page
        );


        /* =====================================
           LOAD PAGE SECTIONS
        ===================================== */

        const {
            data: sections,
            error: sectionsError
        } = await kingdomSupabase

            .from("page_sections")

            .select("*")

            .eq(
                "page_id",
                page.id
            )

            .eq(
                "is_active",
                true
            )

            .order(
                "sort_order",
                {
                    ascending: true
                }
            );


        if (sectionsError) {

            throw sectionsError;

        }


        console.log(
            "HISTORY SECTIONS:",
            sections
        );


        /* =====================================
           RENDER PAGE
        ===================================== */

        renderHistoryPage(
            page,
            sections || []
        );


    } catch (error) {

        console.error(
            "History page loading failed:",
            error
        );

        showHistoryError(
            "Unable to load the History of Agbor page."
        );

    }

}


/* =========================================
   RENDER HISTORY PAGE
========================================= */

function renderHistoryPage(
    page,
    sections
) {


    /* =====================================
       HERO
    ===================================== */

    if (historyHeroTitle) {

        historyHeroTitle.textContent =
            page.title ||
            "History of Agbor";

    }


    if (historyHeroSubtitle) {

        historyHeroSubtitle.textContent =
            page.subtitle ||
            "The history, origins and heritage of Agbor Kingdom.";

    }


    /*
       Optional hero image.

       Your current database row has
       hero_image = null, so the CSS
       background image will remain
       as the fallback.
    */

    if (page.hero_image) {

        const hero =
            document.querySelector(
                ".history-hero"
            );

        if (hero) {

            hero.style.backgroundImage =
                `
                linear-gradient(
                    rgba(20, 15, 10, 0.62),
                    rgba(20, 15, 10, 0.72)
                ),
                url("${escapeHistoryAttribute(
                    page.hero_image
                )}")
                `;

        }

    }


    /* =====================================
       INTRODUCTION
    ===================================== */

    if (historyIntroTitle) {

        historyIntroTitle.textContent =
            page.intro_title ||
            "The Story of Agbor Kingdom";

    }


    if (historyIntroContent) {

        if (page.intro_content) {

            historyIntroContent.innerHTML =
                formatHistoryContent(
                    page.intro_content
                );

        } else {

            historyIntroContent.innerHTML = `
                <p>
                    The history of Agbor Kingdom reflects
                    the traditions, people, institutions
                    and heritage that have shaped the
                    Kingdom through generations.
                </p>
            `;

        }

    }


    /* =====================================
       FIND TIMELINE SECTIONS
    ===================================== */

    const timelineSections =
        sections.filter(
            section =>
                section.section_type ===
                "timeline"
        );


    renderHistoryTimeline(
        timelineSections
    );


    /* =====================================
       FIND HERITAGE SECTION
    ===================================== */

    const heritageSection =
        sections.find(
            section =>
                section.section_type ===
                "heritage"
        );


    if (heritageSection) {

        renderHistoryHeritage(
            heritageSection
        );

    }


    /*
       If there is no dedicated heritage
       section, try to find a section
       containing "heritage" in its title.
    */

    else {

        const fallbackHeritage =
            sections.find(
                section =>
                    String(
                        section.title || ""
                    )
                        .toLowerCase()
                        .includes(
                            "heritage"
                        )
            );


        if (fallbackHeritage) {

            renderHistoryHeritage(
                fallbackHeritage
            );

        }

    }


    /* =====================================
       PAGE TITLE
    ===================================== */

    document.title =
        `${page.title || "History of Agbor"} | Agbor Kingdom`;

}


/* =========================================
   RENDER TIMELINE
========================================= */

function renderHistoryTimeline(
    sections
) {

    if (!historyTimeline) {

        return;

    }


    /*
       Remove loading message.
    */

    if (historyTimelineLoading) {

        historyTimelineLoading.remove();

    }


    if (!sections.length) {

        historyTimeline.innerHTML = `

            <div class="history-empty">

                <p>
                    Historical information will be
                    added to this section soon.
                </p>

            </div>

        `;

        return;

    }


    historyTimeline.innerHTML =
        sections
            .map(
                (
                    section,
                    index
                ) =>
                    createHistoryTimelineItem(
                        section,
                        index
                    )
            )
            .join("");

}


/* =========================================
   CREATE TIMELINE ITEM
========================================= */

function createHistoryTimelineItem(
    section,
    index
) {

    /*
       Use the section title as the
       timeline heading.
    */

    const title =
        escapeHistoryHTML(
            section.title ||
            "Historical Period"
        );


    const content =
        formatHistoryContent(
            section.content || ""
        );


    /*
       Try subtitle first.

       If subtitle is empty,
       use a simple number.
    */

    const marker =
        section.subtitle
            ? escapeHistoryHTML(
                section.subtitle
            )
            : String(
                index + 1
            ).padStart(
                2,
                "0"
            );


    return `

        <article
            class="history-timeline-item"
        >

            <div
                class="history-timeline-marker"
            >
                ${marker}
            </div>


            <div
                class="history-timeline-content"
            >

                ${
                    section.subtitle
                        ? `
                            <span>
                                ${escapeHistoryHTML(
                                    section.subtitle
                                )}
                            </span>
                          `
                        : ""
                }


                <h3>
                    ${title}
                </h3>


                <div>
                    ${content}
                </div>

            </div>

        </article>

    `;

}


/* =========================================
   RENDER HERITAGE
========================================= */

function renderHistoryHeritage(
    section
) {


    if (historyHeritageTitle) {

        historyHeritageTitle.textContent =
            section.title ||
            "The Heritage of Agbor";

    }


    if (historyHeritageContent) {

        historyHeritageContent.innerHTML =
            formatHistoryContent(
                section.content || ""
            );

    }


    /* =====================================
       HERITAGE IMAGE
    ===================================== */

    if (
        historyHeritageImage &&
        section.image_url
    ) {

        historyHeritageImage.src =
            section.image_url;

        historyHeritageImage.alt =
            section.title ||
            "Heritage of Agbor Kingdom";

        historyHeritageImage.hidden =
            false;


        if (
            historyHeritagePlaceholder
        ) {

            historyHeritagePlaceholder
                .classList
                .add("hidden");

        }

    }


    /* =====================================
       HERITAGE BUTTON
    ===================================== */

    if (
        historyHeritageButton &&
        section.button_link
    ) {

        historyHeritageButton.href =
            section.button_link;

        historyHeritageButton.textContent =
            section.button_text ||
            "Explore Our Heritage";

        historyHeritageButton.innerHTML = `

            ${escapeHistoryHTML(
                section.button_text ||
                "Explore Our Heritage"
            )}

            <span>→</span>

        `;

        historyHeritageButton.hidden =
            false;

    }

}


/* =========================================
   FORMAT CONTENT
========================================= */

function formatHistoryContent(
    content
) {

    if (!content) {

        return "";

    }


    /*
       If the database content contains
       normal line breaks, convert them
       into paragraphs.

       We escape the content first so
       database text cannot inject HTML.
    */

    const safeContent =
        escapeHistoryHTML(
            content
        );


    return safeContent

        .split(/\n\s*\n/)

        .map(
            paragraph =>
                `<p>${paragraph
                    .replace(/\n/g, "<br>")}
                </p>`
        )

        .join("");

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHistoryHTML(
    text
) {

    return String(
        text || ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   ESCAPE ATTRIBUTE
========================================= */

function escapeHistoryAttribute(
    text
) {

    return String(
        text || ""
    )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   ERROR STATE
========================================= */

function showHistoryError(
    message
) {

    if (historyTimeline) {

        historyTimeline.innerHTML = `

            <div class="history-empty">

                <p>
                    ${escapeHistoryHTML(
                        message
                    )}
                </p>

            </div>

        `;

    }


    if (historyTimelineLoading) {

        historyTimelineLoading.remove();

    }

}


/* =========================================
   START HISTORY PAGE
========================================= */

loadHistoryPage();
