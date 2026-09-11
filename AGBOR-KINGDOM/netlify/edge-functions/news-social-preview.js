/* =========================================
   AGBOR KINGDOM

   DYNAMIC NEWS SOCIAL PREVIEW

   WhatsApp
   Facebook
   X / Twitter
========================================= */


export default async function (
    request,
    context
) {

    const url =
        new URL(
            request.url
        );


    /* =====================================
       GET NEWS SLUG
    ===================================== */

    const slug =
        url.searchParams.get(
            "slug"
        );


    /* =====================================
       NO SLUG

       Load the normal page.
    ===================================== */

    if (!slug) {

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
                "NEWS SOCIAL PREVIEW: Missing Supabase environment variables."
            );

            return context.next();

        }


        /* =====================================
           LOAD NEWS ARTICLE
        ===================================== */

        const apiUrl =
            supabaseUrl +
            "/rest/v1/news" +
            "?select=id,title,slug,excerpt,image_url,is_published" +
            "&slug=eq." +
            encodeURIComponent(
                slug
            ) +
            "&is_published=eq.true" +
            "&limit=1";


        const newsResponse =
            await fetch(
                apiUrl,
                {
                    headers: {

                        apikey:
                            supabaseAnonKey,

                        Authorization:
                            `Bearer ${supabaseAnonKey}`

                    }
                }
            );


        if (!newsResponse.ok) {

            console.error(
                "NEWS SOCIAL PREVIEW: Unable to load article.",
                newsResponse.status
            );

            return context.next();

        }


        const newsData =
            await newsResponse.json();


        const news =
            newsData?.[0];


        /* =====================================
           ARTICLE NOT FOUND
        ===================================== */

        if (!news) {

            console.error(
                "NEWS SOCIAL PREVIEW: Article not found."
            );

            return context.next();

        }


        /* =====================================
           ARTICLE INFORMATION
        ===================================== */

        const articleTitle =
            news.title ||
            "Agbor Kingdom News";


        const articleDescription =
            news.excerpt ||
            "Latest news, announcements and stories from the Royal Kingdom of Agbor.";


        /*
           IMPORTANT:

           This uses the EXACT image URL
           stored in Supabase.
        */

        let articleImage =
            news.image_url ||
            "";


        /*
           Convert relative URLs to absolute URLs.
        */

        if (articleImage) {

            try {

                articleImage =
                    new URL(
                        articleImage,
                        url.origin
                    ).href;

            } catch (error) {

                console.error(
                    "NEWS SOCIAL PREVIEW: Invalid image URL.",
                    articleImage
                );

            }

        }


        const articleUrl =
            url.origin +
            "/news.html?slug=" +
            encodeURIComponent(
                slug
            );


        /* =====================================
           GET ORIGINAL NEWS.HTML
        ===================================== */

        const response =
            await context.next();


        const html =
            await response.text();


        let updatedHtml =
            html;


        /* =====================================
           ESCAPE HTML
        ===================================== */

        function escapeHTML(
            value
        ) {

            return String(
                value || ""
            )

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
           UPDATE META TAG

           This version is more reliable than
           the previous regex.

           It finds the meta tag by ID and
           replaces its content value.
        ===================================== */

        function updateMetaById(
            id,
            value
        ) {

            const metaRegex =
                new RegExp(
                    `<meta\\b[^>]*\\bid=["']${id}["'][^>]*>`,
                    "i"
                );


            updatedHtml =
                updatedHtml.replace(
                    metaRegex,
                    function (
                        metaTag
                    ) {

                        /*
                           If content already exists,
                           replace it.
                        */

                        if (
                            /\bcontent=["'][^"']*["']/i.test(
                                metaTag
                            )
                        ) {

                            return metaTag.replace(
                                /\bcontent=["'][^"']*["']/i,
                                `content="${escapeHTML(value)}"`
                            );

                        }


                        /*
                           If content does not exist,
                           add it.
                        */

                        return metaTag.replace(
                            ">",
                            ` content="${escapeHTML(value)}">`
                        );

                    }
                );

        }


        /* =====================================
           UPDATE CANONICAL URL
        ===================================== */

        function updateCanonicalUrl(
            value
        ) {

            const canonicalRegex =
                /<link\b[^>]*\bid=["']newsCanonical["'][^>]*>/i;


            updatedHtml =
                updatedHtml.replace(
                    canonicalRegex,
                    function (
                        linkTag
                    ) {

                        if (
                            /\bhref=["'][^"']*["']/i.test(
                                linkTag
                            )
                        ) {

                            return linkTag.replace(
                                /\bhref=["'][^"']*["']/i,
                                `href="${escapeHTML(value)}"`
                            );

                        }


                        return linkTag.replace(
                            ">",
                            ` href="${escapeHTML(value)}">`
                        );

                    }
                );

        }


        /* =====================================
           SEO
        ===================================== */

        updateMetaById(
            "newsMetaDescription",
            articleDescription
        );


        /* =====================================
           OPEN GRAPH
        ===================================== */

        updateMetaById(
            "ogTitle",
            articleTitle
        );


        updateMetaById(
            "ogDescription",
            articleDescription
        );


        updateMetaById(
            "ogUrl",
            articleUrl
        );


        updateMetaById(
            "ogImage",
            articleImage
        );


        updateMetaById(
            "ogImageSecure",
            articleImage
        );


        updateMetaById(
            "ogImageAlt",
            articleTitle
        );


        /* =====================================
           X / TWITTER
        ===================================== */

        updateMetaById(
            "twitterTitle",
            articleTitle
        );


        updateMetaById(
            "twitterDescription",
            articleDescription
        );


        updateMetaById(
            "twitterImage",
            articleImage
        );


        updateMetaById(
            "twitterImageAlt",
            articleTitle
        );


        /* =====================================
           CANONICAL URL
        ===================================== */

        updateCanonicalUrl(
            articleUrl
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
           Prevent metadata from one news article
           being cached for another article.
        */

        headers.set(
            "Cache-Control",
            "no-store"
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
            "NEWS SOCIAL PREVIEW ERROR:",
            error
        );


        /*
           Never break the website.
        */

        return context.next();

    }

}


/* =========================================
   NETLIFY EDGE FUNCTION CONFIGURATION
========================================= */

export const config = {

    path:
        "/news.html"

};