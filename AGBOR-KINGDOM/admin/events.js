/* =========================================
   EVENTS MANAGEMENT
========================================= */
console.log("EVENTS JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

    const manageEventsButton =
        document.getElementById("manageEventsButton");

    const adminEventsPanel =
        document.getElementById("adminEventsPanel");

    const addEventButton =
        document.getElementById("addEventButton");

    const adminEventList =
        document.getElementById("adminEventList");

    const adminEventCount =
        document.getElementById("adminEventCount");

    const adminEventEditor =
        document.getElementById("adminEventEditor");

    const eventEditorForm =
        document.getElementById("eventEditorForm");

    const editEventId =
        document.getElementById("editEventId");

    const editEventTitle =
        document.getElementById("editEventTitle");

    const editEventDescription =
        document.getElementById("editEventDescription");

    const editEventType =
        document.getElementById("editEventType");

    const editEventDate =
        document.getElementById("editEventDate");

    const editEventTime =
        document.getElementById("editEventTime");

    const editEventLocation =
        document.getElementById("editEventLocation");

    const editEventImage =
        document.getElementById("editEventImage");

    const editEventLink =
        document.getElementById("editEventLink");

    const editEventSortOrder =
        document.getElementById("editEventSortOrder");

    const editEventActive =
        document.getElementById("editEventActive");

    const editEventHeading =
        document.getElementById("editEventHeading");

    const editEventStatus =
        document.getElementById("editEventStatus");

    const saveEventButton =
        document.getElementById("saveEventButton");

    const deleteEventButton =
        document.getElementById("deleteEventButton");

    const cancelEventButton =
        document.getElementById("cancelEventButton");

    const eventSaveMessage =
        document.getElementById("eventSaveMessage");


    /* =========================================
       SHOW EVENTS PANEL
    ========================================= */

    if (manageEventsButton) {

        manageEventsButton.addEventListener("click", () => {

            adminEventsPanel.hidden = false;

            adminEventsPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            loadEvents();

        });

    }


    /* =========================================
       ADD EVENT
    ========================================= */

    if (addEventButton) {

        addEventButton.addEventListener("click", () => {

            openNewEventEditor();

        });

    }


    /* =========================================
       CANCEL
    ========================================= */

    if (cancelEventButton) {

        cancelEventButton.addEventListener("click", () => {

            closeEventEditor();

        });

    }


    /* =========================================
       LOAD EVENTS
    ========================================= */

    async function loadEvents() {

        adminEventList.innerHTML = `
            <p class="admin-loading">
                Loading events...
            </p>
        `;

        try {

            const { data, error } = await kingdomAdminSupabase
                .from("events")
                .select("*")

                
                .order("sort_order", {
                    ascending: true
                })
                .order("event_date", {
                    ascending: true
                });

            if (error) {
                throw error;
            }

            renderEvents(data || []);

        } catch (error) {

            console.error(
                "Error loading events:",
                error
            );

            adminEventList.innerHTML = `
                <p class="admin-loading">
                    Unable to load events.
                </p>
            `;

            showEventMessage(
                "Unable to load events.",
                "error"
            );

        }

    }


    /* =========================================
       RENDER EVENTS
    ========================================= */

    function renderEvents(events) {

        adminEventCount.textContent =
            `${events.length} ${
                events.length === 1
                    ? "event"
                    : "events"
            }`;

        if (events.length === 0) {

            adminEventList.innerHTML = `
                <p class="admin-loading">
                    No events found.
                </p>
            `;

            return;

        }

        adminEventList.innerHTML = "";

        events.forEach(event => {

            const item =
                document.createElement("div");

            item.className =
                "admin-news-item";

            const formattedDate =
                formatEventDate(event.event_date);

            item.innerHTML = `

                <div class="admin-news-item-content">

                    <div class="admin-news-item-meta">

                        <span>
                            ${escapeHtml(
                                event.event_type ||
                                "EVENT"
                            )}
                        </span>

                        <span>
                            ${formattedDate}
                        </span>

                    </div>

                    <h4>
                        ${escapeHtml(
                            event.title
                        )}
                    </h4>

                    <p>
                        ${escapeHtml(
                            event.location ||
                            "Location not specified"
                        )}
                    </p>

                    <span class="
                        admin-editor-status
                        ${
                            event.is_active
                                ? "active"
                                : ""
                        }
                    ">
                        ${
                            event.is_active
                                ? "Active"
                                : "Inactive"
                        }
                    </span>

                </div>

                <div class="admin-news-item-actions">

                    <button
                        type="button"
                        class="admin-edit-button"
                        data-event-id="${event.id}"
                    >
                        Edit
                    </button>

                </div>

            `;

            adminEventList.appendChild(item);

        });


        /* =========================================
           EDIT BUTTONS
        ========================================= */

        adminEventList
            .querySelectorAll("[data-event-id]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const eventId =
                            button.dataset.eventId;

                        const event =
                            events.find(
                                item =>
                                    item.id === eventId
                            );

                        if (event) {
                            openEventEditor(event);
                        }

                    }
                );

            });

    }


    /* =========================================
       NEW EVENT EDITOR
    ========================================= */

    function openNewEventEditor() {

        eventEditorForm.reset();

        editEventId.value = "";

        editEventHeading.textContent =
            "Create Event";

        editEventStatus.textContent =
            "New Event";

        saveEventButton.textContent =
            "Create Event";

        deleteEventButton.hidden = true;

        editEventSortOrder.value = 0;

        editEventActive.checked = true;

        eventSaveMessage.textContent = "";

        adminEventEditor.hidden = false;

        adminEventEditor.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =========================================
       EXISTING EVENT EDITOR
    ========================================= */

    function openEventEditor(event) {

        editEventId.value =
            event.id || "";

        editEventTitle.value =
            event.title || "";

        editEventDescription.value =
            event.description || "";

        editEventType.value =
            event.event_type || "";

        editEventDate.value =
            event.event_date || "";

        editEventTime.value =
            event.event_time || "";

        editEventLocation.value =
            event.location || "";

        editEventImage.value =
            event.image_url || "";

        editEventLink.value =
            event.link || "";

        editEventSortOrder.value =
            event.sort_order ?? 0;

        editEventActive.checked =
            event.is_active !== false;

        editEventHeading.textContent =
            "Edit Event";

        editEventStatus.textContent =
            event.is_active
                ? "Active Event"
                : "Inactive Event";

        saveEventButton.textContent =
            "Save Event";

        deleteEventButton.hidden = false;

        eventSaveMessage.textContent = "";

        adminEventEditor.hidden = false;

        adminEventEditor.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =========================================
       SAVE EVENT
    ========================================= */

    if (eventEditorForm) {

        eventEditorForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                saveEventButton.disabled = true;

                showEventMessage(
                    "Saving event...",
                    "loading"
                );

                const eventId =
                    editEventId.value.trim();

                const eventData = {

                    title:
                        editEventTitle.value.trim(),

                    description:
                        editEventDescription.value.trim()
                        || null,

                    event_type:
                        editEventType.value.trim()
                        || null,

                    event_date:
                        editEventDate.value,

                    event_time:
                        editEventTime.value.trim()
                        || null,

                    location:
                        editEventLocation.value.trim()
                        || null,

                    image_url:
                        editEventImage.value.trim()
                        || null,

                    link:
                        editEventLink.value.trim()
                        || null,

                    is_active:
                        editEventActive.checked,

                    sort_order:
                        Number(
                            editEventSortOrder.value
                        ) || 0

                };


                try {

                    let result;

                    /* =================================
                       UPDATE EXISTING EVENT
                    ================================= */

                    if (eventId) {

                        result = await kingdomAdminSupabase
                            .from("events")
                            .update(eventData)
                            .eq("id", eventId);

                    }

                    /* =================================
                       CREATE NEW EVENT
                    ================================= */

                    else {

                        result = await kingdomAdminSupabase
                            .from("events")
                            .insert([
                                eventData
                            ]);

                    }


                    if (result.error) {
                        throw result.error;
                    }


                    showEventMessage(
                        eventId
                            ? "Event updated successfully."
                            : "Event created successfully.",
                        "success"
                    );

                    await loadEvents();

                    setTimeout(() => {

                        closeEventEditor();

                    }, 800);


                } catch (error) {

                    console.error(
                        "Error saving event:",
                        error
                    );

                    showEventMessage(
                        error.message ||
                        "Unable to save event.",
                        "error"
                    );

                } finally {

                    saveEventButton.disabled = false;

                }

            }
        );

    }

/* =========================================
   DELETE EVENT
========================================= */

if (deleteEventButton) {

    deleteEventButton.addEventListener(
        "click",
        function () {

            const eventId =
                editEventId.value.trim();

            if (!eventId) {

                showEventMessage(
                    "Select an event first.",
                    "error"
                );

                return;
            }

            showEventDeleteConfirmation(
                eventId
            );
        }
    );
}


/* =========================================
   EVENT DELETE CONFIRMATION
========================================= */

function showEventDeleteConfirmation(
    eventId
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
       CHANGE MODAL TEXT FOR EVENTS
    ===================================== */

    if (title) {

        title.textContent =
            "Delete Event?";
    }


    const modalMessage =
        modal.querySelector(
            ".delete-confirm-content p"
        );

    if (modalMessage) {

        modalMessage.textContent =
            "Are you sure you want to delete this event? This action cannot be undone.";
    }


    confirmButton.textContent =
        "Delete Event";


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

            await performAdminEventDelete(
                eventId
            );
        };
}


/* =========================================
   PERFORM EVENT DELETE
========================================= */

async function performAdminEventDelete(
    eventId
) {

    if (!eventId) {

        showEventMessage(
            "No event was selected.",
            "error"
        );

        return;
    }

    deleteEventButton.disabled = true;

    showEventMessage(
        "Deleting event...",
        "loading"
    );

    try {

        console.log(
            "Deleting event:",
            eventId
        );


        const { error } =
            await kingdomAdminSupabase
                .from("events")
                .delete()
                .eq(
                    "id",
                    eventId
                );


        if (error) {

            throw error;
        }


        console.log(
            "EVENT DELETED SUCCESSFULLY:",
            eventId
        );


        showEventMessage(
            "Event deleted successfully.",
            "success"
        );


        /* ==============================
           CLEAR EDITOR
        ============================== */

        editEventId.value = "";


        /* ==============================
           RELOAD EVENTS
        ============================== */

        await loadEvents();


        /* ==============================
           CLOSE EDITOR
        ============================== */

        setTimeout(() => {

            closeEventEditor();

        }, 800);


    } catch (error) {

        console.error(
            "Error deleting event:",
            error
        );


        showEventMessage(
            error.message ||
            "Unable to delete event.",
            "error"
        );


    } finally {

        deleteEventButton.disabled = false;
    }
}

    /* =========================================
       CLOSE EDITOR
    ========================================= */

    function closeEventEditor() {

        adminEventEditor.hidden = true;

        eventEditorForm.reset();

        editEventId.value = "";

        eventSaveMessage.textContent = "";

    }


    /* =========================================
       FORMAT DATE
    ========================================= */

    function formatEventDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );

    }


    /* =========================================
       ESCAPE HTML
    ========================================= */

    function escapeHtml(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =========================================
       SAVE MESSAGE
    ========================================= */

    function showEventMessage(
        message,
        type
    ) {

        eventSaveMessage.textContent =
            message;

        eventSaveMessage.dataset.type =
            type;

    }

});