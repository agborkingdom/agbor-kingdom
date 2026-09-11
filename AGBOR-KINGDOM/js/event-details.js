/* =========================================
   AGBOR KINGDOM
   INDIVIDUAL EVENT PAGE
========================================= */

/* =========================================
   MOBILE MENU
========================================= */

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileSideMenu = document.getElementById("mobileSideMenu");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

function openMobileMenu() {
    if (mobileSideMenu) mobileSideMenu.classList.add("open");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
    if (mobileSideMenu) mobileSideMenu.classList.remove("open");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("open");
    document.body.style.overflow = "";
}

if (mobileMenuButton) mobileMenuButton.addEventListener("click", openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener("click", closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener("click", closeMobileMenu);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
        closeSearchResults();
    }
});


/* =========================================
   GET EVENT ID
========================================= */

const eventParams =
    new URLSearchParams(
        window.location.search
    );


const eventId =
    eventParams.get("id");


/* =========================================
   LOAD EVENT
========================================= */

async function loadEventDetails() {

    const container =
        document.getElementById(
            "eventDetailContainer"
        );


    if (!container) {
        return;
    }


    /* =====================================
       CHECK ID
    ===================================== */

    if (!eventId) {

        showEventError(
            container,
            "No event was specified."
        );

        return;
    }


    try {

        const {
            data,
            error
        } = await kingdomSupabase

            .from("events")

            .select("*")

            .eq("id", eventId)

            .eq("is_active", true)

            .maybeSingle();


        if (error) {

            console.error(
                "Event loading failed:",
                error
            );

            showEventError(
                container,
                "Unable to load this event."
            );

            return;
        }


        if (!data) {

            showEventError(
                container,
                "This event could not be found."
            );

            return;
        }


        console.log(
            "EVENT DETAILS:",
            data
        );


        renderEventDetails(
            container,
            data
        );


    } catch (error) {

        console.error(
            "Event page error:",
            error
        );

        showEventError(
            container,
            "Something went wrong while loading the event."
        );

    }

}


/* =========================================
   RENDER EVENT
========================================= */

function renderEventDetails(
    container,
    event
) {

    const date =
        new Date(
            event.event_date + "T00:00:00"
        );


    const formattedDate =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    const title =
        escapeEventText(
            event.title
        );


    const description =
        escapeEventText(
            event.description || ""
        );


    const type =
        escapeEventText(
            event.event_type ||
            "KINGDOM EVENT"
        );


    const time =
        escapeEventText(
            event.event_time || ""
        );


    const location =
        escapeEventText(
            event.location || ""
        );


    const image =
        event.image_url
            ? escapeEventAttribute(
                event.image_url
            )
            : "";


    container.innerHTML = `

        <div class="event-detail-wrapper">


            <!-- =================================
                 BACK LINK
            ================================== -->

            <a
                href="events.html"
                class="event-back-link"
            >
                ← Back to Events
            </a>


            <!-- =================================
                 EVENT HEADER
            ================================== -->

            <div class="event-detail-header">

                <span class="event-detail-type">
                    ${type}
                </span>


                <h1>
                    ${title}
                </h1>


                <div class="event-detail-meta">

                    <span>
                        ◷ ${time || "Time TBA"}
                    </span>

                    <span>
                        ◉ ${location || "Location TBA"}
                    </span>

                </div>

            </div>


            ${
                image
                    ? `
                        <div class="event-detail-image">

                            <img
                                src="${image}"
                                alt="${title}"
                                loading="lazy"
                            >

                        </div>
                    `
                    : ""
            }


            <!-- =================================
                 EVENT BODY
            ================================== -->

            <div class="event-detail-body">


                <div class="event-detail-date">

                    <span>
                        EVENT DATE
                    </span>

                    <strong>
                        ${formattedDate}
                    </strong>

                </div>


                <div class="event-detail-description">

                    <h2>
                        About This Event
                    </h2>

                    ${
                        description
                            ? `
                                <p>
                                    ${description}
                                </p>
                            `
                            : `
                                <p>
                                    Details about this
                                    event will be announced
                                    by the kingdom.
                                </p>
                            `
                    }

                </div>

            </div>


            ${
                event.link
                    ? `
                        <div class="event-detail-action">

                            <a
                                href="${escapeEventAttribute(event.link)}"
                                class="hero-button"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                More Information
                                <span>→</span>
                            </a>

                        </div>
                    `
                    : ""
            }


        </div>

    `;


    /* =====================================
       UPDATE PAGE TITLE
    ===================================== */

    document.title =
        `${event.title} | Agbor Kingdom`;

        setupEventSharing(event);

}


/* =========================================
   EVENT SOCIAL SHARING
========================================= */

function setupEventSharing(event) {

    const shareWhatsApp =
        document.getElementById(
            "eventShareWhatsApp"
        );

    const shareFacebook =
        document.getElementById(
            "eventShareFacebook"
        );

    const shareTwitter =
        document.getElementById(
            "eventShareTwitter"
        );

    const shareCopyLink =
        document.getElementById(
            "eventShareCopyLink"
        );

    const shareCopyText =
        document.getElementById(
            "eventShareCopyText"
        );


    /*
     * REAL EVENT URL
     */

    const eventUrl =
        `${window.location.origin}` +
        `${window.location.pathname}` +
        `?id=${encodeURIComponent(event.id)}`;


    /*
     * SHARE TEXT
     */

    const shareText =
        `${event.title} | Agbor Kingdom`;


    /*
     * WHATSAPP
     */

    if (shareWhatsApp) {

        shareWhatsApp.addEventListener(
            "click",
            async () => {

                const url =
                    `https://wa.me/?text=` +
                    encodeURIComponent(
                        `${shareText}\n${eventUrl}`
                    );

                await recordEventShare(
                    event.id,
                    "whatsapp"
                );

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /*
     * FACEBOOK
     */

    if (shareFacebook) {

        shareFacebook.addEventListener(
            "click",
            async () => {

                const url =
                    `https://www.facebook.com/sharer/sharer.php?u=` +
                    encodeURIComponent(eventUrl);

                await recordEventShare(
                    event.id,
                    "facebook"
                );

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /*
     * X
     */

    if (shareTwitter) {

        shareTwitter.addEventListener(
            "click",
            async () => {

                const url =
                    `https://twitter.com/intent/tweet?text=` +
                    encodeURIComponent(shareText) +
                    `&url=` +
                    encodeURIComponent(eventUrl);

                await recordEventShare(
                    event.id,
                    "twitter"
                );

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /*
     * COPY LINK
     */

    if (shareCopyLink) {

        shareCopyLink.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        eventUrl
                    );

                    if (shareCopyText) {

                        const originalText =
                            shareCopyText.textContent;

                        shareCopyText.textContent =
                            "Copied!";

                        setTimeout(() => {

                            shareCopyText.textContent =
                                originalText;

                        }, 2000);

                    }

                    await recordEventShare(
                        event.id,
                        "copy"
                    );

                } catch (error) {

                    console.error(
                        "Copy link failed:",
                        error
                    );

                }

            }
        );

    }


    /*
     * LOAD TOTAL SHARE COUNT
     */

    loadEventShareCount(event.id);
}


/* =========================================
   RECORD EVENT SHARE
========================================= */

async function recordEventShare(
    eventId,
    platform
) {

    try {

        const {
            error
        } = await kingdomSupabase.rpc(
            "increment_share_count",
            {
                p_content_type: "event",
                p_content_id: eventId,
                p_platform: platform
            }
        );

        if (error) {

            console.error(
                "Event share count failed:",
                error
            );

        }

    } catch (error) {

        console.error(
            "Event share error:",
            error
        );

    }

}


/* =========================================
   LOAD EVENT SHARE COUNT
========================================= */

async function loadEventShareCount(
    eventId
) {

    const totalElement =
        document.getElementById(
            "eventShareTotal"
        );

    if (!totalElement) {
        return;
    }


    try {

        const {
            data,
            error
        } = await kingdomSupabase

            .from("share_counts")

            .select("share_count")

            .eq(
                "content_type",
                "event"
            )

            .eq(
                "content_id",
                eventId
            )

            .maybeSingle();


        if (error) {

            console.error(
                "Event share count loading failed:",
                error
            );

            return;

        }


        totalElement.textContent =
            data?.share_count || 0;


    } catch (error) {

        console.error(
            "Event share count error:",
            error
        );

    }

}
/* =========================================
   ERROR MESSAGE
========================================= */

function showEventError(
    container,
    message
) {

    container.innerHTML = `

        <div class="event-detail-error">

            <span>
                KINGDOM EVENTS
            </span>

            <h1>
                Event Not Available
            </h1>

            <p>
                ${escapeEventText(message)}
            </p>

            <a
                href="events.html"
                class="hero-button"
            >
                View All Events
            </a>

        </div>

    `;

}


/* =========================================
   ESCAPE TEXT
========================================= */

function escapeEventText(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   ESCAPE ATTRIBUTE
========================================= */

function escapeEventAttribute(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* =========================================
   START
========================================= */

loadEventDetails();