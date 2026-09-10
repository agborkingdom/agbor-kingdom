/* =========================================
   AGBOR KINGDOM - MAIN JAVASCRIPT
========================================= */

/* =========================================
   MOBILE MENU
========================================= */

const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const mobileSideMenu = document.getElementById("mobileSideMenu");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

function openMobileMenu() {
    if (mobileSideMenu) mobileSideMenu.classList.add("open");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
    if (mobileSideMenu) mobileSideMenu.classList.remove("open");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("open");
    document.body.style.overflow = "";
}

if (mobileMenuButton) mobileMenuButton.addEventListener("click", openMobileMenu);
if (mobileMenuClose) mobileMenuClose.addEventListener("click", closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener("click", closeMobileMenu);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileMenu();
        closeSearchResults();
    }
});


/* =========================================
   KINGDOM ANNOUNCEMENT MARQUEE
========================================= */

const marqueeTrack = document.getElementById("marqueeTrack");
const marqueeToggle = document.getElementById("marqueeToggle");
let marqueePaused = false;

if (marqueeToggle && marqueeTrack) {
    marqueeToggle.addEventListener("click", () => {
        marqueePaused = !marqueePaused;

        if (marqueePaused) {
            marqueeTrack.style.animationPlayState = "paused";
            marqueeToggle.textContent = "▶";
            marqueeToggle.setAttribute("aria-label", "Play announcements");
            marqueeToggle.setAttribute("aria-pressed", "true");
        } else {
            marqueeTrack.style.animationPlayState = "running";
            marqueeToggle.textContent = "❚❚";
            marqueeToggle.setAttribute("aria-label", "Pause announcements");
            marqueeToggle.setAttribute("aria-pressed", "false");
        }
    });
}

const kingdomMarquee = document.querySelector(".kingdom-marquee");
if (kingdomMarquee && marqueeTrack) {
    kingdomMarquee.addEventListener("mouseenter", () => {
        if (!marqueePaused) marqueeTrack.style.animationPlayState = "paused";
    });

    kingdomMarquee.addEventListener("mouseleave", () => {
        if (!marqueePaused) marqueeTrack.style.animationPlayState = "running";
    });
}


/* =========================================
   HERO SLIDER LOGIC
========================================= */

let currentHeroSlide = 0;
let heroAutoPlay;

function getHeroElements() {
    return {
        slides: document.querySelectorAll(".hero-slide"),
        dots: document.querySelectorAll(".hero-dot"),
        prevBtn: document.getElementById("heroPrev"),
        nextBtn: document.getElementById("heroNext"),
        sliderContainer: document.getElementById("heroSlider")
    };
}

function showHeroSlide(index) {
    const { slides, dots } = getHeroElements();
    if (!slides.length) return;

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    currentHeroSlide = index;

    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentHeroSlide);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentHeroSlide);
    });
}

function nextHeroSlide() {
    showHeroSlide(currentHeroSlide + 1);
}

function previousHeroSlide() {
    showHeroSlide(currentHeroSlide - 1);
}

function startHeroAutoPlay() {
    stopHeroAutoPlay();
    heroAutoPlay = setInterval(() => {
        nextHeroSlide();
    }, 6000);
}

function stopHeroAutoPlay() {
    if (heroAutoPlay) clearInterval(heroAutoPlay);
}

function restartHeroAutoPlay() {
    stopHeroAutoPlay();
    startHeroAutoPlay();
}

function initHeroSlider() {
    const { prevBtn, nextBtn, dots, sliderContainer } = getHeroElements();

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextHeroSlide();
            restartHeroAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            previousHeroSlide();
            restartHeroAutoPlay();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            const slideIndex = Number(e.currentTarget.dataset.slide);
            showHeroSlide(slideIndex);
            restartHeroAutoPlay();
        });
    });

    if (sliderContainer) {
        sliderContainer.addEventListener("mouseenter", stopHeroAutoPlay);
        sliderContainer.addEventListener("mouseleave", startHeroAutoPlay);
    }

    showHeroSlide(0);
    startHeroAutoPlay();
}


/* =========================================
   LOAD ANNOUNCEMENTS (SUPABASE)
========================================= */

async function loadAnnouncements() {
    const marqueeTrack = document.getElementById("marqueeTrack");
    if (!marqueeTrack) return;

    const { data, error } = await kingdomSupabase
        .from("announcements")
        .select(`id, title, message, link`)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error loading announcements:", error);
        return;
    }

    if (!data || data.length === 0) {
        marqueeTrack.innerHTML = "";
        return;
    }

    const announcementHTML = data
        .map((announcement) => {
            const title = announcement.title || "";
            const message = announcement.message || "";
            const link = announcement.link || "#";

            return `
                <a href="${link}" class="marquee-item">
                    <span class="marquee-dot"></span>
                    <span>${title}: ${message}</span>
                </a>
            `;
        })
        .join("");

    marqueeTrack.innerHTML = announcementHTML + announcementHTML;
}

loadAnnouncements();


/* =========================================
   LOAD HERO SLIDES (SUPABASE)
========================================= */

async function loadHeroSlides() {
    const heroSlidesContainer = document.getElementById("heroSlides");
    const heroDotsContainer = document.getElementById("heroDots");

    if (!heroSlidesContainer || !heroDotsContainer) {
        console.warn("Hero slider containers not found.");
        return;
    }

    const { data, error } = await kingdomSupabase
        .from("hero_slides")
        .select(`id, title, subtitle, image_url, button_text, button_link`)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error loading hero slides:", error);
        return;
    }

    if (!data || data.length === 0) {
        console.warn("No active hero slides found.");
        return;
    }

    heroSlidesContainer.innerHTML = data
        .map((slide, index) => `
            <article class="hero-slide ${index === 0 ? "active" : ""}">
                <img src="${slide.image_url}" alt="${slide.title || "Agbor Kingdom"}">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <span class="hero-label">AGBOR KINGDOM</span>
                    ${slide.title ? `<h2>${slide.title}</h2>` : ""}
                    ${slide.subtitle ? `<p>${slide.subtitle}</p>` : ""}
                    ${slide.button_text ? `<a href="${slide.button_link || "#"}" class="hero-button">${slide.button_text}</a>` : ""}
                </div>
            </article>
        `)
        .join("");

    heroDotsContainer.innerHTML = data
        .map((_, index) => `
            <button
                class="hero-dot ${index === 0 ? "active" : ""}"
                data-slide="${index}"
                aria-label="Go to slide ${index + 1}"
                type="button"
            ></button>
        `)
        .join("");

    initHeroSlider();
}

if (
    document.getElementById("heroSlides") &&
    document.getElementById("heroDots")
) {
    loadHeroSlides();
}


/* =========================================
   KINGDOM SEARCH ENGINE
========================================= */

const searchForm = document.getElementById("kingdomSearchForm");
const searchInput = document.getElementById("kingdomSearchInput");
const searchResults = document.getElementById("searchResults");

function closeSearchResults() {
    if (searchResults) {
        searchResults.innerHTML = "";
        searchResults.classList.remove("show");
    }
}

/* Close search on outside click */
document.addEventListener("click", (e) => {
    if (
        searchResults &&
        !searchResults.contains(e.target) &&
        searchInput &&
        !searchInput.contains(e.target)
    ) {
        closeSearchResults();
    }
});

if (searchForm) {
    searchForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const term = searchInput.value.trim();

        if (!term) {
            closeSearchResults();
            return;
        }

        await searchKingdom(term);
    });
}

if (searchInput) {
    let searchTimer;

    searchInput.addEventListener("input", function () {
        clearTimeout(searchTimer);
        const term = searchInput.value.trim();

        if (!term) {
            closeSearchResults();
            return;
        }

        searchResults.innerHTML = `
            <div class="search-message">Searching Agbor Kingdom...</div>
        `;
        searchResults.classList.add("show");

        searchTimer = setTimeout(() => {
            searchKingdom(term);
        }, 300);
    });
}

async function searchKingdom(term) {

    if (!searchResults) return;

    searchResults.innerHTML = `
        <div class="search-message">
            Searching Agbor Kingdom...
        </div>
    `;

    searchResults.classList.add("show");


    try {

        const searchPattern = `%${term}%`;


        /*
        =========================================
        SEARCH NEWS
        =========================================
        */

        const newsPromise =
            kingdomSupabase
                .from("news")
                .select("*")
                .eq("is_published", true)
                .or(
                    `title.ilike.${searchPattern},` +
                    `excerpt.ilike.${searchPattern},` +
                    `content.ilike.${searchPattern},` +
                    `category.ilike.${searchPattern}`
                )
                .order("published_at", {
                    ascending: false
                })
                .limit(8);


        /*
        =========================================
        SEARCH ANNOUNCEMENTS
        =========================================
        */

        const announcementsPromise =
            kingdomSupabase
                .from("announcements")
                .select("*")
                .eq("is_active", true)
                .or(
                    `title.ilike.${searchPattern},` +
                    `message.ilike.${searchPattern}`
                )
                .order("created_at", {
                    ascending: false
                })
                .limit(8);


        /*
        =========================================
        SEARCH HERO SLIDES
        =========================================
        */

        const heroPromise =
            kingdomSupabase
                .from("hero_slides")
                .select("*")
                .eq("is_active", true)
                .or(
                    `title.ilike.${searchPattern},` +
                    `subtitle.ilike.${searchPattern}`
                )
                .order("sort_order", {
                    ascending: true
                })
                .limit(8);


        /*
        =========================================
        RUN ALL SEARCHES
        =========================================
        */
       const eventsPromise =
    kingdomSupabase
        .from("events")
        .select("*")
        .or(
            `title.ilike.${searchPattern},` +
            `description.ilike.${searchPattern},` +
            `location.ilike.${searchPattern}`
        )
        .order("event_date", {
            ascending: true
        })
        .limit(8);


const [
    newsRes,
    announcementsRes,
    heroRes,
    eventsRes
] = await Promise.all([
    newsPromise,
    announcementsPromise,
    heroPromise,
    eventsPromise
]);


        /*
        =========================================
        CHECK ERRORS
        =========================================
        */

        if (newsRes.error) {
            throw newsRes.error;
        }

        if (announcementsRes.error) {
            throw announcementsRes.error;
        }

        if (heroRes.error) {
            throw heroRes.error;
        }

        if (eventsRes.error) {
    throw eventsRes.error;
}


        console.log(
            "NEWS SEARCH RESULTS:",
            newsRes.data
        );

        console.log(
            "ANNOUNCEMENT SEARCH RESULTS:",
            announcementsRes.data
        );

        console.log(
            "HERO SEARCH RESULTS:",
            heroRes.data
        );


        /*
        =========================================
        COMBINE RESULTS
        =========================================
        */

        const results = [];


        /*
        NEWS
        */

        (newsRes.data || []).forEach((item) => {

            results.push({

                type:
                    item.category ||
                    "NEWS",

                title:
                    item.title ||
                    "Agbor Kingdom News",

                image:
                    item.image_url ||
                    null,

                url:
                    item.slug
                        ? `news.html?slug=${encodeURIComponent(item.slug)}`
                        : `news.html?id=${encodeURIComponent(item.id)}`

            });

        });


        /*
        ANNOUNCEMENTS
        */

        (announcementsRes.data || []).forEach((item) => {

            results.push({

                type:
                    "PALACE UPDATE",

                title:
                    item.title ||
                    "Kingdom Announcement",

                image:
                    null,

                url:
                    item.link ||
                    "#"

            });

        });


        /*
        HERO SLIDES
        */

        (heroRes.data || []).forEach((item) => {

            results.push({

                type:
                    "KINGDOM",

                title:
                    item.title ||
                    "Agbor Kingdom",

                image:
                    item.image_url ||
                    null,

                url:
                    item.button_link ||
                    "#"

            });

        });


        /*
=========================================
EVENTS
=========================================
*/
     
(eventsRes.data || []).forEach((item) => {

    results.push({

        type: "EVENTS",

        title:
            item.title ||
            "Agbor Kingdom Event",

        image:
            item.image_url ||
            null,

        url:
            item.slug
                ? `events.html?slug=${encodeURIComponent(item.slug)}`
                : `events.html?id=${encodeURIComponent(item.id)}`

    });

});


        /*
        =========================================
        RENDER RESULTS
        =========================================
        */

        renderSearchResults(results);


    } catch (error) {

        console.error(
            "Kingdom search failed:",
            error
        );


        searchResults.innerHTML = `
            <div class="search-message">
                Search could not be completed.
            </div>
        `;

        searchResults.classList.add("show");

    }

}


function renderSearchResults(results) {

    if (!searchResults) return;


    if (!results.length) {

        searchResults.innerHTML = `
            <div class="search-message">
                No results found for
                "<strong>${escapeSearchText(
                    searchInput.value
                )}</strong>"
            </div>
        `;

        searchResults.classList.add("show");

        return;
    }


    searchResults.innerHTML =
        results
            .slice(0, 10)
            .map((item) => {

                const title =
                    escapeSearchText(
                        item.title ||
                        "Agbor Kingdom"
                    );


                const type =
                    escapeSearchText(
                        item.type ||
                        "KINGDOM"
                    );


                const image =
                    item.image
                        ? `
                            <div class="search-result-image">

                                <img
                                    src="${escapeSearchText(
                                        item.image
                                    )}"
                                    alt=""
                                    loading="lazy"
                                >

                            </div>
                        `
                        : "";


                /*
                Only create a real link when
                we actually have a destination.
                */

                if (
                    !item.url ||
                    item.url === "#"
                ) {

                    return `
                        <div
                            class="search-result-item
                                   search-result-disabled"
                        >

                            ${image}

                            <div
                                class="search-result-content"
                            >

                                <span
                                    class="search-result-type"
                                >
                                    ${type}
                                </span>

                                <h4
                                    class="search-result-title"
                                >
                                    ${title}
                                </h4>

                            </div>

                        </div>
                    `;

                }


                return `
                    <a
                        href="${escapeSearchText(item.url)}"
                        class="search-result-item"
                    >

                        ${image}

                        <div
                            class="search-result-content"
                        >

                            <span
                                class="search-result-type"
                            >
                                ${type}
                            </span>

                            <h4
                                class="search-result-title"
                            >
                                ${title}
                            </h4>

                        </div>

                    </a>
                `;

            })
            .join("");


    searchResults.classList.add("show");

}

function escapeSearchText(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================
   HERO SIDEBAR TABS & POSTS
========================================= */

const widgetTabs = document.querySelectorAll(".tab-btn");
const widgetPosts = document.getElementById("widgetPosts");


/* =========================================
   LOAD SIDEBAR POSTS
========================================= */

async function loadSidebarPosts(tab = "latest") {

    if (!widgetPosts) return;

    widgetPosts.innerHTML = `
        <div class="widget-loading">
            Loading kingdom updates...
        </div>
    `;


    try {

        let query = kingdomSupabase
            .from("news")
            .select("*")
            .eq("is_published", true);


        /* -----------------------------------------
           LATEST
        ----------------------------------------- */

        if (tab === "latest") {

            query = query
                .order("published_at", {
                    ascending: false
                })
                .limit(5);

        }


        /* -----------------------------------------
           POPULAR
        ----------------------------------------- */

        else if (tab === "popular") {

            query = query
                .order("views", {
                    ascending: false
                })
                .limit(5);

        }


        /* -----------------------------------------
           TRENDING
        ----------------------------------------- */
       
        else if (tab === "trending") {

    const sevenDaysAgo =
        new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString();


    query = query
        .gte("published_at", sevenDaysAgo)
        .order("views", {
            ascending: false
        })
        .limit(5);

}

        const { data, error } = await query;


        if (error) {
            throw error;
        }


        console.log(
            `${tab.toUpperCase()} SIDEBAR:`,
            data
        );


        renderSidebarPosts(data || [], tab);


    } catch (error) {

        console.error(
            `Failed to load ${tab} sidebar posts:`,
            error
        );


        widgetPosts.innerHTML = `
            <div class="widget-message">
                Unable to load kingdom updates.
            </div>
        `;

    }

}


/* =========================================
   RENDER SIDEBAR POSTS
========================================= */

function renderSidebarPosts(posts, tab = "latest") {

    if (!posts.length) {

        widgetPosts.innerHTML = `
            <div class="widget-message">
                No kingdom updates available.
            </div>
        `;

        return;
    }


    widgetPosts.innerHTML = posts
        .slice(0, 5)
        .map((item, index) => {

            const title =
                item.title ||
                "Agbor Kingdom Update";


            const image =
                item.image_url ||
                item.image ||
                "";


            const category =
                item.category ||
                "KINGDOM";


            const link =
                item.slug
                    ? `news.html?slug=${encodeURIComponent(item.slug)}`
                    : "#";


            return `

                <a
                    href="${link}"
                    class="post-item"
                >

                    <div class="post-number">
                        ${String(index + 1).padStart(2, "0")}
                    </div>


                    ${
                        image
                            ? `
                                <div class="post-image">

                                    <img
                                        src="${escapeSearchText(image)}"
                                        alt=""
                                        loading="lazy"
                                    >

                                </div>
                            `
                            : ""
                    }


                    <div class="post-info">

                        <span class="post-badge">
                            ${escapeSearchText(category)}
                        </span>


                        <h4>
                            ${escapeSearchText(title)}
                        </h4>

                    </div>

                </a>

            `;

        })
        .join("");

}


/* =========================================
   TAB SWITCHING
========================================= */

widgetTabs.forEach((tab) => {

    tab.addEventListener("click", () => {

        widgetTabs.forEach((button) => {
            button.classList.remove("active");
        });


        tab.classList.add("active");


        const selectedTab =
            tab.dataset.tab ||
            tab.textContent
                .trim()
                .toLowerCase();


        loadSidebarPosts(selectedTab);

    });

});


/* =========================================
   INITIAL SIDEBAR LOAD
========================================= */

loadSidebarPosts("latest");




/* =========================================
   LATEST NEWS
========================================= */

const latestNewsGrid =
    document.getElementById("latestNewsGrid");


async function loadLatestNews() {

    if (!latestNewsGrid) {
        return;
    }


    latestNewsGrid.innerHTML = `
        <div class="news-loading">
            Loading latest news...
        </div>
    `;


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
                image_url,
                category,
                author,
                published_at,
                is_featured
            `)

            .eq("is_published", true)

            .order("published_at", {
                ascending: false
            })

            .limit(3);


        if (error) {
            throw error;
        }


        renderLatestNews(data || []);

    }


    catch (error) {

        console.error(
            "Error loading latest news:",
            error
        );


        latestNewsGrid.innerHTML = `
            <div class="news-loading">
                Unable to load latest news.
            </div>
        `;

    }

}
loadLatestNews();

/* =========================================
   RENDER LATEST NEWS
========================================= */

function renderLatestNews(newsItems) {

    if (!newsItems.length) {

        latestNewsGrid.innerHTML = `
            <div class="news-loading">
                No news has been published yet.
            </div>
        `;

        return;
    }


    latestNewsGrid.innerHTML = newsItems
        .map(news => {

            const date = news.published_at
                ? new Date(news.published_at)
                    .toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        }
                    )
                : "";


            const image = news.image_url
                || "images/news/news-default.jpg";


            return `

                <article class="news-card">

                    <a
                        href="news.html?slug=${encodeURIComponent(news.slug)}"
                        class="news-image"
                    >

                        <img
                            src="${escapeSearchText(image)}"
                            alt="${escapeSearchText(news.title)}"
                            loading="lazy"
                                 onerror="
                                this.onerror=null;
                                this.src='images/news/news-default.jpg';
                            "
                        >

                        <span class="news-category">
                            ${escapeSearchText(
                                news.category || "KINGDOM"
                            )}
                        </span>

                    </a>


                    <div class="news-card-content">

                        <time
                            datetime="${news.published_at || ""}"
                        >
                            ${date}
                        </time>


                        <h3>
                            ${escapeSearchText(news.title)}
                        </h3>


                        <p>
                            ${escapeSearchText(
                                news.excerpt || ""
                            )}
                        </p>


                        <a
                            href="news.html?slug=${encodeURIComponent(news.slug)}"
                            class="news-read-more"
                        >
                            Read More
                            <span>→</span>
                        </a>

                    </div>

                </article>

            `;

        })
        .join("");

}

/* =========================================
   SINGLE NEWS ARTICLE
========================================= */

async function loadSingleNews() {

    const singleNewsPage =
        document.getElementById("singleNewsPage");

    if (!singleNewsPage) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const slug = params.get("slug");


    if (!slug) {

        showSingleNewsError();

        return;
    }


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
                content,
                image_url,
                category,
                author,
                published_at
            `)

            .eq("slug", slug)

            .eq("is_published", true)

            .maybeSingle();


        if (error) {
            throw error;
        }


        if (!data) {

            showSingleNewsError();

            return;
        }


        renderSingleNews(data);

    }


    catch (error) {

        console.error(
            "Error loading news article:",
            error
        );


        showSingleNewsError();

    }

}

/* =========================================
   AGBOR KINGDOM
   NEWS SOCIAL SHARING
========================================= */


/* =========================================
   INCREMENT NEWS SHARE
========================================= */

async function incrementNewsShare(
    newsId,
    platform
) {

    if (!newsId) {

        return null;

    }


    try {

        const {

            data,

            error

        } = await kingdomSupabase.rpc(

            "increment_share_count",

            {

                p_content_type: "news",

                p_content_id: newsId,

                p_platform: platform

            }

        );


        if (error) {

            throw error;

        }


        return data;


    } catch (error) {

        console.error(

            "Unable to increment news share count:",

            error

        );

        return null;

    }

}


/* =========================================
   LOAD TOTAL NEWS SHARES
========================================= */

async function loadNewsShareCount(
    newsId
) {

    const totalElement =

        document.getElementById(
            "newsShareTotal"
        );


    if (!totalElement || !newsId) {

        return;

    }


    try {

        const {

            data,

            error

        } = await kingdomSupabase

            .from("share_counts")

            .select("share_count")

            .eq(
                "content_type",
                "news"
            )

            .eq(
                "content_id",
                newsId
            );


        if (error) {

            throw error;

        }


        const totalShares =

            (data || []).reduce(

                (
                    total,
                    item
                ) => {

                    return (

                        total +

                        Number(
                            item.share_count || 0
                        )

                    );

                },

                0

            );


        totalElement.textContent =

            totalShares;


    } catch (error) {

        console.error(

            "Unable to load news share count:",

            error

        );

    }

}


/* =========================================
   SETUP NEWS SHARING
========================================= */

function setupNewsSharing(news) {


    const whatsappButton =

        document.getElementById(
            "shareWhatsApp"
        );


    const facebookButton =

        document.getElementById(
            "shareFacebook"
        );


    const twitterButton =

        document.getElementById(
            "shareTwitter"
        );


    const copyButton =

        document.getElementById(
            "shareCopyLink"
        );


    /* =====================================
       ARTICLE INFORMATION
    ===================================== */

    const articleTitle =

        news.title ||
        "News from Agbor Kingdom";


    const articleUrl =

        `${window.location.origin}/news.html?slug=` +

        encodeURIComponent(
            news.slug
        );


    /* =====================================
       WHATSAPP
    ===================================== */

    if (whatsappButton) {

        whatsappButton.onclick = async function () {


            incrementNewsShare(

                news.id,

                "whatsapp"

            );


            loadNewsShareCount(

                news.id

            );


            const text =

                `${articleTitle}\n\n${articleUrl}`;


            const shareUrl =

                "https://wa.me/?text=" +

                encodeURIComponent(
                    text
                );


            window.open(

                shareUrl,

                "_blank"

            );

        };

    }


    /* =====================================
       FACEBOOK
    ===================================== */

    if (facebookButton) {

        facebookButton.onclick = async function () {


            incrementNewsShare(

                news.id,

                "facebook"

            );


            loadNewsShareCount(

                news.id

            );


            const shareUrl =

                "https://www.facebook.com/sharer/sharer.php?u=" +

                encodeURIComponent(
                    articleUrl
                );


            window.open(

                shareUrl,

                "_blank",

                "width=650,height=500"

            );

        };

    }


    /* =====================================
       X / TWITTER
    ===================================== */

    if (twitterButton) {

        twitterButton.onclick = async function () {


            incrementNewsShare(

                news.id,

                "twitter"

            );


            loadNewsShareCount(

                news.id

            );


            const shareUrl =

                "https://twitter.com/intent/tweet?text=" +

                encodeURIComponent(
                    articleTitle
                ) +

                "&url=" +

                encodeURIComponent(
                    articleUrl
                );


            window.open(

                shareUrl,

                "_blank",

                "width=650,height=500"

            );

        };

    }


    /* =====================================
       COPY LINK
    ===================================== */

    if (copyButton) {

        copyButton.onclick = async function () {


            try {

                await navigator.clipboard.writeText(

                    articleUrl

                );


                await incrementNewsShare(

                    news.id,

                    "copy"

                );


                await loadNewsShareCount(

                    news.id

                );


                const copyText =

                    document.getElementById(
                        "shareCopyText"
                    );


                if (copyText) {


                    const originalText =

                        copyText.textContent;


                    copyText.textContent =

                        "Copied!";


                    setTimeout(

                        function () {

                            copyText.textContent =

                                originalText;

                        },

                        2000

                    );

                }


            } catch (error) {


                console.error(

                    "Unable to copy news link:",

                    error

                );

            }

        };

    }


    /* =====================================
       LOAD INITIAL COUNT
    ===================================== */

    loadNewsShareCount(
        news.id
    );

}


/* =========================================
   RENDER SINGLE NEWS
========================================= */

function renderSingleNews(news) {

    const loading =
        document.getElementById(
            "singleNewsLoading"
        );

    const content =
        document.getElementById(
            "singleNewsContent"
        );


    const title =
        document.getElementById(
            "singleNewsTitle"
        );

    const category =
        document.getElementById(
            "singleNewsCategory"
        );

    const date =
        document.getElementById(
            "singleNewsDate"
        );

    const author =
        document.getElementById(
            "singleNewsAuthor"
        );

    const image =
        document.getElementById(
            "singleNewsImage"
        );

    const body =
        document.getElementById(
            "singleNewsBody"
        );


    const publishedDate =
        news.published_at

            ? new Date(
                news.published_at
            ).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            )

            : "";


    title.textContent =
        news.title || "";


    category.textContent =
        news.category || "KINGDOM";


    date.textContent =
        publishedDate;


    author.textContent =
        news.author || "Agbor Kingdom";


    image.src =
        news.image_url || "";


    image.alt =
        news.title || "Agbor Kingdom News";


    /*
       We use textContent for the title and metadata
       to prevent HTML injection.

       Article content is currently inserted as
       text rather than interpreted as HTML.
    */

    body.textContent =
        news.content || news.excerpt || "";


    document.title = `${news.title} | Agbor Kingdom`;

// ==========================================
// SEO & SOCIAL MEDIA META DATA
// ==========================================
const articleTitle =
    news.title || "Agbor Kingdom News";

const articleDescription =
    news.excerpt ||
    "Latest news, announcements and stories from Agbor Kingdom.";

const articleUrl =
    "https://agborkingdom.netlify.app/news.html?slug=" +
    encodeURIComponent(news.slug);



const articleImage =
    news.image_url || "";
    
// SEO description
const metaDescription =
    document.getElementById("newsMetaDescription");

if (metaDescription) {
    metaDescription.setAttribute(
        "content",
        articleDescription
    );
}

// Open Graph
const ogTitle =
    document.getElementById("ogTitle");

const ogDescription =
    document.getElementById("ogDescription");

const ogUrl =
    document.getElementById("ogUrl");

const ogImage =
    document.getElementById("ogImage");

if (ogTitle) {
    ogTitle.setAttribute(
        "content",
        articleTitle
    );
}

if (ogDescription) {
    ogDescription.setAttribute(
        "content",
        articleDescription
    );
}

if (ogUrl) {
    ogUrl.setAttribute(
        "content",
        articleUrl
    );
}

if (ogImage) {
    ogImage.setAttribute(
        "content",
        articleImage
    );
}

// X / Twitter
const twitterTitle =
    document.getElementById("twitterTitle");

const twitterDescription =
    document.getElementById("twitterDescription");

const twitterImage =
    document.getElementById("twitterImage");

if (twitterTitle) {
    twitterTitle.setAttribute(
        "content",
        articleTitle
    );
}

if (twitterDescription) {
    twitterDescription.setAttribute(
        "content",
        articleDescription
    );
}

if (twitterImage) {
    twitterImage.setAttribute(
        "content",
        articleImage
    );
}

// Canonical URL
const canonical =
    document.getElementById("newsCanonical");

if (canonical) {
    canonical.setAttribute(
        "href",
        articleUrl
    );
}

loading.hidden = true;
content.hidden = false;

// =========================================
// INCREMENT NEWS VIEWS
// =========================================

incrementNewsViews(news.id);

setupNewsSharing(news);
}

/* =========================================
   INCREMENT NEWS VIEWS
========================================= */

async function incrementNewsViews(articleId) {

    if (!articleId) {
        return;
    }

    try {

        const { error } =
            await kingdomSupabase.rpc(
                "increment_news_views",
                {
                    news_id: articleId
                }
            );


        if (error) {
            throw error;
        }


        console.log(
            "News view recorded:",
            articleId
        );

    } catch (error) {

        console.error(
            "Failed to increment news views:",
            error
        );

    }

}
/* =========================================
   SINGLE NEWS ERROR
========================================= */

function showSingleNewsError() {

    const loading =
        document.getElementById(
            "singleNewsLoading"
        );

    const content =
        document.getElementById(
            "singleNewsContent"
        );

    const errorBox =
        document.getElementById(
            "singleNewsError"
        );


    if (loading) {
        loading.hidden = true;
    }


    if (content) {
        content.hidden = true;
    }


    if (errorBox) {
        errorBox.hidden = false;
    }

}

loadSingleNews();

/* =========================================
   NEWS ARCHIVE
========================================= */

const newsArchiveGrid =
    document.getElementById("newsArchiveGrid");

const featuredNews =
    document.getElementById("featuredNews");

const newsArchiveSearch =
    document.getElementById("newsArchiveSearch");

const newsLoadMore =
    document.getElementById("newsLoadMore");


let newsArchivePage = 0;

const NEWS_PER_PAGE = 6;

let newsArchiveCategory = "ALL";

let newsArchiveSearchTerm = "";


/* =========================================
   LOAD NEWS ARCHIVE
========================================= */

async function loadNewsArchive(reset = false) {

    if (!newsArchiveGrid) {
        return;
    }


    if (reset) {

        newsArchivePage = 0;

        newsArchiveGrid.innerHTML = `
            <div class="news-loading">
                Loading news...
            </div>
        `;

    }


    try {

        const from =
            newsArchivePage * NEWS_PER_PAGE;

        const to =
            from + NEWS_PER_PAGE - 1;


        let query =
            kingdomSupabase

                .from("news")

                .select(`
                    id,
                    title,
                    slug,
                    excerpt,
                    image_url,
                    category,
                    author,
                    published_at,
                    is_featured
                `)

                .eq("is_published", true);


        /* CATEGORY */

        if (
            newsArchiveCategory !== "ALL"
        ) {

            query =
                query.eq(
                    "category",
                    newsArchiveCategory
                );

        }


        /* SEARCH */

        if (
            newsArchiveSearchTerm
        ) {

            const search =
                newsArchiveSearchTerm
                    .replace(/,/g, "");

            query =
                query.or(
                    `title.ilike.%${search}%,excerpt.ilike.%${search}%`
                );

        }


        const {
            data,
            error
        } = await query

            .order(
                "published_at",
                {
                    ascending: false
                }
            )

            .range(from, to);


        if (error) {
            throw error;
        }


        if (reset) {

            newsArchiveGrid.innerHTML = "";

        }


        renderNewsArchive(
            data || [],
            reset
        );


        if (
            !data ||
            data.length < NEWS_PER_PAGE
        ) {

            if (newsLoadMore) {
                newsLoadMore.style.display =
                    "none";
            }

        } else {

            if (newsLoadMore) {
                newsLoadMore.style.display =
                    "inline-flex";
            }

        }


        newsArchivePage++;

    }


    catch (error) {

        console.error(
            "Error loading news archive:",
            error
        );


        newsArchiveGrid.innerHTML = `
            <div class="news-loading">
                Unable to load news.
            </div>
        `;

    }

}

/* =========================================
   RENDER NEWS ARCHIVE
========================================= */

function renderNewsArchive(
    newsItems,
    reset = false
) {

    if (
        reset &&
        !newsItems.length
    ) {

        newsArchiveGrid.innerHTML = `
            <div class="news-loading">
                No news found.
            </div>
        `;

        return;
    }


    const html =
        newsItems
            .map(news => {

                const date =
                    news.published_at

                        ? new Date(
                            news.published_at
                        ).toLocaleDateString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            }
                        )

                        : "";


                const image =
                    news.image_url ||
                    "images/news/news-default.jpg";


                return `

                    <article class="news-card">

                        <a
                            href="news.html?slug=${encodeURIComponent(news.slug)}"
                            class="news-image"
                        >

                            <img
                                src="${escapeSearchText(image)}"
                                alt="${escapeSearchText(news.title)}"
                                loading="lazy"
                            >

                            <span class="news-category">
                                ${escapeSearchText(
                                    news.category || "KINGDOM"
                                )}
                            </span>

                        </a>


                        <div class="news-card-content">

                            <time>
                                ${date}
                            </time>


                            <h3>
                                ${escapeSearchText(news.title)}
                            </h3>


                            <p>
                                ${escapeSearchText(
                                    news.excerpt || ""
                                )}
                            </p>


                            <a
                                href="news.html?slug=${encodeURIComponent(news.slug)}"
                                class="news-read-more"
                            >
                                Read More
                                <span>→</span>
                            </a>

                        </div>

                    </article>

                `;

            })
            .join("");


    newsArchiveGrid.insertAdjacentHTML(
        "beforeend",
        html
    );

}

/* =========================================
   LOAD FEATURED NEWS
========================================= */

async function loadFeaturedNews() {

    if (!featuredNews) {
        return;
    }


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
                image_url,
                category,
                published_at
            `)

            .eq("is_published", true)

            .eq("is_featured", true)

            .order(
                "published_at",
                {
                    ascending: false
                }
            )

            .limit(1);


        if (error) {
            throw error;
        }


        if (!data || !data.length) {

            featuredNews.innerHTML = "";

            return;
        }


        renderFeaturedNews(
            data[0]
        );

    }


    catch (error) {

        console.error(
            "Error loading featured news:",
            error
        );

    }

}

/* =========================================
   RENDER FEATURED NEWS
========================================= */

function renderFeaturedNews(news) {

    const date =
        news.published_at

            ? new Date(
                news.published_at
            ).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            )

            : "";


    const image =
        news.image_url ||
        "images/news/news-default.jpg";


    featuredNews.innerHTML = `

        <article class="featured-news-card">

            <a
               href="${news.slug ? `news.html?slug=${encodeURIComponent(news.slug)}` : `news.html?id=${encodeURIComponent(news.id)}`}"
                class="featured-news-image"
            >

                <img
                    src="${escapeSearchText(image)}"
                    alt="${escapeSearchText(news.title)}"
                    loading="lazy"
                >

            </a>


            <div class="featured-news-content">

                <span class="section-label">
                    FEATURED STORY
                </span>


                <span class="featured-news-category">
                    ${escapeSearchText(
                        news.category || "KINGDOM"
                    )}
                </span>


                <h2>
                    ${escapeSearchText(news.title)}
                </h2>


                <time>
                    ${date}
                </time>


                <p>
                    ${escapeSearchText(
                        news.excerpt || ""
                    )}
                </p>


                <a
                    href="news.html?slug=${encodeURIComponent(news.slug)}"
                    class="hero-button"
                >
                    Read Full Story
                </a>

            </div>

        </article>

    `;

}
/* =========================================
   NEWS CATEGORY FILTER
========================================= */

const newsFilterButtons =
    document.querySelectorAll(
        ".news-filter-button"
    );

newsFilterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedCategory =
            button.dataset.category || "ALL";

        console.log(
            "NEWS CATEGORY SELECTED:",
            selectedCategory
        );


        /* Remove active from every button */

        newsFilterButtons.forEach(item => {

            item.classList.remove("active");

        });


        /* Make clicked button active */

        button.classList.add("active");


        /* Update current category */

        newsArchiveCategory =
            selectedCategory;


        /* Reset search when changing category */

        newsArchiveSearchTerm = "";

        if (newsArchiveSearch) {

            newsArchiveSearch.value = "";

        }


        /* Reload archive */

        loadNewsArchive(true);

    });

});

/* =========================================
   NEWS ARCHIVE SEARCH
========================================= */

function performNewsArchiveSearch() {

    if (!newsArchiveSearch) {
        return;
    }


    newsArchiveSearchTerm =
        newsArchiveSearch.value.trim();


    loadNewsArchive(true);

}

if (newsArchiveSearch) {

    newsArchiveSearch.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                performNewsArchiveSearch();

            }

        }
    );

}

const newsArchiveSearchButton =
    document.getElementById(
        "newsArchiveSearchButton"
    );


if (newsArchiveSearchButton) {

    newsArchiveSearchButton.addEventListener(
        "click",
        performNewsArchiveSearch
    );

}
/* =========================================
   LOAD MORE NEWS
========================================= */

if (newsLoadMore) {

    newsLoadMore.addEventListener(
        "click",
        () => {

            loadNewsArchive(false);

        }
    );

}

loadNewsArchive(true);

loadFeaturedNews();



/* =========================================
   HOMEPAGE EVENTS
========================================= */

const homepageEventsGrid =
    document.getElementById("homepageEventsGrid");

const homepageEventsLoading =
    document.getElementById("homepageEventsLoading");


async function loadHomepageEvents() {

    if (!homepageEventsGrid) {
        return;
    }

    if (homepageEventsLoading) {
        homepageEventsLoading.style.display = "flex";
    }


    try {

       const today = new Date()
    .toISOString()
    .split("T")[0];

const { data, error } =
    await kingdomSupabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .gte("event_date", today)
        .order("event_date", {
            ascending: true
        })
        .order("sort_order", {
            ascending: true
        })
        .limit(3);

        if (error) {
            throw error;
        }


        console.log(
            "HOMEPAGE EVENTS:",
            data
        );


        if (homepageEventsLoading) {
            homepageEventsLoading.style.display = "none";
        }


        renderHomepageEvents(data || []);


    } catch (error) {

        console.error(
            "Homepage events loading failed:",
            error
        );


        if (homepageEventsLoading) {
            homepageEventsLoading.style.display = "none";
        }


        homepageEventsGrid.innerHTML = `
            <div class="homepage-events-message">
                <p>
                    Events are currently unavailable.
                </p>
            </div>
        `;
    }
}
/* =========================================
   RENDER HOMEPAGE EVENTS
========================================= */

function renderHomepageEvents(events) {

    if (!homepageEventsGrid) {
        return;
    }


    if (!events.length) {

        homepageEventsGrid.innerHTML = `
            <div class="homepage-events-message">

                <p>
                    There are no upcoming events at this time.
                </p>

            </div>
        `;

        return;
    }


    homepageEventsGrid.innerHTML =

        events
            .slice(0, 3)
            .map((event) => {

                const eventDate =
                    event.event_date
                        ? new Date(
                            `${event.event_date}T00:00:00`
                        )
                        : null;


                const month =
                    eventDate
                        ? eventDate
                            .toLocaleDateString(
                                "en-US",
                                {
                                    month: "short"
                                }
                            )
                            .toUpperCase()
                        : "";


                const day =
                    eventDate
                        ? eventDate.getDate()
                        : "";


                const year =
                    eventDate
                        ? eventDate.getFullYear()
                        : "";


                const title =
                    escapeSearchText(
                        event.title ||
                        "Agbor Kingdom Event"
                    );


                const description =
                    escapeSearchText(
                        event.description ||
                        ""
                    );


                const category =
                    escapeSearchText(
                
                        event.event_type ||
                        "KINGDOM EVENT"
                    );


                const eventTime =
                    escapeSearchText(
                        event.event_time ||
                        ""
                    );


                const location =
                    escapeSearchText(
                        event.location ||
                        ""
                    );


                return `

                    <a
                        href="event-details.html?id=${encodeURIComponent(event.id)}"
                        class="event-card homepage-event-card"
                    >

                        <div class="event-date">

                            <span class="event-month">
                                ${month}
                            </span>

                            <strong class="event-day">
                                ${day}
                            </strong>

                            <span class="event-year">
                                ${year}
                            </span>

                        </div>


                        <div class="event-details">

                            <span class="event-type">
                                ${category}
                            </span>


                            <h3>
                                ${title}
                            </h3>


                            <p>
                                ${description}
                            </p>


                            <div class="event-meta">

                                ${
                                    eventTime
                                        ? `
                                            <span>
                                                ◷
                                                ${eventTime}
                                            </span>
                                        `
                                        : ""
                                }


                                ${
                                    location
                                        ? `
                                            <span>
                                                ◉
                                                ${location}
                                            </span>
                                        `
                                        : ""
                                }

                            </div>

                        </div>

                    </a>

                `;

            })

            .join("");
}

loadHomepageEvents();




/* =========================================
   HOMEPAGE GALLERY
========================================= */

const homepageGalleryGrid =
    document.getElementById("homepageGalleryGrid");

const homepageGalleryLoading =
    document.getElementById("homepageGalleryLoading");


async function loadHomepageGallery() {

    if (!homepageGalleryGrid) {
        return;
    }

    if (homepageGalleryLoading) {
        homepageGalleryLoading.style.display = "flex";
    }

    try {

        const { data, error } =
            await kingdomSupabase
                .from("gallery")
                .select(`
                    id,
                    title,
                    description,
                    category,
                    image_url
                `)
                .eq("is_active", true)
                .order("sort_order", {
                    ascending: true
                })
                .order("created_at", {
                    ascending: false
                })
                .limit(5);


        if (error) {
            throw error;
        }


        console.log(
            "HOMEPAGE GALLERY:",
            data
        );


        if (homepageGalleryLoading) {
            homepageGalleryLoading.style.display = "none";
        }


        renderHomepageGallery(data || []);


    } catch (error) {

        console.error(
            "Homepage gallery loading failed:",
            error
        );


        if (homepageGalleryLoading) {
            homepageGalleryLoading.style.display = "none";
        }


        homepageGalleryGrid.innerHTML = `
            <div class="homepage-gallery-message">
                <p>
                    Gallery content is currently unavailable.
                </p>
            </div>
        `;
    }
}


/* =========================================
   RENDER HOMEPAGE GALLERY
========================================= */

function renderHomepageGallery(items) {

    if (!homepageGalleryGrid) {
        return;
    }


    if (!items.length) {

        homepageGalleryGrid.innerHTML = `
            <div class="homepage-gallery-message">
                <p>
                    No gallery items available.
                </p>
            </div>
        `;

        return;
    }


    homepageGalleryGrid.innerHTML =
        items
            .slice(0, 5)
            .map((item, index) => {

                const title =
                    item.title ||
                    "Agbor Kingdom Heritage";

                const category =
                    item.category ||
                    "HERITAGE";


                const imageHtml =
                    item.image_url

                        ? `
                            <img
                                src="${escapeSearchText(item.image_url)}"
                                alt="${escapeSearchText(title)}"
                                loading="lazy"
                            >
                          `

                        : `
                            <div class="gallery-image-placeholder">
                                <span>
                                    AGBOR KINGDOM
                                </span>
                            </div>
                          `;


                return `
                    <a
                        href="gallery.html"
                        class="gallery-item ${
                            index === 0
                                ? "gallery-large"
                                : ""
                        }"
                    >

                        ${imageHtml}

                        <div class="gallery-overlay">

                            <span>
                                ${escapeSearchText(category)}
                            </span>

                            <h3>
                                ${escapeSearchText(title)}
                            </h3>

                        </div>

                    </a>
                `;

            })
            .join("");
}

loadHomepageGallery();


