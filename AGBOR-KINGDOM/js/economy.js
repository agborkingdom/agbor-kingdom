/* =========================================
   ECONOMY PAGE
========================================= */
const economyTraditionalImage =
    document.getElementById(
        "economyTraditionalImage"
    );
const economyPageContent =
    document.getElementById("economyPageContent");

const economyHeroTitle =
    document.getElementById("economyHeroTitle");

const economyHeroSubtitle =
    document.getElementById("economyHeroSubtitle");

const economyIntroTitle =
    document.getElementById("economyIntroTitle");

const economyIntroContent =
    document.getElementById("economyIntroContent");

const economyGrid =
    document.getElementById("economyGrid");

const economyTraditionalTitle =
    document.getElementById("economyTraditionalTitle");

const economyTraditionalContent =
    document.getElementById("economyTraditionalContent");

const economyFutureTitle =
    document.getElementById("economyFutureTitle");

const economyFutureContent =
    document.getElementById("economyFutureContent");

    const economyHero =
    document.querySelector(".economy-hero");


/* =========================================
   LOAD ECONOMY PAGE
========================================= */

async function loadEconomyPage() {

    try {

        const { data: page, error: pageError } =
            await kingdomSupabase
                .from("kingdom_pages")
                .select("*")
                .eq("slug", "economy")
                .eq("is_published", true)
                .single();

        if (pageError) {
            throw pageError;
        }

        console.log("ECONOMY PAGE:", page);


        const { data: sections, error: sectionsError } =
            await kingdomSupabase
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
            "ECONOMY SECTIONS:",
            sections
        );


        renderEconomyPage(
            page,
            sections || []
        );

    } catch (error) {

        console.error(
            "Economy page loading failed:",
            error
        );

    }
}


/* =========================================
   RENDER ECONOMY PAGE
========================================= */

function renderEconomyPage(page, sections) {

    /* HERO */

    if (
    economyHero &&
    page.hero_image
) {

    economyHero.style.backgroundImage =
        `url("${page.hero_image}")`;
}

    if (economyHeroTitle) {

        economyHeroTitle.textContent =
            page.title ||
            "Economy of Agbor Kingdom";

    }

    if (economyHeroSubtitle) {

        economyHeroSubtitle.textContent =
            page.subtitle || "";

    }


    /* INTRO */

    if (economyIntroTitle) {

        economyIntroTitle.textContent =
            page.intro_title ||
            "The Economic Life of Agbor Kingdom";

    }

    if (economyIntroContent) {

        economyIntroContent.textContent =
            page.intro_content || "";

    }


    /* ECONOMIC CARDS */

    const cards = sections.filter(
        section =>
            section.section_type === "card"
    );

    if (economyGrid) {

        economyGrid.innerHTML =
            cards.map(
                createEconomyCard
            ).join("");

    }


    /* TRADITIONAL ECONOMIC LIFE */

    const traditional =
        sections.find(
            section =>
                section.title ===
                "Traditional Economic Life"
        );

    if (traditional) {

        if (economyTraditionalTitle) {

            economyTraditionalTitle.textContent =
                traditional.title || "";

        }

        if (economyTraditionalContent) {

            economyTraditionalContent.textContent =
                traditional.content || "";

        }

    }

    if (traditional) {

    if (economyTraditionalTitle) {

        economyTraditionalTitle.textContent =
            traditional.title || "";

    }

    if (economyTraditionalContent) {

        economyTraditionalContent.textContent =
            traditional.content || "";

    }

    if (
        economyTraditionalImage &&
        traditional.image_url
    ) {

        economyTraditionalImage.src =
            traditional.image_url;

        economyTraditionalImage.alt =
            traditional.title ||
            "Traditional economic life in Agbor Kingdom";

    }

}


    /* ECONOMIC FUTURE */

    const future =
        sections.find(
            section =>
                section.title ===
                "Economic Future"
        );

    if (future) {

        if (economyFutureTitle) {

            economyFutureTitle.textContent =
                future.title || "";

        }

        if (economyFutureContent) {

            economyFutureContent.textContent =
                future.content || "";

        }

    }

}


/* =========================================
   CREATE ECONOMY CARD
========================================= */

function createEconomyCard(section) {

    const title =
        escapeSearchText(
            section.title || ""
        );

    const subtitle =
        escapeSearchText(
            section.subtitle || ""
        );

    const content =
        escapeSearchText(
            section.content || ""
        );

    const image =
        section.image_url || "";

    return `
        <article class="economy-card">

            ${
                image
                    ? `
                        <div class="economy-card-image">
                            <img
                                src="${escapeSearchText(image)}"
                                alt="${title}"
                                loading="lazy"
                            >
                        </div>
                    `
                    : ""
            }

            <div class="economy-card-content">

                <h3>
                    ${title}
                </h3>

                ${
                    subtitle
                        ? `
                            <span class="economy-card-subtitle">
                                ${subtitle}
                            </span>
                        `
                        : ""
                }

                <p>
                    ${content}
                </p>

            </div>

        </article>
    `;
}


/* =========================================
   START ECONOMY PAGE
========================================= */

loadEconomyPage();