/* =========================================
   AGBOR KINGDOM ADMIN
   ILLUSTRIOUS SONS & DAUGHTERS
========================================= */

console.log("Agbor Kingdom Illustrious JS loaded");


/* =========================================
   ELEMENTS
========================================= */

const manageIllustriousButton =
    document.getElementById(
        "manageIllustriousButton"
    );

const adminIllustriousPanel =
    document.getElementById(
        "adminIllustriousPanel"
    );

const addIllustriousButton =
    document.getElementById(
        "addIllustriousButton"
    );

const adminIllustriousList =
    document.getElementById(
        "adminIllustriousList"
    );

const adminIllustriousCount =
    document.getElementById(
        "adminIllustriousCount"
    );

const adminIllustriousEditor =
    document.getElementById(
        "adminIllustriousEditor"
    );

const illustriousEditorForm =
    document.getElementById(
        "illustriousEditorForm"
    );

const editIllustriousId =
    document.getElementById(
        "editIllustriousId"
    );

const editIllustriousName =
    document.getElementById(
        "editIllustriousName"
    );

const editIllustriousTitle =
    document.getElementById(
        "editIllustriousTitle"
    );

const editIllustriousCategory =
    document.getElementById(
        "editIllustriousCategory"
    );

const editIllustriousCommunity =
    document.getElementById(
        "editIllustriousCommunity"
    );

const editIllustriousDescription =
    document.getElementById(
        "editIllustriousDescription"
    );

const editIllustriousImage =
    document.getElementById(
        "editIllustriousImage"
    );

const editIllustriousSortOrder =
    document.getElementById(
        "editIllustriousSortOrder"
    );

const editIllustriousActive =
    document.getElementById(
        "editIllustriousActive"
    );

const editIllustriousHeading =
    document.getElementById(
        "editIllustriousHeading"
    );

const editIllustriousStatus =
    document.getElementById(
        "editIllustriousStatus"
    );

const saveIllustriousButton =
    document.getElementById(
        "saveIllustriousButton"
    );

const deleteIllustriousButton =
    document.getElementById(
        "deleteIllustriousButton"
    );

const cancelIllustriousButton =
    document.getElementById(
        "cancelIllustriousButton"
    );

const illustriousSaveMessage =
    document.getElementById(
        "illustriousSaveMessage"
    );



/* =========================================
   OPEN ILLUSTRIOUS MANAGEMENT
========================================= */

if (manageIllustriousButton) {

    console.log(
        "Manage Illustrious button found."
    );

    manageIllustriousButton.addEventListener(
        "click",
        function () {

            console.log(
                "Manage Illustrious clicked."
            );

            if (adminIllustriousPanel) {

                adminIllustriousPanel.hidden =
                    false;

                adminIllustriousPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

            loadIllustriousPeople();

        }
    );

} else {

    console.error(
        "Manage Illustrious button NOT FOUND."
    );

}


/* =========================================
   LOAD PEOPLE
========================================= */

async function loadIllustriousPeople() {

    if (!adminIllustriousList) {
        return;
    }


    adminIllustriousList.innerHTML = `
        <p class="admin-loading">
            Loading illustrious sons and daughters...
        </p>
    `;


    try {

        const {
            data,
            error
        } = await kingdomAdminSupabase
            .from(
                "illustrious_sons_daughters"
            )
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
            "ILLUSTRIOUS PEOPLE:",
            data
        );


        renderIllustriousPeople(
            data || []
        );


    } catch (error) {

        console.error(
            "Error loading illustrious people:",
            error
        );


        adminIllustriousList.innerHTML = `
            <p class="admin-loading">
                Unable to load illustrious people.
            </p>
        `;

    }

}


/* =========================================
   RENDER
========================================= */

function renderIllustriousPeople(
    people
) {

    if (!adminIllustriousList) {
        return;
    }


    if (!people.length) {

        adminIllustriousList.innerHTML = `
            <div class="admin-no-news">

                <p>
                    No illustrious sons or daughters found.
                </p>

            </div>
        `;

        if (adminIllustriousCount) {

            adminIllustriousCount.textContent =
                "0 people";

        }

        return;

    }


    if (adminIllustriousCount) {

        adminIllustriousCount.textContent =
            `${people.length} ${
                people.length === 1
                    ? "person"
                    : "people"
            }`;

    }


    adminIllustriousList.innerHTML = "";


    people.forEach(
        (person, index) => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "admin-news-item";


            item.dataset.personId =
                person.id;


            const image =
                person.image_url || "";


            item.innerHTML = `

                ${
                    image
                        ? `
                            <div class="admin-news-image">

                                <img
                                    src="${escapeIllustriousHTML(
                                        image
                                    )}"
                                    alt=""
                                >

                            </div>
                        `
                        : ""
                }


                <div class="admin-news-number">

                    ${String(index + 1).padStart(2, "0")}

                </div>


                <div class="admin-news-content">

                    <div class="admin-news-category">

                        ${escapeIllustriousHTML(
                            person.category ||
                            "ILLUSTRIOUS"
                        )}

                    </div>


                    <h4>

                        ${escapeIllustriousHTML(
                            person.name
                        )}

                    </h4>


                    <p>

                        ${escapeIllustriousHTML(
                            person.title ||
                            person.community ||
                            "Agbor Kingdom"
                        )}

                    </p>

                </div>


                <div
                    class="admin-editor-status ${
                        person.is_active
                            ? "active"
                            : ""
                    }"
                >

                    ${
                        person.is_active
                            ? "Active"
                            : "Inactive"
                    }

                </div>

            `;


            adminIllustriousList.appendChild(
                item
            );


            /* CLICK TO EDIT */

            item.addEventListener(
                "click",
                function () {

                    openIllustriousEditor(
                        person
                    );

                }
            );

        }
    );

}


/* =========================================
   ADD NEW PERSON
========================================= */

if (addIllustriousButton) {

    addIllustriousButton.addEventListener(
        "click",
        function () {

            openNewIllustriousEditor();

        }
    );

}


/* =========================================
   NEW EDITOR
========================================= */

function openNewIllustriousEditor() {

    if (illustriousEditorForm) {
        illustriousEditorForm.reset();
    }


    editIllustriousId.value = "";


    editIllustriousSortOrder.value =
        "0";


    editIllustriousActive.checked =
        true;


    editIllustriousHeading.textContent =
        "Create Illustrious Person";


    editIllustriousStatus.textContent =
        "New Person";


    saveIllustriousButton.textContent =
        "Create Person";


    deleteIllustriousButton.hidden =
        true;


    illustriousSaveMessage.textContent =
        "";


    adminIllustriousEditor.hidden =
        false;


    adminIllustriousEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   OPEN EXISTING PERSON
========================================= */

function openIllustriousEditor(
    person
) {

    editIllustriousId.value =
        person.id || "";


    editIllustriousName.value =
        person.name || "";


    editIllustriousTitle.value =
        person.title || "";


    editIllustriousCategory.value =
        person.category || "";


    editIllustriousCommunity.value =
        person.community || "";


    editIllustriousDescription.value =
        person.description || "";


    editIllustriousImage.value =
        person.image_url || "";


    editIllustriousSortOrder.value =
        person.sort_order ?? 0;


    editIllustriousActive.checked =
        person.is_active !== false;


    editIllustriousHeading.textContent =
        "Edit Illustrious Person";


    editIllustriousStatus.textContent =
        person.is_active
            ? "Active Person"
            : "Inactive Person";


    saveIllustriousButton.textContent =
        "Save Changes";


    deleteIllustriousButton.hidden =
        false;


    illustriousSaveMessage.textContent =
        "";


    adminIllustriousEditor.hidden =
        false;


    adminIllustriousEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   SAVE
========================================= */

if (illustriousEditorForm) {

    illustriousEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const personId =
                editIllustriousId.value.trim();


            const personData = {

                name:
                    editIllustriousName.value.trim(),

                title:
                    editIllustriousTitle.value.trim()
                    || null,

                category:
                    editIllustriousCategory.value.trim()
                    || null,

                community:
                    editIllustriousCommunity.value.trim()
                    || null,

                description:
                    editIllustriousDescription.value.trim()
                    || null,

                image_url:
                    editIllustriousImage.value.trim()
                    || null,

                sort_order:
                    Number(
                        editIllustriousSortOrder.value
                    ) || 0,

                is_active:
                    editIllustriousActive.checked

            };


            if (!personData.name) {

                illustriousSaveMessage.textContent =
                    "Please enter a name.";

                return;

            }


            saveIllustriousButton.disabled =
                true;


            saveIllustriousButton.textContent =
                "Saving...";


            try {

                let result;


                /* UPDATE */

                if (personId) {

                    result =
                        await kingdomAdminSupabase
                            .from(
                                "illustrious_sons_daughters"
                            )
                            .update(
                                personData
                            )
                            .eq(
                                "id",
                                personId
                            );

                }


                /* CREATE */

                else {

                    result =
                        await kingdomAdminSupabase
                            .from(
                                "illustrious_sons_daughters"
                            )
                            .insert(
                                personData
                            );

                }


                if (result.error) {
                    throw result.error;
                }


                illustriousSaveMessage.textContent =
                    personId
                        ? "Person updated successfully."
                        : "Person created successfully.";


                await loadIllustriousPeople();


                setTimeout(
                    function () {

                        closeIllustriousEditor();

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Error saving illustrious person:",
                    error
                );


                illustriousSaveMessage.textContent =
                    error.message ||
                    "Unable to save person.";


            } finally {

                saveIllustriousButton.disabled =
                    false;


                saveIllustriousButton.textContent =
                    personId
                        ? "Save Changes"
                        : "Create Person";

            }

        }
    );

}

/* =========================================
   DELETE ILLUSTRIOUS PERSON
========================================= */

if (deleteIllustriousButton) {

    deleteIllustriousButton.addEventListener(
        "click",
        function () {

            const personId =
                editIllustriousId.value.trim();

            if (!personId) {

                illustriousSaveMessage.textContent =
                    "No person was selected.";

                return;
            }

            showIllustriousDeleteConfirmation(
                personId
            );

        }
    );

}


/* =========================================
   ILLUSTRIOUS DELETE CONFIRMATION
========================================= */

function showIllustriousDeleteConfirmation(
    personId
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
       CHANGE MODAL TEXT
    ===================================== */

    if (title) {

        title.textContent =
            "Delete Person?";

    }


    const modalMessage =
        modal.querySelector(
            ".delete-confirm-content p"
        );

    if (modalMessage) {

        modalMessage.textContent =
            "Are you sure you want to delete this person? This action cannot be undone.";

    }


    confirmButton.textContent =
        "Delete Person";


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

            modal.hidden = true;

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            await performAdminIllustriousDelete(
                personId
            );

        };

}


/* =========================================
   PERFORM ILLUSTRIOUS DELETE
========================================= */

async function performAdminIllustriousDelete(
    personId
) {

    if (!personId) {

        illustriousSaveMessage.textContent =
            "No person was selected.";

        return;
    }


    deleteIllustriousButton.disabled =
        true;

    deleteIllustriousButton.textContent =
        "Deleting...";


    illustriousSaveMessage.textContent =
        "Deleting person...";


    try {

        console.log(
            "Deleting illustrious person:",
            personId
        );


        const { error } =
            await kingdomAdminSupabase

                .from(
                    "illustrious_sons_daughters"
                )

                .delete()

                .eq(
                    "id",
                    personId
                );


        if (error) {

            throw error;

        }


        console.log(
            "ILLUSTRIOUS PERSON DELETED SUCCESSFULLY:",
            personId
        );


        illustriousSaveMessage.textContent =
            "Person deleted successfully.";


        /* ==============================
           CLEAR EDITOR
        ============================== */

        editIllustriousId.value =
            "";


        /* ==============================
           RELOAD PEOPLE
        ============================== */

        await loadIllustriousPeople();


        /* ==============================
           CLOSE EDITOR
        ============================== */

        setTimeout(
            function () {

                closeIllustriousEditor();

            },
            800
        );


    } catch (error) {

        console.error(
            "Error deleting illustrious person:",
            error
        );


        illustriousSaveMessage.textContent =
            error.message ||
            "Unable to delete person.";


    } finally {

        deleteIllustriousButton.disabled =
            false;

        deleteIllustriousButton.textContent =
            "Delete Person";

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeIllustriousHTML(
    value
) {

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