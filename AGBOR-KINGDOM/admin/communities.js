/* =========================================
   AGBOR KINGDOM ADMIN
   COMMUNITIES MANAGEMENT
========================================= */

console.log("Agbor Kingdom Communities JS loaded");


/* =========================================
   ELEMENTS
========================================= */

const manageCommunitiesButton =
    document.getElementById(
        "manageCommunitiesButton"
    );

const adminCommunitiesPanel =
    document.getElementById(
        "adminCommunitiesPanel"
    );

const adminCommunityList =
    document.getElementById(
        "adminCommunityList"
    );

const adminCommunityCount =
    document.getElementById(
        "adminCommunityCount"
    );

    const addCommunityButton =
    document.getElementById(
        "addCommunityButton"
    );

const adminCommunityEditor =
    document.getElementById(
        "adminCommunityEditor"
    );

const communityEditorForm =
    document.getElementById(
        "communityEditorForm"
    );

const editCommunityId =
    document.getElementById(
        "editCommunityId"
    );

const editCommunityName =
    document.getElementById(
        "editCommunityName"
    );

const editCommunityDescription =
    document.getElementById(
        "editCommunityDescription"
    );

const editCommunityImage =
    document.getElementById(
        "editCommunityImage"
    );

const editCommunitySortOrder =
    document.getElementById(
        "editCommunitySortOrder"
    );

const editCommunityActive =
    document.getElementById(
        "editCommunityActive"
    );

const editCommunityHeading =
    document.getElementById(
        "editCommunityHeading"
    );

const editCommunityStatus =
    document.getElementById(
        "editCommunityStatus"
    );

const saveCommunityButton =
    document.getElementById(
        "saveCommunityButton"
    );

const deleteCommunityButton =
    document.getElementById(
        "deleteCommunityButton"
    );

const cancelCommunityButton =
    document.getElementById(
        "cancelCommunityButton"
    );

const communitySaveMessage =
    document.getElementById(
        "communitySaveMessage"
    );

/* =========================================
   OPEN COMMUNITIES MANAGEMENT
========================================= */

if (manageCommunitiesButton) {

    console.log(
        "Manage Communities button found."
    );

    manageCommunitiesButton.addEventListener(
        "click",
        function () {

            console.log(
                "Manage Communities clicked."
            );


            if (adminCommunitiesPanel) {

                adminCommunitiesPanel.hidden =
                    false;

                adminCommunitiesPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }


            loadCommunities();

        }
    );

} else {

    console.error(
        "Manage Communities button NOT FOUND."
    );

}


/* =========================================
   LOAD COMMUNITIES
========================================= */

async function loadCommunities() {

    if (!adminCommunityList) {
        return;
    }


    adminCommunityList.innerHTML = `

        <p class="admin-loading">
            Loading communities...
        </p>

    `;


    try {

        const {
            data,
            error
        } = await kingdomAdminSupabase

            .from("communities")

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
            "COMMUNITIES:",
            data
        );


        renderCommunities(
            data || []
        );


    } catch (error) {

        console.error(
            "Error loading communities:",
            error
        );


        adminCommunityList.innerHTML = `

            <p class="admin-loading">
                Unable to load communities.
            </p>

        `;

    }

}


/* =========================================
   RENDER COMMUNITIES
========================================= */

function renderCommunities(
    communities
) {

    if (!adminCommunityList) {
        return;
    }


    /* =====================================
       COUNT
    ===================================== */

    if (adminCommunityCount) {

        adminCommunityCount.textContent =
            `${communities.length} ${
                communities.length === 1
                    ? "community"
                    : "communities"
            }`;

    }


    /* =====================================
       EMPTY
    ===================================== */

    if (!communities.length) {

        adminCommunityList.innerHTML = `

            <div class="admin-no-news">

                <p>
                    No communities found.
                </p>

            </div>

        `;

        return;

    }


    /* =====================================
       CLEAR LIST
    ===================================== */

    adminCommunityList.innerHTML = "";


    /* =====================================
       CREATE ITEMS
    ===================================== */

    communities.forEach(
    function (community, index) {

        const item =
            document.createElement("article");

        item.className =
            "admin-news-item";

        item.dataset.communityId =
            community.id;


        item.innerHTML = `

            ${
                community.image_url
                    ? `
                        <div class="admin-news-image">

                            <img
                                src="${escapeCommunityHTML(
                                    community.image_url
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
                    COMMUNITY
                </div>

                <h4>
                    ${escapeCommunityHTML(
                        community.name
                    )}
                </h4>

                <p>
                    ${escapeCommunityHTML(
                        community.description ||
                        "Agbor Kingdom community"
                    )}
                </p>

            </div>


            <div
                class="admin-editor-status ${
                    community.is_active
                        ? "active"
                        : ""
                }"
            >
                ${
                    community.is_active
                        ? "Active"
                        : "Inactive"
                }
            </div>

        `;


        adminCommunityList.appendChild(item);


        /* =====================================
           CLICK TO EDIT
        ===================================== */

        item.addEventListener(
            "click",
            function () {

                openCommunityEditor(
                    community
                );

            }
        );

    }
);

}

/* =========================================
   OPEN EXISTING COMMUNITY
========================================= */

function openCommunityEditor(
    community
) {

    editCommunityId.value =
        community.id || "";

    editCommunityName.value =
        community.name || "";

    editCommunityDescription.value =
        community.description || "";

    editCommunityImage.value =
        community.image_url || "";

    editCommunitySortOrder.value =
        community.sort_order ?? 0;

    editCommunityActive.checked =
        community.is_active !== false;


    editCommunityHeading.textContent =
        "Edit Community";

    editCommunityStatus.textContent =
        community.is_active
            ? "Active Community"
            : "Inactive Community";


    saveCommunityButton.textContent =
        "Save Changes";


    deleteCommunityButton.hidden =
        false;


    communitySaveMessage.textContent =
        "";


    adminCommunityEditor.hidden =
        false;


    adminCommunityEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}
/* =========================================
   ADD COMMUNITY
========================================= */

if (addCommunityButton) {

    addCommunityButton.addEventListener(
        "click",
        function () {

            openNewCommunityEditor();

        }
    );

}
/* =========================================
   OPEN NEW COMMUNITY EDITOR
========================================= */

function openNewCommunityEditor() {

    if (communityEditorForm) {
        communityEditorForm.reset();
    }

    editCommunityId.value = "";

    editCommunitySortOrder.value = "0";

    editCommunityActive.checked = true;

    editCommunityHeading.textContent =
        "Create Community";

    editCommunityStatus.textContent =
        "New Community";

    saveCommunityButton.textContent =
        "Create Community";

    deleteCommunityButton.hidden = true;

    communitySaveMessage.textContent = "";

    adminCommunityEditor.hidden = false;

    adminCommunityEditor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}
/* =========================================
   SAVE COMMUNITY
========================================= */

if (communityEditorForm) {

    communityEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const communityId =
                editCommunityId.value.trim();


            const communityData = {

                name:
                    editCommunityName.value.trim(),

                description:
                    editCommunityDescription.value.trim()
                    || null,

                image_url:
                    editCommunityImage.value.trim()
                    || null,

                sort_order:
                    Number(
                        editCommunitySortOrder.value
                    ) || 0,

                is_active:
                    editCommunityActive.checked

            };


            if (!communityData.name) {

                communitySaveMessage.textContent =
                    "Please enter a community name.";

                return;

            }


            saveCommunityButton.disabled =
                true;

            saveCommunityButton.textContent =
                "Saving...";


            try {

                let result;


                /* =============================
                   UPDATE
                ============================= */

                if (communityId) {

                    result =
                  result = await kingdomAdminSupabase
    .from("communities")
    .update(communityData)
    .eq("id", communityId)
    .select();
                }


                /* =============================
                   CREATE
                ============================= */

                else {

                    result =
                        await kingdomAdminSupabase

                            .from("communities")

                            .insert([
                                communityData
                            ]);

                }


                if (result.error) {
                    throw result.error;
                }


                communitySaveMessage.textContent =
                    communityId
                        ? "Community updated successfully."
                        : "Community created successfully.";


                await loadCommunities();


                setTimeout(
                    function () {

                        closeCommunityEditor();

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Error saving community:",
                    error
                );


                communitySaveMessage.textContent =
                    error.message ||
                    "Unable to save community.";


            } finally {

                saveCommunityButton.disabled =
                    false;

                saveCommunityButton.textContent =
                    communityId
                        ? "Save Changes"
                        : "Create Community";

            }

        }
    );

}

/* =========================================
   CANCEL COMMUNITY EDITOR
========================================= */

if (cancelCommunityButton) {

    cancelCommunityButton.addEventListener(
        "click",
        function () {

            closeCommunityEditor();

        }
    );

}

/* =========================================
   CLOSE COMMUNITY EDITOR
========================================= */

function closeCommunityEditor() {

    if (adminCommunityEditor) {

        adminCommunityEditor.hidden =
            true;

    }


    if (communityEditorForm) {

        communityEditorForm.reset();

    }


    editCommunityId.value = "";

    communitySaveMessage.textContent = "";

}

/* =========================================
   COMMUNITY DELETE CONFIRMATION
========================================= */

function showCommunityDeleteConfirmation(
    communityId
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
            "Delete Community?";

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
            "Are you sure you want to delete this community? This action cannot be undone.";

    }


    confirmButton.textContent =
        "Delete Community";


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
confirmButton.onclick = async function () {

    // Remove focus before hiding the modal
    confirmButton.blur();

    modal.hidden = true;
    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    await performAdminCommunityDelete(
        communityId
    );
};
    
}

/* =========================================
   DELETE COMMUNITY
========================================= */

if (deleteCommunityButton) {

    deleteCommunityButton.addEventListener(
        "click",
        function () {

            const communityId =
                editCommunityId.value.trim();


            if (!communityId) {
                return;
            }


            showCommunityDeleteConfirmation(
                communityId
            );

        }
    );

}

/* =========================================
   PERFORM COMMUNITY DELETE
========================================= */

async function performAdminCommunityDelete(
    communityId
) {

    if (!communityId) {

        communitySaveMessage.textContent =
            "No community was selected.";

        return;

    }


    deleteCommunityButton.disabled =
        true;


    deleteCommunityButton.textContent =
        "Deleting...";


    communitySaveMessage.textContent =
        "Deleting community...";


    try {

        console.log(
            "Deleting community:",
            communityId
        );


        const { error } =
            await kingdomAdminSupabase

                .from("communities")

                .delete()

                .eq(
                    "id",
                    communityId
                );


        if (error) {
            throw error;
        }


        console.log(
            "COMMUNITY DELETED SUCCESSFULLY:",
            communityId
        );


        communitySaveMessage.textContent =
            "Community deleted successfully.";


        editCommunityId.value = "";


        await loadCommunities();


        setTimeout(
            function () {

                closeCommunityEditor();

            },
            800
        );


    } catch (error) {

        console.error(
            "Error deleting community:",
            error
        );


        communitySaveMessage.textContent =
            error.message ||
            "Unable to delete community.";


    } finally {

        deleteCommunityButton.disabled =
            false;

        deleteCommunityButton.textContent =
            "Delete Community";

    }

}
/* =========================================
   ESCAPE HTML
========================================= */

function escapeCommunityHTML(
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