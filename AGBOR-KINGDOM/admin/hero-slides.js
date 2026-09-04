/* =========================================
   HERO SLIDES ELEMENTS
========================================= */

const manageHeroSlidesButton =
    document.getElementById("manageHeroSlidesButton");

const adminHeroSlidesPanel =
    document.getElementById("adminHeroSlidesPanel");

const adminHeroSlidesList =
    document.getElementById("adminHeroSlidesList");

const adminHeroSlidesCount =
    document.getElementById("adminHeroSlidesCount");

    /* =========================================
   HERO SLIDE EDITOR ELEMENTS
========================================= */

const adminHeroSlideEditor =
    document.getElementById("adminHeroSlideEditor");

const heroSlideEditorForm =
    document.getElementById("heroSlideEditorForm");

const editHeroSlideId =
    document.getElementById("editHeroSlideId");

const editHeroSlideTitle =
    document.getElementById("editHeroSlideTitle");

const editHeroSlideSubtitle =
    document.getElementById("editHeroSlideSubtitle");

const editHeroSlideImage =
    document.getElementById("editHeroSlideImage");

const editHeroSlideButtonText =
    document.getElementById("editHeroSlideButtonText");

const editHeroSlideButtonLink =
    document.getElementById("editHeroSlideButtonLink");

const editHeroSlideSortOrder =
    document.getElementById("editHeroSlideSortOrder");

const editHeroSlideActive =
    document.getElementById("editHeroSlideActive");

const editHeroSlideHeading =
    document.getElementById("editHeroSlideHeading");

const editHeroSlideStatus =
    document.getElementById("editHeroSlideStatus");

const saveHeroSlideButton =
    document.getElementById("saveHeroSlideButton");

const deleteHeroSlideButton =
    document.getElementById("deleteHeroSlideButton");

const cancelHeroSlideButton =
    document.getElementById("cancelHeroSlideButton");

const heroSlideSaveMessage =
    document.getElementById("heroSlideSaveMessage");

    /* =========================================
   OPEN HERO SLIDES MANAGEMENT
========================================= */

if (manageHeroSlidesButton) {

    manageHeroSlidesButton.addEventListener(
        "click",
        async function () {

            console.log("Manage Hero Slides clicked.");

            if (adminHeroSlidesPanel) {

                adminHeroSlidesPanel.hidden = false;

                adminHeroSlidesPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

            await loadHeroSlides();

        }
    );

} else {

    console.error(
        "Manage Hero Slides button NOT FOUND."
    );

}

/* =========================================
   LOAD HERO SLIDES
========================================= */

async function loadHeroSlides() {

    if (!adminHeroSlidesList) {

        console.error(
            "Admin Hero Slides list not found."
        );

        return;
    }

    adminHeroSlidesList.innerHTML = `
        <p class="admin-loading">
            Loading hero slides...
        </p>
    `;

    try {

        console.log(
            "Loading hero slides from Supabase..."
        );

        const {
            data,
            error
        } = await kingdomAdminSupabase

            .from("hero_slides")

            .select("*")

            .order(
                "sort_order",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }

        console.log(
            "HERO SLIDES:",
            data
        );

        renderHeroSlides(
            data || []
        );

    } catch (error) {

        console.error(
            "Error loading hero slides:",
            error
        );

        adminHeroSlidesList.innerHTML = `
            <div class="admin-no-news">
                <p>
                    Unable to load hero slides.
                </p>
            </div>
        `;

        if (adminHeroSlidesCount) {
            adminHeroSlidesCount.textContent =
                "0 slides";
        }

    }

}

/* =========================================
   RENDER HERO SLIDES
========================================= */

function renderHeroSlides(slides) {

    if (!adminHeroSlidesList) {
        return;
    }

    /* =====================================
       COUNT
    ===================================== */

    if (adminHeroSlidesCount) {

        adminHeroSlidesCount.textContent =
            `${slides.length} ${
                slides.length === 1
                    ? "slide"
                    : "slides"
            }`;

    }

    /* =====================================
       EMPTY
    ===================================== */

    if (!slides.length) {

        adminHeroSlidesList.innerHTML = `
            <div class="admin-no-news">
                <p>
                    No hero slides found.
                </p>
            </div>
        `;

        return;
    }

    /* =====================================
       CLEAR LIST
    ===================================== */

    adminHeroSlidesList.innerHTML = "";

    /* =====================================
       CREATE SLIDE ITEMS
    ===================================== */

    slides.forEach(
        function (slide, index) {

            const item =
                document.createElement("article");

            item.className =
                "admin-media-card";

            item.dataset.heroSlideId =
                slide.id;

            item.innerHTML = `

                <div class="admin-media-card-image">

                    <img
                        src="${escapeHeroSlideHTML(
                            slide.image_url
                        )}"
                        alt="${escapeHeroSlideHTML(
                            slide.title || "Hero slide"
                        )}"
                        loading="lazy"
                    >

                </div>

                <div class="admin-media-card-body">

                    <span class="admin-news-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <div class="admin-news-content">

                        <div class="admin-news-category">
                            HERO SLIDE
                        </div>

                        <h4>
                            ${escapeHeroSlideHTML(
                                slide.title || "Untitled Slide"
                            )}
                        </h4>

                        <p>
                            ${escapeHeroSlideHTML(
                                slide.subtitle || ""
                            )}
                        </p>

                    </div>

                    <div
                        class="admin-editor-status ${
                            slide.is_active
                                ? "active"
                                : ""
                        }"
                    >
                        ${
                            slide.is_active
                                ? "Active"
                                : "Inactive"
                        }
                    </div>

                </div>
            `;

            adminHeroSlidesList.appendChild(item);

              /* =================================
   CLICK TO EDIT
================================= */

item.addEventListener(
    "click",
    function () {

        openHeroSlideEditor(slide);

    }
);

        }
    );
  

}

/* =========================================
   OPEN HERO SLIDE EDITOR
========================================= */

function openHeroSlideEditor(slide) {

    console.log(
        "Opening hero slide editor:",
        slide
    );

    editHeroSlideId.value =
        slide.id || "";

    editHeroSlideTitle.value =
        slide.title || "";

    editHeroSlideSubtitle.value =
        slide.subtitle || "";

    editHeroSlideImage.value =
        slide.image_url || "";

    editHeroSlideButtonText.value =
        slide.button_text || "";

    editHeroSlideButtonLink.value =
        slide.button_link || "";

    editHeroSlideSortOrder.value =
        slide.sort_order ?? 0;

    editHeroSlideActive.checked =
        slide.is_active !== false;


    editHeroSlideHeading.textContent =
        "Edit Hero Slide";

    editHeroSlideStatus.textContent =
        slide.is_active
            ? "Active Slide"
            : "Inactive Slide";


    saveHeroSlideButton.textContent =
        "Save Changes";

    deleteHeroSlideButton.hidden =
        false;

    heroSlideSaveMessage.textContent =
        "";


    adminHeroSlideEditor.hidden =
        false;


    adminHeroSlideEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

/* =========================================
   OPEN NEW HERO SLIDE EDITOR
========================================= */

function openNewHeroSlideEditor() {

    if (heroSlideEditorForm) {
        heroSlideEditorForm.reset();
    }

    editHeroSlideId.value = "";

    editHeroSlideSortOrder.value = 0;

    editHeroSlideActive.checked = true;


    editHeroSlideHeading.textContent =
        "Create Hero Slide";

    editHeroSlideStatus.textContent =
        "New Slide";


    saveHeroSlideButton.textContent =
        "Create Slide";

    deleteHeroSlideButton.hidden =
        true;

    heroSlideSaveMessage.textContent =
        "";


    adminHeroSlideEditor.hidden =
        false;


    adminHeroSlideEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

const addHeroSlideButton =
    document.getElementById("addHeroSlideButton");


if (addHeroSlideButton) {

    addHeroSlideButton.addEventListener(
        "click",
        function () {

            console.log(
                "Add Hero Slide clicked."
            );

            openNewHeroSlideEditor();

        }
    );

}

/* =========================================
   SAVE / CREATE / UPDATE HERO SLIDE
========================================= */

if (heroSlideEditorForm) {

    heroSlideEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const heroSlideId =
                editHeroSlideId.value.trim();


            const heroSlideData = {

                title:
                    editHeroSlideTitle.value.trim()
                    || null,

                subtitle:
                    editHeroSlideSubtitle.value.trim()
                    || null,

                image_url:
                    editHeroSlideImage.value.trim(),

                button_text:
                    editHeroSlideButtonText.value.trim()
                    || null,

                button_link:
                    editHeroSlideButtonLink.value.trim()
                    || null,

                sort_order:
                    Number(
                        editHeroSlideSortOrder.value
                    ) || 0,

                is_active:
                    editHeroSlideActive.checked

            };


            /* =================================
               VALIDATION
            ================================= */

            if (!heroSlideData.image_url) {

                heroSlideSaveMessage.textContent =
                    "Please enter an image URL.";

                return;

            }


            saveHeroSlideButton.disabled =
                true;

            saveHeroSlideButton.textContent =
                "Saving...";

            heroSlideSaveMessage.textContent =
                "";


            try {

                let result;


                /* =================================
                   UPDATE EXISTING
                ================================= */

                if (heroSlideId) {

                    console.log(
                        "Updating hero slide:",
                        heroSlideId
                    );


                    result =
                        await kingdomAdminSupabase

                            .from("hero_slides")

                            .update(
                                heroSlideData
                            )

                            .eq(
                                "id",
                                heroSlideId
                            );

                }


                /* =================================
                   CREATE NEW
                ================================= */

                else {

                    console.log(
                        "Creating new hero slide..."
                    );


                    result =
                        await kingdomAdminSupabase

                            .from("hero_slides")

                            .insert([
                                heroSlideData
                            ]);

                }


                if (result.error) {
                    throw result.error;
                }


                console.log(
                    "HERO SLIDE SAVED SUCCESSFULLY"
                );


                heroSlideSaveMessage.textContent =
                    heroSlideId
                        ? "Hero slide updated successfully."
                        : "Hero slide created successfully.";


                await loadHeroSlides();


                setTimeout(
                    function () {

                        closeHeroSlideEditor();

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Error saving hero slide:",
                    error
                );


                heroSlideSaveMessage.textContent =
                    error.message ||
                    "Unable to save hero slide.";

            } finally {

                saveHeroSlideButton.disabled =
                    false;


                saveHeroSlideButton.textContent =
                    heroSlideId
                        ? "Save Changes"
                        : "Create Slide";

            }

        }
    );

}

/* =========================================
   CANCEL HERO SLIDE EDITOR
========================================= */

if (cancelHeroSlideButton) {

    cancelHeroSlideButton.addEventListener(
        "click",
        function () {

            closeHeroSlideEditor();

        }
    );

}

/* =========================================
   CLOSE HERO SLIDE EDITOR
========================================= */

function closeHeroSlideEditor() {

    if (adminHeroSlideEditor) {

        adminHeroSlideEditor.hidden =
            true;

    }


    if (heroSlideEditorForm) {

        heroSlideEditorForm.reset();

    }


    editHeroSlideId.value = "";

    heroSlideSaveMessage.textContent = "";

}

/* =========================================
   HERO SLIDE DELETE BUTTON
========================================= */

if (deleteHeroSlideButton) {

    deleteHeroSlideButton.addEventListener(
        "click",
        function () {

            const heroSlideId =
                editHeroSlideId.value.trim();


            if (!heroSlideId) {

                heroSlideSaveMessage.textContent =
                    "No hero slide selected.";

                return;

            }


            showHeroSlideDeleteConfirmation(
                heroSlideId
            );

        }
    );

}

/* =========================================
   HERO SLIDE DELETE CONFIRMATION
========================================= */

function showHeroSlideDeleteConfirmation(
    heroSlideId
) {

    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );

    const confirmButton =
        document.getElementById(
            "confirmDeleteButton"
        );

    const title =
        document.getElementById(
            "deleteConfirmTitle"
        );


    if (!modal || !confirmButton) {

        console.error(
            "Admin: Delete confirmation modal not found."
        );

        return;

    }


    /* =====================================
       TITLE
    ===================================== */

    if (title) {

        title.textContent =
            "Delete Hero Slide?";

    }


    /* =====================================
       MESSAGE
    ===================================== */

    const modalMessage =
        modal.querySelector(
            ".delete-confirm-content p"
        );


    if (modalMessage) {

        modalMessage.textContent =
            "Are you sure you want to delete this hero slide? This action cannot be undone.";

    }


    /* =====================================
       BUTTON
    ===================================== */

    confirmButton.textContent =
        "Delete Slide";


    /* =====================================
       SHOW MODAL
    ===================================== */

    modal.hidden = false;

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    /* =====================================
       CONFIRM DELETE
    ===================================== */

    confirmButton.onclick =
        async function () {

            /*
             * Remove focus before hiding
             * the modal.
             */

            confirmButton.blur();


            modal.hidden = true;

            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            await performAdminHeroSlideDelete(
                heroSlideId
            );

        };

}

/* =========================================
   PERFORM HERO SLIDE DELETE
========================================= */

async function performAdminHeroSlideDelete(
    heroSlideId
) {

    if (!heroSlideId) {

        heroSlideSaveMessage.textContent =
            "No hero slide was selected.";

        return;

    }


    deleteHeroSlideButton.disabled =
        true;

    deleteHeroSlideButton.textContent =
        "Deleting...";


    heroSlideSaveMessage.textContent =
        "Deleting hero slide...";


    try {

        console.log(
            "Deleting hero slide:",
            heroSlideId
        );


        const {
            error
        } = await kingdomAdminSupabase

            .from("hero_slides")

            .delete()

            .eq(
                "id",
                heroSlideId
            );


        if (error) {
            throw error;
        }


        console.log(
            "HERO SLIDE DELETED SUCCESSFULLY:",
            heroSlideId
        );


        heroSlideSaveMessage.textContent =
            "Hero slide deleted successfully.";


        editHeroSlideId.value = "";


        await loadHeroSlides();


        setTimeout(
            function () {

                closeHeroSlideEditor();

            },
            800
        );


    } catch (error) {

        console.error(
            "Error deleting hero slide:",
            error
        );


        heroSlideSaveMessage.textContent =
            error.message ||
            "Unable to delete hero slide.";


    } finally {

        deleteHeroSlideButton.disabled =
            false;

        deleteHeroSlideButton.textContent =
            "Delete Slide";

    }

}

/* =========================================
   ESCAPE HERO SLIDE HTML
========================================= */

function escapeHeroSlideHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}