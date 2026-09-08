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

    const url =
        new URL(request.url);


    /* =====================================
       GET PUBLICATION ID
    ===================================== */

    const publicationId =
        url.searchParams.get("id");


    /* =====================================
       NO ID

       Continue normally.
    ===================================== */

    if (!publicationId) {

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
           LOAD PUBLICATION

           Only active publications.
        ===================================== */

        const publicationUrl =
            `${supabaseUrl}/rest/v1/publications` +
            `?select=*` +
            `&id=eq.${encodeURIComponent(
                publicationId
            )}` +
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


        /* =====================================
           PUBLICATION NOT FOUND
        ===================================== */

        if (!publication) {

            return context.next();

        }


        /* =====================================
           PUBLICATION DATA
        ===================================== */

        const publicationTitle =
            publication.title ||
            "Agbor Kingdom Publication";


        const publicationDescription =
            publication.description ||
            "Official publications from the Royal Kingdom of Agbor.";


        const publicationImage =
            publication.cover_image_url ||
            "";


        const canonicalUrl =
            `${url.origin}/publication-details.html?id=` +
            encodeURIComponent(
                publicationId
            );


        /* =====================================
           GET ORIGINAL HTML PAGE
        ===================================== */

        const response =
            await context.next();


        const html =
            await response.text();


        /* =====================================
           ESCAPE HTML
        ===================================== */

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


        /* =====================================
           UPDATE HTML
        ===================================== */

        let updatedHtml =
            html;


        /* =====================================
           UPDATE META BY ID
        ===================================== */

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


        /* =====================================
           SEO DESCRIPTION
        ===================================== */

        updateMetaById(
            "publicationMetaDescription",
            publicationDescription
        );


        /* =====================================
           OPEN GRAPH
        ===================================== */

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


        /* =====================================
           X / TWITTER
        ===================================== */

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


        /* =====================================
           UPDATE CANONICAL URL
        ===================================== */

        updatedHtml =
            updatedHtml.replace(

                /(<link[^>]*id=["']publicationCanonical["'][^>]*href=["'])[^"']*(["'][^>]*>)/i,

                `$1${escapeHTML(
                    canonicalUrl
                )}$2`

            );


        /* =====================================
           RESPONSE HEADERS
        ===================================== */

        const headers =
            new Headers(
                response.headers
            );


        headers.set(
            "content-type",
            "text/html; charset=UTF-8"
        );


        /*
           Prevent metadata from one publication
           being cached for another publication.
        */

        headers.set(
            "Cache-Control",
            "no-store"
        );


        /* =====================================
           RETURN UPDATED PAGE
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
            "Agbor Kingdom publication social preview error:",
            error
        );


        /*
           Never break the publication page.
        */

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