/* =========================================
   AGBOR KINGDOM
   ALL EVENTS PAGE
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
   LOAD ALL EVENTS
========================================= */

async function loadAllEvents() {

    const eventsGrid =
        document.getElementById("allEventsGrid");


    if (!eventsGrid) {
        return;
    }


    try {

        const { data, error } = await kingdomSupabase
            .from("events")
            .select("*")
            .eq("is_active", true)
            .order("event_date", {
                ascending: true
            })
            .order("sort_order", {
                ascending: true
            });


        if (error) {

            console.error(
                "Error loading all events:",
                error
            );

            eventsGrid.innerHTML = `
                <div class="events-message">

                    Unable to load events
                    at this time.

                </div>
            `;

            return;
        }


        console.log(
            "ALL EVENTS:",
            data
        );


        if (!data || data.length === 0) {

            eventsGrid.innerHTML = `
                <div class="events-message">

                    There are currently
                    no upcoming events.

                </div>
            `;

            return;
        }


        eventsGrid.innerHTML =
            data
                .map(event => {

                    return createFullEventCard(event);

                })
                .join("");


    } catch (error) {

        console.error(
            "Events page failed:",
            error
        );

        eventsGrid.innerHTML = `
            <div class="events-message">

                Unable to load events.

            </div>
        `;

    }

}


/* =========================================
   CREATE FULL EVENT CARD
========================================= */

function createFullEventCard(event) {

    const date = new Date(
        event.event_date + "T00:00:00"
    );


    const month =
        date
            .toLocaleDateString(
                "en-US",
                {
                    month: "short"
                }
            )
            .toUpperCase();


    const day =
        date.toLocaleDateString(
            "en-US",
            {
                day: "2-digit"
            }
        );


    const year =
        date.toLocaleDateString(
            "en-US",
            {
                year: "numeric"
            }
        );


    const title =
        escapeEventPageText(
            event.title
        );


    const description =
        escapeEventPageText(
            event.description || ""
        );


    const type =
        escapeEventPageText(
            event.event_type ||
            "KINGDOM EVENT"
        );


    const time =
        escapeEventPageText(
            event.event_time || ""
        );


    const location =
        escapeEventPageText(
            event.location || ""
        );


    return `

    <article class="event-card">

        <div class="event-date">

            <span class="event-month">
                ${month}
            </span>

            <strong class="event-day">
                ${day}
            </strong>

            <span class="event-year">
                ${year}
            </span>

        </div>


        <div class="event-details">

            <span class="event-type">
                ${type}
            </span>


            <h3>
                ${title}
            </h3>


            ${
                description
                    ? `
                        <p>
                            ${description}
                        </p>
                    `
                    : ""
            }


            <div class="event-meta">

                ${
                    time
                        ? `
                            <span>
                                ◷ ${time}
                            </span>
                        `
                        : ""
                }


                ${
                    location
                        ? `
                            <span>
                                ◉ ${location}
                            </span>
                        `
                        : ""
                }

            </div>


            <a
                href="event-details.html?id=${event.id}"
                class="event-read-more"
            >
                Event Details
                <span>→</span>
            </a>

        </div>

    </article>

`;

}


/* =========================================
   ESCAPE TEXT
========================================= */

function escapeEventPageText(text) {

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

function escapeEventPageAttribute(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* =========================================
   START
========================================= */

loadAllEvents();