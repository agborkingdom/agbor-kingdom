/* =========================================
   AGBOR KINGDOM
   DYNAMIC PUBLICATION SOCIAL PREVIEW
   WhatsApp
   Facebook
   X / Twitter
========================================= */

export default async function (request, context) {

    console.log(
        "PUBLICATION SOCIAL PREVIEW FUNCTION STARTED"
    );

    const url = new URL(
        request.url
    );


    /* =====================================
       GET PUBLICATION ID
    ===================================== */

    const publicationId =
        url.searchParams.get("id");


    console.log(
        "Publication ID:",
        publicationId
    );


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

        const params =
            new URLSearchParams();

        params.set(
            "select",
            "*"
        );

        params.set(
            "id",
            `eq.${publicationId}`
        );

        params.set(
            "is_active",
            "eq.true"
        );

        params.set(
            "limit",
            "1"
        );


        const publicationUrl =
            `${supabaseUrl}/rest/v1/publications?${params.toString()}`;


        console.log(
            "Loading publication from Supabase"
        );


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

            console.error(
                "Publication not found."
            );

            return context.next();

        }


        console.log(
            "Publication found:",
            publication.title
        );


        console.log(
            "Publication image:",
            publication.cover_image_url
        );


        /* =================================
           PUBLICATION DATA
        ================================= */

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


        /* =================================
           GET ORIGINAL HTML
        ================================= */

        const response =
            await context.next();


        const html =
            await response.text();


        let updatedHtml =
            html;


        /* =================================
           HELPER:
           ESCAPE REGEX TEXT
        ================================= */

        function escapeRegex(value) {

            return String(value).replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        }


        /* =================================
           HELPER:
           ESCAPE HTML ATTRIBUTE
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


        /* =================================
           UPDATE META TAG BY ID

           Works regardless of the order
           of attributes inside the tag.
        ================================= */

        function updateMetaById(
            id,
            value
        ) {

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

                        /* Replace existing content */

                        if (
                            /\bcontent=["'][^"']*["']/i.test(tag)
                        ) {

                            return tag.replace(
                                /\bcontent=(["'])[^"']*\1/i,
                                `content="${escapeHTML(value)}"`
                            );

                        }


                        /* Add content if missing */

                        return tag.replace(
                            ">",
                            ` content="${escapeHTML(value)}">`
                        );

                    }
                );

        }


        /* =================================
           UPDATE CANONICAL URL
        ================================= */

        function updateCanonicalUrl(value) {

            const tagRegex =
                /<link\b[^>]*\bid=["']publicationCanonical["'][^>]*>/i;


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

        updateCanonicalUrl(
            canonicalUrl
        );


        /* =================================
           DEBUG MARKER

           This confirms that the Edge
           Function modified the HTML.
        ================================= */

        updatedHtml =
            updatedHtml.replace(
                "</head>",
                `

<!-- PUBLICATION EDGE FUNCTION ACTIVE -->

</head>`
            );


        console.log(
            "Publication social preview HTML updated successfully."
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


        headers.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate"
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