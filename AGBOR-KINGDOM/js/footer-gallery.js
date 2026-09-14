/* =========================================
   AGBOR KINGDOM
   FOOTER GALLERY SLIDER
========================================= */

let footerGalleryItems = [];
let footerGalleryIndex = 0;
let footerGalleryTimer = null;


/* =========================================
   LOAD FOOTER GALLERY
========================================= */

async function loadFooterGallery() {

    const gallery =
        document.getElementById("footerGallery");

    const image =
        document.getElementById("footerGalleryImage");

    const loading =
        document.getElementById("footerGalleryLoading");

    const category =
        document.getElementById("footerGalleryCategory");

    const title =
        document.getElementById("footerGalleryTitle");


    if (
        !gallery ||
        !image
    ) {
        console.warn(
            "Footer gallery elements not found."
        );

        return;
    }


    try {

        if (loading) {
            loading.style.display = "block";
        }


        const {
            data,
            error
        } = await kingdomSupabase

            .from("gallery")

            .select(
                "id, title, category, description, image_url, sort_order, created_at"
            )

            .eq(
                "is_active",
                true
            )

            .order(
                "sort_order",
                {
                    ascending: true
                }
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            )

            .limit(6);


        if (error) {
            throw error;
        }


        footerGalleryItems =
            data || [];


        console.log(
            "FOOTER GALLERY:",
            footerGalleryItems
        );


        if (!footerGalleryItems.length) {

            if (loading) {
                loading.textContent =
                    "No gallery images available.";
            }

            return;
        }


        /*
         * Hide loading
         */

        if (loading) {
            loading.style.display = "none";
        }


        /*
         * Show first image
         */

        showFooterGalleryImage();


        /*
         * Start automatic slider
         */

        startFooterGallerySlider();


    } catch (error) {

        console.error(
            "Footer gallery loading failed:",
            error
        );


        if (loading) {

            loading.textContent =
                "Gallery unavailable.";

        }

    }

}


/* =========================================
   SHOW CURRENT IMAGE
========================================= */

function showFooterGalleryImage() {

    const image =
        document.getElementById(
            "footerGalleryImage"
        );

    const category =
        document.getElementById(
            "footerGalleryCategory"
        );

    const title =
        document.getElementById(
            "footerGalleryTitle"
        );


    const item =
        footerGalleryItems[
            footerGalleryIndex
        ];


    if (!item || !image) {
        return;
    }


    /*
     * Fade out
     */

    image.classList.add(
        "footer-gallery-changing"
    );


    setTimeout(() => {

        image.src =
            item.image_url || "";


        image.alt =
            item.title ||
            "Agbor Kingdom Gallery";


        if (category) {

            category.textContent =
                item.category ||
                "HERITAGE";

        }


        if (title) {

            title.textContent =
                item.title ||
                "Agbor Kingdom";

        }


        /*
         * Fade back in
         */

        image.classList.remove(
            "footer-gallery-changing"
        );

    }, 200);

}


/* =========================================
   AUTOMATIC SLIDER
========================================= */

function startFooterGallerySlider() {

    /*
     * Clear an existing timer
     */

    if (footerGalleryTimer) {

        clearInterval(
            footerGalleryTimer
        );

    }


    /*
     * No need to slide if
     * there is only one image.
     */

    if (
        footerGalleryItems.length <= 1
    ) {
        return;
    }


    /*
     * Change image every 5 seconds.
     */

    footerGalleryTimer =
        setInterval(() => {

            footerGalleryIndex =
                (
                    footerGalleryIndex + 1
                ) %
                footerGalleryItems.length;


            showFooterGalleryImage();

        }, 5000);

}


/* =========================================
   INITIALIZE FOOTER GALLERY
========================================= */

function initializeFooterGallery() {

    /*
     * If the footer is already available,
     * load immediately.
     */

    const gallery =
        document.getElementById(
            "footerGallery"
        );


    if (gallery) {

        loadFooterGallery();

        return;

    }


    /*
     * Otherwise wait for footer-loader.js
     */

    document.addEventListener(
        "agborFooterLoaded",
        () => {

            loadFooterGallery();

        },
        {
            once: true
        }
    );

}


/* =========================================
   START
========================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeFooterGallery
    );

} else {

    initializeFooterGallery();

}