/* =========================================
   AGBOR KINGDOM ADMIN
   MEDIA MANAGEMENT
========================================= */

console.log("Agbor Kingdom Media JS loaded");


/* =========================================
   ELEMENTS
========================================= */

const manageMediaButton =
    document.getElementById("manageMediaButton");

   const addMediaButton =
    document.getElementById(
        "addMediaButton"
    );

const adminMediaPanel =
    document.getElementById("adminMediaPanel");

const galleryMediaTab =
    document.getElementById("galleryMediaTab");

const videosMediaTab =
    document.getElementById("videosMediaTab");

const adminGalleryMediaContent =
    document.getElementById("adminGalleryMediaContent");

const adminVideosMediaContent =
    document.getElementById("adminVideosMediaContent");

const adminGalleryList =
    document.getElementById("adminGalleryList");

const adminGalleryCount =
    document.getElementById("adminGalleryCount");

    const adminMediaEditor =
    document.getElementById(
        "adminMediaEditor"
    );

const galleryEditorForm =
    document.getElementById(
        "galleryEditorForm"
    );

const editGalleryId =
    document.getElementById(
        "editGalleryId"
    );

const editGalleryTitle =
    document.getElementById(
        "editGalleryTitle"
    );

const editGalleryDescription =
    document.getElementById(
        "editGalleryDescription"
    );

const editGalleryCategory =
    document.getElementById(
        "editGalleryCategory"
    );

const editGalleryImage =
    document.getElementById(
        "editGalleryImage"
    );

const editGallerySortOrder =
    document.getElementById(
        "editGallerySortOrder"
    );

const editGalleryActive =
    document.getElementById(
        "editGalleryActive"
    );

const editGalleryHeading =
    document.getElementById(
        "editGalleryHeading"
    );

const editGalleryStatus =
    document.getElementById(
        "editGalleryStatus"
    );

const saveGalleryButton =
    document.getElementById(
        "saveGalleryButton"
    );

const deleteGalleryButton =
    document.getElementById(
        "deleteGalleryButton"
    );

const cancelGalleryButton =
    document.getElementById(
        "cancelGalleryButton"
    );

const gallerySaveMessage =
    document.getElementById(
        "gallerySaveMessage"
    );

    /* =========================================
   VIDEO ELEMENTS
========================================= */

const adminVideoEditor =
    document.getElementById(
        "adminVideoEditor"
    );

const videoEditorForm =
    document.getElementById(
        "videoEditorForm"
    );

const editVideoId =
    document.getElementById(
        "editVideoId"
    );

const editVideoTitle =
    document.getElementById(
        "editVideoTitle"
    );

const editVideoDescription =
    document.getElementById(
        "editVideoDescription"
    );

const editVideoCategory =
    document.getElementById(
        "editVideoCategory"
    );

const editVideoUrl =
    document.getElementById(
        "editVideoUrl"
    );

const editVideoThumbnail =
    document.getElementById(
        "editVideoThumbnail"
    );

const editVideoDuration =
    document.getElementById(
        "editVideoDuration"
    );

const editVideoPublishedAt =
    document.getElementById(
        "editVideoPublishedAt"
    );

const editVideoSortOrder =
    document.getElementById(
        "editVideoSortOrder"
    );

const editVideoPublished =
    document.getElementById(
        "editVideoPublished"
    );

const editVideoFeatured =
    document.getElementById(
        "editVideoFeatured"
    );

const editVideoHeading =
    document.getElementById(
        "editVideoHeading"
    );

const editVideoStatus =
    document.getElementById(
        "editVideoStatus"
    );

const saveVideoButton =
    document.getElementById(
        "saveVideoButton"
    );

const deleteVideoButton =
    document.getElementById(
        "deleteVideoButton"
    );

const cancelVideoButton =
    document.getElementById(
        "cancelVideoButton"
    );

const videoSaveMessage =
    document.getElementById(
        "videoSaveMessage"
    );


/* =========================================
   OPEN MEDIA MANAGEMENT
========================================= */

if (manageMediaButton) {

    manageMediaButton.addEventListener(
        "click",
        async function () {

            console.log("Manage Media clicked.");

            if (adminMediaPanel) {

                adminMediaPanel.hidden = false;

                adminMediaPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

            /* Load Gallery when Media opens */
            await loadGallery();

        }
    );

} else {

    console.error(
        "Manage Media button NOT FOUND."
    );

}
/* =========================================
   ADD MEDIA BUTTON
========================================= */

if (addMediaButton) {

    console.log(
        "Add Media button found."
    );

    addMediaButton.addEventListener(
        "click",
        function () {

            console.log(
                "Add Media clicked."
            );

            /*
             * If Gallery tab is active,
             * open Gallery editor.
             */

            if (
                galleryMediaTab &&
                galleryMediaTab.classList.contains("active")
            ) {

                openNewGalleryEditor();

                return;

            }




            /*
             * If Videos tab is active,
             * we will connect the Video
             * editor here next.
             */

            if (
                videosMediaTab &&
                videosMediaTab.classList.contains("active")
            ) {

                openNewVideoEditor();

                return;

            }

        }
    );

} else {

    console.error(
        "Add Media button NOT FOUND."
    );

}

/* =========================================
   GALLERY TAB
========================================= */

if (galleryMediaTab) {

    galleryMediaTab.addEventListener(
        "click",
        async function () {

            console.log("Gallery tab clicked.");

            galleryMediaTab.classList.add("active");

            videosMediaTab.classList.remove("active");

            adminGalleryMediaContent.hidden =
                false;

            adminVideosMediaContent.hidden =
                true;

            /* Reload gallery */
            await loadGallery();

        }
    );

}

/* =========================================
   VIDEOS TAB
========================================= */

if (videosMediaTab) {

    videosMediaTab.addEventListener(
        "click",
        async function () {

            console.log(
                "Videos tab clicked."
            );

            videosMediaTab.classList.add(
                "active"
            );

            galleryMediaTab.classList.remove(
                "active"
            );

            adminVideosMediaContent.hidden =
                false;

            adminGalleryMediaContent.hidden =
                true;

            /* Load videos */

            await loadVideos();

        }
    );

}


/* =========================================
   LOAD GALLERY
========================================= */

async function loadGallery() {

    if (!adminGalleryList) {
        console.error(
            "Admin Gallery list not found."
        );
        return;
    }


    /* Loading state */

    adminGalleryList.innerHTML = `
        <p class="admin-loading">
            Loading gallery images...
        </p>
    `;


    try {

        console.log(
            "Loading gallery from Supabase..."
        );


        const {
            data,
            error
        } = await kingdomAdminSupabase
            .from("gallery")
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
            "GALLERY:",
            data
        );


        renderGallery(
            data || []
        );


    } catch (error) {

        console.error(
            "Error loading gallery:",
            error
        );


        adminGalleryList.innerHTML = `
            <div class="admin-no-news">
                <p>
                    Unable to load gallery.
                </p>
            </div>
        `;

        if (adminGalleryCount) {

            adminGalleryCount.textContent =
                "0 images";

        }

    }

}

/* =========================================
   LOAD VIDEOS
========================================= */

async function loadVideos() {

    const adminVideoList =
        document.getElementById(
            "adminVideoList"
        );

    const adminVideoCount =
        document.getElementById(
            "adminVideoCount"
        );


    if (!adminVideoList) {

        console.error(
            "Admin Video list not found."
        );

        return;

    }


    /* Loading state */

    adminVideoList.innerHTML = `
        <p class="admin-loading">
            Loading videos...
        </p>
    `;


    try {

        console.log(
            "Loading videos from Supabase..."
        );


        const {
            data,
            error
        } = await kingdomAdminSupabase

            .from("videos")

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
            "VIDEOS:",
            data
        );


        renderVideos(
            data || []
        );


    } catch (error) {

        console.error(
            "Error loading videos:",
            error
        );


        adminVideoList.innerHTML = `
            <div class="admin-no-news">
                <p>
                    Unable to load videos.
                </p>
            </div>
        `;


        if (adminVideoCount) {

            adminVideoCount.textContent =
                "0 videos";

        }

    }

}

/* =========================================
   RENDER VIDEOS
========================================= */

function renderVideos(videos) {

    const adminVideoList =
        document.getElementById(
            "adminVideoList"
        );

    const adminVideoCount =
        document.getElementById(
            "adminVideoCount"
        );


    if (!adminVideoList) {

        return;

    }


    /* =====================================
       COUNT
    ===================================== */

    if (adminVideoCount) {

        adminVideoCount.textContent =
            `${videos.length} ${
                videos.length === 1
                    ? "video"
                    : "videos"
            }`;

    }


    /* =====================================
       EMPTY
    ===================================== */

    if (!videos.length) {

        adminVideoList.innerHTML = `
            <div class="admin-no-news">
                <p>
                    No videos found.
                </p>
            </div>
        `;

        return;

    }


    /* =====================================
       CLEAR LIST
    ===================================== */

    adminVideoList.innerHTML = "";


    /* =====================================
       CREATE VIDEO ITEMS
    ===================================== */

    videos.forEach(
        function (video, index) {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "admin-media-card";


            item.dataset.videoId =
                video.id;


            const thumbnail =
                video.thumbnail_url ||
                "";


            item.innerHTML = `

                <div class="admin-media-card-image">

                    ${
                        thumbnail

                        ? `

                            <img
                                src="${escapeMediaHTML(
                                    thumbnail
                                )}"
                                alt="${escapeMediaHTML(
                                    video.title
                                )}"
                                loading="lazy"
                            >

                        `

                        : `

                            <div class="admin-media-video-placeholder">
                                VIDEO
                            </div>

                        `
                    }

                </div>


                <div class="admin-media-card-body">

                    <span class="admin-news-number">
                        ${String(
                            index + 1
                        ).padStart(2, "0")}
                    </span>


                    <div class="admin-news-content">

                        <div class="admin-news-category">

                            ${escapeMediaHTML(
                                video.category ||
                                "KINGDOM"
                            )}

                        </div>


                        <h4>

                            ${escapeMediaHTML(
                                video.title
                            )}

                        </h4>


                        ${
                            video.duration

                            ? `

                                <p>
                                    ${escapeMediaHTML(
                                        video.duration
                                    )}
                                </p>

                            `

                            : ""
                        }

                    </div>


                    <div class="admin-editor-status ${
                        video.is_published
                            ? "active"
                            : ""
                    }">

                        ${
                            video.is_published
                                ? "Published"
                                : "Unpublished"
                        }

                    </div>

                </div>

            `;


            adminVideoList.appendChild(
                item
            );


            /* =================================
               CLICK VIDEO
               Editor comes next
            ================================= */

            item.addEventListener(
                "click",
                function () {

                    openVideoEditor(
                        video
                    );

                }
            );

        }
    );

}
/* =========================================
   OPEN VIDEO EDITOR
========================================= */

function openVideoEditor(video) {

    console.log(
        "Opening video editor:",
        video
    );


    /* =====================================
       BASIC INFORMATION
    ===================================== */

    editVideoId.value =
        video.id || "";

    editVideoTitle.value =
        video.title || "";

    editVideoDescription.value =
        video.description || "";

    editVideoCategory.value =
        video.category || "KINGDOM";


    /* =====================================
       VIDEO URL
    ===================================== */

    editVideoUrl.value =
        video.video_url || "";


    /* =====================================
       THUMBNAIL
    ===================================== */

    editVideoThumbnail.value =
        video.thumbnail_url || "";


    /* =====================================
       DURATION
    ===================================== */

    editVideoDuration.value =
        video.duration || "";


    /* =====================================
       PUBLISHED DATE
    ===================================== */

    if (video.published_at) {

        const publishedDate =
            new Date(video.published_at);

        if (
            !isNaN(
                publishedDate.getTime()
            )
        ) {

            /*
             * datetime-local expects:
             * YYYY-MM-DDTHH:mm
             */

            const year =
                publishedDate.getFullYear();

            const month =
                String(
                    publishedDate.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    publishedDate.getDate()
                ).padStart(2, "0");

            const hours =
                String(
                    publishedDate.getHours()
                ).padStart(2, "0");

            const minutes =
                String(
                    publishedDate.getMinutes()
                ).padStart(2, "0");

            editVideoPublishedAt.value =
                `${year}-${month}-${day}T${hours}:${minutes}`;

        } else {

            editVideoPublishedAt.value =
                "";

        }

    } else {

        editVideoPublishedAt.value =
            "";

    }


    /* =====================================
       SORT ORDER
    ===================================== */

    editVideoSortOrder.value =
        video.sort_order ?? 0;


    /* =====================================
       PUBLISHED
    ===================================== */

    editVideoPublished.checked =
        video.is_published === true;


    /* =====================================
       FEATURED
    ===================================== */

    editVideoFeatured.checked =
        video.is_featured === true;


    /* =====================================
       EDITOR HEADER
    ===================================== */

    editVideoHeading.textContent =
        "Edit Video";


    editVideoStatus.textContent =
        video.is_published
            ? "Published Video"
            : "Unpublished Video";


    /* =====================================
       BUTTONS
    ===================================== */

    saveVideoButton.textContent =
        "Save Changes";

    deleteVideoButton.hidden =
        false;


    /* =====================================
       CLEAR MESSAGE
    ===================================== */

    videoSaveMessage.textContent =
        "";


    /* =====================================
       SHOW EDITOR
    ===================================== */

    adminVideoEditor.hidden =
        false;


    /* =====================================
       SCROLL TO EDITOR
    ===================================== */

    adminVideoEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

/* =========================================
   CANCEL VIDEO EDITOR
========================================= */

if (cancelVideoButton) {

    cancelVideoButton.addEventListener(
        "click",
        function () {

            closeVideoEditor();

        }
    );

}

/* =========================================
   CLOSE VIDEO EDITOR
========================================= */

function closeVideoEditor() {

    if (adminVideoEditor) {

        adminVideoEditor.hidden =
            true;

    }


    if (videoEditorForm) {

        videoEditorForm.reset();

    }


    editVideoId.value = "";

    videoSaveMessage.textContent = "";

}

/* =========================================
   SAVE / CREATE VIDEO
========================================= */

if (videoEditorForm) {

    videoEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const videoId =
                editVideoId.value.trim();

                


            /* =====================================
               COLLECT FORM DATA
            ===================================== */

            const videoData = {

                title:
                    editVideoTitle.value.trim(),

                description:
                    editVideoDescription.value.trim()
                    || null,

                category:
                    editVideoCategory.value.trim()
                    || "KINGDOM",

                video_url:
                    editVideoUrl.value.trim(),

                thumbnail_url:
                    editVideoThumbnail.value.trim()
                    || null,

                duration:
                    editVideoDuration.value.trim()
                    || null,

                sort_order:
                    Number(
                        editVideoSortOrder.value
                    ) || 0,

                is_published:
                    editVideoPublished.checked,

                is_featured:
                    editVideoFeatured.checked

            };


            /* =====================================
               PUBLISHED DATE
            ===================================== */

            const publishedDate =
                editVideoPublishedAt.value.trim();


            if (publishedDate) {

                videoData.published_at =
                    new Date(
                        publishedDate
                    ).toISOString();

            } else {

                videoData.published_at =
                    null;

            }


            /* =====================================
               VALIDATION
            ===================================== */

            if (!videoData.title) {

                videoSaveMessage.textContent =
                    "Please enter a video title.";

                return;

            }


            if (!videoData.video_url) {

                videoSaveMessage.textContent =
                    "Please enter a video URL.";

                return;

            }


            /* =====================================
               BUTTON STATE
            ===================================== */

            saveVideoButton.disabled =
                true;

            saveVideoButton.textContent =
                "Saving...";

            videoSaveMessage.textContent =
                "";


            try {

                let result;


                /* =================================
                   UPDATE EXISTING VIDEO
                ================================= */

                if (videoId) {

                    console.log(
                        "Updating video:",
                        videoId
                    );


                    result =
                        await kingdomAdminSupabase

                            .from("videos")

                            .update(
                                videoData
                            )

                            .eq(
                                "id",
                                videoId
                            );

                }


                /* =================================
                   CREATE NEW VIDEO
                ================================= */

                else {

                    console.log(
                        "Creating new video..."
                    );


                    result =
                        await kingdomAdminSupabase

                            .from("videos")

                            .insert([
                                videoData
                            ]);

                }


                /* =================================
                   CHECK ERROR
                ================================= */

                if (result.error) {

                    throw result.error;

                }


                console.log(
                    videoId
                        ? "VIDEO UPDATED:"
                        : "VIDEO CREATED:",
                    result.data
                );


                /* =================================
                   SUCCESS MESSAGE
                ================================= */

                videoSaveMessage.textContent =
                    videoId
                        ? "Video updated successfully."
                        : "Video created successfully.";


                /* =================================
                   RELOAD VIDEOS
                ================================= */

                await loadVideos();


                /* =================================
                   CLOSE EDITOR
                ================================= */

                setTimeout(
                    function () {

                        closeVideoEditor();

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Error saving video:",
                    error
                );


                videoSaveMessage.textContent =
                    error.message ||
                    "Unable to save video.";


            } finally {

                saveVideoButton.disabled =
                    false;


                saveVideoButton.textContent =
                    videoId
                        ? "Save Changes"
                        : "Create Video";

            }

        }
    );

}

/* =========================================
   VIDEO DELETE BUTTON
========================================= */

if (deleteVideoButton) {

    deleteVideoButton.addEventListener(
        "click",
        function () {

            const videoId =
                editVideoId.value.trim();


            if (!videoId) {

                videoSaveMessage.textContent =
                    "No video selected.";

                return;

            }


            showVideoDeleteConfirmation(
                videoId
            );

        }
    );

}

/* =========================================
   VIDEO DELETE CONFIRMATION
========================================= */

function showVideoDeleteConfirmation(
    videoId
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
       MODAL TITLE
    ===================================== */

    if (title) {

        title.textContent =
            "Delete Video?";

    }


    /* =====================================
       MODAL MESSAGE
    ===================================== */

    const modalMessage =
        modal.querySelector(
            ".delete-confirm-content p"
        );


    if (modalMessage) {

        modalMessage.textContent =
            "Are you sure you want to delete this video? This action cannot be undone.";

    }


    /* =====================================
       BUTTON TEXT
    ===================================== */

    confirmButton.textContent =
        "Delete Video";


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
             * IMPORTANT:
             *
             * Remove focus before hiding
             * the modal.
             *
             * This prevents the browser
             * aria-hidden warning.
             */

            confirmButton.blur();


            modal.hidden = true;

            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            await performAdminVideoDelete(
                videoId
            );

        };

}

/* =========================================
   PERFORM VIDEO DELETE
========================================= */

async function performAdminVideoDelete(
    videoId
) {

    if (!videoId) {

        videoSaveMessage.textContent =
            "No video was selected.";

        return;

    }


    /* =====================================
       BUTTON STATE
    ===================================== */

    deleteVideoButton.disabled =
        true;

    deleteVideoButton.textContent =
        "Deleting...";


    videoSaveMessage.textContent =
        "Deleting video...";


    try {

        console.log(
            "Deleting video:",
            videoId
        );


        /* =================================
           DELETE FROM SUPABASE
        ================================= */

        const {
            error
        } = await kingdomAdminSupabase

            .from("videos")

            .delete()

            .eq(
                "id",
                videoId
            );


        if (error) {

            throw error;

        }


        console.log(
            "VIDEO DELETED SUCCESSFULLY:",
            videoId
        );


        /* =================================
           SUCCESS MESSAGE
        ================================= */

        videoSaveMessage.textContent =
            "Video deleted successfully.";


        /* =================================
           CLEAR SELECTED VIDEO
        ================================= */

        editVideoId.value = "";


        /* =================================
           RELOAD VIDEOS
        ================================= */

        await loadVideos();


        /* =================================
           CLOSE EDITOR
        ================================= */

        setTimeout(
            function () {

                closeVideoEditor();

            },
            800
        );


    } catch (error) {

        console.error(
            "Error deleting video:",
            error
        );


        videoSaveMessage.textContent =
            error.message ||
            "Unable to delete video.";


    } finally {

        deleteVideoButton.disabled =
            false;

        deleteVideoButton.textContent =
            "Delete Video";

    }

}

/* =========================================
   NEW VIDEO EDITOR
========================================= */

function openNewVideoEditor() {

    if (videoEditorForm) {

        videoEditorForm.reset();

    }


    /* Clear ID */

    editVideoId.value = "";


    /* Defaults */

    editVideoCategory.value =
        "KINGDOM";

    editVideoSortOrder.value =
        0;

    editVideoPublished.checked =
        false;

    editVideoFeatured.checked =
        false;


    /* Clear published date */

    editVideoPublishedAt.value =
        "";


    /* Editor heading */

    editVideoHeading.textContent =
        "Add Video";


    editVideoStatus.textContent =
        "New Video";


    /* Buttons */

    saveVideoButton.textContent =
        "Create Video";

    deleteVideoButton.hidden =
        true;


    /* Clear message */

    videoSaveMessage.textContent =
        "";


    /* Show editor */

    adminVideoEditor.hidden =
        false;


    adminVideoEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

/* =========================================
   RENDER GALLERY
========================================= */

function renderGallery(gallery) {

    if (!adminGalleryList) {
        return;
    }


    /* =====================================
       COUNT
    ===================================== */

    if (adminGalleryCount) {

        adminGalleryCount.textContent =
            `${gallery.length} ${
                gallery.length === 1
                    ? "image"
                    : "images"
            }`;

    }


    /* =====================================
       EMPTY
    ===================================== */

    if (!gallery.length) {

        adminGalleryList.innerHTML = `
            <div class="admin-no-news">
                <p>
                    No gallery images found.
                </p>
            </div>
        `;

        return;

    }


    /* =====================================
       CLEAR LIST
    ===================================== */

    adminGalleryList.innerHTML = "";


    /* =====================================
       CREATE GALLERY ITEMS
    ===================================== */

    gallery.forEach(
        function (image, index) {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "admin-media-card";


            item.dataset.galleryId =
                image.id;


            item.innerHTML = `

                <div class="admin-media-card-image">

                    <img
                        src="${escapeMediaHTML(
                            image.image_url
                        )}"
                        alt="${escapeMediaHTML(
                            image.title
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
        ${escapeMediaHTML(
            image.category || "HERITAGE"
        )}
    </div>

    <h4>
        ${escapeMediaHTML(
            image.title
        )}
    </h4>

</div>
                    


                    <div
                        class="admin-editor-status ${
                            image.is_active
                                ? "active"
                                : ""
                        }"
                    >
                        ${
                            image.is_active
                                ? "Active"
                                : "Inactive"
                        }
                    </div>

                </div>

            `;


            adminGalleryList.appendChild(
                item
            );


            /* =================================
               CLICK IMAGE
               Editor will be connected later
            ================================= */

           item.addEventListener(
    "click",
    function () {

        openGalleryEditor(image);

    }
);

        }
    );

}

/* =========================================
   NEW GALLERY EDITOR
========================================= */

function openNewGalleryEditor() {

    galleryEditorForm.reset();

    editGalleryId.value = "";

    editGallerySortOrder.value = 0;

    editGalleryActive.checked = true;

    editGalleryHeading.textContent =
        "Create Gallery Image";

    editGalleryStatus.textContent =
        "New Image";

    saveGalleryButton.textContent =
        "Create Image";

    deleteGalleryButton.hidden = true;

    gallerySaveMessage.textContent = "";

    adminMediaEditor.hidden = false;

    adminMediaEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

/* =========================================
   OPEN GALLERY EDITOR
========================================= */

function openGalleryEditor(image) {

    console.log(
        "Opening gallery editor:",
        image
    );


    editGalleryId.value =
        image.id || "";

    editGalleryTitle.value =
        image.title || "";

    editGalleryDescription.value =
        image.description || "";

    editGalleryCategory.value =
        image.category || "";

    editGalleryImage.value =
        image.image_url || "";

    editGallerySortOrder.value =
        image.sort_order ?? 0;

    editGalleryActive.checked =
        image.is_active !== false;


    editGalleryHeading.textContent =
        "Edit Gallery Image";

    editGalleryStatus.textContent =
        image.is_active
            ? "Active Image"
            : "Inactive Image";


    saveGalleryButton.textContent =
        "Save Changes";

    deleteGalleryButton.hidden =
        false;

    gallerySaveMessage.textContent =
        "";


    adminMediaEditor.hidden =
        false;


    adminMediaEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

if (cancelGalleryButton) {

    cancelGalleryButton.addEventListener(
        "click",
        function () {

            closeGalleryEditor();

        }
    );

}

/* =========================================
   SAVE / CREATE GALLERY
========================================= */

if (galleryEditorForm) {

    galleryEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const galleryId =
                editGalleryId.value.trim();

            const galleryData = {
                title: editGalleryTitle.value.trim(),
                description:
                    editGalleryDescription.value.trim() || null,
                category:
                    editGalleryCategory.value.trim() || "HERITAGE",
                image_url:
                    editGalleryImage.value.trim(),
                sort_order:
                    Number(editGallerySortOrder.value) || 0,
                is_active:
                    editGalleryActive.checked
            };

            if (!galleryData.title) {
                gallerySaveMessage.textContent =
                    "Please enter an image title.";
                return;
            }

            if (!galleryData.image_url) {
                gallerySaveMessage.textContent =
                    "Please enter an image URL.";
                return;
            }

            saveGalleryButton.disabled = true;
            saveGalleryButton.textContent = "Saving...";

            gallerySaveMessage.textContent = "";

            try {

                

                let result;

                /* UPDATE IMAGE */

                if (galleryId) {

                    result = await kingdomAdminSupabase
                        .from("gallery")
                        .update(galleryData)
                        .eq("id", galleryId);

                }

                /* CREATE IMAGE */
                else {
const { data: sessionData, error: sessionError } =
    await kingdomAdminSupabase.auth.getSession();

console.log(
    "SESSION:",
    sessionData.session
);

console.log(
    "ACCESS TOKEN EXISTS:",
    !!sessionData.session?.access_token
);

const { data: userData, error: userError } =
    await kingdomAdminSupabase.auth.getUser();

console.log(
    "USER:",
    userData.user
);

console.log(
    "USER ERROR:",
    userError
);

    result = await kingdomAdminSupabase
        .from("gallery")
        .insert([galleryData]);

}

                if (result.error) throw result.error;

                gallerySaveMessage.textContent =
                    galleryId
                        ? "Gallery image updated successfully."
                        : "Gallery image created successfully.";

                await loadGallery();

                setTimeout(() => {
                    closeGalleryEditor();
                }, 800);

            } catch (error) {

                console.error(
                    "Error saving gallery:",
                    error
                );

                gallerySaveMessage.textContent =
                    error.message ||
                    "Unable to save gallery image.";

            } finally {

                saveGalleryButton.disabled = false;

                saveGalleryButton.textContent =
                    galleryId
                        ? "Save Changes"
                        : "Create Image";

            }

        }
    );

}
/* =========================================
   GALLERY DELETE BUTTON
========================================= */

if (deleteGalleryButton) {

    deleteGalleryButton.addEventListener(
        "click",
        function () {

            const galleryId =
                editGalleryId.value.trim();


            if (!galleryId) {

                gallerySaveMessage.textContent =
                    "No gallery image selected.";

                return;

            }


            showGalleryDeleteConfirmation(
                galleryId
            );

        }
    );

}

/* =========================================
   GALLERY DELETE CONFIRMATION
========================================= */

function showGalleryDeleteConfirmation(
    galleryId
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
       MODAL TITLE
    ===================================== */

    if (title) {

        title.textContent =
            "Delete Gallery Image?";

    }


    /* =====================================
       MODAL MESSAGE
    ===================================== */

    const modalMessage =
        modal.querySelector(
            ".delete-confirm-content p"
        );


    if (modalMessage) {

        modalMessage.textContent =
            "Are you sure you want to delete this gallery image? This action cannot be undone.";

    }


    /* =====================================
       BUTTON TEXT
    ===================================== */

    confirmButton.textContent =
        "Delete Image";


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
             * Remove focus BEFORE hiding
             * the modal.
             *
             * This prevents the
             * aria-hidden warning we
             * previously encountered.
             */

            confirmButton.blur();


            modal.hidden = true;

            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            await performAdminGalleryDelete(
                galleryId
            );

        };

}

/* =========================================
   PERFORM GALLERY DELETE
========================================= */

async function performAdminGalleryDelete(
    galleryId
) {

    if (!galleryId) {

        gallerySaveMessage.textContent =
            "No gallery image was selected.";

        return;

    }


    deleteGalleryButton.disabled =
        true;

    deleteGalleryButton.textContent =
        "Deleting...";


    gallerySaveMessage.textContent =
        "Deleting gallery image...";


    try {

        console.log(
            "Deleting gallery image:",
            galleryId
        );


        const {
            error
        } = await kingdomAdminSupabase

            .from("gallery")

            .delete()

            .eq(
                "id",
                galleryId
            );


        if (error) {
            throw error;
        }


        console.log(
            "GALLERY DELETED SUCCESSFULLY:",
            galleryId
        );


        gallerySaveMessage.textContent =
            "Gallery image deleted successfully.";


        /* =================================
           CLEAR ID
        ================================= */

        editGalleryId.value = "";


        /* =================================
           RELOAD GALLERY
        ================================= */

        await loadGallery();


        /* =================================
           CLOSE EDITOR
        ================================= */

        setTimeout(
            function () {

                closeGalleryEditor();

            },
            800
        );


    } catch (error) {

        console.error(
            "Error deleting gallery image:",
            error
        );


        gallerySaveMessage.textContent =
            error.message ||
            "Unable to delete gallery image.";


    } finally {

        deleteGalleryButton.disabled =
            false;

        deleteGalleryButton.textContent =
            "Delete Image";

    }

}



function closeGalleryEditor() {

    if (adminMediaEditor) {

        adminMediaEditor.hidden =
            true;

    }

    if (galleryEditorForm) {

        galleryEditorForm.reset();

    }

    editGalleryId.value = "";

    gallerySaveMessage.textContent = "";

}

/* =========================================
   ESCAPE HTML
========================================= */

function escapeMediaHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}