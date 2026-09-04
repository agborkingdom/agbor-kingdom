
/* =========================================
   AGBOR KINGDOM ADMIN
   ANNOUNCEMENTS MANAGEMENT
========================================= */

const adminAnnouncementList =
    document.getElementById(
        "adminAnnouncementList"
    );

const adminAnnouncementCount =
    document.getElementById(
        "adminAnnouncementCount"
    );

const adminAnnouncementEditor =
    document.getElementById(
        "adminAnnouncementEditor"
    );

const announcementEditorForm =
    document.getElementById(
        "announcementEditorForm"
    );

const editAnnouncementId =
    document.getElementById(
        "editAnnouncementId"
    );

const editAnnouncementHeading =
    document.getElementById(
        "editAnnouncementHeading"
    );

const editAnnouncementTitle =
    document.getElementById(
        "editAnnouncementTitle"
    );

const editAnnouncementMessage =
    document.getElementById(
        "editAnnouncementMessage"
    );

const editAnnouncementLink =
    document.getElementById(
        "editAnnouncementLink"
    );

const editAnnouncementSortOrder =
    document.getElementById(
        "editAnnouncementSortOrder"
    );

const editAnnouncementStartsAt =
    document.getElementById(
        "editAnnouncementStartsAt"
    );

const editAnnouncementExpiresAt =
    document.getElementById(
        "editAnnouncementExpiresAt"
    );

const editAnnouncementActive =
    document.getElementById(
        "editAnnouncementActive"
    );

const editAnnouncementStatus =
    document.getElementById(
        "editAnnouncementStatus"
    );

const announcementSaveMessage =
    document.getElementById(
        "announcementSaveMessage"
    );

const saveAnnouncementButton =
    document.getElementById(
        "saveAnnouncementButton"
    );

const addAnnouncementButton =
    document.getElementById(
        "addAnnouncementButton"
    );

const deleteAnnouncementButton =
    document.getElementById(
        "deleteAnnouncementButton"
    );

const cancelAnnouncementButton =
    document.getElementById(
        "cancelAnnouncementButton"
    );

const announcementDeleteConfirmModal =
    document.getElementById(
        "announcementDeleteConfirmModal"
    );

const confirmAnnouncementDeleteButton =
    document.getElementById(
        "confirmAnnouncementDeleteButton"
    );


/* =========================================
   DATE HELPERS
========================================= */

function formatAnnouncementDate(value) {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


function convertDateTimeLocalToISO(value) {

    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toISOString();
}


function convertISOToDateTimeLocal(value) {

    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}


/* =========================================
   LOAD ANNOUNCEMENTS
========================================= */

async function loadAdminAnnouncements() {

    if (!adminAnnouncementList) {
        return;
    }

    if (
        typeof kingdomAdminSupabase ===
        "undefined"
    ) {

        adminAnnouncementList.innerHTML = `
            <p class="admin-loading">
                Supabase connection is not available.
            </p>
        `;

        return;
    }


    adminAnnouncementList.innerHTML = `
        <p class="admin-loading">
            Loading announcements...
        </p>
    `;


    try {

        console.log(
            "Loading kingdom announcements..."
        );


        const {
            data: announcements,
            error
        } = await kingdomAdminSupabase

            .from("announcements")

            .select("*")

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
            );


        if (error) {
            throw error;
        }


        console.log(
            "ADMIN ANNOUNCEMENTS:",
            announcements
        );


        renderAdminAnnouncements(
            announcements || []
        );


    } catch (error) {

        console.error(
            "Admin announcements loading failed:",
            error
        );


        adminAnnouncementList.innerHTML = `
            <p class="admin-loading">
                Unable to load announcements.
            </p>
        `;


        if (adminAnnouncementCount) {

            adminAnnouncementCount.textContent =
                "Unable to load";

        }

    }

}


/* =========================================
   GET ANNOUNCEMENT STATUS
========================================= */

function getAnnouncementDisplayStatus(
    announcement
) {

    const now =
        new Date();

    const startsAt =
        announcement.starts_at
            ? new Date(
                announcement.starts_at
            )
            : null;

    const expiresAt =
        announcement.expires_at
            ? new Date(
                announcement.expires_at
            )
            : null;


    if (!announcement.is_active) {

        return {
            text: "Inactive",
            className: "inactive"
        };

    }


    if (
        startsAt &&
        now < startsAt
    ) {

        return {
            text: "Scheduled",
            className: "scheduled"
        };

    }


    if (
        expiresAt &&
        now > expiresAt
    ) {

        return {
            text: "Expired",
            className: "inactive"
        };

    }


    return {
        text: "Active",
        className: "active"
    };

}


/* =========================================
   RENDER ANNOUNCEMENTS
========================================= */

function renderAdminAnnouncements(
    announcements
) {

    if (!adminAnnouncementList) {
        return;
    }


    if (!announcements.length) {

        adminAnnouncementList.innerHTML = `
            <div class="admin-no-announcements">
                <p>
                    No announcements found.
                </p>
            </div>
        `;


        if (adminAnnouncementCount) {

            adminAnnouncementCount.textContent =
                "0 announcements";

        }

        return;

    }


    if (adminAnnouncementCount) {

        adminAnnouncementCount.textContent =
            `${announcements.length} ${
                announcements.length === 1
                    ? "announcement"
                    : "announcements"
            }`;

    }


    adminAnnouncementList.innerHTML =
        announcements
            .map(
                (
                    announcement,
                    index
                ) => {

                    const title =
                        escapeAdminHTML(
                            announcement.title ||
                            "Untitled Announcement"
                        );


                    const message =
                        escapeAdminHTML(
                            announcement.message ||
                            ""
                        );


                    const status =
                        getAnnouncementDisplayStatus(
                            announcement
                        );


                    const createdDate =
                        formatAnnouncementDate(
                            announcement.created_at
                        );


                    return `

                        <article
                            class="admin-announcement-item"
                            data-announcement-id="${escapeAdminHTML(
                                announcement.id
                            )}"
                        >

                            <div
                                class="admin-announcement-number"
                            >
                                ${index + 1}
                            </div>


                            <div
                                class="admin-announcement-content"
                            >

                                <h4>
                                    ${title}
                                </h4>

                                <p
                                    class="admin-announcement-message"
                                >
                                    ${message}
                                </p>

                            </div>


                            <div
                                class="admin-announcement-date"
                            >
                                ${escapeAdminHTML(
                                    createdDate
                                )}
                            </div>


                            <div
                                class="admin-announcement-status ${status.className}"
                            >
                                ${status.text}
                            </div>

                        </article>

                    `;

                }
            )
            .join("");


    const items =
        adminAnnouncementList.querySelectorAll(
            ".admin-announcement-item"
        );


    items.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    const announcementId =
                        item.dataset.announcementId;


                    const announcement =
                        announcements.find(
                            entry =>
                                entry.id ===
                                announcementId
                        );


                    if (
                        announcement
                    ) {

                        loadAdminAnnouncementForEditing(
                            announcement
                        );

                    }

                }
            );

        }
    );

}


/* =========================================
   LOAD SELECTED ANNOUNCEMENT
========================================= */

function loadAdminAnnouncementForEditing(
    announcement
) {

    if (!announcement) {
        return;
    }


    console.log(
        "ADMIN SELECTED ANNOUNCEMENT:",
        announcement
    );


    if (adminAnnouncementEditor) {

        adminAnnouncementEditor.hidden =
            false;

    }


    if (editAnnouncementId) {

        editAnnouncementId.value =
            announcement.id || "";

    }


    if (editAnnouncementHeading) {

        editAnnouncementHeading.textContent =
            announcement.title ||
            "Edit Announcement";

    }


    if (editAnnouncementTitle) {

        editAnnouncementTitle.value =
            announcement.title ||
            "";

    }


    if (editAnnouncementMessage) {

        editAnnouncementMessage.value =
            announcement.message ||
            "";

    }


    if (editAnnouncementLink) {

        editAnnouncementLink.value =
            announcement.link ||
            "";

    }


    if (editAnnouncementSortOrder) {

        editAnnouncementSortOrder.value =
            announcement.sort_order ??
            0;

    }


    if (editAnnouncementStartsAt) {

        editAnnouncementStartsAt.value =
            convertISOToDateTimeLocal(
                announcement.starts_at
            );

    }


    if (editAnnouncementExpiresAt) {

        editAnnouncementExpiresAt.value =
            convertISOToDateTimeLocal(
                announcement.expires_at
            );

    }


    if (editAnnouncementActive) {

        editAnnouncementActive.checked =
            announcement.is_active === true;

    }


    updateAnnouncementEditorStatus(
        announcement.is_active
    );


    if (deleteAnnouncementButton) {

        deleteAnnouncementButton.hidden =
            false;

    }


    if (announcementSaveMessage) {

        announcementSaveMessage.textContent =
            "";

        announcementSaveMessage.classList.remove(
            "success",
            "error"
        );

    }


    document
        .querySelectorAll(
            ".admin-announcement-item"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "selected"
                );

            }
        );


    const selectedItem =
        document.querySelector(
            `[data-announcement-id="${CSS.escape(
                announcement.id
            )}"]`
        );


    if (selectedItem) {

        selectedItem.classList.add(
            "selected"
        );

    }

}


/* =========================================
   UPDATE EDITOR STATUS
========================================= */

function updateAnnouncementEditorStatus(
    isActive
) {

    if (!editAnnouncementStatus) {
        return;
    }


    editAnnouncementStatus.textContent =
        isActive
            ? "Active"
            : "Inactive";


    editAnnouncementStatus.classList.toggle(
        "active",
        isActive
    );


    editAnnouncementStatus.classList.toggle(
        "inactive",
        !isActive
    );

}


/* =========================================
   PREPARE NEW ANNOUNCEMENT
========================================= */

function prepareNewAnnouncement() {

    console.log(
        "Preparing new announcement..."
    );


    if (adminAnnouncementEditor) {

        adminAnnouncementEditor.hidden =
            false;

    }


    if (editAnnouncementId) {

        editAnnouncementId.value =
            "";

    }


    if (editAnnouncementHeading) {

        editAnnouncementHeading.textContent =
            "Add New Announcement";

    }


    if (editAnnouncementTitle) {

        editAnnouncementTitle.value =
            "";

    }


    if (editAnnouncementMessage) {

        editAnnouncementMessage.value =
            "";

    }


    if (editAnnouncementLink) {

        editAnnouncementLink.value =
            "";

    }


    if (editAnnouncementSortOrder) {

        editAnnouncementSortOrder.value =
            "0";

    }


    if (editAnnouncementStartsAt) {

        editAnnouncementStartsAt.value =
            "";

    }


    if (editAnnouncementExpiresAt) {

        editAnnouncementExpiresAt.value =
            "";

    }


    if (editAnnouncementActive) {

        editAnnouncementActive.checked =
            true;

    }


    updateAnnouncementEditorStatus(
        true
    );


    if (deleteAnnouncementButton) {

        deleteAnnouncementButton.hidden =
            true;

    }


    if (saveAnnouncementButton) {

        saveAnnouncementButton.textContent =
            "Create Announcement";

    }


    if (announcementSaveMessage) {

        announcementSaveMessage.textContent =
            "";

        announcementSaveMessage.classList.remove(
            "success",
            "error"
        );

    }


    document
        .querySelectorAll(
            ".admin-announcement-item"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "selected"
                );

            }
        );

}


if (addAnnouncementButton) {

    addAnnouncementButton.addEventListener(
        "click",
        prepareNewAnnouncement
    );

}


/* =========================================
   CANCEL EDITOR
========================================= */

function cancelAnnouncementEditor() {

    if (adminAnnouncementEditor) {

        adminAnnouncementEditor.hidden =
            true;

    }


    document
        .querySelectorAll(
            ".admin-announcement-item"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "selected"
                );

            }
        );

}


if (cancelAnnouncementButton) {

    cancelAnnouncementButton.addEventListener(
        "click",
        cancelAnnouncementEditor
    );

}


/* =========================================
   SAVE ANNOUNCEMENT
========================================= */

if (announcementEditorForm) {

    announcementEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const announcementId =
                editAnnouncementId
                    ? editAnnouncementId.value.trim()
                    : "";


            const title =
                editAnnouncementTitle
                    ? editAnnouncementTitle.value.trim()
                    : "";


            const message =
                editAnnouncementMessage
                    ? editAnnouncementMessage.value.trim()
                    : "";


            const link =
                editAnnouncementLink
                    ? editAnnouncementLink.value.trim()
                    : "";


            const sortOrder =
                editAnnouncementSortOrder
                    ? Number(
                        editAnnouncementSortOrder.value
                    ) || 0
                    : 0;


            const startsAt =
                editAnnouncementStartsAt
                    ? convertDateTimeLocalToISO(
                        editAnnouncementStartsAt.value
                    )
                    : null;


            const expiresAt =
                editAnnouncementExpiresAt
                    ? convertDateTimeLocalToISO(
                        editAnnouncementExpiresAt.value
                    )
                    : null;


            const isActive =
                editAnnouncementActive
                    ? editAnnouncementActive.checked
                    : false;


            if (!title) {

                showAdminToast(
                    "Enter an announcement title.",
                    "warning",
                    "Title Required"
                );

                return;

            }


            if (!message) {

                showAdminToast(
                    "Enter the announcement message.",
                    "warning",
                    "Message Required"
                );

                return;

            }


            if (
                startsAt &&
                expiresAt &&
                new Date(startsAt) >=
                new Date(expiresAt)
            ) {

                showAdminToast(
                    "The expiry date must be later than the start date.",
                    "warning",
                    "Invalid Schedule"
                );

                return;

            }


            const announcementData = {

                title: title,

                message: message,

                link: link || null,

                sort_order: sortOrder,

                starts_at: startsAt,

                expires_at: expiresAt,

                is_active: isActive

            };


            try {

                if (saveAnnouncementButton) {

                    saveAnnouncementButton.disabled =
                        true;

                    saveAnnouncementButton.textContent =
                        "Saving...";

                }


                if (announcementSaveMessage) {

                    announcementSaveMessage.textContent =
                        "";

                }


                let data = null;

                let error = null;


                /* =====================================
                   UPDATE
                ====================================== */

                if (announcementId) {

                    console.log(
                        "Updating announcement:",
                        announcementId
                    );


                    const result =
                        await kingdomAdminSupabase

                            .from("announcements")

                            .update({

                                ...announcementData,

                                updated_at:
                                    new Date().toISOString()

                            })

                            .eq(
                                "id",
                                announcementId
                            )

                            .select()
                            .single();


                    data =
                        result.data;

                    error =
                        result.error;

                }


                /* =====================================
                   CREATE
                ====================================== */

                else {

                    console.log(
                        "Creating new announcement..."
                    );


                    const result =
                        await kingdomAdminSupabase

                            .from("announcements")

                            .insert(
                                announcementData
                            )

                            .select()
                            .single();


                    data =
                        result.data;

                    error =
                        result.error;

                }


                if (error) {
                    throw error;
                }


                console.log(
                    "ANNOUNCEMENT SAVED:",
                    data
                );


                if (editAnnouncementId) {

                    editAnnouncementId.value =
                        data.id || "";

                }


                if (editAnnouncementHeading) {

                    editAnnouncementHeading.textContent =
                        data.title ||
                        "Edit Announcement";

                }


                if (saveAnnouncementButton) {

                    saveAnnouncementButton.textContent =
                        "Save Announcement";

                }


                if (announcementSaveMessage) {

                    announcementSaveMessage.textContent =
                        announcementId
                            ? "Announcement updated successfully."
                            : "Announcement created successfully.";

                    announcementSaveMessage.classList.add(
                        "success"
                    );

                }


                showAdminToast(
                    announcementId
                        ? "The announcement has been updated successfully."
                        : "The new announcement has been created.",
                    "success",
                    announcementId
                        ? "Announcement Updated"
                        : "Announcement Created"
                );


                await loadAdminAnnouncements();


            } catch (error) {

                console.error(
                    "Admin announcement save failed:",
                    error
                );


                if (announcementSaveMessage) {

                    announcementSaveMessage.textContent =
                        "Unable to save announcement.";

                    announcementSaveMessage.classList.add(
                        "error"
                    );

                }


                showAdminToast(
                    error.message ||
                    "Unable to save the announcement.",
                    "error",
                    "Save Failed"
                );


            } finally {

                if (saveAnnouncementButton) {

                    saveAnnouncementButton.disabled =
                        false;

                    saveAnnouncementButton.textContent =
                        editAnnouncementId &&
                        editAnnouncementId.value
                            ? "Save Announcement"
                            : "Create Announcement";

                }

            }

        }
    );

}


/* =========================================
   DELETE CONFIRMATION
========================================= */

function showAnnouncementDeleteConfirmation(
    announcementId
) {

    if (
        !announcementDeleteConfirmModal ||
        !confirmAnnouncementDeleteButton
    ) {

        console.error(
            "Admin: Announcement delete modal not found."
        );

        return;

    }


    announcementDeleteConfirmModal.hidden =
        false;

    announcementDeleteConfirmModal.setAttribute(
        "aria-hidden",
        "false"
    );


    confirmAnnouncementDeleteButton.onclick =
        async function () {

            announcementDeleteConfirmModal.hidden =
                true;

            announcementDeleteConfirmModal.setAttribute(
                "aria-hidden",
                "true"
            );


            await performAdminAnnouncementDelete(
                announcementId
            );

        };

}


/* =========================================
   DELETE ANNOUNCEMENT
========================================= */

async function performAdminAnnouncementDelete(
    announcementId
) {

    if (!announcementId) {

        showAdminToast(
            "No announcement was selected.",
            "warning",
            "No Announcement Selected"
        );

        return;

    }


    try {

        console.log(
            "Deleting announcement:",
            announcementId
        );


        const {
            data,
            error
        } = await kingdomAdminSupabase

            .from("announcements")

            .delete()

            .eq(
                "id",
                announcementId
            )

            .select();


        if (error) {
            throw error;
        }


        if (
            !data ||
            data.length === 0
        ) {

            showAdminToast(
                "The announcement could not be deleted. Check your DELETE policy.",
                "error",
                "Delete Not Completed"
            );

            return;

        }


        console.log(
            "ANNOUNCEMENT DELETED:",
            data
        );


        if (adminAnnouncementEditor) {

            adminAnnouncementEditor.hidden =
                true;

        }


        if (editAnnouncementId) {

            editAnnouncementId.value =
                "";

        }


        await loadAdminAnnouncements();


        showAdminToast(
            "The announcement has been permanently deleted.",
            "success",
            "Announcement Deleted"
        );


    } catch (error) {

        console.error(
            "Admin announcement delete failed:",
            error
        );


        showAdminToast(
            error.message ||
            "Unable to delete the announcement.",
            "error",
            "Delete Failed"
        );

    }

}


/* =========================================
   DELETE BUTTON
========================================= */

if (deleteAnnouncementButton) {

    deleteAnnouncementButton.addEventListener(
        "click",
        function () {

            const announcementId =
                editAnnouncementId
                    ? editAnnouncementId.value
                    : "";


            if (!announcementId) {

                return;

            }


            showAnnouncementDeleteConfirmation(
                announcementId
            );

        }
    );

}


/* =========================================
   CANCEL DELETE
========================================= */

function closeAnnouncementDeleteConfirmation() {

    if (
        !announcementDeleteConfirmModal
    ) {

        return;

    }


    announcementDeleteConfirmModal.hidden =
        true;

    announcementDeleteConfirmModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.closest(
                "[data-announcement-delete-cancel]"
            )
        ) {

            closeAnnouncementDeleteConfirmation();

        }

    }
);


/* =========================================
   LOAD ANNOUNCEMENTS WHEN ADMIN STARTS
========================================= */

async function initializeAnnouncementAdmin() {

    console.log(
        "Initializing announcement management..."
    );

    await loadAdminAnnouncements();

}
