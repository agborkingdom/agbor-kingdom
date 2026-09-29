export default async (request, context) => {

    const siteUrl =
        "https://agborkingdom.org";

    /*
     * =========================================
     * STATIC PAGES
     * =========================================
     */

    const staticPages = [

        "/",

        "/history.html",
        "/dein.html",
        "/agbor-monarchs.html",
        "/agbor-council.html",
        "/agbor-communities.html",

        "/royal-council.html",
        "/royal-family.html",
        "/palace-pages.html",
        "/royal-palace.html",

        "/traditions.html",
        "/festivals.html",
        "/language.html",
        "/arts-crafts.html",

        "/economy.html",
        "/political-achievements.html",

        "/events.html",
        "/news-list.html",
        "/publications.html",

        "/videos.html",
        "/gallery.html",
        "/contact.html"

    ];


    /*
     * =========================================
     * SUPABASE
     * =========================================
     */

    const supabaseUrl =
        Netlify.env.get("SUPABASE_URL");

    const supabaseKey =
        Netlify.env.get("SUPABASE_ANON_KEY");


    if (
        !supabaseUrl ||
        !supabaseKey
    ) {

        console.error(
            "Sitemap: Supabase environment variables are missing."
        );

        return new Response(
            "Sitemap configuration error.",
            {
                status: 500,
                headers: {
                    "content-type":
                        "text/plain; charset=UTF-8"
                }
            }
        );

    }


    /*
     * =========================================
     * SUPABASE REQUEST HELPER
     * =========================================
     */

    async function supabaseRequest(
        table,
        select
    ) {

        const url =
            `${supabaseUrl}/rest/v1/${table}` +
            `?select=${encodeURIComponent(select)}`;

        const response =
            await fetch(
                url,
                {
                    headers: {
                        apikey: supabaseKey,
                        Authorization:
                            `Bearer ${supabaseKey}`
                    }
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                `Supabase ${table} error: ${errorText}`
            );

        }


        return response.json();

    }


    /*
     * =========================================
     * XML ESCAPE
     * =========================================
     */

    function escapeXml(value) {

        return String(value || "")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&apos;"
            );

    }


    /*
     * =========================================
     * CREATE SLUG
     * =========================================
     */

    function createSlug(title) {

        if (!title) {
            return "";
        }

        return String(title)
            .trim()
            .toLowerCase()
            .replace(
                /['"]/g,
                ""
            )
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                "");

    }


    try {

        /*
         * =====================================
         * LOAD NEWS
         * =====================================
         *
         * News uses its existing slug.
         */

        const news =
            await supabaseRequest(
                "news",
                "slug"
            );


        /*
         * =====================================
         * LOAD EVENTS
         * =====================================
         */

        const events =
            await supabaseRequest(
                "events",
                "title"
            );


        /*
         * =====================================
         * LOAD PUBLICATIONS
         * =====================================
         */

        const publications =
            await supabaseRequest(
                "publications",
                "title"
            );


        /*
         * =====================================
         * BUILD URL LIST
         * =====================================
         */

        const urls = [];


        /*
         * STATIC URLS
         */

        staticPages.forEach(
            function (page) {

                urls.push(
                    siteUrl + page
                );

            }
        );


        /*
         * NEWS URLS
         */

        (news || []).forEach(
            function (item) {

                if (!item.slug) {
                    return;
                }

                urls.push(
                    siteUrl +
                    "/news/" +
                    encodeURIComponent(
                        item.slug
                    )
                );

            }
        );


        /*
         * EVENT URLS
         */

        (events || []).forEach(
            function (item) {

                const slug =
                    createSlug(
                        item.title
                    );

                if (!slug) {
                    return;
                }

                urls.push(
                    siteUrl +
                    "/events/" +
                    encodeURIComponent(
                        slug
                    )
                );

            }
        );


        /*
         * PUBLICATION URLS
         */

        (publications || []).forEach(
            function (item) {

                const slug =
                    createSlug(
                        item.title
                    );

                if (!slug) {
                    return;
                }

                urls.push(
                    siteUrl +
                    "/publications/" +
                    encodeURIComponent(
                        slug
                    )
                );

            }
        );


        /*
         * =====================================
         * REMOVE DUPLICATES
         * =====================================
         */

        const uniqueUrls =
            [...new Set(urls)];


        /*
         * =====================================
         * CREATE XML
         * =====================================
         */

        const xmlUrls =
            uniqueUrls
                .map(
                    function (url) {

                        return `
    <url>
        <loc>${escapeXml(url)}</loc>
    </url>`;

                    }
                )
                .join("");


        const sitemap =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${xmlUrls}
</urlset>`;


        /*
         * =====================================
         * RETURN SITEMAP
         * =====================================
         */

        return new Response(
            sitemap,
            {
                status: 200,
                headers: {
                    "content-type":
                        "application/xml; charset=UTF-8",

                    "cache-control":
                        "public, max-age=300"
                }
            }
        );


    } catch (error) {

        console.error(
            "Sitemap generation error:",
            error
        );


        return new Response(
            "Unable to generate sitemap.",
            {
                status: 500,
                headers: {
                    "content-type":
                        "text/plain; charset=UTF-8"
                }
            }
        );

    }

};