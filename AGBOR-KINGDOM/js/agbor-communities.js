
/* =========================================
   AGBOR KINGDOM COMMUNITIES PAGE
========================================= */

const communitiesPageSlug = "communities";


/* =========================================
   PAGE ELEMENTS
========================================= */

const communitiesHeroTitle =
    document.getElementById("communitiesHeroTitle");

const communitiesHeroSubtitle =
    document.getElementById("communitiesHeroSubtitle");

const communitiesIntroTitle =
    document.getElementById("communitiesIntroTitle");

const communitiesIntroContent =
    document.getElementById("communitiesIntroContent");

const communitiesGrid =
    document.getElementById("communitiesGrid");


/* =========================================
   ESCAPE HTML
========================================= */

function escapeCommunitiesHTML(value) {

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

function formatCommunitiesContent(content) {

    if (!content) {
        return "";
    }

    return String(content)
        .split(/\n\s*\n/)
        .map(paragraph => {

            const clean =
                escapeCommunitiesHTML(
                    paragraph.trim()
                );

            return clean
                ? `<p>${clean}</p>`
                : "";

        })
        .join("");

}


/* =========================================
   LOAD COMMUNITIES PAGE
========================================= */

async function loadCommunitiesPage() {

    /*
        Make sure the Supabase client exists.
    */

    if (typeof kingdomSupabase === "undefined") {

        console.error(
            "Communities: kingdomSupabase is not available."
        );

        return;

    }


    try {

        /* =====================================
           LOAD PAGE INFORMATION
        ===================================== */

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase

            .from("kingdom_pages")

            .select("*")

            .eq("slug", communitiesPageSlug)

            .eq("is_published", true)

            .maybeSingle();


        if (pageError) {

            throw pageError;

        }


        if (!page) {

            console.warn(
                "Communities page was not found."
            );

            return;

        }


        console.log(
            "COMMUNITIES PAGE:",
            page
        );


        /* =====================================
           HERO CONTENT
        ===================================== */

        if (communitiesHeroTitle) {

            communitiesHeroTitle.textContent =
                page.title ||
                "Agbor Kingdom Communities";

        }


        if (communitiesHeroSubtitle) {

            communitiesHeroSubtitle.textContent =
                page.subtitle ||
                "";

        }

        if (communitiesHeroSubtitle) {
    communitiesHeroSubtitle.textContent =
        page.subtitle ||
        "";
}

/* =====================================
   HERO BACKGROUND IMAGE
===================================== */

const communitiesHero =
    document.querySelector(".communities-hero");

if (communitiesHero && page.hero_image) {

    communitiesHero.style.backgroundImage =
        `url("${page.hero_image}")`;
}

        /* =====================================
           INTRODUCTION CONTENT
        ===================================== */

        if (communitiesIntroTitle) {

            communitiesIntroTitle.textContent =
                page.intro_title ||
                "Communities of Agbor Kingdom";

        }


        if (communitiesIntroContent) {

            communitiesIntroContent.innerHTML =
                formatCommunitiesContent(
                    page.intro_content ||
                    ""
                );

        }


        /* =====================================
           LOAD COMMUNITIES
        ===================================== */

        const {
            data: communities,
            error: communitiesError
        } = await kingdomSupabase

            .from("communities")

            .select("*")

            .eq("is_active", true)

            .order("sort_order", {
                ascending: true
            });


        if (communitiesError) {

            throw communitiesError;

        }


        console.log(
            "AGBOR COMMUNITIES:",
            communities
        );


        /* =====================================
           RENDER COMMUNITY CARDS
        ===================================== */

        renderCommunities(
            communities || []
        );


        /* =====================================
           PAGE TITLE
        ===================================== */

        document.title =
            `${page.title} | Agbor Kingdom`;


    } catch (error) {

        console.error(
            "Agbor Communities page loading failed:",
            error
        );


        if (communitiesGrid) {

            communitiesGrid.innerHTML = `

                <div class="communities-loading">

                    <p>
                        Community information is
                        currently unavailable.
                    </p>

                </div>

            `;

        }

    }

}


/* =========================================
   RENDER COMMUNITY CARDS
========================================= */

function renderCommunities(communities) {

    if (!communitiesGrid) {

        return;

    }


    /* =====================================
       NO COMMUNITIES
    ===================================== */

    if (!communities.length) {

        communitiesGrid.innerHTML = `

            <div class="communities-loading">

                <p>
                    Community information will
                    be available soon.
                </p>

            </div>

        `;

        return;

    }


    /* =====================================
       CREATE CARDS
    ===================================== */

    communitiesGrid.innerHTML =

        communities

            .map((community, index) => {

                const name =
                    escapeCommunitiesHTML(
                        community.name ||
                        "Agbor Kingdom Community"
                    );


                const description =
                    escapeCommunitiesHTML(
                        community.description ||
                        ""
                    );


                const category =
                    escapeCommunitiesHTML(
                        community.category ||
                        "AGBOR KINGDOM"
                    );


                const imageUrl =
                    community.image_url
                        ? escapeCommunitiesHTML(
                            community.image_url
                        )
                        : "images/community-placeholder.jpg";


                const number =
                    String(index + 1)
                        .padStart(2, "0");


                const imageAlt =
                    `${name} - Agbor Kingdom`;


                return `

                    <article
                        class="community-card"
                    >

                        <div
                            class="community-card-image"
                        >

                            <img
                                src="${imageUrl}"
                                alt="${escapeCommunitiesHTML(imageAlt)}"
                                loading="lazy"
                            >

                            <span
                                class="community-number"
                            >
                                ${number}
                            </span>

                        </div>


                        <div
                            class="community-card-content"
                        >

                            <span
                                class="community-label"
                            >
                                ${category}
                            </span>


                            <h3>
                                ${name}
                            </h3>


                            <p>
                                ${description}
                            </p>

                        </div>

                    </article>

                `;

            })

            .join("");

}


/* =========================================
   START PAGE
========================================= */

loadCommunitiesPage();

