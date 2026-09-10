/* =========================================
   AGBOR KINGDOM
   DYNAMIC PUBLICATION SOCIAL PREVIEW
   WhatsApp / Facebook / X
========================================= */

export default async function (request, context) {

    console.log(
        "PUBLICATION SOCIAL PREVIEW FUNCTION STARTED"
    );

    const url = new URL(request.url);

    const publicationId =
        url.searchParams.get("id");

    console.log(
        "Publication ID:",
        publicationId
    );

    /*
       No publication ID.
       Let Netlify serve the page normally.
    */

    if (!publicationId) {
        return context.next();
    }

    try {

        /* =====================================
           SUPABASE
        ===================================== */

        const supabaseUrl =
            Netlify.env.get("SUPABASE_URL");

        const supabaseAnonKey =
            Netlify.env.get("SUPABASE_ANON_KEY");

        if (
            !supabaseUrl ||
            !supabaseAnonKey
        ) {

            console.error(
                "Missing Supabase environment variables."
            );

            return context.next();
        }


        /* =====================================
           LOAD PUBLICATION
        ===================================== */

        const publicationUrl =
            new URL(
                `${supabaseUrl}/rest/v1/publications`
            );

        publicationUrl.searchParams.set(
            "select",
            "*"
        );

        publicationUrl.searchParams.set(
            "id",
            `eq.${publicationId}`
        );

        publicationUrl.searchParams.set(
            "is_active",
            "eq.true"
        );

        publicationUrl.searchParams.set(
            "limit",
            "1"
        );


        const publicationResponse =
            await fetch(
                publicationUrl.toString(),
                {
                    headers: {
                        apikey:
                            supabaseAnonKey,

                        Authorization:
                            `Bearer ${supabaseAnonKey}`,

                        Accept:
                            "application/json"
                    }
                }
            );


        if (!publicationResponse.ok) {

            console.error(
                "Supabase request failed:",
                publicationResponse.status,
                await publicationResponse.text()
            );

            return context.next();
        }


        const publicationData =
            await publicationResponse.json();


        const publication =
            publicationData?.[0];


        if (!publication) {

            console.error(
                "Publication not found:",
                publicationId
            );

            return context.next();
        }


        console.log(
            "Publication found:",
            publication.title
        );


        /* =====================================
           PUBLICATION DATA
        ===================================== */

        const title =
            publication.title ||
            "Agbor Kingdom Publication";


        const description =
            publication.description ||
            "Official publications from the Royal Kingdom of Agbor.";


        const image =
            publication.cover_image_url ||
            "";


        const canonicalUrl =
            `${url.origin}/publication-details.html?id=${encodeURIComponent(
                publicationId
            )}`;


        console.log(
            "Title:",
            title
        );

        console.log(
            "Description:",
            description
        );

        console.log(
            "Image:",
            image
        );

        console.log(
            "Canonical:",
            canonicalUrl
        );


        /* =====================================
           GET ORIGINAL PAGE
        ===================================== */

        const response =
            await context.next();


        if (!response.ok) {

            console.error(
                "Original page request failed:",
                response.status
            );

            return response;
        }


        const html =
            await response.text();


        /* =====================================
           HTML ESCAPING
        ===================================== */

        function escapeHTML(value) {

            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }


        /* =====================================
           UPDATE META TAG
        ===================================== */

        function updateMeta(id, value) {

            const escapedId =
                id.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );


            const regex =
                new RegExp(
                    `<meta\\b[^>]*\\bid=["']${escapedId}["'][^>]*>`,
                    "i"
                );


            const escapedValue =
                escapeHTML(value);


            if (!regex.test(html)) {

                console.error(
                    `Meta tag not found: ${id}`
                );

                return;
            }


            updatedHtml =
                updatedHtml.replace(
                    regex,
                    function (tag) {

                        const contentRegex =
                            /\bcontent=(["'])[^"']*\1/i;


                        if (
                            contentRegex.test(tag)
                        ) {

                            return tag.replace(
                                contentRegex,
                                `content="${escapedValue}"`
                            );
                        }


                        return tag.replace(
                            ">",
                            ` content="${escapedValue}">`
                        );
                    }
                );
        }


        /* =====================================
           UPDATE CANONICAL
        ===================================== */

        function updateCanonical(value) {

            const regex =
                /<link\b[^>]*\bid=["']publicationCanonical["'][^>]*>/i;


            if (!regex.test(updatedHtml)) {

                console.error(
                    "Canonical tag not found."
                );

                return;
            }


            updatedHtml =
                updatedHtml.replace(
                    regex,
                    function (tag) {

                        return tag.replace(
                            /\bhref=(["'])[^"']*\1/i,
                            `href="${escapeHTML(value)}"`
                        );
                    }
                );
        }


        /* =====================================
           MODIFY HTML
        ===================================== */

        let updatedHtml = html;


        updateMeta(
            "publicationMetaDescription",
            description
        );


        updateMeta(
            "publicationOgTitle",
            title
        );


        updateMeta(
            "publicationOgDescription",
            description
        );


        updateMeta(
            "publicationOgUrl",
            canonicalUrl
        );


        updateMeta(
            "publicationOgImage",
            image
        );


        updateMeta(
            "publicationOgImageAlt",
            title
        );


        updateMeta(
            "publicationTwitterTitle",
            title
        );


        updateMeta(
            "publicationTwitterDescription",
            description
        );


        updateMeta(
            "publicationTwitterImage",
            image
        );


        updateCanonical(
            canonicalUrl
        );


        /* =====================================
           DEBUG
        ===================================== */

        updatedHtml =
            updatedHtml.replace(
                "</head>",
                `
<!-- PUBLICATION EDGE FUNCTION ACTIVE -->
</head>`
            );


        console.log(
            "HTML successfully modified."
        );


        /* =====================================
           RESPONSE
        ===================================== */

        const headers =
            new Headers(response.headers);


        headers.set(
            "content-type",
            "text/html; charset=UTF-8"
        );


        /*
           Prevent cached generic metadata
           from being served.
        */

        headers.set(
            "Cache-Control",
            "no-store"
        );


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
            "Publication social preview error:",
            error
        );

        return context.next();
    }
}


/* =========================================
   NETLIFY EDGE FUNCTION CONFIG
========================================= */

export const config = {

    path:
        "/publication-details.html"

};