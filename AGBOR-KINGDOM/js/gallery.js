/* =========================================
   AGBOR KINGDOM
   GALLERY PAGE
========================================= */




const galleryGrid =
    document.getElementById("galleryGrid");

const galleryLoading =
    document.getElementById("galleryLoading");

const galleryEmpty =
    document.getElementById("galleryEmpty");

const galleryFilters =
    document.querySelectorAll(".gallery-filter");

const galleryLightbox =
    document.getElementById("galleryLightbox");

const galleryLightboxImage =
    document.getElementById("galleryLightboxImage");

const galleryLightboxTitle =
    document.getElementById("galleryLightboxTitle");

const galleryLightboxDescription =
    document.getElementById("galleryLightboxDescription");

const galleryLightboxCategory =
    document.getElementById("galleryLightboxCategory");

const galleryLightboxClose =
    document.getElementById("galleryLightboxClose");

const galleryLightboxPrev =
    document.getElementById("galleryLightboxPrev");

const galleryLightboxNext =
    document.getElementById("galleryLightboxNext");


let galleryItems = [];

let filteredGalleryItems = [];

let currentGalleryIndex = 0;



/* =========================================
   LOAD GALLERY
========================================= */

async function loadGallery() {

    if (!galleryGrid) return;

    // Show loading
    galleryLoading.style.display = "flex";

    galleryEmpty.style.display = "none";

    galleryGrid.innerHTML = "";

    try {

        const { data, error } =
            await kingdomSupabase
                .from("gallery")
                .select("*")
                .eq("is_active", true)
                .order("sort_order", {
                    ascending: true
                })
                .order("created_at", {
                    ascending: false
                });

        if (error) {
            throw error;
        }

        galleryItems = data || [];
        filteredGalleryItems = galleryItems;

        console.log("GALLERY:", galleryItems);

        // IMPORTANT:
        // Hide loading BEFORE rendering
        galleryLoading.style.display = "none";

        renderGallery();

    } catch (error) {

        console.error(
            "Gallery loading failed:",
            error
        );

        galleryLoading.style.display = "none";

        galleryEmpty.style.display = "block";

        const emptyTitle =
            galleryEmpty.querySelector("h3");

        const emptyText =
            galleryEmpty.querySelector("p");

        if (emptyTitle) {
            emptyTitle.textContent =
                "Unable to Load Gallery";
        }

        if (emptyText) {
            emptyText.textContent =
                "Please try again later.";
        }
    }
}


/* =========================================
   RENDER GALLERY
========================================= */

function renderGallery() {

    galleryGrid.innerHTML = "";


    if (!filteredGalleryItems.length) {

        galleryEmpty.hidden = false;

        return;

    }


    galleryEmpty.hidden = true;


    filteredGalleryItems.forEach(
        (item, index) => {

            const card =
                document.createElement("article");


            card.className =
                "gallery-page-item";


            card.innerHTML = `

                <button
                    type="button"
                    class="gallery-image-button"
                    aria-label="View ${escapeGalleryText(item.title)}"
                >

                    <img
                        src="${escapeGalleryText(item.image_url)}"
                        alt="${escapeGalleryText(item.title)}"
                        loading="lazy"
                    >

                    <span class="gallery-page-overlay">

                        <span class="gallery-page-category">
                            ${escapeGalleryText(item.category)}
                        </span>

                        <strong class="gallery-page-title">
                            ${escapeGalleryText(item.title)}
                        </strong>

                        <span class="gallery-view">
                            View Image
                            <span>→</span>
                        </span>

                    </span>

                </button>

            `;


            const button =
                card.querySelector(
                    ".gallery-image-button"
                );


            button.addEventListener(
                "click",
                () => {

                    currentGalleryIndex =
                        index;

                    openGalleryLightbox();

                }
            );


            galleryGrid.appendChild(card);

        }
    );

}



/* =========================================
   CATEGORY FILTER
========================================= */

galleryFilters.forEach(
    (filter) => {

        filter.addEventListener(
            "click",
            () => {

                galleryFilters.forEach(
                    (button) => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


                filter.classList.add("active");


                const category =
                    filter.dataset.category;


                if (category === "ALL") {

                    filteredGalleryItems =
                        galleryItems;

                } else {

                    filteredGalleryItems =
                        galleryItems.filter(
                            (item) =>
                                String(
                                    item.category || ""
                                ).toUpperCase() ===
                                category.toUpperCase()
                        );

                }


                renderGallery();

            }
        );

    }
);



/* =========================================
   LIGHTBOX
========================================= */

function openGalleryLightbox() {

    const item =
        filteredGalleryItems[
            currentGalleryIndex
        ];


    if (!item) return;


    galleryLightboxImage.src =
        item.image_url;


    galleryLightboxImage.alt =
        item.title || "Agbor Kingdom Gallery";


    galleryLightboxTitle.textContent =
        item.title || "";


    galleryLightboxDescription.textContent =
        item.description || "";


    galleryLightboxCategory.textContent =
        item.category || "HERITAGE";


    galleryLightbox.classList.add("show");

    galleryLightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "gallery-lightbox-open"
    );

}



/* =========================================
   CLOSE LIGHTBOX
========================================= */

function closeGalleryLightbox() {

    galleryLightbox.classList.remove("show");

    galleryLightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "gallery-lightbox-open"
    );

}


galleryLightboxClose?.addEventListener(
    "click",
    closeGalleryLightbox
);



/* =========================================
   NEXT IMAGE
========================================= */

galleryLightboxNext?.addEventListener(
    "click",
    () => {

        if (!filteredGalleryItems.length) {
            return;
        }


        currentGalleryIndex =
            (currentGalleryIndex + 1) %
            filteredGalleryItems.length;


        openGalleryLightbox();

    }
);



/* =========================================
   PREVIOUS IMAGE
========================================= */

galleryLightboxPrev?.addEventListener(
    "click",
    () => {

        if (!filteredGalleryItems.length) {
            return;
        }


        currentGalleryIndex =
            (
                currentGalleryIndex -
                1 +
                filteredGalleryItems.length
            ) %
            filteredGalleryItems.length;


        openGalleryLightbox();

    }
);



/* =========================================
   KEYBOARD CONTROLS
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !galleryLightbox ||
            !galleryLightbox.classList.contains("show")
        ) {
            return;
        }


        if (event.key === "Escape") {

            closeGalleryLightbox();

        }


        if (event.key === "ArrowRight") {

            galleryLightboxNext?.click();

        }


        if (event.key === "ArrowLeft") {

            galleryLightboxPrev?.click();

        }

    }
);



/* =========================================
   ESCAPE TEXT
========================================= */

function escapeGalleryText(text) {

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

loadGallery();