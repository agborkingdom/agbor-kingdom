export default async (
    request,
    context
) => {

    const url =
        new URL(request.url);


    /* =========================================
       GET EVENT ID
    ========================================= */

    const eventId =
        url.searchParams.get("id");


    /* No event ID → normal page */

    if (!eventId) {

        return context.next();

    }


    /* =========================================
       DETECT SOCIAL MEDIA BOTS
    ========================================= */

    const userAgent =
        request.headers.get("user-agent") ||
        "";


    const socialBots =
        /facebookexternalhit|Facebot|Twitterbot|WhatsApp|Slackbot|TelegramBot|LinkedInBot|Discordbot|Pinterest|Googlebot/i;


    /* Normal visitors continue normally */

    if (!socialBots.test(userAgent)) {

        return context.next();

    }


    try {

        /* =====================================
           ENVIRONMENT VARIABLES
        ====================================== */

        const supabaseUrl =
            Netlify.env.get(
                "SUPABASE_URL"
            );


        const supabaseKey =
            Netlify.env.get(
                "SUPABASE_ANON_KEY"
            );


        if (
            !supabaseUrl ||
            !supabaseKey
        ) {

            console.error(
                "Missing Supabase environment variables."
            );

            return context.next();

        }


        /* =====================================
           GET EVENT FROM SUPABASE
        ====================================== */

        const response =
            await fetch(

                `${supabaseUrl}/rest/v1/events` +

                `?select=id,title,description,event_type,event_date,event_time,location,image_url` +

                `&id=eq.${encodeURIComponent(eventId)}` +

                `&is_active=eq.true` +

                `&limit=1`,

                {

                    headers: {

                        apikey:
                            supabaseKey,

                        Authorization:
                            `Bearer ${supabaseKey}`

                    }

                }

            );


        if (!response.ok) {

            console.error(
                "Supabase event request failed:",
                response.status
            );

            return context.next();

        }


        const events =
            await response.json();


        const event =
            events?.[0];


        if (!event) {

            return context.next();

        }


        /* =====================================
           EVENT INFORMATION
        ====================================== */

        const title =
            event.title ||
            "Agbor Kingdom Event";


        const description =
            event.description ||
            "Upcoming events and activities from the Royal Kingdom of Agbor.";


        const eventUrl =
            `${url.origin}/event.html?id=${encodeURIComponent(event.id)}`;


        let image =
            event.image_url || "";


        /* =====================================
           MAKE IMAGE ABSOLUTE
        ====================================== */

        if (image) {

            try {

                image =
                    new URL(
                        image,
                        url.origin
                    ).href;

            } catch (error) {

                console.error(
                    "Invalid event image URL:",
                    image
                );

            }

        }


        /* =====================================
           FALLBACK IMAGE
        ====================================== */

        if (!image) {

            image =
                `${url.origin}/images/events/event-default.jpg`;

        }


        /* =====================================
           ESCAPE HTML
        ====================================== */

        const escapeHtml =
            value =>
                String(value || "")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");


        /* =====================================
           SOCIAL PREVIEW HTML
        ====================================== */

        const html = `<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<title>${escapeHtml(title)}</title>


<meta
    name="description"
    content="${escapeHtml(description)}"
>


<link
    rel="canonical"
    href="${escapeHtml(eventUrl)}"
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
    content="${escapeHtml(title)}"
>

<meta
    property="og:description"
    content="${escapeHtml(description)}"
>

<meta
    property="og:url"
    content="${escapeHtml(eventUrl)}"
>

<meta
    property="og:image"
    content="${escapeHtml(image)}"
>

<meta
    property="og:image:secure_url"
    content="${escapeHtml(image)}"
>

<meta
    property="og:image:alt"
    content="${escapeHtml(title)}"
>


<!-- X / TWITTER -->

<meta
    name="twitter:card"
    content="summary_large_image"
>

<meta
    name="twitter:title"
    content="${escapeHtml(title)}"
>

<meta
    name="twitter:description"
    content="${escapeHtml(description)}"
>

<meta
    name="twitter:image"
    content="${escapeHtml(image)}"
>

<meta
    name="twitter:image:alt"
    content="${escapeHtml(title)}"
>

</head>

<body>

<h1>${escapeHtml(title)}</h1>

<p>${escapeHtml(description)}</p>

</body>

</html>`;


        return new Response(

            html,

            {

                headers: {

                    "content-type":
                        "text/html; charset=UTF-8",

                    "cache-control":
                        "public, max-age=300"

                }

            }

        );


    } catch (error) {

        console.error(
            "Event social preview error:",
            error
        );

        return context.next();

    }

};