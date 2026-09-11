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
   AGBOR KINGDOM
   EVENT SOCIAL SHARING
========================================= */


/* =========================================
   GET PUBLIC EVENT URL
========================================= */

function getEventShareUrl(event) {

    if (!event || !event.id) {

        return window.location.href;

    }


    return (
        window.location.origin +
        "/event.html?id=" +
        encodeURIComponent(event.id)
    );

}


/* =========================================
   GET EVENT IMAGE URL
========================================= */

function getEventShareImageUrl(imageUrl) {

    if (!imageUrl) {

        return "";

    }


    try {

        return new URL(
            imageUrl,
            window.location.origin
        ).href;

    } catch (error) {

        console.warn(
            "Unable to normalize event image URL:",
            imageUrl
        );

        return imageUrl;

    }

}


/* =========================================
   INCREMENT EVENT SHARE
========================================= */

async function incrementEventShare(
    eventId,
    platform
) {

    if (!eventId) {

        return null;

    }


    try {

        const {
            data,
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

            throw error;

        }


        return data;

    } catch (error) {

        console.error(
            "Unable to increment event share count:",
            error
        );

        return null;

    }

}


/* =========================================
   LOAD EVENT SHARE COUNT
========================================= */

async function loadEventShareCount(eventId) {

    const totalElement =
        document.getElementById(
            "eventShareTotal"
        );


    if (!totalElement || !eventId) {

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
            );


        if (error) {

            throw error;

        }


        const totalShares =
            (data || []).reduce(
                function (
                    total,
                    item
                ) {

                    return (
                        total +
                        Number(
                            item.share_count || 0
                        )
                    );

                },
                0
            );


        totalElement.textContent =
            totalShares;


    } catch (error) {

        console.error(
            "Unable to load event share count:",
            error
        );

    }

}


/* =========================================
   SETUP EVENT SHARING
========================================= */

function setupEventSharing(event) {

    if (!event) {

        return;

    }


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


    /* =====================================
       EVENT INFORMATION
    ===================================== */

    const eventTitle =
        event.title ||
        "Agbor Kingdom Event";


    const eventDescription =
        event.description ||
        "Upcoming event from the Royal Kingdom of Agbor.";


    const eventUrl =
        getEventShareUrl(event);


    /* =====================================
       WHATSAPP
    ===================================== */

    if (whatsappButton) {

        whatsappButton.onclick =
            function () {

                const text =
                    eventTitle +
                    "\n\n" +
                    eventDescription +
                    "\n\n" +
                    eventUrl;


                const shareUrl =
                    "https://wa.me/?text=" +
                    encodeURIComponent(text);


                /* Record share */

                incrementEventShare(
                    event.id,
                    "whatsapp"
                ).then(function () {

                    loadEventShareCount(
                        event.id
                    );

                });


                window.open(
                    shareUrl,
                    "_blank"
                );

            };

    }


    /* =====================================
       FACEBOOK
    ===================================== */

    if (facebookButton) {

        facebookButton.onclick =
            function () {

                const shareUrl =
                    "https://www.facebook.com/sharer/sharer.php?u=" +
                    encodeURIComponent(eventUrl);


                /* Record share */

                incrementEventShare(
                    event.id,
                    "facebook"
                ).then(function () {

                    loadEventShareCount(
                        event.id
                    );

                });


                window.open(
                    shareUrl,
                    "_blank",
                    "width=650,height=600,resizable=yes,scrollbars=yes"
                );

            };

    }


    /* =====================================
       X / TWITTER
    ===================================== */

    if (twitterButton) {

        twitterButton.onclick =
            function () {

                const shareUrl =
                    "https://twitter.com/intent/tweet?text=" +
                    encodeURIComponent(eventTitle) +
                    "&url=" +
                    encodeURIComponent(eventUrl);


                /* Record share */

                incrementEventShare(
                    event.id,
                    "twitter"
                ).then(function () {

                    loadEventShareCount(
                        event.id
                    );

                });


                window.open(
                    shareUrl,
                    "_blank",
                    "width=650,height=600,resizable=yes,scrollbars=yes"
                );

            };

    }


    /* =====================================
       COPY LINK
    ===================================== */

    if (copyButton) {

        copyButton.onclick =
            async function () {

                const copyText =
                    document.getElementById(
                        "shareEventCopyText"
                    );


                const originalText =
                    copyText
                        ? copyText.textContent
                        : "Copy Link";


                try {

                    /* Modern clipboard */

                    if (
                        navigator.clipboard &&
                        window.isSecureContext
                    ) {

                        await navigator.clipboard.writeText(
                            eventUrl
                        );

                    } else {

                        /* Fallback */

                        const textarea =
                            document.createElement(
                                "textarea"
                            );


                        textarea.value =
                            eventUrl;


                        textarea.style.position =
                            "fixed";


                        textarea.style.left =
                            "-9999px";


                        document.body.appendChild(
                            textarea
                        );


                        textarea.select();


                        document.execCommand(
                            "copy"
                        );


                        textarea.remove();

                    }


                    /* Record share */

                    await incrementEventShare(
                        event.id,
                        "copy"
                    );


                    await loadEventShareCount(
                        event.id
                    );


                    if (copyText) {

                        copyText.textContent =
                            "Copied!";

                    }


                    setTimeout(
                        function () {

                            if (copyText) {

                                copyText.textContent =
                                    originalText;

                            }

                        },
                        2000
                    );


                } catch (error) {

                    console.error(
                        "Unable to copy event link:",
                        error
                    );

                }

            };

    }


    /* =====================================
       LOAD INITIAL COUNT
    ===================================== */

    loadEventShareCount(
        event.id
    );

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
/* =========================================
   EVENT SEO & SOCIAL META DATA
========================================= */

const eventTitle =
    event.title ||
    "Agbor Kingdom Event";


const eventDescription =
    event.description ||
    "Upcoming events and activities from the Royal Kingdom of Agbor.";


/* =========================================
   EVENT URL
========================================= */

const eventUrl =
    window.location.origin +
    "/event.html?id=" +
    encodeURIComponent(event.id);


/* =========================================
   EVENT IMAGE
========================================= */

let eventImage =
    event.image_url || "";


/* Make relative images absolute */

if (eventImage) {

    try {

        eventImage =
            new URL(
                eventImage,
                window.location.origin
            ).href;

    } catch (error) {

        console.warn(
            "Unable to normalize event image:",
            eventImage
        );

    }

}


/* =========================================
   PAGE TITLE
========================================= */

document.title =
    `${event.title} | Agbor Kingdom`;


/* =====================================
   SETUP EVENT SHARING
===================================== */

setupEventSharing(event);


/* =========================================
   META DESCRIPTION
========================================= */

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


/* =========================================
   CANONICAL
========================================= */

const canonical =
    document.getElementById(
        "eventCanonical"
    );

if (canonical) {

    canonical.setAttribute(
        "href",
        eventUrl
    );

}


/* =========================================
   OPEN GRAPH
========================================= */

const ogTitle =
    document.getElementById(
        "ogTitle"
    );

const ogDescription =
    document.getElementById(
        "ogDescription"
    );

const ogUrl =
    document.getElementById(
        "ogUrl"
    );

const ogImage =
    document.getElementById(
        "ogImage"
    );

const ogImageSecure =
    document.getElementById(
        "ogImageSecure"
    );

const ogImageAlt =
    document.getElementById(
        "ogImageAlt"
    );


if (ogTitle) {

    ogTitle.setAttribute(
        "content",
        eventTitle
    );

}


if (ogDescription) {

    ogDescription.setAttribute(
        "content",
        eventDescription
    );

}


if (ogUrl) {

    ogUrl.setAttribute(
        "content",
        eventUrl
    );

}


if (ogImage) {

    ogImage.setAttribute(
        "content",
        eventImage
    );

}


if (ogImageSecure) {

    ogImageSecure.setAttribute(
        "content",
        eventImage
    );

}


if (ogImageAlt) {

    ogImageAlt.setAttribute(
        "content",
        eventTitle
    );

}


/* =========================================
   X / TWITTER
========================================= */

const twitterTitle =
    document.getElementById(
        "twitterTitle"
    );

const twitterDescription =
    document.getElementById(
        "twitterDescription"
    );

const twitterImage =
    document.getElementById(
        "twitterImage"
    );

const twitterImageAlt =
    document.getElementById(
        "twitterImageAlt"
    );


if (twitterTitle) {

    twitterTitle.setAttribute(
        "content",
        eventTitle
    );

}


if (twitterDescription) {

    twitterDescription.setAttribute(
        "content",
        eventDescription
    );

}


if (twitterImage) {

    twitterImage.setAttribute(
        "content",
        eventImage
    );

}


if (twitterImageAlt) {

    twitterImageAlt.setAttribute(
        "content",
        eventTitle
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