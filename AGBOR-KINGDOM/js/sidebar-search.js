/* =========================================================
   AGBOR KINGDOM
   SIDEBAR SITE-WIDE SEARCH
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchForm =
        document.getElementById("kingdomSearchForm");

    const searchInput =
        document.getElementById("kingdomSearchInput");

    const searchResults =
        document.getElementById("searchResults");

    if (!searchForm || !searchInput || !searchResults) {
        console.warn("Sidebar search elements not found.");
        return;
    }


    /* =====================================================
       ORIGINAL HTML PAGES
       ===================================================== */

    const sitePages = [

        {
            title: "History of Agbor",
            description:
                "Discover the history, origins and heritage of Agbor Kingdom.",
            category: "KINGDOM",
            url: "history.html",
            keywords:
                "history agbor kingdom origin heritage past"
        },

        {
            title: "Agbor Kingdom Communities",
            description:
                "Explore the communities that make up Agbor Kingdom.",
            category: "COMMUNITIES",
            url: "agbor-communities.html",
            keywords:
                "communities community towns villages agbor"
        },

        {
            title: "Council of Chiefs",
            description:
                "Learn about the Council of Chiefs and its traditional role in Agbor Kingdom.",
            category: "ROYAL INSTITUTION",
            url: "agbor-council.html",
            keywords:
                "council chiefs traditional chiefs royal institution"
        },

        {
            title: "Agbor Kingdom Monarchs",
            description:
                "Explore the monarchs and royal history of Agbor Kingdom.",
            category: "ROYAL INSTITUTION",
            url: "agbor-monarchs.html",
            keywords:
                "monarchs dein kings rulers royal history"
        },

        {
            title: "Arts and Crafts of Agbor Kingdom",
            description:
                "Discover the artistic traditions, crafts and creative heritage of Agbor Kingdom.",
            category: "ARTS & CRAFTS",
            url: "arts-crafts.html",
            keywords:
                "arts crafts artwork creativity culture traditional art"
        },

        {
            title: "Economy of Agbor Kingdom",
            description:
                "Explore enterprise, economic development, investment and opportunities in Agbor Kingdom.",
            category: "KINGDOM",
            url: "economy.html",
            keywords:
                "economy business enterprise investment development growth"
        },

        {
            title: "Kingdom Events",
            description:
                "Discover upcoming events, ceremonies and activities in Agbor Kingdom.",
            category: "EVENTS",
            url: "events.html",
            keywords:
                "events ceremonies activities calendar kingdom"
        },

        {
            title: "Festivals of Agbor Kingdom",
            description:
                "Discover the festivals and cultural celebrations of Agbor Kingdom.",
            category: "CULTURE",
            url: "festivals.html",
            keywords:
                "festivals festival celebration culture ceremony"
        },

        {
            title: "Agbor Kingdom Gallery",
            description:
                "Explore photographs and visual memories from Agbor Kingdom.",
            category: "MEDIA",
            url: "gallery.html",
            keywords:
                "gallery photographs photos images pictures media"
        },

        {
            title: "Language of Agbor Kingdom",
            description:
                "Explore the language, expressions and linguistic heritage of Agbor Kingdom.",
            category: "CULTURE",
            url: "language.html",
            keywords:
                "language linguistic heritage expressions identity culture"
        },

        {
            title: "Palace Pages",
            description:
                "Explore information and pages relating to the Royal Palace of Agbor Kingdom.",
            category: "PALACE",
            url: "palace-pages.html",
            keywords:
                "palace royal palace dein palace institution"
        },

        {
            title: "Royal Palace of Agbor Kingdom",
            description:
                "Learn about the Royal Palace and its significance to Agbor Kingdom.",
            category: "PALACE",
            url: "royal-palace.html",
            keywords:
                "royal palace palace dein royal institution"
        },

        {
            title: "Royal Council",
            description:
                "Learn about the Royal Council and its role within the Kingdom.",
            category: "ROYAL INSTITUTION",
            url: "royal-council.html",
            keywords:
                "royal council council institution palace"
        },

        {
            title: "Royal Family of Agbor Kingdom",
            description:
                "Learn about the Royal Family and its place within Agbor Kingdom.",
            category: "ROYAL FAMILY",
            url: "royal-family.html",
            keywords:
                "royal family prince princess family palace royal"
        },

        {
            title: "Traditions of Agbor Kingdom",
            description:
                "Discover the traditions, customs and practices of Agbor Kingdom.",
            category: "CULTURE",
            url: "traditions.html",
            keywords:
                "traditions tradition customs culture heritage practices"
        },

        {
            title: "Political Achievements",
            description:
                "Explore the political achievements and contributions of illustrious sons and daughters of Agbor Kingdom.",
            category: "KINGDOM",
            url: "political-achievements.html",
            keywords:
                "political achievements leaders sons daughters achievements"
        },

        {
            title: "News",
            description:
                "Read the latest news and updates from Agbor Kingdom.",
            category: "NEWS",
            url: "news-list.html",
            keywords:
                "news updates announcements latest kingdom"
        },

        {
            title: "Publications",
            description:
                "Explore official publications from Agbor Kingdom.",
            category: "PUBLICATIONS",
            url: "publications.html",
            keywords:
                "publications books documents reports"
        },

        {
            title: "Videos",
            description:
                "Watch videos and visual stories from Agbor Kingdom.",
            category: "MEDIA",
            url: "videos.html",
            keywords:
                "videos video media watch"
        }

    ];


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       NORMALIZE SEARCH
       ===================================================== */

    function normalize(value) {

        return String(value || "")
            .toLowerCase()
            .trim();

    }


    /* =====================================================
       SEARCH HTML PAGES
       ===================================================== */

    function searchSitePages(term) {

        const query =
            normalize(term);

        if (!query) {
            return [];
        }

        return sitePages.filter(page => {

            const searchableText = normalize(
                [
                    page.title,
                    page.description,
                    page.category,
                    page.keywords
                ].join(" ")
            );

            return searchableText.includes(query);

        });

    }


    /* =====================================================
       SEARCH SUPABASE CONTENT
       ===================================================== */

    async function searchSupabase(term) {

        if (
            typeof kingdomSupabase === "undefined"
        ) {
            console.warn(
                "kingdomSupabase is not available."
            );

            return [];
        }

        const query =
            normalize(term);

        if (!query) {
            return [];
        }


        const results = [];


        /* =================================================
           NEWS
           ================================================= */

        try {

            const {
                data,
                error
            } = await kingdomSupabase
                .from("news")
                .select(`
                    id,
                    title,
                    slug,
                    excerpt,
                    category
                `)
                .eq("is_published", true)
                .or(
                    `title.ilike.%${query}%,excerpt.ilike.%${query}%,category.ilike.%${query}%`
                )
                .limit(8);

            if (!error && data) {

                data.forEach(item => {

                    results.push({

                        title:
                            item.title,

                        description:
                            item.excerpt ||
                            "Read the latest news from Agbor Kingdom.",

                        category:
                            item.category ||
                            "NEWS",

                        url:
                            item.slug
                                ? `news.html?slug=${encodeURIComponent(item.slug)}`
                                : `news.html?id=${encodeURIComponent(item.id)}`

                    });

                });

            }

        } catch (error) {

            console.warn(
                "News search failed:",
                error
            );

        }


        /* =================================================
           EVENTS
           ================================================= */

        try {

            const {
                data,
                error
            } = await kingdomSupabase
                .from("events")
                .select(`
                    id,
                    title,
                    description
                `)
                .eq("is_active", true)
                .or(
                    `title.ilike.%${query}%,description.ilike.%${query}%`
                )
                .limit(6);

            if (!error && data) {

                data.forEach(item => {

                    results.push({

                        title:
                            item.title,

                        description:
                            item.description ||
                            "Kingdom event or ceremony.",

                        category:
                            "EVENTS",

                        url:
                            `event-details.html?id=${encodeURIComponent(item.id)}`

                    });

                });

            }

        } catch (error) {

            console.warn(
                "Events search failed:",
                error
            );

        }


        /* =================================================
           PUBLICATIONS
           ================================================= */

        try {

            const {
                data,
                error
            } = await kingdomSupabase
                .from("publications")
                .select(`
                    id,
                    title,
                    description,
                    category
                `)
                .eq("is_active", true)
                .or(
                    `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
                )
                .limit(6);

            if (!error && data) {

                data.forEach(item => {

                    results.push({

                        title:
                            item.title,

                        description:
                            item.description ||
                            "Official publication of Agbor Kingdom.",

                        category:
                            item.category ||
                            "PUBLICATIONS",

                        url:
                            `publication-details.html?id=${encodeURIComponent(item.id)}`

                    });

                });

            }

        } catch (error) {

            console.warn(
                "Publications search failed:",
                error
            );

        }


        /* =================================================
           VIDEOS
           ================================================= */

        try {

            const {
                data,
                error
            } = await kingdomSupabase
                .from("videos")
                .select(`
                    id,
                    title,
                    description,
                    category
                `)
                .eq("is_published", true)
                .or(
                    `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
                )
                .limit(6);

            if (!error && data) {

                data.forEach(item => {

                    results.push({

                        title:
                            item.title,

                        description:
                            item.description ||
                            "Video from Agbor Kingdom.",

                        category:
                            item.category ||
                            "VIDEOS",

                        url:
                            `videos.html?id=${encodeURIComponent(item.id)}`

                    });

                });

            }

        } catch (error) {

            console.warn(
                "Videos search failed:",
                error
            );

        }


        /* =================================================
           ILLUSTRIOUS SONS & DAUGHTERS
           ================================================= */

        try {

            const {
                data,
                error
            } = await kingdomSupabase
                .from("illustrious_sons_daughters")
                .select(`
                    id,
                    name,
                    title,
                    category,
                    community,
                    description
                `)
                .eq("is_active", true)
                .or(
                    `name.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,community.ilike.%${query}%`
                )
                .limit(6);

            if (!error && data) {

                data.forEach(item => {

                    results.push({

                        title:
                            item.name,

                        description:
                            item.description ||
                            item.title ||
                            "An illustrious son or daughter of Agbor Kingdom.",

                        category:
                            item.category ||
                            "ILLUSTRIOUS SONS & DAUGHTERS",

                        url:
                            "political-achievements.html"

                    });

                });

            }

        } catch (error) {

            console.warn(
                "Illustrious people search failed:",
                error
            );

        }


        return results;

    }


    /* =====================================================
       REMOVE DUPLICATES
       ===================================================== */

    function removeDuplicates(results) {

        const seen =
            new Set();

        return results.filter(item => {

            const key =
                `${item.title}|${item.url}`;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;

        });

    }


    /* =====================================================
       RENDER RESULTS
       ===================================================== */

    function renderResults(results, term) {

        if (!term) {

            searchResults.innerHTML = "";

            searchResults.classList.remove(
                "has-results"
            );

            return;

        }


        if (!results.length) {

            searchResults.innerHTML = `

                <div class="sidebar-search-empty">

                    <div class="sidebar-search-empty-icon">
                        🔎
                    </div>

                    <h4>
                        No results found
                    </h4>

                    <p>
                        We couldn't find anything matching
                        "${escapeHTML(term)}".
                    </p>

                </div>

            `;

            searchResults.classList.add(
                "has-results"
            );

            return;

        }


        searchResults.innerHTML = results
            .map(result => `

                <a
                    href="${escapeHTML(result.url)}"
                    class="sidebar-search-result"
                >

                    <span class="sidebar-search-result-category">
                        ${escapeHTML(result.category)}
                    </span>

                    <span class="sidebar-search-result-title">
                        ${escapeHTML(result.title)}
                    </span>

                    <span class="sidebar-search-result-description">
                        ${escapeHTML(result.description)}
                    </span>

                </a>

            `)
            .join("");


        searchResults.classList.add(
            "has-results"
        );

    }


    /* =====================================================
       PERFORM SEARCH
       ===================================================== */

    let searchTimer = null;

    async function performSearch() {

        const term =
            searchInput.value.trim();


        /* Clear */
        if (!term) {

            renderResults([], "");

            return;

        }


        searchResults.innerHTML = `

            <div class="sidebar-search-loading">
                Searching Agbor Kingdom...
            </div>

        `;

        searchResults.classList.add(
            "has-results"
        );


        /* Search real HTML pages immediately */
        const pageResults =
            searchSitePages(term);


        /* Search Supabase */
        const databaseResults =
            await searchSupabase(term);


        /* Combine */
        const allResults =
            removeDuplicates([
                ...pageResults,
                ...databaseResults
            ]);


        renderResults(
            allResults,
            term
        );

    }


    /* =====================================================
       SEARCH WHILE TYPING
       ===================================================== */

    searchInput.addEventListener(
        "input",
        () => {

            clearTimeout(
                searchTimer
            );


            const value =
                searchInput.value.trim();


            if (!value) {

                renderResults([], "");

                return;

            }


            searchTimer =
                setTimeout(
                    performSearch,
                    350
                );

        }
    );


    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    searchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            clearTimeout(
                searchTimer
            );

            performSearch();

        }
    );


    /* =====================================================
       CLICK OUTSIDE
       ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                !searchForm.contains(event.target) &&
                !searchResults.contains(event.target)
            ) {

                searchResults.classList.remove(
                    "has-results"
                );

            }

        }
    );


    /* =====================================================
       FOCUS SEARCH AGAIN
       ===================================================== */

    searchInput.addEventListener(
        "focus",
        () => {

            if (
                searchInput.value.trim() &&
                searchResults.innerHTML.trim()
            ) {

                searchResults.classList.add(
                    "has-results"
                );

            }

        }
    );

});