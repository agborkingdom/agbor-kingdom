/* =========================================
   AGBOR KINGDOM

   DYNAMIC PUBLICATION SOCIAL PREVIEW

   WhatsApp
   Facebook
   X / Twitter
========================================= */


export default async function (
    request,
    context
) {

    const url = new URL(
        request.url
    );


    /* =====================================
       GET PUBLICATION ID
    ===================================== */

    const publicationId =
        url.searchParams.get("id");


    /* No ID → load normally */

    if (!publicationId) {

        return context.next();

    }


    try {

        /* =================================
           SUPABASE SETTINGS
        ================================= */

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


        /* =================================
           GET PUBLICATION
        ================================= */

        const publicationUrl =

            `${supabaseUrl}/rest/v1/publications` +

            `?select=*` +

            `&id=eq.${encodeURIComponent(publicationId)}` +

            `&is_active=eq.true` +

            `&limit=1`;


        const publicationResponse =
            await fetch(

                publicationUrl,

                {
                    headers: {

                        apikey:
                            supabaseAnonKey,

                        Authorization:
                            `Bearer ${supabaseAnonKey}`

                    }
                }

            );


        if (!publicationResponse.ok) {

            console.error(
                "Unable to load publication:",
                publicationResponse.status
            );

            return context.next();

        }


        const publicationData =
            await publicationResponse.json();


        const publication =
            publicationData?.[0];


        /* Publication not found */

        if (!publication) {

            return context.next();

        }


        /* =================================
           PUBLICATION DATA
        ================================= */

        const publicationTitle =

            publication.title ||

            "Agbor Kingdom Publication";


        const publicationDescription =

            publication.description ||

            "Publications, books, reports and documents from the Royal Kingdom of Agbor.";


        const publicationImage =

            publication.cover_image_url ||

            "";


        const canonicalUrl =

            `${url.origin}/publication-details.html?id=` +

            encodeURIComponent(
                publicationId
            );


        /* =================================
           GET ORIGINAL HTML
        ================================= */

        const response =
            await context.next();


        const html =
            await response.text();


        /* =================================
           ESCAPE HTML
        ================================= */

        function escapeHTML(value) {

            return String(value || "")

                .replaceAll(
                    "&",
                    "&amp;"
                )

                .replaceAll(
                    '"',
                    "&quot;"
                )

                .replaceAll(
                    "<",
                    "&lt;"
                )

                .replaceAll(
                    ">",
                    "&gt;"
                );

        }


        let updatedHtml =
            html;

            updatedHtml =
    updatedHtml.replace(
        "</head>",
        `<!-- PUBLICATION EDGE FUNCTION ACTIVE -->
</head>`
    );

        /* =================================
           UPDATE META TAG BY ID
        ================================= */

        function updateMetaById(
            id,
            value
        ) {

            const regex =
                new RegExp(

                    `(<meta[^>]*id=["']${id}["'][^>]*content=["'])[^"']*(["'][^>]*>)`,

                    "i"

                );


            updatedHtml =
                updatedHtml.replace(

                    regex,

                    `$1${escapeHTML(value)}$2`

                );

        }


        /* =================================
           SEO
        ================================= */

        updateMetaById(

            "publicationMetaDescription",

            publicationDescription

        );


        /* =================================
           OPEN GRAPH
        ================================= */

        updateMetaById(

            "publicationOgTitle",

            publicationTitle

        );


        updateMetaById(

            "publicationOgDescription",

            publicationDescription

        );


        updateMetaById(

            "publicationOgUrl",

            canonicalUrl

        );


        updateMetaById(

            "publicationOgImage",

            publicationImage

        );


        updateMetaById(

            "publicationOgImageAlt",

            publicationTitle

        );


        /* =================================
           X / TWITTER
        ================================= */

        updateMetaById(

            "publicationTwitterTitle",

            publicationTitle

        );


        updateMetaById(

            "publicationTwitterDescription",

            publicationDescription

        );


        updateMetaById(

            "publicationTwitterImage",

            publicationImage

        );


        /* =================================
           CANONICAL URL
        ================================= */

        updatedHtml =
            updatedHtml.replace(

                /(<link[^>]*id=["']publicationCanonical["'][^>]*href=["'])[^"']*(["'][^>]*>)/i,

                `$1${escapeHTML(canonicalUrl)}$2`

            );


        /* =================================
           RESPONSE HEADERS
        ================================= */

        const headers =
            new Headers(
                response.headers
            );


        headers.set(

            "content-type",

            "text/html; charset=UTF-8"

        );


        /* Prevent one publication preview
           from being cached for another */

        headers.set(

            "Cache-Control",

            "no-store"

        );


        /* =================================
           RETURN UPDATED HTML
        ================================= */

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

            "Agbor Kingdom publication social preview error:",

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
        "/publication-details.html"

};