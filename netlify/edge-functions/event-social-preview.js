/* =========================================
   AGBOR KINGDOM

   DYNAMIC EVENT SOCIAL PREVIEW

   WhatsApp
   Facebook
   X / Twitter
   LinkedIn
   Telegram

========================================= */

export default async function (request, context) {

    console.log(
        "EVENT SOCIAL PREVIEW FUNCTION STARTED"
    );


    /* =========================================
       CURRENT URL
    ========================================= */

    const url =
        new URL(request.url);


    /* =========================================
       GET EVENT ID
    ========================================= */

    const eventId =
        url.searchParams.get("id");


    console.log(
        "EVENT ID:",
        eventId
    );


    /* =========================================
       NO EVENT ID
    ========================================= */

    if (!eventId) {

        return context.next();

    }


    try {


        /* =========================================
           SUPABASE ENVIRONMENT VARIABLES
        ========================================= */

        const supabaseUrl =
            Netlify.env.get(
                "SUPABASE_URL"
            );


        const supabaseAnonKey =
            Netlify.env.get(
                "SUPABASE_ANON_KEY"
            );


        if (
            !supabaseUrl ||
            !supabaseAnonKey
        ) {

            console.error(
                "Missing Supabase environment variables."
            );

            return context.next();

        }


        /* =========================================
           BUILD SUPABASE REQUEST
        ========================================= */

        const params =
            new URLSearchParams();


        params.set(
            "select",
            `
                id,
                title,
                description,
                event_type,
                event_date,
                event_time,
                location,
                image_url
            `
        );


        params.set(
            "id",
            `eq.${eventId}`
        );


        params.set(
            "is_active",
            "eq.true"
        );


        params.set(
            "limit",
            "1"
        );


        const eventApiUrl =
            `${supabaseUrl}/rest/v1/events?${params.toString()}`;


        console.log(
            "Loading event from Supabase..."
        );


        /* =========================================
           FETCH EVENT
        ========================================= */

        const eventResponse =
            await fetch(
                eventApiUrl,
                {
                    headers: {

                        apikey:
                            supabaseAnonKey,

                        Authorization:
                            `Bearer ${supabaseAnonKey}`

                    }
                }
            );


        if (!eventResponse.ok) {

            console.error(
                "Supabase event request failed:",
                eventResponse.status
            );

            return context.next();

        }


        const events =
            await eventResponse.json();


        const event =
            events?.[0];


        /* =========================================
           EVENT NOT FOUND
        ========================================= */

        if (!event) {

            console.error(
                "Event not found."
            );

            return context.next();

        }


        console.log(
            "EVENT FOUND:",
            event.title
        );


        console.log(
            "EVENT IMAGE:",
            event.image_url
        );


        /* =========================================
           EVENT INFORMATION
        ========================================= */

        const eventTitle =
            event.title ||
            "Agbor Kingdom Event";


        const eventDescription =
            event.description ||
            "Upcoming events and activities from the Royal Kingdom of Agbor.";


        const canonicalUrl =
            `${url.origin}/event.html?id=` +
            encodeURIComponent(
                event.id
            );


        /* =========================================
           EVENT IMAGE
        ========================================= */

        let eventImage =
            event.image_url || "";


        /* =========================================
           MAKE IMAGE ABSOLUTE
        ========================================= */

        if (eventImage) {

            try {

                eventImage =
                    new URL(
                        eventImage,
                        url.origin
                    ).href;

            } catch (error) {

                console.error(
                    "Invalid event image URL:",
                    eventImage
                );

            }

        }


        /* =========================================
           FALLBACK IMAGE
        ========================================= */

        if (!eventImage) {

            eventImage =
                `${url.origin}/images/events/event-default.jpg`;

        }


        console.log(
            "FINAL EVENT SOCIAL IMAGE:",
            eventImage
        );


        /* =========================================
           ESCAPE HTML
        ========================================= */

        function escapeHtml(value) {

            return String(value || "")

                .replace(
                    /&/g,
                    "&amp;"
                )

                .replace(
                    /"/g,
                    "&quot;"
                )

                .replace(
                    /</g,
                    "&lt;"
                )

                .replace(
                    />/g,
                    "&gt;"
                );

        }


        /* =========================================
           GET ORIGINAL PAGE
        ========================================= */

        const response =
            await context.next();


        const html =
            await response.text();


        /* =========================================
           SOCIAL META TAGS

           IMPORTANT:
           These are generated SERVER-SIDE.

           WhatsApp, Facebook, X, LinkedIn
           and Telegram can read them.
        ========================================= */

        const socialMetaTags = `

<!-- =========================================
     AGBOR KINGDOM EVENT SOCIAL PREVIEW
========================================= -->

<meta
    name="description"
    content="${escapeHtml(eventDescription)}"
>

<link
    rel="canonical"
    href="${escapeHtml(canonicalUrl)}"
>

<!-- OPEN GRAPH -->

<meta
    property="og:type"
    content="website"
>

<meta
    property="og:site_name"
    content="Agbor Kingdom"
>

<meta
    property="og:title"
    content="${escapeHtml(eventTitle)}"
>

<meta
    property="og:description"
    content="${escapeHtml(eventDescription)}"
>

<meta
    property="og:url"
    content="${escapeHtml(canonicalUrl)}"
>

<meta
    property="og:image"
    content="${escapeHtml(eventImage)}"
>

<meta
    property="og:image:secure_url"
    content="${escapeHtml(eventImage)}"
>

<meta
    property="og:image:alt"
    content="${escapeHtml(eventTitle)}"
>

<!-- X / TWITTER -->

<meta
    name="twitter:card"
    content="summary_large_image"
>

<meta
    name="twitter:title"
    content="${escapeHtml(eventTitle)}"
>

<meta
    name="twitter:description"
    content="${escapeHtml(eventDescription)}"
>

<meta
    name="twitter:image"
    content="${escapeHtml(eventImage)}"
>

<meta
    name="twitter:image:alt"
    content="${escapeHtml(eventTitle)}"
>

<!-- EVENT EDGE FUNCTION ACTIVE -->

`;


        /* =========================================
           REMOVE EMPTY DEFAULT EVENT TAGS

           This prevents WhatsApp/Facebook from
           seeing empty og:image tags first.
        ========================================= */

        let updatedHtml =
            html;


        const idsToRemove = [

            "eventMetaDescription",

            "eventOgTitle",

            "eventOgDescription",

            "eventOgUrl",

            "eventOgImage",

            "eventOgImageSecureUrl",

            "eventOgImageAlt",

            "eventTwitterTitle",

            "eventTwitterDescription",

            "eventTwitterImage",

            "eventTwitterImageAlt"

        ];


        idsToRemove.forEach(id => {

            const regex =
                new RegExp(
                    `<meta[^>]*id=["']${id}["'][^>]*>`,
                    "gi"
                );


            updatedHtml =
                updatedHtml.replace(
                    regex,
                    ""
                );

        });


        /* =========================================
           REMOVE EMPTY CANONICAL
        ========================================= */

        updatedHtml =
            updatedHtml.replace(

                /<link[^>]*id=["']eventCanonical["'][^>]*>/gi,

                ""

            );


        /* =========================================
           INSERT SOCIAL TAGS INTO HEAD
        ========================================= */

        updatedHtml =
            updatedHtml.replace(

                /<\/head>/i,

                `${socialMetaTags}</head>`

            );


        console.log(
            "EVENT SOCIAL PREVIEW HTML CREATED SUCCESSFULLY"
        );


        /* =========================================
           RESPONSE HEADERS
        ========================================= */

        const headers =
            new Headers(
                response.headers
            );


        headers.set(

            "content-type",

            "text/html; charset=UTF-8"

        );


        headers.set(

            "Cache-Control",

            "no-store, no-cache, must-revalidate"

        );


        /* =========================================
           RETURN UPDATED PAGE
        ========================================= */

        return new Response(

            updatedHtml,

            {

                status:
                    response.status,

                statusText:
                    response.statusText,

                headers

            }

        );


    } catch (error) {


        console.error(
            "EVENT SOCIAL PREVIEW ERROR:",
            error
        );


        return context.next();

    }

}


/* =========================================
   NETLIFY EDGE FUNCTION CONFIGURATION
========================================= */

export const config = {

    path:
        "/event.html"

};