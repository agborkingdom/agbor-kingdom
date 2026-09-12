/* =========================================
   AGBOR KINGDOM
   DYNAMIC EVENT SOCIAL PREVIEW
========================================= */

export default async function (request, context) {

    console.log(
        "EVENT SOCIAL PREVIEW FUNCTION STARTED"
    );


    /* =====================================
       CURRENT URL
    ===================================== */

    const url =
        new URL(request.url);


    /* =====================================
       GET EVENT ID
    ===================================== */

    const eventId =
        url.searchParams.get("id");


    console.log(
        "Event ID:",
        eventId
    );


    /* =====================================
       NO EVENT ID
    ===================================== */

    if (!eventId) {

        return context.next();

    }


    try {


        /* =====================================
           SUPABASE ENVIRONMENT VARIABLES
        ===================================== */

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
                "Supabase environment variables are missing."
            );

            return context.next();

        }


        /* =====================================
           GET EVENT FROM SUPABASE
        ===================================== */

        const params =
            new URLSearchParams();


        params.set(
            "select",
            "id,title,description,event_type,event_date,event_time,location,image_url"
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
            "Loading event from Supabase"
        );


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
                "Unable to load event:",
                eventResponse.status
            );

            return context.next();

        }


        const eventData =
            await eventResponse.json();


        const event =
            eventData?.[0];


        /* =====================================
           EVENT NOT FOUND
        ===================================== */

        if (!event) {

            console.error(
                "Event not found."
            );

            return context.next();

        }


        console.log(
            "Event found:",
            event.title
        );


        /* =====================================
           EVENT INFORMATION
        ===================================== */

        const eventTitle =
            event.title ||
            "Agbor Kingdom Event";


        const eventDescription =
            event.description ||
            "Upcoming events and activities from the Royal Kingdom of Agbor.";


        const canonicalUrl =
            `${url.origin}/event.html?id=` +
            encodeURIComponent(event.id);


        /* =====================================
           EVENT IMAGE
        ===================================== */

        let eventImage =
            event.image_url || "";


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

                eventImage = "";

            }

        }


        /* =====================================
           FALLBACK IMAGE
        ===================================== */

        if (!eventImage) {

            eventImage =
                `${url.origin}/images/events/event-default.jpg`;

        }


        console.log(
            "Event image:",
            eventImage
        );


        /* =====================================
           GET ORIGINAL HTML
        ===================================== */

        const response =
            await context.next();


        const html =
            await response.text();


        let updatedHtml =
            html;


        /* =====================================
           ESCAPE REGEX
        ===================================== */

        function escapeRegex(value) {

            return String(value).replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        }


        /* =====================================
           ESCAPE HTML ATTRIBUTE
        ===================================== */

        function escapeHTML(value) {

            return String(value || "")
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

        }


        /* =====================================
           UPDATE META TAG BY ID
        ===================================== */

        function updateMetaById(id, value) {

            const idPattern =
                escapeRegex(id);


            const tagRegex =
                new RegExp(
                    `<meta\\b[^>]*\\bid=["']${idPattern}["'][^>]*>`,
                    "i"
                );


            updatedHtml =
                updatedHtml.replace(
                    tagRegex,
                    function (tag) {


                        if (
                            /\bcontent=["'][^"']*["']/i.test(tag)
                        ) {

                            return tag.replace(
                                /\bcontent=(["'])[^"']*\1/i,
                                `content="${escapeHTML(value)}"`
                            );

                        }


                        return tag.replace(
                            ">",
                            ` content="${escapeHTML(value)}">`
                        );

                    }
                );

        }


        /* =====================================
           UPDATE CANONICAL
        ===================================== */

        function updateCanonicalUrl(value) {

            const tagRegex =
                /<link\b[^>]*\bid=["']eventCanonical["'][^>]*>/i;


            updatedHtml =
                updatedHtml.replace(
                    tagRegex,
                    function (tag) {


                        if (
                            /\bhref=["'][^"']*["']/i.test(tag)
                        ) {

                            return tag.replace(
                                /\bhref=(["'])[^"']*\1/i,
                                `href="${escapeHTML(value)}"`
                            );

                        }


                        return tag.replace(
                            ">",
                            ` href="${escapeHTML(value)}">`
                        );

                    }
                );

        }


        /* =====================================
           UPDATE PAGE TITLE
        ===================================== */

        updatedHtml =
            updatedHtml.replace(
                /<title>[\s\S]*?<\/title>/i,
                `<title>${escapeHTML(eventTitle)} | Agbor Kingdom</title>`
            );


        /* =====================================
           SEO DESCRIPTION
        ===================================== */

        updateMetaById(
            "eventMetaDescription",
            eventDescription
        );


        /* =====================================
           OPEN GRAPH
        ===================================== */

        updateMetaById(
            "eventOgTitle",
            eventTitle
        );


        updateMetaById(
            "eventOgDescription",
            eventDescription
        );


        updateMetaById(
            "eventOgUrl",
            canonicalUrl
        );


        updateMetaById(
            "eventOgImage",
            eventImage
        );


        updateMetaById(
            "eventOgImageSecureUrl",
            eventImage
        );


        updateMetaById(
            "eventOgImageAlt",
            eventTitle
        );


        /* =====================================
           TWITTER / X
        ===================================== */

        updateMetaById(
            "eventTwitterTitle",
            eventTitle
        );


        updateMetaById(
            "eventTwitterDescription",
            eventDescription
        );


        updateMetaById(
            "eventTwitterImage",
            eventImage
        );


        updateMetaById(
            "eventTwitterImageAlt",
            eventTitle
        );


        /* =====================================
           CANONICAL URL
        ===================================== */

        updateCanonicalUrl(
            canonicalUrl
        );


        /* =====================================
           DEBUG MARKER
        ===================================== */

        updatedHtml =
            updatedHtml.replace(
                "</head>",
                `

<!-- EVENT EDGE FUNCTION ACTIVE -->

</head>`
            );


        console.log(
            "Event social preview HTML updated successfully."
        );


        /* =====================================
           RESPONSE HEADERS
        ===================================== */

        const headers =
            new Headers(response.headers);


        headers.set(
            "content-type",
            "text/html; charset=UTF-8"
        );


        headers.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate"
        );


        /* =====================================
           RETURN UPDATED HTML
        ===================================== */

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
            "Agbor Kingdom event social preview error:",
            error
        );


        return context.next();

    }

}


/* =========================================
   NETLIFY EDGE FUNCTION CONFIGURATION
========================================= */

export const config = {

    path: "/event.html"

};