/* =========================================
   AGBOR KINGDOM
   FOOTER GALLERY SLIDER
========================================= */

const footerGallery =
    document.getElementById("footerGallery");

const footerGalleryImage =
    document.getElementById("footerGalleryImage");

const footerGalleryTitle =
    document.getElementById("footerGalleryTitle");

const footerGalleryCategory =
    document.getElementById("footerGalleryCategory");

const footerGalleryLoading =
    document.getElementById("footerGalleryLoading");


let footerGalleryItems = [];

let footerGalleryIndex = 0;

let footerGalleryTimer = null;


/* =========================================
   LOAD FOOTER GALLERY
========================================= */

async function loadFooterGallery() {

    if (
        !footerGallery ||
        !footerGalleryImage
    ) {
        return;
    }

    try {

        const {
            data,
            error
        } = await kingdomSupabase

            .from("gallery")

            .select(
                "id, title, category, image_url, sort_order, created_at"
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


        if (
            !footerGalleryItems.length
        ) {

            footerGallery.style.display =
                "none";

            return;
        }


        footerGallery.classList.add(
            "is-ready"
        );


        footerGalleryIndex = 0;


        showFooterGalleryImage();


        /*
         * Change image every 5 seconds.
         */

        startFooterGallerySlider();


    } catch (error) {

        console.error(
            "Footer gallery loading failed:",
            error
        );


        if (footerGallery) {

            footerGallery.style.display =
                "none";

        }

    }

}


/* =========================================
   SHOW CURRENT IMAGE
========================================= */

function showFooterGalleryImage() {

    const item =
        footerGalleryItems[
            footerGalleryIndex
        ];


    if (!item) {
        return;
    }


    footerGalleryImage.classList.add(
        "is-changing"
    );


    setTimeout(
        function () {

            footerGalleryImage.src =
                item.image_url || "";


            footerGalleryImage.alt =
                item.title ||
                "Agbor Kingdom Gallery";


            footerGalleryTitle.textContent =
                item.title ||
                "Agbor Kingdom";


            footerGalleryCategory.textContent =
                item.category ||
                "HERITAGE";


            footerGalleryImage.classList.remove(
                "is-changing"
            );

        },
        450
    );

}


/* =========================================
   NEXT IMAGE
========================================= */

function showNextFooterGalleryImage() {

    if (
        !footerGalleryItems.length
    ) {
        return;
    }


    footerGalleryIndex =
        (
            footerGalleryIndex + 1
        ) %
        footerGalleryItems.length;


    showFooterGalleryImage();

}


/* =========================================
   START SLIDER
========================================= */

function startFooterGallerySlider() {

    stopFooterGallerySlider();


    /*
     * 5 seconds between images.
     */

    footerGalleryTimer =
        setInterval(
            showNextFooterGalleryImage,
            5000
        );

}


/* =========================================
   STOP SLIDER
========================================= */

function stopFooterGallerySlider() {

    if (footerGalleryTimer) {

        clearInterval(
            footerGalleryTimer
        );

        footerGalleryTimer = null;

    }

}

/* =========================================
   START AFTER FOOTER LOADS
========================================= */

document.addEventListener(
    "agborFooterLoaded",
    () => {

        loadFooterGallery();

    }
);
