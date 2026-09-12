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


<!-- =========================================
     EVENT SOCIAL SHARING
========================================== -->

<div
    class="single-event-share"
    id="singleEventShare"
>

    <div class="single-event-share-heading">

        <span class="single-event-share-label">

            SHARE THIS EVENT

        </span>

        <h3>

            Invite others

        </h3>

    </div>


    <div class="single-event-share-buttons">


        <!-- WhatsApp -->

        <button
            type="button"
            class="single-event-share-button whatsapp"
            id="shareEventWhatsApp"
        >

            <span class="share-icon">

                ◉

            </span>

            <span>

                WhatsApp

            </span>

        </button>


        <!-- Facebook -->

        <button
            type="button"
            class="single-event-share-button facebook"
            id="shareEventFacebook"
        >

            <span class="share-icon">

                f

            </span>

            <span>

                Facebook

            </span>

        </button>


        <!-- X / Twitter -->

        <button
            type="button"
            class="single-event-share-button twitter"
            id="shareEventTwitter"
        >

            <span class="share-icon">

                𝕏

            </span>

            <span>

                X

            </span>

        </button>


        <!-- Copy Link -->

        <button
            type="button"
            class="single-event-share-button copy"
            id="shareEventCopyLink"
        >

            <span class="share-icon">

                ↗

            </span>

            <span id="shareEventCopyText">

                Copy Link

            </span>

        </button>


    </div>


    <!-- TOTAL SHARES -->

    <div
        class="single-event-share-count"
        id="eventShareCount"
    >

        Shared

        <strong id="eventShareTotal">

            0

        </strong>

        times

    </div>

</div>


</div>
`;


    /* =====================================
       UPDATE PAGE TITLE
    ===================================== */

    document.title =
        `${event.title} | Agbor Kingdom`;

        /* =========================================
   EVENT SOCIAL SHARING
========================================= */

setupEventSharing(event);

        /* =========================================
   EVENT SEO FOR BROWSER
========================================= */

const eventTitle =
    event.title ||
    "Agbor Kingdom Event";


const eventDescription =
    event.description ||
    "Official events from the Royal Kingdom of Agbor.";


const eventUrl =
    window.location.origin +
    "/event.html?id=" +
    encodeURIComponent(event.id);


let eventImage =
    event.image_url || "";


if (eventImage) {

    try {

        eventImage =
            new URL(
                eventImage,
                window.location.origin
            ).href;

    } catch (error) {

        console.warn(
            "Unable to normalize event image."
        );

    }

}


/* SEO */

const metaDescription =
    document.getElementById(
        "eventMetaDescription"
    );

if (metaDescription) {

    metaDescription.setAttribute(
        "content",
        eventDescription
    );

}


/* OPEN GRAPH */

const eventOgTitle =
    document.getElementById(
        "eventOgTitle"
    );

const eventOgDescription =
    document.getElementById(
        "eventOgDescription"
    );

const eventOgUrl =
    document.getElementById(
        "eventOgUrl"
    );

const eventOgImage =
    document.getElementById(
        "eventOgImage"
    );

const eventOgImageAlt =
    document.getElementById(
        "eventOgImageAlt"
    );


if (eventOgTitle) {

    eventOgTitle.setAttribute(
        "content",
        eventTitle
    );

}


if (eventOgDescription) {

    eventOgDescription.setAttribute(
        "content",
        eventDescription
    );

}


if (eventOgUrl) {

    eventOgUrl.setAttribute(
        "content",
        eventUrl
    );

}


if (eventOgImage) {

    eventOgImage.setAttribute(
        "content",
        eventImage
    );

}


if (eventOgImageAlt) {

    eventOgImageAlt.setAttribute(
        "content",
        eventTitle
    );

}


/* TWITTER / X */

const eventTwitterTitle =
    document.getElementById(
        "eventTwitterTitle"
    );

const eventTwitterDescription =
    document.getElementById(
        "eventTwitterDescription"
    );

const eventTwitterImage =
    document.getElementById(
        "eventTwitterImage"
    );


if (eventTwitterTitle) {

    eventTwitterTitle.setAttribute(
        "content",
        eventTitle
    );

}


if (eventTwitterDescription) {

    eventTwitterDescription.setAttribute(
        "content",
        eventDescription
    );

}


if (eventTwitterImage) {

    eventTwitterImage.setAttribute(
        "content",
        eventImage
    );

}


/* CANONICAL */

const eventCanonical =
    document.getElementById(
        "eventCanonical"
    );

if (eventCanonical) {

    eventCanonical.setAttribute(
        "href",
        eventUrl
    );

}

}
/* =========================================
   EVENT SOCIAL SHARING
========================================= */

function setupEventSharing(event) {

    const whatsappButton =
        document.getElementById(
            "shareEventWhatsApp"
        );


    const facebookButton =
        document.getElementById(
            "shareEventFacebook"
        );


    const twitterButton =
        document.getElementById(
            "shareEventTwitter"
        );


    const copyButton =
        document.getElementById(
            "shareEventCopyLink"
        );


    const copyText =
        document.getElementById(
            "shareEventCopyText"
        );


    /* =====================================
       EVENT URL
    ===================================== */

    const eventUrl =
        window.location.origin +
        "/event.html?id=" +
        encodeURIComponent(event.id);


    const eventTitle =
        event.title ||
        "Agbor Kingdom Event";


    /* =====================================
       WHATSAPP
    ===================================== */

    if (whatsappButton) {

        whatsappButton.addEventListener(
            "click",
            function () {

                const shareText =
                    `${eventTitle}\n\n${eventUrl}`;


                const whatsappUrl =
                    "https://wa.me/?text=" +
                    encodeURIComponent(
                        shareText
                    );


                window.open(
                    whatsappUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* =====================================
       FACEBOOK
    ===================================== */

    if (facebookButton) {

        facebookButton.addEventListener(
            "click",
            function () {

                const facebookUrl =
                    "https://www.facebook.com/sharer/sharer.php?u=" +
                    encodeURIComponent(
                        eventUrl
                    );


                window.open(
                    facebookUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* =====================================
       X / TWITTER
    ===================================== */

    if (twitterButton) {

        twitterButton.addEventListener(
            "click",
            function () {

                const twitterUrl =
                    "https://twitter.com/intent/tweet?text=" +
                    encodeURIComponent(
                        eventTitle
                    ) +
                    "&url=" +
                    encodeURIComponent(
                        eventUrl
                    );


                window.open(
                    twitterUrl,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* =====================================
       COPY LINK
    ===================================== */

    if (copyButton) {

        copyButton.addEventListener(
            "click",
            async function () {

                try {

                    await navigator.clipboard.writeText(
                        eventUrl
                    );


                    if (copyText) {

                        const originalText =
                            "Copy Link";


                        copyText.textContent =
                            "Copied!";


                        setTimeout(
                            function () {

                                copyText.textContent =
                                    originalText;

                            },
                            2000
                        );

                    }


                } catch (error) {

                    console.error(
                        "Unable to copy event link:",
                        error
                    );

                }

            }
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