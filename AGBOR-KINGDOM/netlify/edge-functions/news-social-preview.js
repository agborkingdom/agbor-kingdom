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

    const url = new URL(
        request.url
    );


    /* =====================================
       GET NEWS SLUG
    ===================================== */

    const slug =
        url.searchParams.get("slug");


    /*
       If there is no slug,
       continue normally.
    */

    if (!slug) {

        return context.next();

    }


    try {

        /* =================================
           SUPABASE SETTINGS

           These will come from
           Netlify Environment Variables.
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
           GET NEWS ARTICLE
        ================================= */

        const newsUrl =
            `${supabaseUrl}/rest/v1/news` +
            `?select=*` +
            `&slug=eq.${encodeURIComponent(slug)}` +
            `&limit=1`;


        const newsResponse =
            await fetch(
                newsUrl,
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
                "Unable to load news article:",
                newsResponse.status
            );

            return context.next();

        }


        const newsData =
            await newsResponse.json();


        const news =
            newsData?.[0];

console.log("NEWS SLUG:", slug);
console.log("NEWS FOUND:", !!news);
console.log("NEWS IMAGE URL:", news?.image_url);
console.log("NEWS TITLE:", news?.title);
        /*
           Article not found.
           Continue normally so your
           existing page can handle it.
        */

        if (!news) {

            return context.next();

        }


        /* =================================
           ARTICLE DATA
        ================================= */

        const articleTitle =
            news.title ||
            "Agbor Kingdom News";


        const articleDescription =
            news.excerpt ||
            "Latest news, announcements and stories from the Royal Kingdom of Agbor.";


        const articleImage =
            news.image_url || "";


        const articleUrl =
            `${url.origin}/news.html?slug=` +
            encodeURIComponent(slug);


        /* =================================
           GET ORIGINAL NEWS.HTML
        ================================= */

        const response =
            await context.next();


        const html =
            await response.text();


        /* =================================
           ESCAPE HTML ATTRIBUTE VALUES
        ================================= */

        function escapeHTML(value) {

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


        /* =================================
           REPLACE META TAG CONTENT
        ================================= */

        let updatedHtml =
            html;
            

updatedHtml = updatedHtml.replace(
    "</head>",
    "<!-- NEWS EDGE FUNCTION ACTIVE -->\n</head>"
);
        /*
           Helper function that updates
           content="" for a tag with an ID.
        */

       function updateMetaById(
    id,
    value
) {

    const metaRegex =
        new RegExp(

            `<meta([^>]*\\bid=["']${id}["'][^>]*)>`,

            "i"

        );



    updatedHtml =
        updatedHtml.replace(

            metaRegex,

            function (match, attributes) {

                const contentRegex =
                    /\bcontent=["'][^"']*["']/i;



                if (
                    contentRegex.test(attributes)
                ) {

                    attributes =
                        attributes.replace(

                            contentRegex,

                            `content="${escapeHTML(value)}"`

                        );

                } else {

                    attributes +=
                        ` content="${escapeHTML(value)}"`;

                }



                return `<meta${attributes}>`;

            }

        );

}


        /* =================================
           SEO
        ================================= */

        updateMetaById(
            "newsMetaDescription",
            articleDescription
        );


        /* =================================
           OPEN GRAPH
        ================================= */

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
            "ogImageAlt",
            articleTitle
        );


        /* =================================
           TWITTER / X
        ================================= */

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


        /* =================================
           CANONICAL URL
        ================================= */

       const canonicalRegex =
    /<link([^>]*\bid=["']newsCanonical["'][^>]*)>/i;



updatedHtml =
    updatedHtml.replace(

        canonicalRegex,

        function (match, attributes) {

            const hrefRegex =
                /\bhref=["'][^"']*["']/i;



            if (
                hrefRegex.test(attributes)
            ) {

                attributes =
                    attributes.replace(

                        hrefRegex,

                        `href="${escapeHTML(articleUrl)}"`

                    );

            } else {

                attributes +=
                    ` href="${escapeHTML(articleUrl)}"`;

            }



            return `<link${attributes}>`;

        }

    );


        /* =================================
           RETURN UPDATED HTML
        ================================= */

        const headers =
            new Headers(
                response.headers
            );


        headers.set(

            "content-type",

            "text/html; charset=UTF-8"

        );


        /*
           Important:
           Don't allow one article's
           metadata to be cached and
           shown for another article.
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
            "Agbor Kingdom social preview error:",
            error
        );


        /*
           Never break the website.
           If something fails,
           load the normal page.
        */

        return context.next();

    }

}


/* =========================================
   NETLIFY EDGE FUNCTION CONFIGURATION
========================================= */

export const config = {

    path: "/news.html"

};