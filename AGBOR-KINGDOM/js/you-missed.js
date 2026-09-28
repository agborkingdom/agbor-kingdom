/* =========================================
   AGBOR KINGDOM
   YOU MISSED COMPONENT
========================================= */

const YOU_MISSED_LIMIT = 3;

const youMissedContainer =
    document.getElementById("youMissed");

const YOU_MISSED_COMPONENT_URL =
    "/components/you-missed.html";

async function loadYouMissedComponent() {
    if (!youMissedContainer) {
        console.warn(
            "You Missed container not found."
        );
        return false;
    }

    try {
        const response =
            await fetch(
                YOU_MISSED_COMPONENT_URL
            );

        if (!response.ok) {
            throw new Error(
                `Unable to load You Missed component: ${response.status}`
            );
        }

        youMissedContainer.innerHTML =
            await response.text();

        return true;

    } catch (error) {
        console.error(
            "You Missed component HTML error:",
            error
        );

        youMissedContainer.innerHTML = "";

        return false;
    }
}
/* =========================================
   CREATE SLUG
========================================= */

function createYouMissedSlug(title) {

    if (!title) {
        return "";
    }

    return String(title)
        .trim()
        .toLowerCase()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeYouMissedHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   FORMAT DATE
========================================= */

function formatYouMissedDate(value) {

    if (!value) {
        return "";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================
   GET IMAGE URL
========================================= */

function getYouMissedImage(item) {

    if (item.type === "NEWS") {

        return (
            item.image_url ||
            "images/news/news-default.jpg"
        );

    }


    if (item.type === "EVENT") {

        return (
            item.image_url ||
            "images/events/event-default.jpg"
        );

    }


    if (item.type === "PUBLICATION") {

        return (
            item.cover_image_url ||
            "images/publications/publication-default.jpg"
        );

    }


    return "";

}


/* =========================================
   GET ITEM URL
========================================= */

function getYouMissedUrl(item) {

    if (item.type === "NEWS") {

        return (
            "/news/" +
            encodeURIComponent(
                item.slug
            )
        );

    }


    if (item.type === "EVENT") {

        return (
            "/events/" +
            encodeURIComponent(
                createYouMissedSlug(
                    item.title
                )
            )
        );

    }


    if (item.type === "PUBLICATION") {

        return (
            "/publications/" +
            encodeURIComponent(
                createYouMissedSlug(
                    item.title
                )
            )
        );

    }


    return "#";

}


/* =========================================
   LOAD NEWS
========================================= */

async function loadYouMissedNews() {

    const {
        data,
        error
    } = await kingdomSupabase

        .from("news")

        .select(`
            id,
            title,
            slug,
            excerpt,
            image_url,
            category,
            published_at
        `)

        .eq(
            "is_published",
            true
        )

        .order(
            "published_at",
            {
                ascending: false
            }
        )

        .limit(3);


    if (error) {

        console.error(
            "You Missed - News error:",
            error
        );

        return [];

    }


    return (data || []).map(
        news => ({

            id:
                news.id,

            type:
                "NEWS",

            title:
                news.title,

            description:
                news.excerpt || "",

            image_url:
                news.image_url,

            category:
                news.category ||
                "KINGDOM NEWS",

            date:
                news.published_at,

            sortDate:
                news.published_at
                    ? new Date(
                        news.published_at
                    ).getTime()
                    : 0,

            slug:
                news.slug

        })
    );

}


/* =========================================
   LOAD EVENTS
========================================= */

async function loadYouMissedEvents() {

    const {
        data,
        error
    } = await kingdomSupabase

        .from("events")

        .select(`
            id,
            title,
            description,
            image_url,
            event_type,
            event_date
        `)

        .eq(
            "is_active",
            true
        )

        .order(
            "event_date",
            {
                ascending: false
            }
        )

        .limit(3);


    if (error) {

        console.error(
            "You Missed - Events error:",
            error
        );

        return [];

    }


    return (data || []).map(
        event => ({

            id:
                event.id,

            type:
                "EVENT",

            title:
                event.title,

            description:
                event.description || "",

            image_url:
                event.image_url,

            category:
                event.event_type ||
                "KINGDOM EVENT",

            date:
                event.event_date,

            sortDate:
                event.event_date
                    ? new Date(
                        event.event_date +
                        "T00:00:00"
                    ).getTime()
                    : 0

        })
    );

}


/* =========================================
   LOAD PUBLICATIONS
========================================= */

async function loadYouMissedPublications() {

    const {
        data,
        error
    } = await kingdomSupabase

        .from("publications")

        .select(`
            id,
            title,
            description,
            cover_image_url,
            category,
            author,
            publication_date
        `)

        .eq(
            "is_active",
            true
        )

        .order(
            "publication_date",
            {
                ascending: false
            }
        )

        .limit(3);


    if (error) {

        console.error(
            "You Missed - Publications error:",
            error
        );

        return [];

    }


    return (data || []).map(
        publication => ({

            id:
                publication.id,

            type:
                "PUBLICATION",

            title:
                publication.title,

            description:
                publication.description || "",

            cover_image_url:
                publication.cover_image_url,

            category:
                publication.category ||
                "PUBLICATION",

            author:
                publication.author ||
                "Agbor Kingdom",

            date:
                publication.publication_date,

            sortDate:
                publication.publication_date
                    ? new Date(
                        publication.publication_date +
                        "T00:00:00"
                    ).getTime()
                    : 0

        })
    );

}


/* =========================================
   RENDER
========================================= */

function renderYouMissed(items) {
    const grid =
        document.getElementById("youMissedGrid");

    if (!grid) {
        console.warn(
            "You Missed grid not found."
        );
        return;
    }

    if (!items.length) {
        grid.innerHTML = "";
        return;
    }

    const cards =
        items
            .map(item => {
                const image =
                    getYouMissedImage(item);

                const url =
                    getYouMissedUrl(item);

                const title =
                    escapeYouMissedHTML(
                        item.title
                    );

                const category =
                    escapeYouMissedHTML(
                        item.category
                    );

                const date =
                    formatYouMissedDate(
                        item.date
                    );

                return `
                    <article
                        class="you-missed-card"
                    >
                        <a
                            href="${url}"
                            class="you-missed-card-link"
                        >
                            <img
                                src="${escapeYouMissedHTML(image)}"
                                alt="${title}"
                                class="you-missed-image"
                                loading="lazy"
                                onerror="
                                    this.onerror=null;
                                    this.style.display='none';
                                "
                            >

                            <div
                                class="you-missed-overlay"
                            ></div>

                            <div
                                class="you-missed-content"
                            >
                                <span
                                    class="you-missed-category"
                                >
                                    ${category}
                                </span>

                                <h3>
                                    ${title}
                                </h3>

                                ${
                                    date
                                        ? `
                                            <div
                                                class="you-missed-date"
                                            >
                                                ${date}
                                            </div>
                                        `
                                        : ""
                                }
                            </div>
                        </a>
                    </article>
                `;
            })
            .join("");

    grid.innerHTML = cards;
}

/* =========================================
   LOAD EVERYTHING
========================================= */

async function loadYouMissed() {

    if (!youMissedContainer) {
        return;
    }


    try {

        const [
            newsItems,
            eventItems,
            publicationItems
        ] = await Promise.all([

            loadYouMissedNews(),

            loadYouMissedEvents(),

            loadYouMissedPublications()

        ]);


        const combinedItems = [

            ...newsItems,

            ...eventItems,

            ...publicationItems

        ];


        combinedItems.sort(
            (a, b) =>
                b.sortDate -
                a.sortDate
        );


        const latestThree =
            combinedItems.slice(
                0,
                YOU_MISSED_LIMIT
            );


        renderYouMissed(
            latestThree
        );


    } catch (error) {

        console.error(
            "You Missed component failed:",
            error
        );

        youMissedContainer.innerHTML = "";

    }

}


/* =========================================
   START
========================================= */

 async function initializeYouMissed() {
    const componentLoaded =
        await loadYouMissedComponent();

    if (!componentLoaded) {
        return;
    }

    await loadYouMissed();
}

initializeYouMissed();