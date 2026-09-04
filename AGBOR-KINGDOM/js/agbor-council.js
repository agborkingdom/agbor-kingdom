
/* =========================================
   AGBOR KINGDOM — COUNCIL OF CHIEFS
========================================= */

const councilPageSlug = "council-of-chiefs";

/* =========================================
   PAGE ELEMENTS
========================================= */

const councilHeroTitle =
    document.getElementById("councilHeroTitle");

const councilHeroSubtitle =
    document.getElementById("councilHeroSubtitle");

const councilIntroTitle =
    document.getElementById("councilIntroTitle");

const councilIntroContent =
    document.getElementById("councilIntroContent");

const chiefsGrid =
    document.getElementById("chiefsGrid");

const chiefsLoading =
    document.getElementById("chiefsLoading");

const councilRoleTitle =
    document.getElementById("councilRoleTitle");

const councilRoleContent =
    document.getElementById("councilRoleContent");

    


/* =========================================
   ESCAPE HTML
========================================= */

function escapeCouncilHTML(value) {

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

function formatCouncilContent(content) {

    if (!content) {
        return "";
    }

    return String(content)
        .split(/\n\s*\n/)
        .map(paragraph => {

            const clean =
                escapeCouncilHTML(
                    paragraph.trim()
                );

            return clean
                ? `<p>${clean}</p>`
                : "";

        })
        .join("");
}


/* =========================================
   LOAD COUNCIL PAGE
========================================= */

async function loadCouncilPage() {

    if (!kingdomSupabase) {

        console.error(
            "Council of Chiefs: kingdomSupabase is not available."
        );

        return;
    }

    try {

        /* =====================================
           LOAD MAIN PAGE
        ===================================== */

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase

            .from("kingdom_pages")

            .select("*")

            .eq("slug", councilPageSlug)

            .eq("is_published", true)

            .maybeSingle();


        if (pageError) {
            throw pageError;
        }


        if (!page) {

            console.warn(
                "Council of Chiefs page was not found."
            );

            if (chiefsGrid) {

                chiefsGrid.innerHTML = `
                    <div class="homepage-events-message">
                        <p>
                            Council information is currently unavailable.
                        </p>
                    </div>
                `;
            }

            return;
        }


        console.log(
            "COUNCIL OF CHIEFS PAGE:",
            page
        );

const councilHero = document.querySelector(".council-hero");

if (councilHero && page.hero_image) {
    councilHero.style.backgroundImage = `
        linear-gradient(
            rgba(20, 15, 10, 0.55),
            rgba(20, 15, 10, 0.70)
        ),
        url("${escapeCouncilHTML(page.hero_image)}")
    `;
}
        /* =====================================
           BASIC PAGE CONTENT
        ===================================== */

        if (councilHeroTitle) {

            councilHeroTitle.textContent =
                page.title ||
                "Council of Chiefs";
        }


        if (councilHeroSubtitle) {

            councilHeroSubtitle.textContent =
                page.subtitle ||
                "";
        }


        if (councilIntroTitle) {

            councilIntroTitle.textContent =
                page.intro_title ||
                "Council of Chiefs of Agbor Kingdom";
        }


        if (councilIntroContent) {

            councilIntroContent.innerHTML =
                formatCouncilContent(
                    page.intro_content ||
                    ""
                );
        }


        /* =====================================
           LOAD PAGE SECTIONS
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
            "COUNCIL OF CHIEFS SECTIONS:",
            sections
        );


        /* =====================================
           RENDER CHIEFS
        ===================================== */

        renderCouncilChiefs(
            sections || []
        );


        /* =====================================
           RENDER COUNCIL ROLE
        ===================================== */

        renderCouncilRole(
            sections || []
        );


        /* =====================================
           PAGE TITLE
        ===================================== */

        document.title =
            `${page.title} | Agbor Kingdom`;


    } catch (error) {

        console.error(
            "Council of Chiefs page loading failed:",
            error
        );


        if (chiefsGrid) {

            chiefsGrid.innerHTML = `
                <div class="homepage-events-message">
                    <p>
                        Council information is currently unavailable.
                    </p>
                </div>
            `;
        }

    }

}


/* =========================================
   RENDER CHIEFS
========================================= */

function renderCouncilChiefs(sections) {

    if (!chiefsGrid) {
        return;
    }


    if (chiefsLoading) {
        chiefsLoading.remove();
    }


    /*
       Only sections with section_type = chief
       are displayed as chief cards.
    */

    const chiefs = sections.filter(section => {

        const type =
            String(
                section.section_type || ""
            )
            .trim()
            .toLowerCase();

        return (
            type === "chief" ||
            type === "council_chief" ||
            type === "council-chief"
        );

    });


    if (!chiefs.length) {

        chiefsGrid.innerHTML = `
            <div class="homepage-events-message">
                <p>
                    Council of Chiefs information
                    will be published here.
                </p>
            </div>
        `;

        return;
    }


    chiefsGrid.innerHTML = chiefs
        .map((chief, index) => {

            const number =
                String(index + 1)
                    .padStart(2, "0");


            const name =
                escapeCouncilHTML(
                    chief.title ||
                    "Chief of Agbor Kingdom"
                );


            const title =
                escapeCouncilHTML(
                    chief.subtitle ||
                    "Traditional Title"
                );


            const description =
                formatCouncilContent(
                    chief.content ||
                    ""
                );


            const image =
                chief.image_url
                    ? `
                        <div class="chief-image">

                            <img
                                src="${escapeCouncilHTML(
                                    chief.image_url
                                )}"
                                alt="${name}"
                                loading="lazy"
                            >

                            <span class="chief-number">
                                ${number}
                            </span>

                        </div>
                    `
                    : `
                        <div class="chief-image">

                            <div class="chief-image-placeholder">
                                <span>
                                    AGBOR KINGDOM
                                </span>
                            </div>

                            <span class="chief-number">
                                ${number}
                            </span>

                        </div>
                    `;


            /*
               If button_link is being used as the
               community value, display it.
               Otherwise no community line appears.
            */

            const community =
                chief.button_link
                    ? `
                        <div class="chief-community">
                            ${escapeCouncilHTML(
                                chief.button_link
                            )}
                        </div>
                    `
                    : "";


            return `

                <article class="chief-card">

                    ${image}

                    <div class="chief-content">

                        <span class="chief-label">
    ${escapeCouncilHTML(
        chief.label || "COUNCIL OF CHIEFS"
    )}
</span>
                        <h3>
                            ${name}
                        </h3>

                        <span class="chief-title">
                            ${title}
                        </span>

                        ${community}

                        <div class="chief-description">
                            ${description}
                        </div>

                    </div>

                </article>

            `;

        })
        .join("");

}


/* =========================================
   RENDER COUNCIL ROLE
========================================= */

function renderCouncilRole(sections) {

    if (
        !councilRoleTitle &&
        !councilRoleContent
    ) {
        return;
    }


    const roleSection =
        sections.find(section => {

            const type =
                String(
                    section.section_type || ""
                )
                .trim()
                .toLowerCase();

            return (
                type === "council_role" ||
                type === "council-role" ||
                type === "role"
            );

        });


    if (!roleSection) {
        return;
    }


    if (councilRoleTitle) {

        councilRoleTitle.textContent =
            roleSection.title ||
            "The Role of the Council";
    }


    if (councilRoleContent) {

        councilRoleContent.innerHTML =
            formatCouncilContent(
                roleSection.content ||
                ""
            );
    }

}


/* =========================================
   START
========================================= */

loadCouncilPage();

