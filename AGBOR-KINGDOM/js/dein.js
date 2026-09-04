
/* =========================================
   AGBOR KINGDOM
   THE DEIN PAGE
========================================= */

const deinHero =
    document.querySelector(".dein-hero");

const deinHeroImage =
    document.getElementById("deinHeroImage");

const deinHeroLabel =
    document.getElementById("deinHeroLabel");

const deinHeroTitle =
    document.getElementById("deinHeroTitle");

const deinHeroSubtitle =
    document.getElementById("deinHeroSubtitle");

const deinCardImage =
    document.getElementById("deinCardImage");

const deinMessageTitle =
    document.getElementById("deinMessageTitle");

const deinMessageSubtitle =
    document.getElementById("deinMessageSubtitle");

const deinMessageContent =
    document.getElementById("deinMessageContent");


/* =========================================
   ESCAPE HTML
========================================= */

function escapeDeinText(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   LOAD DEIN PAGE
========================================= */

async function loadDeinPage() {

    try {

        const {
            data: page,
            error: pageError
        } = await kingdomSupabase
            .from("kingdom_pages")
            .select("*")
            .eq("slug", "dein")
            .eq("is_published", true)
            .maybeSingle();


        if (pageError) {
            throw pageError;
        }


        if (!page) {

            console.warn(
                "Dein page was not found."
            );

            return;
        }


        /* =====================================
           PAGE TITLE
        ====================================== */

        if (page.title) {

            document.title =
                `${page.title} | The Royal Kingdom of Agbor`;

        }


        /* =====================================
           LOAD SECTIONS
        ====================================== */

        const {
            data: sections,
            error: sectionError
        } = await kingdomSupabase
            .from("page_sections")
            .select("*")
            .eq("page_id", page.id)
            .eq("is_active", true)
            .order("sort_order", {
                ascending: true
            });


        if (sectionError) {
            throw sectionError;
        }


        if (!sections || !sections.length) {

            console.warn(
                "No active Dein sections found."
            );

            return;
        }


        sections.forEach(section => {

            const type =
                String(
                    section.section_type || ""
                ).toLowerCase();


            /* =================================
               HERO
            ================================= */

            if (type === "hero") {

                if (
                    section.label &&
                    deinHeroLabel
                ) {
                    deinHeroLabel.textContent =
                        section.label;
                }


                if (
                    section.title &&
                    deinHeroTitle
                ) {
                    deinHeroTitle.textContent =
                        section.title;
                }


                if (
                    section.subtitle &&
                    deinHeroSubtitle
                ) {
                    deinHeroSubtitle.textContent =
                        section.subtitle;
                }


                if (
                    section.image_url &&
                    deinHeroImage
                ) {

                    deinHeroImage.src =
                        section.image_url;

                    deinHeroImage.alt =
                        section.title ||
                        "The Dein of Agbor Kingdom";

                    deinHeroImage.onload = () => {

                        if (deinHero) {
                            deinHero.classList.add(
                                "loaded"
                            );
                        }

                    };

                }

            }


            /* =================================
               MESSAGE
            ================================= */

            if (
                type === "message" ||
                type === "content"
            ) {

                if (
                    section.label &&
                    !deinMessageTitle
                ) {
                    return;
                }


                if (
                    section.title &&
                    deinMessageTitle
                ) {
                    deinMessageTitle.textContent =
                        section.title;
                }


                if (
                    section.subtitle &&
                    deinMessageSubtitle
                ) {
                    deinMessageSubtitle.textContent =
                        section.subtitle;
                }


                if (
                    section.content &&
                    deinMessageContent
                ) {

                    deinMessageContent.innerHTML =
                        formatDeinMessage(
                            section.content
                        );

                }


                /*
                 * If the message section has
                 * an image, use it for the
                 * royal portrait card.
                 */

                if (
                    section.image_url &&
                    deinCardImage
                ) {

                    deinCardImage.src =
                        section.image_url;

                }

            }

        });


        /*
         * If the message section did not
         * contain an image, look for a
         * separate card/portrait section.
         */

        const cardSection =
            sections.find(section => {

                const type =
                    String(
                        section.section_type || ""
                    ).toLowerCase();

                return (
                    type === "card" ||
                    type === "portrait"
                );

            });


        if (
            cardSection &&
            cardSection.image_url &&
            deinCardImage
        ) {

            deinCardImage.src =
                cardSection.image_url;

        }


        if (
            deinHero &&
            deinHeroImage &&
            deinHeroImage.complete &&
            deinHeroImage.src
        ) {

            deinHero.classList.add(
                "loaded"
            );

        }


        initializeDeinReveal();


    } catch (error) {

        console.error(
            "Dein page loading failed:",
            error
        );

    }

}


/* =========================================
   FORMAT MESSAGE
========================================= */

function formatDeinMessage(content) {

    const safe =
        escapeDeinText(content);

    return safe
        .split(/\n\s*\n/)
        .map(paragraph => {

            return `<p>${paragraph.replace(
                /\n/g,
                "<br>"
            )}</p>`;

        })
        .join("");

}


/* =========================================
   ROYAL REVEAL ANIMATION
========================================= */

function initializeDeinReveal() {

    const revealElements =
        document.querySelectorAll(
            ".dein-section-heading, " +
            ".dein-introduction-text, " +
            ".dein-introduction-card, " +
            ".dein-message-card, " +
            ".dein-value-card, " +
            ".dein-closing-content"
        );


    revealElements.forEach(element => {

        element.classList.add(
            "dein-reveal"
        );

    });


    if (
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach(element => {

            element.classList.add(
                "dein-visible"
            );

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "dein-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================
   START
========================================= */

if (
    typeof kingdomSupabase !== "undefined"
) {

    loadDeinPage();

} else {

    console.error(
        "kingdomSupabase is not defined. Check js/supabase.js."
    );

}

