/* =========================================
   VIDEOS PAGE
========================================= */

const videosGrid =
    document.getElementById("videosGrid");

const videosLoading =
    document.getElementById("videosLoading");

const videosFilter =
    document.getElementById("videosFilter");

const videoModal =
    document.getElementById("videoModal");

const videoModalOverlay =
    document.getElementById("videoModalOverlay");

const videoModalClose =
    document.getElementById("videoModalClose");

const videoPlayer =
    document.getElementById("videoPlayer");

    const directVideoPlayer =
    document.getElementById(
        "directVideoPlayer"
    );

const videoModalTitle =
    document.getElementById("videoModalTitle");

const videoModalDescription =
    document.getElementById(
        "videoModalDescription"
    );

const videoModalCategory =
    document.getElementById(
        "videoModalCategory"
    );


let videosData = [];

let currentCategory = "ALL";


/* =========================================
   LOAD VIDEOS
========================================= */

async function loadVideos() {

    if (!videosGrid) {
        return;
    }

    showVideosLoading();

    try {

        const { data, error } =
            await kingdomSupabase
                .from("videos")
                .select("*")
                .eq("is_published", true)
                .order("sort_order", {
                    ascending: true
                })
                .order("created_at", {
                    ascending: false
                });

        if (error) {
            throw error;
        }


        videosData = data || [];


        console.log(
            "VIDEOS:",
            videosData
        );


        buildVideoCategories();


        renderVideos();


    } catch (error) {

        console.error(
            "Videos loading failed:",
            error
        );


        renderVideosError();

    }

}


/* =========================================
   LOADING STATE
========================================= */

function showVideosLoading() {

    videosGrid.innerHTML = `
        <div class="videos-loading">

            <div class="videos-spinner"></div>

            <p>
                Loading videos...
            </p>

        </div>
    `;

}


/* =========================================
   RENDER VIDEOS
========================================= */

function renderVideos() {

    let filteredVideos =
        videosData;


    if (
        currentCategory !== "ALL"
    ) {

        filteredVideos =
            videosData.filter(
                video =>
                    String(
                        video.category || ""
                    ).toUpperCase()
                    === currentCategory
            );

    }


    if (!filteredVideos.length) {

        videosGrid.innerHTML = `
            <div class="videos-empty">

                <h3>
                    No videos available
                </h3>

                <p>
                    There are currently no videos
                    in this category.
                </p>

            </div>
        `;

        return;

    }


    videosGrid.innerHTML =
        filteredVideos
            .map(createVideoCard)
            .join("");

}


/* =========================================
   CREATE VIDEO CARD
========================================= */

function createVideoCard(video) {

    const title =
        escapeVideoText(
            video.title ||
            "Agbor Kingdom Video"
        );


    const description =
        escapeVideoText(
            video.description ||
            ""
        );


    const category =
        escapeVideoText(
            video.category ||
            "KINGDOM MEDIA"
        );


    const thumbnail =
        video.thumbnail_url;


    return `
        <article
            class="video-card"
            data-video-id="${escapeVideoText(video.id)}"
        >

            <div class="video-thumbnail">

                ${
                    thumbnail
                        ? `
                            <img
                                src="${escapeVideoText(thumbnail)}"
                                alt="${title}"
                                loading="lazy"
                            >
                        `
                        : `
                            <div
                                class="video-thumbnail-placeholder"
                            >
                                <span>▶</span>
                            </div>
                        `
                }


                <div
                    class="video-play-button"
                    aria-hidden="true"
                >
                    ▶
                </div>

            </div>


            <div class="video-card-content">

                <span class="video-category">
                    ${category}
                </span>

                <h3>
                    ${title}
                </h3>

                ${
                    description
                        ? `
                            <p>
                                ${description}
                            </p>
                        `
                        : ""
                }

            </div>

        </article>
    `;

}


/* =========================================
   VIDEO CARD CLICK
========================================= */

videosGrid?.addEventListener(
    "click",
    function (event) {

        const card =
            event.target.closest(
                ".video-card"
            );


        if (!card) {
            return;
        }


        const videoId =
            card.dataset.videoId;


        const video =
            videosData.find(
                item =>
                    String(item.id)
                    === String(videoId)
            );


        if (!video) {
            return;
        }


        openVideoModal(video);

    }
);


/* =========================================
   OPEN VIDEO MODAL
========================================= */
function openVideoModal(video) {

    if (!video || !video.video_url) {
        return;
    }

    const videoUrl =
        video.video_url.trim();

    /*
       Detect YouTube URL
    */

    const youtubeEmbedUrl =
        getYouTubeEmbedUrl(
            videoUrl
        );


    /*
       If it is YouTube,
       use the iframe.
    */

    if (youtubeEmbedUrl) {

        if (directVideoPlayer) {
            directVideoPlayer.pause();
            directVideoPlayer.removeAttribute(
                "src"
            );
            directVideoPlayer.load();
            directVideoPlayer.hidden = true;
        }

        if (videoPlayer) {
            videoPlayer.hidden = false;
            videoPlayer.src =
                youtubeEmbedUrl;
        }

    } else {

        /*
           Otherwise treat it as a
           direct video URL.
        */

        if (videoPlayer) {
            videoPlayer.src = "";
            videoPlayer.hidden = true;
        }

        if (directVideoPlayer) {

            directVideoPlayer.hidden = false;

            directVideoPlayer.src =
                videoUrl;

            directVideoPlayer.load();

        }

    }


    /*
       Modal information
    */

    videoModalTitle.textContent =
        video.title ||
        "Agbor Kingdom Video";

    videoModalDescription.textContent =
        video.description ||
        "";

    videoModalCategory.textContent =
        video.category ||
        "KINGDOM MEDIA";


    /*
       Open modal
    */

    videoModal.classList.add(
        "show"
    );

    videoModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";


    /*
       Autoplay direct videos.
       Browser policy may block autoplay
       if sound is enabled, so controls
       remain available.
    */

    if (
        directVideoPlayer &&
        !directVideoPlayer.hidden
    ) {

        directVideoPlayer
            .play()
            .catch(() => {
                /*
                   Autoplay may be blocked.
                   User can press Play.
                */
            });

    }

}

/* =========================================
   CLOSE VIDEO MODAL
========================================= */

function closeVideoModal() {

    /*
       Close modal
    */

    videoModal.classList.remove(
        "show"
    );

    videoModal.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
       Stop YouTube
    */

    if (videoPlayer) {

        videoPlayer.src = "";
        videoPlayer.hidden = false;

    }


    /*
       Stop direct video
    */

    if (directVideoPlayer) {

        directVideoPlayer.pause();

        directVideoPlayer.removeAttribute(
            "src"
        );

        directVideoPlayer.load();

        directVideoPlayer.hidden = true;

    }


    /*
       Restore page scrolling
    */

    document.body.style.overflow =
        "";

}

/* =========================================
   CLOSE BUTTON
========================================= */

videoModalClose?.addEventListener(
    "click",
    closeVideoModal
);


/* =========================================
   CLICK OUTSIDE
========================================= */

videoModalOverlay?.addEventListener(
    "click",
    closeVideoModal
);


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            videoModal.classList.contains("show")
        ) {

            closeVideoModal();

        }

    }
);


/* =========================================
   YOUTUBE EMBED URL
========================================= */

function getYouTubeEmbedUrl(url) {

    if (!url) {
        return null;
    }


    try {

        const parsed =
            new URL(url);


        let videoId = null;


        /*
           Standard URL:

           youtube.com/watch?v=VIDEO_ID
        */

        if (
            parsed.hostname.includes(
                "youtube.com"
            )
        ) {

            videoId =
                parsed.searchParams.get(
                    "v"
                );

        }


        /*
           Short URL:

           youtu.be/VIDEO_ID
        */

        if (
            parsed.hostname ===
            "youtu.be"
        ) {

            videoId =
                parsed.pathname
                    .replace("/", "");

        }


        /*
           Already an embed URL
        */

        if (
            parsed.pathname
                .startsWith("/embed/")
        ) {

            videoId =
                parsed.pathname
                    .split("/embed/")[1];

        }


        if (!videoId) {
            return null;
        }


        return `
            https://www.youtube.com/embed/${videoId}
            ?autoplay=1
            &rel=0
            &modestbranding=1
        `.replace(/\s/g, "");

    } catch (error) {

        console.error(
            "Invalid video URL:",
            error
        );

        return null;

    }

}


/* =========================================
   BUILD CATEGORY FILTERS
========================================= */

function buildVideoCategories() {

    if (!videosFilter) {
        return;
    }


    const categories =
        [
            ...new Set(
                videosData
                    .map(
                        video =>
                            String(
                                video.category || ""
                            )
                            .trim()
                            .toUpperCase()
                    )
                    .filter(Boolean)
            )
        ];


    videosFilter.innerHTML = `

        <button
            type="button"
            class="video-filter-btn active"
            data-category="ALL"
        >
            All Videos
        </button>

        ${
            categories
                .map(
                    category => `
                        <button
                            type="button"
                            class="video-filter-btn"
                            data-category="${escapeVideoText(category)}"
                        >
                            ${escapeVideoText(category)}
                        </button>
                    `
                )
                .join("")
        }

    `;

}


/* =========================================
   CATEGORY FILTER CLICK
========================================= */

videosFilter?.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".video-filter-btn"
            );


        if (!button) {
            return;
        }


        currentCategory =
            button.dataset.category ||
            "ALL";


        document
            .querySelectorAll(
                ".video-filter-btn"
            )
            .forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


        button.classList.add(
            "active"
        );


        renderVideos();

    }
);


/* =========================================
   ERROR STATE
========================================= */

function renderVideosError() {

    videosGrid.innerHTML = `
        <div class="videos-empty">

            <h3>
                Unable to Load Videos
            </h3>

            <p>
                Please try again later.
            </p>

        </div>
    `;

}


/* =========================================
   ESCAPE TEXT
========================================= */

function escapeVideoText(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   START
========================================= */

loadVideos();