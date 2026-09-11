/* =========================================================
   AGBOR KINGDOM
   NEWS SOCIAL PREVIEW
   NETLIFY EDGE FUNCTION
========================================================= */

function escapeHTML(value = "") {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/* =========================================================
   NORMALIZE IMAGE URL
========================================================= */

function getAbsoluteImageUrl(
    imageUrl,
    siteUrl
) {

    if (!imageUrl) {
        return "";
    }

    try {

        return new URL(
            imageUrl,
            siteUrl
        ).href;

    } catch (error) {

        return imageUrl;

    }

}



/* =========================================================
   ESCAPE REGULAR EXPRESSION
========================================================= */

function escapeRegExp(value) {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}



/* =========================================================
   MAIN EDGE FUNCTION
========================================================= */

export default async function (
    request,
    context
) {

    const requestUrl =
        new URL(request.url);



    /* =====================================================
       ONLY HANDLE NEWS PAGES WITH A SLUG
    ===================================================== */

    const slug =
        requestUrl.searchParams.get("slug");



    if (!slug) {

        return context.next();

    }



    /* =====================================================
       ENVIRONMENT VARIABLES
    ===================================================== */

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



    try {

        /* =================================================
           GET NEWS ARTICLE FROM SUPABASE
        ================================================= */

        const apiUrl =
            `${supabaseUrl}/rest/v1/news` +
            `?select=id,title,slug,excerpt,image_url,is_published` +
            `&slug=eq.${encodeURIComponent(slug)}` +
            `&is_published=eq.true` +
            `&limit=1`;



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
                "Unable to fetch news article:",
                newsResponse.status
            );

            return context.next();

        }



        const articles =
            await newsResponse.json();



        if (
            !articles ||
            !articles.length
        ) {

            return context.next();

        }



        const news =
            articles[0];



        /* =================================================
           ARTICLE DATA
        ================================================= */

        const articleTitle =
            news.title ||
            "Agbor Kingdom News";



        const articleDescription =
            news.excerpt ||
            "Latest news, announcements and stories from the Royal Kingdom of Agbor.";





        /*
         * IMPORTANT:
         * This keeps the exact public URL being shared.
         */

        const articleUrl =
            requestUrl.origin +
            "/news.html?slug=" +
            encodeURIComponent(
                news.slug
            );



        const articleImage =
            getAbsoluteImageUrl(
                news.image_url,
                requestUrl.origin
            );



        /* =================================================
           GET THE ORIGINAL news.html RESPONSE
        ================================================= */

        const response =
            await context.next();



        const contentType =
            response.headers.get(
                "content-type"
            ) || "";



        /*
         * Only modify HTML.
         */

        if (
            !contentType.includes(
                "text/html"
            )
        ) {

            return response;

        }



        let html =
            await response.text();



        /* =================================================
           SOCIAL PREVIEW META TAGS
        ================================================= */

        const socialMeta = `

<!-- NEWS SOCIAL PREVIEW ACTIVE -->

<title>${escapeHTML(articleTitle)} | Agbor Kingdom</title>

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
    content="Agbor Kingdom"
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

<!-- TWITTER / X -->

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

<!-- END NEWS SOCIAL PREVIEW -->

`;



        /* =================================================
           REMOVE EXISTING DYNAMIC SOCIAL TAGS
        ================================================= */

        const metaPatterns = [

            /<title[^>]*>[\s\S]*?<\/title>/gi,

            /<meta[^>]+name=["']description["'][^>]*>/gi,

            /<link[^>]+rel=["']canonical["'][^>]*>/gi,

            /<meta[^>]+property=["']og:[^"']+["'][^>]*>/gi,

            /<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/gi

        ];



        metaPatterns.forEach(
            pattern => {

                html =
                    html.replace(
                        pattern,
                        ""
                    );

            }
        );



        /* =================================================
           INSERT META TAGS INTO <head>
        ================================================= */

        html =
            html.replace(
                /<\/head>/i,
                `${socialMeta}\n</head>`
            );



        /* =================================================
           RETURN THE NEW HTML
        ================================================= */

        const headers =
            new Headers(
                response.headers
            );



        headers.set(
            "content-type",
            "text/html; charset=utf-8"
        );



        headers.set(
            "cache-control",
            "public, max-age=0, must-revalidate"
        );



        return new Response(
            html,
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
            "News social preview error:",
            error
        );



        return context.next();

    }

}



/* =========================================================
   EDGE FUNCTION ROUTE
========================================================= */

export const config = {

    path: "/news.html"

};