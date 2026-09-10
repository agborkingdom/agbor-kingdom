/**
 * =========================================================
 * AGBOR KINGDOM
 * NEWS SOCIAL PREVIEW — NETLIFY EDGE FUNCTION
 * =========================================================
 *
 * This function runs BEFORE news.html reaches the browser.
 *
 * It:
 * 1. Reads ?slug= from the requested URL
 * 2. Fetches the published article from Supabase
 * 3. Injects real Open Graph metadata
 * 4. Injects real X/Twitter metadata
 * 5. Leaves the normal page rendering to main.js
 *
 * This is what allows WhatsApp/Facebook/etc. to see the
 * actual article information when they crawl the URL.
 * =========================================================
 */

const SUPABASE_URL =
    "https://flhorvkvkxbodappjspg.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_6VtnjF-OR6pIJZS59we_sQ_uZ3XlWFs";


/* =========================================================
   HTML ESCAPE
   Prevents article data from breaking the HTML.
   ========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   MAKE ABSOLUTE URL
   ========================================================= */

function makeAbsoluteUrl(
    value,
    origin
) {

    if (!value) {
        return "";
    }

    try {

        return new URL(
            value,
            origin
        ).href;

    } catch {

        return value;

    }

}


/* =========================================================
   FETCH NEWS FROM SUPABASE
   ========================================================= */

async function getNewsBySlug(slug) {

    if (!slug) {
        return null;
    }


    const endpoint =
        `${SUPABASE_URL}/rest/v1/news` +
        `?select=id,title,slug,excerpt,image_url,category,author,published_at` +
        `&slug=eq.${encodeURIComponent(slug)}` +
        `&is_published=eq.true` +
        `&limit=1`;


    const response =
        await fetch(
            endpoint,
            {
                method: "GET",

                headers: {
                    "apikey":
                        SUPABASE_ANON_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_ANON_KEY}`,

                    "Content-Type":
                        "application/json"
                }
            }
        );


    if (!response.ok) {

        console.error(
            "Supabase News request failed:",
            response.status,
            response.statusText
        );

        return null;

    }


    const data =
        await response.json();


    if (
        !Array.isArray(data) ||
        !data.length
    ) {

        return null;

    }


    return data[0];

}


/* =========================================================
   NETLIFY EDGE FUNCTION
   ========================================================= */

export default async function (
    request,
    context
) {

    /* -----------------------------------------------------
       Get the original page from Netlify
       ----------------------------------------------------- */

    const response =
        await context.next();


    let html =
        await response.text();


    const requestUrl =
        new URL(request.url);


    const slug =
        requestUrl.searchParams.get(
            "slug"
        );


    /* -----------------------------------------------------
       If there is no slug, return the normal page.
       ----------------------------------------------------- */

    if (!slug) {

        return new Response(
            html,
            {
                status:
                    response.status,

                statusText:
                    response.statusText,

                headers:
                    response.headers
            }
        );

    }


    /* -----------------------------------------------------
       Fetch actual News article
       ----------------------------------------------------- */

    let news = null;


    try {

        news =
            await getNewsBySlug(
                slug
            );

    } catch (error) {

        console.error(
            "News social preview failed:",
            error
        );

    }


    /* -----------------------------------------------------
       If article wasn't found, return normal HTML.
       ----------------------------------------------------- */

    if (!news) {

        return new Response(
            html,
            {
                status:
                    response.status,

                statusText:
                    response.statusText,

                headers:
                    response.headers
            }
        );

    }


    /* =====================================================
       BUILD REAL ARTICLE INFORMATION
       ===================================================== */

    const articleTitle =
        news.title ||
        "Agbor Kingdom News";


    const articleDescription =
        news.excerpt ||
        "Latest news, announcements and stories from the Royal Kingdom of Agbor.";


    const articleUrl =
        `${requestUrl.origin}/news.html?slug=` +
        encodeURIComponent(
            news.slug || slug
        );


    const articleImage =
        makeAbsoluteUrl(
            news.image_url,
            requestUrl.origin
        );


    const articleAuthor =
        news.author ||
        "Agbor Kingdom";


    const articleCategory =
        news.category ||
        "KINGDOM";


    /* =====================================================
       BUILD META TAGS
       ===================================================== */

    const socialMeta = `

<!-- =====================================================
     AGBOR KINGDOM — DYNAMIC NEWS SOCIAL META
     ===================================================== -->

<meta
    name="description"
    id="newsMetaDescription"
    content="${escapeHtml(articleDescription)}"
>

<link
    rel="canonical"
    id="newsCanonical"
    href="${escapeHtml(articleUrl)}"
>


<!-- =====================================================
     OPEN GRAPH
     ===================================================== -->

<meta
    property="og:type"
    content="article"
>

<meta
    property="og:title"
    id="ogTitle"
    content="${escapeHtml(articleTitle)}"
>

<meta
    property="og:description"
    id="ogDescription"
    content="${escapeHtml(articleDescription)}"
>

<meta
    property="og:url"
    id="ogUrl"
    content="${escapeHtml(articleUrl)}"
>

<meta
    property="og:site_name"
    content="The Royal Kingdom of Agbor"
>

<meta
    property="og:image"
    id="ogImage"
    content="${escapeHtml(articleImage)}"
>

<meta
    property="og:image:alt"
    id="ogImageAlt"
    content="${escapeHtml(articleTitle)}"
>

<meta
    property="og:locale"
    content="en_US"
>


<!-- =====================================================
     ARTICLE INFORMATION
     ===================================================== -->

<meta
    property="article:section"
    content="${escapeHtml(articleCategory)}"
>

<meta
    property="article:author"
    content="${escapeHtml(articleAuthor)}"
>

${news.published_at ? `
<meta
    property="article:published_time"
    content="${escapeHtml(news.published_at)}"
>
` : ""}


<!-- =====================================================
     X / TWITTER
     ===================================================== -->

<meta
    name="twitter:card"
    content="summary_large_image"
>

<meta
    name="twitter:title"
    id="twitterTitle"
    content="${escapeHtml(articleTitle)}"
>

<meta
    name="twitter:description"
    id="twitterDescription"
    content="${escapeHtml(articleDescription)}"
>

<meta
    name="twitter:image"
    id="twitterImage"
    content="${escapeHtml(articleImage)}"
>

<meta
    name="twitter:image:alt"
    content="${escapeHtml(articleTitle)}"
>

`;


    /* =====================================================
       REMOVE OLD DYNAMIC META TAGS
       ===================================================== */

    const metaIds = [
        "newsMetaDescription",
        "newsCanonical",
        "ogTitle",
        "ogDescription",
        "ogUrl",
        "ogImage",
        "ogImageAlt",
        "twitterTitle",
        "twitterDescription",
        "twitterImage"
    ];


    for (
        const id of metaIds
    ) {

        const pattern =
            new RegExp(
                `<(?:meta|link)[^>]+id=["']${id}["'][^>]*>`,
                "gi"
            );

        html =
            html.replace(
                pattern,
                ""
            );

    }


    /* =====================================================
       INJECT REAL SOCIAL META BEFORE </head>
       ===================================================== */

    if (
        html.includes("</head>")
    ) {

        html =
            html.replace(
                "</head>",
                `${socialMeta}\n</head>`
            );

    }


    /* =====================================================
       RESPONSE HEADERS
       ===================================================== */

    const headers =
        new Headers(
            response.headers
        );


    headers.set(
        "content-type",
        "text/html; charset=UTF-8"
    );


    headers.set(
        "x-news-edge-function",
        "active"
    );


    /* =====================================================
       RETURN FINAL HTML
       ===================================================== */

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

}


/* =========================================================
   NETLIFY CONFIGURATION
   ========================================================= */

export const config = {

    path: "/news.html"

};