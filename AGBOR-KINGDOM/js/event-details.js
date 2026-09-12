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
   AGBOR KINGDOM
   INDIVIDUAL EVENT PAGE
========================================= */

/* =========================================
   GET EVENT ID
========================================= */

const eventParams = new URLSearchParams(window.location.search);
const eventId = eventParams.get("id");

/* =========================================
   LOAD EVENT
========================================= */

async function loadEventDetails() {
    const container = document.getElementById("eventDetailContainer");

    if (!container) return;

    if (!eventId) {
        showEventError(container, "No event was specified.");
        return;
    }

    try {
        const { data, error } = await kingdomSupabase
            .from("events")
            .select("*")
            .eq("id", eventId)
            .eq("is_active", true)
            .maybeSingle();

        if (error) {
            console.error("Event loading failed:", error);
            showEventError(container, "Unable to load this event.");
            return;
        }

        if (!data) {
            showEventError(container, "This event could not be found.");
            return;
        }

        renderEventDetails(container, data);

    } catch (error) {
        console.error("Event page error:", error);
        showEventError(container, "Something went wrong while loading the event.");
    }
}

/* =========================================
   SOCIAL SHARING HELPER
========================================= */

function getEventShareUrl(event) {
    if (!event || !event.id) {
        return window.location.href;
    }
    
    /* Generates: https://agborkingdom.org/event-details.html?id=11ed7c9e-0fa1-40dd-82a4-893cd5aa40ea */
    return `${window.location.origin}/event-details.html?id=${encodeURIComponent(event.id)}`;
}

function setupEventSharing(event) {
    if (!event) return;

    const whatsappButton = document.getElementById("shareEventWhatsApp");
    const facebookButton = document.getElementById("shareEventFacebook");
    const twitterButton = document.getElementById("shareEventTwitter");
    const copyButton = document.getElementById("shareEventCopyLink");

    const eventTitle = event.title || "Agbor Kingdom Event";
    const eventDescription = event.description || "Upcoming event from the Royal Kingdom of Agbor.";
    const eventUrl = getEventShareUrl(event);


/* WHATSAPP */
if (whatsappButton) {
    whatsappButton.onclick = function () {
        /* Send ONLY the title and the clean URL so WhatsApp renders a clean preview card */
        const text = `*${eventTitle}*\n\n${eventUrl}`;
        window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
    };
}

    /* FACEBOOK */
    if (facebookButton) {
        facebookButton.onclick = function () {
            const shareUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(eventUrl);
            window.open(shareUrl, "_blank", "width=650,height=600,resizable=yes,scrollbars=yes");
        };
    }

    /* X / TWITTER */
    if (twitterButton) {
        twitterButton.onclick = function () {
            const shareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(eventTitle) + "&url=" + encodeURIComponent(eventUrl);
            window.open(shareUrl, "_blank", "width=650,height=600,resizable=yes,scrollbars=yes");
        };
    }

    /* COPY LINK */
    if (copyButton) {
        copyButton.onclick = async function () {
            const copyText = document.getElementById("shareEventCopyText");
            const originalText = copyText ? copyText.textContent : "Copy Link";

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(eventUrl);
                } else {
                    const textarea = document.createElement("textarea");
                    textarea.value = eventUrl;
                    textarea.style.position = "fixed";
                    textarea.style.left = "-9999px";
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    textarea.remove();
                }

                if (copyText) copyText.textContent = "Copied!";

                setTimeout(() => {
                    if (copyText) copyText.textContent = originalText;
                }, 2000);

            } catch (error) {
                console.error("Unable to copy link:", error);
            }
        };
    }
}

/* =========================================
   RENDER EVENT
========================================= */

function renderEventDetails(container, event) {
    const date = new Date(event.event_date + "T00:00:00");
    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const title = escapeEventText(event.title);
    const description = escapeEventText(event.description || "");
    const type = escapeEventText(event.event_type || "KINGDOM EVENT");
    const time = escapeEventText(event.event_time || "");
    const location = escapeEventText(event.location || "");
    const image = event.image_url ? escapeEventAttribute(event.image_url) : "";

    container.innerHTML = `
        <div class="event-detail-wrapper">

            <a href="events.html" class="event-back-link">← Back to Events</a>

            <div class="event-detail-header">
                <span class="event-detail-type">${type}</span>
                <h1>${title}</h1>
                <div class="event-detail-meta">
                    <span>◷ ${time || "Time TBA"}</span>
                    <span>◉ ${location || "Location TBA"}</span>
                </div>
            </div>

            ${image ? `
                <div class="event-detail-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                </div>
            ` : ""}

            <div class="event-detail-body">
                <div class="event-detail-date">
                    <span>EVENT DATE</span>
                    <strong>${formattedDate}</strong>
                </div>

                <div class="event-detail-description">
                    <h2>About This Event</h2>
                    ${description ? `<p>${description}</p>` : `<p>Details about this event will be announced by the kingdom.</p>`}
                </div>
            </div>

            ${event.link ? `
                <div class="event-detail-action">
                    <a href="${escapeEventAttribute(event.link)}" class="hero-button" target="_blank" rel="noopener noreferrer">
                        More Information <span>→</span>
                    </a>
                </div>
            ` : ""}

            <!-- SOCIAL SHARING SECTION -->
            <div class="single-event-share" id="singleEventShare">
                <div class="single-event-share-heading">
                    <span class="single-event-share-label">SHARE THIS EVENT</span>
                    <h3>Invite others</h3>
                </div>

                <div class="single-event-share-buttons">
                    <button type="button" class="single-event-share-button whatsapp" id="shareEventWhatsApp">
                        <span class="share-icon">◉</span>
                        <span>WhatsApp</span>
                    </button>

                    <button type="button" class="single-event-share-button facebook" id="shareEventFacebook">
                        <span class="share-icon">f</span>
                        <span>Facebook</span>
                    </button>

                    <button type="button" class="single-event-share-button twitter" id="shareEventTwitter">
                        <span class="share-icon">𝕏</span>
                        <span>X</span>
                    </button>

                    <button type="button" class="single-event-share-button copy" id="shareEventCopyLink">
                        <span class="share-icon">↗</span>
                        <span id="shareEventCopyText">Copy Link</span>
                    </button>
                </div>
            </div>

        </div>
    `;

    /* SEO & META DATA */
const eventTitle = event.title || "Agbor Kingdom Event";
const eventDescription = event.description || "Upcoming events from the Royal Kingdom of Agbor.";
const eventUrl = window.location.origin + "/event-details.html?id=" + encodeURIComponent(event.id);

    let eventImage = event.image_url || "";
    if (eventImage) {
        try {
            eventImage = new URL(eventImage, window.location.origin).href;
        } catch (error) {
            console.warn("Unable to normalize event image:", eventImage);
        }
    }

    document.title = `${eventTitle} | Agbor Kingdom`;

    const metaDescription = document.getElementById("eventMetaDescription");
    if (metaDescription) metaDescription.setAttribute("content", eventDescription);

    const canonical = document.getElementById("eventCanonical");
    if (canonical) canonical.setAttribute("href", eventUrl);

    const ogTitle = document.getElementById("ogTitle");
    const ogDescription = document.getElementById("ogDescription");
    const ogUrl = document.getElementById("ogUrl");
    const ogImage = document.getElementById("ogImage");
    const ogImageSecure = document.getElementById("ogImageSecure");
    const ogImageAlt = document.getElementById("ogImageAlt");

    if (ogTitle) ogTitle.setAttribute("content", eventTitle);
    if (ogDescription) ogDescription.setAttribute("content", eventDescription);
    if (ogUrl) ogUrl.setAttribute("content", eventUrl);
    if (ogImage) ogImage.setAttribute("content", eventImage);
    if (ogImageSecure) ogImageSecure.setAttribute("content", eventImage);
    if (ogImageAlt) ogImageAlt.setAttribute("content", eventTitle);

    const twitterTitle = document.getElementById("twitterTitle");
    const twitterDescription = document.getElementById("twitterDescription");
    const twitterImage = document.getElementById("twitterImage");
    const twitterImageAlt = document.getElementById("twitterImageAlt");

    if (twitterTitle) twitterTitle.setAttribute("content", eventTitle);
    if (twitterDescription) twitterDescription.setAttribute("content", eventDescription);
    if (twitterImage) twitterImage.setAttribute("content", eventImage);
    if (twitterImageAlt) twitterImageAlt.setAttribute("content", eventTitle);

    /* ATTACH SHARE HANDLERS */
    setupEventSharing(event);
}

function showEventError(container, message) {
    container.innerHTML = `
        <div class="event-detail-error">
            <span>KINGDOM EVENTS</span>
            <h1>Event Not Available</h1>
            <p>${escapeEventText(message)}</p>
            <a href="events.html" class="hero-button">View All Events</a>
        </div>
    `;
}

function escapeEventText(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeEventAttribute(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

loadEventDetails();