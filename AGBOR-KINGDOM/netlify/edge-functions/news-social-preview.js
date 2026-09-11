/* =========================================
   AGBOR KINGDOM
   NEWS SOCIAL PREVIEW

   WhatsApp
   Facebook
   X / Twitter
========================================= */

export default async function (request, context) {

    console.log(
        "NEWS SOCIAL PREVIEW FUNCTION STARTED"
    );


    const url =
        new URL(request.url);


    /* =====================================
       GET NEWS SLUG
    ===================================== */

    const slug =
        url.searchParams.get("slug");


    console.log(
        "NEWS SLUG:",
        slug
    );


    /* =====================================
       NO SLUG

       Load normal page.
    ===================================== */

    if (!slug) {

        console.log(
            "NO NEWS SLUG FOUND"
        );

        return context.next();

    }


    try {


        /* =====================================
           SUPABASE SETTINGS
        ===================================== */

        const supabaseUrl =
            Netlify.env.get(
                "SUPABASE_URL"
            );


        const supabaseAnonKey =
            Netlify.env.get(
                "SUPABASE_ANON_KEY"
            );


        console.log(
            "SUPABASE URL AVAILABLE:",
            !!supabaseUrl
        );


        console.log(
            "SUPABASE KEY AVAILABLE:",
            !!supabaseAnonKey
        );


        if (
            !supabaseUrl ||
            !supabaseAnonKey
        ) {

            console.error(
                "SUPABASE ENVIRONMENT VARIABLES ARE MISSING"
            );

            return context.next();

        }


        /* =====================================
           LOAD NEWS ARTICLE FROM SUPABASE
        ===================================== */

        const newsApiUrl =
            `${supabaseUrl}/rest/v1/news` +
            `?select=id,title,slug,excerpt,image_url,is_published` +
            `&slug=eq.${encodeURIComponent(slug)}` +
            `&is_published=eq.true` +
            `&limit=1`;


        console.log(
            "LOADING NEWS ARTICLE:",
            newsApiUrl
        );


        const newsResponse =
            await fetch(
                newsApiUrl,
                {

                    headers: {

                        apikey:
                            supabaseAnonKey,

                        Authorization:
                            `Bearer ${supabaseAnonKey}`

                    }

                }
            );


        console.log(
            "SUPABASE RESPONSE:",
            newsResponse.status
        );


        if (!newsResponse.ok) {

            console.error(
                "SUPABASE NEWS REQUEST FAILED"
            );

            return context.next();

        }


        const newsData =
            await newsResponse.json();


        console.log(
            "NEWS DATA FOUND:",
            newsData.length
        );


        const news =
            newsData?.[0];


        /* =====================================
           ARTICLE NOT FOUND
        ===================================== */

        if (!news) {

            console.error(
                "NEWS ARTICLE NOT FOUND FOR SLUG:",
                slug
            );

            return context.next();

        }


        console.log(
            "NEWS ARTICLE FOUND:",
            news.title
        );


        /* =====================================
           ARTICLE DATA
        ===================================== */

        const articleTitle =
            news.title ||
            "Agbor Kingdom News";


        const articleDescription =
            news.excerpt ||
            "Latest news, announcements and stories from the Royal Kingdom of Agbor.";


        let articleImage =
            news.image_url ||
            "";


        /* =====================================
           MAKE IMAGE URL ABSOLUTE
        ===================================== */

        if (articleImage) {

            try {

                articleImage =
                    new URL(
                        articleImage,
                        url.origin
                    ).href;

            } catch (error) {

                console.error(
                    "INVALID IMAGE URL:",
                    articleImage
                );

            }

        }


        console.log(
            "ARTICLE IMAGE:",
            articleImage
        );


        const articleUrl =
            `${url.origin}/news.html?slug=` +
            encodeURIComponent(slug);


        /* =====================================
           GET ORIGINAL PAGE
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
           CREATE SOCIAL META TAGS

           IMPORTANT:
           These are inserted directly into
           the HTML BEFORE </head>.
        ===================================== */

        const socialMetaTags = `

<!-- =====================================
     AGBOR KINGDOM DYNAMIC NEWS PREVIEW
===================================== -->

<meta
    name="description"
    content="${escapeHTML(articleDescription)}"
>

<link
    rel="canonical"
    href="${escapeHTML(articleUrl)}"
>


<!-- OPEN GRAPH -->

<meta
    property="og:type"
    content="article"
>

<meta
    property="og:site_name"
    content="The Royal Kingdom of Agbor"
>

<meta
    property="og:title"
    content="${escapeHTML(articleTitle)}"
>

<meta
    property="og:description"
    content="${escapeHTML(articleDescription)}"
>

<meta
    property="og:url"
    content="${escapeHTML(articleUrl)}"
>

<meta
    property="og:image"
    content="${escapeHTML(articleImage)}"
>

<meta
    property="og:image:secure_url"
    content="${escapeHTML(articleImage)}"
>

<meta
    property="og:image:alt"
    content="${escapeHTML(articleTitle)}"
>


<!-- X / TWITTER -->

<meta
    name="twitter:card"
    content="summary_large_image"
>

<meta
    name="twitter:title"
    content="${escapeHTML(articleTitle)}"
>

<meta
    name="twitter:description"
    content="${escapeHTML(articleDescription)}"
>

<meta
    name="twitter:image"
    content="${escapeHTML(articleImage)}"
>

<meta
    name="twitter:image:alt"
    content="${escapeHTML(articleTitle)}"
>


<!-- NEWS SOCIAL PREVIEW ACTIVE -->

`;


        /* =====================================
           INSERT META TAGS
        ===================================== */

        const updatedHtml =
            html.replace(
                "</head>",
                `${socialMetaTags}</head>`
            );


        console.log(
            "SOCIAL META TAGS INSERTED SUCCESSFULLY"
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


        headers.set(
            "Cache-Control",
            "no-store"
        );


        /* =====================================
           RETURN PAGE
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