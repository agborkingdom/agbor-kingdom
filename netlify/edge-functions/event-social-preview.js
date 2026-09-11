// netlify/edge-functions/event-social-preview.js

const SUPABASE_URL =
    "https://flhorvkvkxbodappjspg.supabase.co";

const SUPABASE_ANON_KEY =
    Netlify.env.get("SUPABASE_ANON_KEY");


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}


/* =========================================
   MAKE IMAGE URL ABSOLUTE
========================================= */

function absoluteImageUrl(
    imageUrl,
    origin
) {

    if (!imageUrl) {
        return "";
    }

    try {

        return new URL(
            imageUrl,
            origin
        ).href;

    } catch {

        return "";

    }

}


/* =========================================
   GET EVENT FROM SUPABASE
========================================= */

async function getEventById(eventId) {

    if (
        !eventId ||
        !SUPABASE_ANON_KEY
    ) {
        return null;
    }


    const endpoint =
        `${SUPABASE_URL}/rest/v1/events` +
        `?select=id,title,description,event_type,event_date,event_time,location,image_url,link` +
        `&id=eq.${encodeURIComponent(eventId)}` +
        `&is_active=eq.true` +
        `&limit=1`;


    try {

        const response =
            await fetch(
                endpoint,
                {
                    headers: {
                        apikey:
                            SUPABASE_ANON_KEY,

                        Authorization:
                            `Bearer ${SUPABASE_ANON_KEY}`
                    }
                }
            );


        if (!response.ok) {

            console.error(
                "Event lookup failed:",
                response.status,
                await response.text()
            );

            return null;

        }


        const rows =
            await response.json();


        if (
            !Array.isArray(rows) ||
            rows.length === 0
        ) {
            return null;
        }


        return rows[0];


    } catch (error) {

        console.error(
            "Event lookup error:",
            error
        );

        return null;

    }

}


/* =========================================
   EDGE FUNCTION
========================================= */

export default async function (
    request,
    context
) {

    /*
     * Get original HTML from Netlify.
     */

    const response =
        await context.next();


    let html =
        await response.text();


    const url =
        new URL(request.url);


    /* =====================================
       GET EVENT ID
    ===================================== */

    const eventId =
        url.searchParams.get("id");


    /*
     * No event ID:
     * return normal HTML.
     */

    if (!eventId) {
        return response;
    }


    /* =====================================
       LOAD EVENT
    ===================================== */

    const event =
        await getEventById(eventId);


    /*
     * Event doesn't exist
     * or isn't active.
     */

    if (!event) {
        return response;
    }


    /* =====================================
       REAL EVENT URL
    ===================================== */

    const eventUrl =
        `${url.origin}` +
        `${url.pathname}` +
        `?id=${encodeURIComponent(event.id)}`;


    /* =====================================
       EVENT DATA
    ===================================== */

    const title =
        event.title ||
        "Agbor Kingdom Event";


    const description =
        event.description ||
        "Kingdom events and activities from the Royal Kingdom of Agbor.";


    const imageUrl =
        absoluteImageUrl(
            event.image_url,
            url.origin
        );


    /* =====================================
       SAFE VALUES
    ===================================== */

    const safeTitle =
        escapeHtml(title);


    const safeDescription =
        escapeHtml(description);


    const safeEventUrl =
        escapeHtml(eventUrl);


    const safeImageUrl =
        escapeHtml(imageUrl);


    /* =========================================
       NORMAL SEO DESCRIPTION
    ========================================= */

    html = html.replace(
        /<meta\s+name=["']description["'][^>]*>/i,
        `<meta name="description" id="eventMetaDescription" content="${safeDescription}">`
    );


    /* =========================================
       CANONICAL
    ========================================= */

    html = html.replace(
        /<link\s+rel=["']canonical["'][^>]*>/i,
        `<link rel="canonical" id="eventCanonical" href="${safeEventUrl}">`
    );


    /* =========================================
       OPEN GRAPH
    ========================================= */

    html = html.replace(
        /<meta\s+property=["']og:type["'][^>]*>/i,
        `<meta property="og:type" content="article">`
    );


    html = html.replace(
        /<meta\s+property=["']og:title["'][^>]*>/i,
        `<meta property="og:title" id="ogEventTitle" content="${safeTitle}">`
    );


    html = html.replace(
        /<meta\s+property=["']og:description["'][^>]*>/i,
        `<meta property="og:description" id="ogEventDescription" content="${safeDescription}">`
    );


    html = html.replace(
        /<meta\s+property=["']og:url["'][^>]*>/i,
        `<meta property="og:url" id="ogEventUrl" content="${safeEventUrl}">`
    );


    html = html.replace(
        /<meta\s+property=["']og:image["'][^>]*>/i,
        `<meta property="og:image" id="ogEventImage" content="${safeImageUrl}">`
    );


    html = html.replace(
        /<meta\s+property=["']og:image:alt["'][^>]*>/i,
        `<meta property="og:image:alt" id="ogEventImageAlt" content="${safeTitle}">`
    );


    /* =========================================
       TWITTER / X
    ========================================= */

    html = html.replace(
        /<meta\s+name=["']twitter:card["'][^>]*>/i,
        `<meta name="twitter:card" content="summary_large_image">`
    );


    html = html.replace(
        /<meta\s+name=["']twitter:title["'][^>]*>/i,
        `<meta name="twitter:title" id="twitterEventTitle" content="${safeTitle}">`
    );


    html = html.replace(
        /<meta\s+name=["']twitter:description["'][^>]*>/i,
        `<meta name="twitter:description" id="twitterEventDescription" content="${safeDescription}">`
    );


    html = html.replace(
        /<meta\s+name=["']twitter:image["'][^>]*>/i,
        `<meta name="twitter:image" id="twitterEventImage" content="${safeImageUrl}">`
    );


    /* =========================================
       DIAGNOSTIC HEADERS
    ========================================= */

    const headers =
        new Headers(response.headers);


    headers.set(
        "content-type",
        "text/html; charset=UTF-8"
    );


    headers.set(
        "x-event-edge-function",
        "active"
    );


    headers.set(
        "x-event-id",
        event.id
    );


    return new Response(
        html,
        {
            status:
                response.status,

            statusText:
                response.statusText,

            headers
        }
    );

}


/* =========================================
   NETLIFY ROUTE
========================================= */

export const config = {
    path: "/event-details.html"
};