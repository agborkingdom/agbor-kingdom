/* =========================================
   AGBOR KINGDOM ADMIN
   KINGDOM PUBLICATIONS MANAGEMENT
========================================= */

console.log("Agbor Kingdom Publications JS loaded");


/* =========================================
   ELEMENTS
========================================= */

const managePublicationsButton =
    document.getElementById(
        "managePublicationsButton"
    );

const addPublicationButton =
    document.getElementById(
        "addPublicationButton"
    );

const adminPublicationsPanel =
    document.getElementById(
        "adminPublicationsPanel"
    );

const adminPublicationsList =
    document.getElementById(
        "adminPublicationsList"
    );

const adminPublicationsCount =
    document.getElementById(
        "adminPublicationsCount"
    );


/* =========================================
   PUBLICATION EDITOR ELEMENTS
========================================= */

const adminPublicationEditor =
    document.getElementById(
        "adminPublicationEditor"
    );

const publicationEditorForm =
    document.getElementById(
        "publicationEditorForm"
    );

const editPublicationId =
    document.getElementById(
        "editPublicationId"
    );

const editPublicationTitle =
    document.getElementById(
        "editPublicationTitle"
    );

const editPublicationDescription =
    document.getElementById(
        "editPublicationDescription"
    );

const editPublicationCategory =
    document.getElementById(
        "editPublicationCategory"
    );

const editPublicationAuthor =
    document.getElementById(
        "editPublicationAuthor"
    );

const editPublicationDate =
    document.getElementById(
        "editPublicationDate"
    );

const editPublicationCoverImage =
    document.getElementById(
        "editPublicationCoverImage"
    );

const editPublicationFile =
    document.getElementById(
        "editPublicationFile"
    );

const editPublicationSortOrder =
    document.getElementById(
        "editPublicationSortOrder"
    );

const editPublicationActive =
    document.getElementById(
        "editPublicationActive"
    );

const editPublicationHeading =
    document.getElementById(
        "editPublicationHeading"
    );

const editPublicationStatus =
    document.getElementById(
        "editPublicationStatus"
    );

const savePublicationButton =
    document.getElementById(
        "savePublicationButton"
    );

const deletePublicationButton =
    document.getElementById(
        "deletePublicationButton"
    );

const cancelPublicationButton =
    document.getElementById(
        "cancelPublicationButton"
    );

const publicationSaveMessage =
    document.getElementById(
        "publicationSaveMessage"
    );


/* =========================================
   OPEN PUBLICATIONS MANAGEMENT
========================================= */

if (managePublicationsButton) {

    managePublicationsButton.addEventListener(
        "click",
        async function () {

            console.log(
                "Manage Publications clicked."
            );


            if (adminPublicationsPanel) {

                adminPublicationsPanel.hidden =
                    false;

                adminPublicationsPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }


            await loadPublications();

        }
    );

} else {

    console.error(
        "Manage Publications button NOT FOUND."
    );

}


/* =========================================
   ADD PUBLICATION
========================================= */

if (addPublicationButton) {

    addPublicationButton.addEventListener(
        "click",
        function () {

            console.log(
                "Add Publication clicked."
            );

            openNewPublicationEditor();

        }
    );

}


/* =========================================
   LOAD PUBLICATIONS
========================================= */

async function loadPublications() {

    if (!adminPublicationsList) {

        console.error(
            "Admin Publications list not found."
        );

        return;

    }


    adminPublicationsList.innerHTML = `
        <p class="admin-loading">
            Loading publications...
        </p>
    `;


    try {

        console.log(
            "Loading publications from Supabase..."
        );


        const {
            data,
            error
        } = await kingdomAdminSupabase

            .from("publications")

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
            "PUBLICATIONS:",
            data
        );


        renderPublications(
            data || []
        );


    } catch (error) {

        console.error(
            "Error loading publications:",
            error
        );


        adminPublicationsList.innerHTML = `
            <div class="admin-no-news">

                <p>
                    Unable to load publications.
                </p>

            </div>
        `;


        if (adminPublicationsCount) {

            adminPublicationsCount.textContent =
                "0 publications";

        }

    }

}


/* =========================================
   RENDER PUBLICATIONS
========================================= */

function renderPublications(publications) {

    if (!adminPublicationsList) {

        return;

    }


    if (adminPublicationsCount) {

        adminPublicationsCount.textContent =
            `${publications.length} ${
                publications.length === 1
                    ? "publication"
                    : "publications"
            }`;

    }


    if (!publications.length) {

        adminPublicationsList.innerHTML = `
            <div class="admin-no-news">

                <p>
                    No publications found.
                </p>

            </div>
        `;

        return;

    }


    adminPublicationsList.innerHTML = "";


    publications.forEach(
        function (publication, index) {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "admin-media-card";


            item.dataset.publicationId =
                publication.id;


            item.innerHTML = `

                <div class="admin-media-card-image">

                    ${
                        publication.cover_image_url

                            ? `

                                <img
                                    src="${escapePublicationHTML(
                                        publication.cover_image_url
                                    )}"
                                    alt="${escapePublicationHTML(
                                        publication.title
                                    )}"
                                    loading="lazy"
                                >

                              `

                            : `

                                <div class="admin-media-placeholder">

                                    <span>
                                        PUBLICATION
                                    </span>

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

                        ${
                            publication.category

                                ? `

                                    <div class="admin-news-category">

                                        ${escapePublicationHTML(
                                            publication.category
                                        )}

                                    </div>

                                  `

                                : ""

                        }


                        <h4>

                            ${escapePublicationHTML(
                                publication.title
                            )}

                        </h4>


                        ${
                            publication.author

                                ? `

                                    <p>

                                        By ${escapePublicationHTML(
                                            publication.author
                                        )}

                                    </p>

                                  `

                                : ""

                        }


                        ${
                            publication.publication_date

                                ? `

                                    <small>

                                        ${formatPublicationDate(
                                            publication.publication_date
                                        )}

                                    </small>

                                  `

                                : ""

                        }

                    </div>


                    <div
                        class="admin-editor-status ${
                            publication.is_active
                                ? "active"
                                : ""
                        }"
                    >

                        ${
                            publication.is_active
                                ? "Active"
                                : "Inactive"
                        }

                    </div>

                </div>

            `;


            adminPublicationsList.appendChild(
                item
            );


            /* =================================
               CLICK → EDIT
            ================================= */

            item.addEventListener(
                "click",
                function () {

                    openPublicationEditor(
                        publication
                    );

                }
            );

        }
    );

}


/* =========================================
   OPEN NEW PUBLICATION EDITOR
========================================= */

function openNewPublicationEditor() {

    console.log(
        "Opening new publication editor."
    );


    if (publicationEditorForm) {

        publicationEditorForm.reset();

    }


    editPublicationId.value =
        "";


    editPublicationSortOrder.value =
        0;


    editPublicationActive.checked =
        true;


    editPublicationHeading.textContent =
        "Create Publication";


    editPublicationStatus.textContent =
        "New Publication";


    savePublicationButton.textContent =
        "Create Publication";


    deletePublicationButton.hidden =
        true;


    publicationSaveMessage.textContent =
        "";


    adminPublicationEditor.hidden =
        false;


    adminPublicationEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   OPEN EXISTING PUBLICATION
========================================= */

function openPublicationEditor(
    publication
) {

    console.log(
        "Opening publication editor:",
        publication
    );


    editPublicationId.value =
        publication.id || "";


    editPublicationTitle.value =
        publication.title || "";


    editPublicationDescription.value =
        publication.description || "";


    editPublicationCategory.value =
        publication.category || "";


    editPublicationAuthor.value =
        publication.author || "";


    editPublicationDate.value =
        publication.publication_date || "";


    editPublicationCoverImage.value =
        publication.cover_image_url || "";


    editPublicationFile.value =
        publication.file_url || "";


    editPublicationSortOrder.value =
        publication.sort_order ?? 0;


    editPublicationActive.checked =
        publication.is_active !== false;


    editPublicationHeading.textContent =
        "Edit Publication";


    editPublicationStatus.textContent =
        publication.is_active
            ? "Active Publication"
            : "Inactive Publication";


    savePublicationButton.textContent =
        "Save Changes";


    deletePublicationButton.hidden =
        false;


    publicationSaveMessage.textContent =
        "";


    adminPublicationEditor.hidden =
        false;


    adminPublicationEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   SAVE / CREATE / UPDATE
========================================= */

if (publicationEditorForm) {

    publicationEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const publicationId =
                editPublicationId.value.trim();


            const publicationData = {

                title:
                    editPublicationTitle.value.trim(),

                description:
                    editPublicationDescription.value.trim()
                    || null,

                category:
                    editPublicationCategory.value.trim()
                    || null,

                author:
                    editPublicationAuthor.value.trim()
                    || null,

                publication_date:
                    editPublicationDate.value
                    || null,

                cover_image_url:
                    editPublicationCoverImage.value.trim()
                    || null,

                file_url:
                    editPublicationFile.value.trim()
                    || null,

                sort_order:
                    Number(
                        editPublicationSortOrder.value
                    ) || 0,

                is_active:
                    editPublicationActive.checked

            };


            /* =================================
               VALIDATION
            ================================= */

            if (!publicationData.title) {

                publicationSaveMessage.textContent =
                    "Please enter a publication title.";

                return;

            }


            savePublicationButton.disabled =
                true;


            savePublicationButton.textContent =
                "Saving...";


            publicationSaveMessage.textContent =
                "";


            try {

                let result;


                /* ==============================
                   UPDATE
                ============================== */

                if (publicationId) {

                    console.log(
                        "Updating publication:",
                        publicationId
                    );


                    result =
                        await kingdomAdminSupabase

                            .from("publications")

                            .update(
                                publicationData
                            )

                            .eq(
                                "id",
                                publicationId
                            );

                }


                /* ==============================
                   CREATE
                ============================== */

                else {

                    console.log(
                        "Creating publication..."
                    );


                    result =
                        await kingdomAdminSupabase

                            .from("publications")

                            .insert([
                                publicationData
                            ]);

                }


                if (result.error) {

                    throw result.error;

                }


                console.log(
                    "PUBLICATION SAVED SUCCESSFULLY"
                );


                publicationSaveMessage.textContent =
                    publicationId
                        ? "Publication updated successfully."
                        : "Publication created successfully.";


                await loadPublications();


                setTimeout(
                    function () {

                        closePublicationEditor();

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Error saving publication:",
                    error
                );


                publicationSaveMessage.textContent =
                    error.message ||
                    "Unable to save publication.";

            } finally {

                savePublicationButton.disabled =
                    false;


                savePublicationButton.textContent =
                    publicationId
                        ? "Save Changes"
                        : "Create Publication";

            }

        }
    );

}


/* =========================================
   CANCEL
========================================= */

if (cancelPublicationButton) {

    cancelPublicationButton.addEventListener(
        "click",
        function () {

            closePublicationEditor();

        }
    );

}


/* =========================================
   CLOSE EDITOR
========================================= */

function closePublicationEditor() {

    if (adminPublicationEditor) {

        adminPublicationEditor.hidden =
            true;

    }


    if (publicationEditorForm) {

        publicationEditorForm.reset();

    }


    editPublicationId.value =
        "";


    publicationSaveMessage.textContent =
        "";

}


/* =========================================
   DELETE BUTTON
========================================= */

if (deletePublicationButton) {

    deletePublicationButton.addEventListener(
        "click",
        function () {

            const publicationId =
                editPublicationId.value.trim();


            if (!publicationId) {

                publicationSaveMessage.textContent =
                    "No publication selected.";

                return;

            }


            showPublicationDeleteConfirmation(
                publicationId
            );

        }
    );

}


/* =========================================
   DELETE CONFIRMATION MODAL
========================================= */

function showPublicationDeleteConfirmation(
    publicationId
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
            "Delete Publication?";

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
            "Are you sure you want to delete this publication? This action cannot be undone.";

    }


    /* =====================================
       BUTTON
    ===================================== */

    confirmButton.textContent =
        "Delete Publication";


    /* =====================================
       SHOW MODAL
    ===================================== */

    modal.hidden =
        false;


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
             * This prevents the aria-hidden
             * accessibility warning.
             */

            confirmButton.blur();


            modal.hidden =
                true;


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            await performPublicationDelete(
                publicationId
            );

        };

}


/* =========================================
   PERFORM DELETE
========================================= */

async function performPublicationDelete(
    publicationId
) {

    if (!publicationId) {

        publicationSaveMessage.textContent =
            "No publication was selected.";

        return;

    }


    deletePublicationButton.disabled =
        true;


    deletePublicationButton.textContent =
        "Deleting...";


    publicationSaveMessage.textContent =
        "Deleting publication...";


    try {

        console.log(
            "Deleting publication:",
            publicationId
        );


        const {
            error
        } = await kingdomAdminSupabase

            .from("publications")

            .delete()

            .eq(
                "id",
                publicationId
            );


        if (error) {

            throw error;

        }


        console.log(
            "PUBLICATION DELETED SUCCESSFULLY:",
            publicationId
        );


        publicationSaveMessage.textContent =
            "Publication deleted successfully.";


        editPublicationId.value =
            "";


        await loadPublications();


        setTimeout(
            function () {

                closePublicationEditor();

            },
            800
        );


    } catch (error) {

        console.error(
            "Error deleting publication:",
            error
        );


        publicationSaveMessage.textContent =
            error.message ||
            "Unable to delete publication.";

    } finally {

        deletePublicationButton.disabled =
            false;


        deletePublicationButton.textContent =
            "Delete Publication";

    }

}


/* =========================================
   DATE FORMATTER
========================================= */

function formatPublicationDate(date) {

    if (!date) {

        return "";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return date;

    }


    return parsedDate.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapePublicationHTML(value) {

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