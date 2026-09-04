
/* =========================================
   AGBOR KINGDOM ADMIN
   CONTACT MESSAGES MANAGEMENT
========================================= */

console.log("Agbor Kingdom Contact Messages JS loaded");


/* =========================================
   ELEMENTS
========================================= */

const manageContactMessagesButton =
    document.getElementById(
        "manageContactMessagesButton"
    );

const adminContactMessagesPanel =
    document.getElementById(
        "adminContactMessagesPanel"
    );

const adminContactMessageList =
    document.getElementById(
        "adminContactMessageList"
    );

const adminContactMessageCount =
    document.getElementById(
        "adminContactMessageCount"
    );

const adminContactMessageViewer =
    document.getElementById(
        "adminContactMessageViewer"
    );

const contactMessageStatus =
    document.getElementById(
        "contactMessageStatus"
    );

const contactMessageHeading =
    document.getElementById(
        "contactMessageHeading"
    );

const viewContactName =
    document.getElementById(
        "viewContactName"
    );

const viewContactEmail =
    document.getElementById(
        "viewContactEmail"
    );

const viewContactPhone =
    document.getElementById(
        "viewContactPhone"
    );

const viewContactSubject =
    document.getElementById(
        "viewContactSubject"
    );

const viewContactDate =
    document.getElementById(
        "viewContactDate"
    );

const viewContactMessage =
    document.getElementById(
        "viewContactMessage"
    );

const contactMessageSaveMessage =
    document.getElementById(
        "contactMessageSaveMessage"
    );

const markContactMessageReadButton =
    document.getElementById(
        "markContactMessageReadButton"
    );

const replyContactMessageButton =
    document.getElementById(
        "replyContactMessageButton"
    );

const deleteContactMessageButton =
    document.getElementById(
        "deleteContactMessageButton"
    );

const cancelContactMessageButton =
    document.getElementById(
        "cancelContactMessageButton"
    );


/* =========================================
   CURRENT MESSAGE
========================================= */

let selectedContactMessage = null;


/* =========================================
   OPEN CONTACT MESSAGES MANAGEMENT
========================================= */

if (manageContactMessagesButton) {

    console.log(
        "Manage Contact Messages button found."
    );

    manageContactMessagesButton.addEventListener(
        "click",
        function () {

            console.log(
                "Manage Contact Messages clicked."
            );

            if (adminContactMessagesPanel) {

                adminContactMessagesPanel.hidden =
                    false;

                adminContactMessagesPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

            loadContactMessages();

        }
    );

} else {

    console.error(
        "Manage Contact Messages button NOT FOUND."
    );

}


/* =========================================
   LOAD CONTACT MESSAGES
========================================= */

async function loadContactMessages() {

    if (!adminContactMessageList) {
        return;
    }

    adminContactMessageList.innerHTML = `

        <p class="admin-loading">
            Loading enquiries...
        </p>

    `;

    try {

        const {
            data,
            error
        } = await kingdomAdminSupabase

            .from("contact_messages")

            .select("*")

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
            "CONTACT MESSAGES:",
            data
        );


        renderContactMessages(
            data || []
        );


    } catch (error) {

        console.error(
            "Error loading contact messages:",
            error
        );

        adminContactMessageList.innerHTML = `

            <p class="admin-loading">
                Unable to load contact messages.
            </p>

        `;

    }

}


/* =========================================
   RENDER CONTACT MESSAGES
========================================= */

function renderContactMessages(messages) {

    if (!adminContactMessageList) {
        return;
    }


    /* =====================================
       COUNT
    ====================================== */

  if (adminContactMessageCount) {

    const unreadCount =
        messages.filter(
            message => !message.is_read
        ).length;

    const messageText =
        messages.length === 1
            ? "message"
            : "messages";

    const unreadText =
        unreadCount === 1
            ? "1 unread"
            : `${unreadCount} unread`;

    adminContactMessageCount.textContent =
        `${messages.length} ${messageText} · ${unreadText}`;

}


    /* =====================================
       EMPTY
    ====================================== */

    if (!messages.length) {

        adminContactMessageList.innerHTML = `

            <div class="admin-no-news">

                <p>
                    No contact enquiries have been received.
                </p>

            </div>

        `;

        return;

    }


    /* =====================================
       CLEAR LIST
    ====================================== */

    adminContactMessageList.innerHTML = "";


    /* =====================================
       CREATE MESSAGE ITEMS
    ====================================== */

    messages.forEach(
        function (contactMessage, index) {

            const item =
                document.createElement("article");

            item.className =
                "admin-news-item";

            item.dataset.contactMessageId =
                contactMessage.id;


            if (contactMessage.is_read) {

                item.classList.add(
                    "contact-message-read"
                );

            } else {

                item.classList.add(
                    "contact-message-unread"
                );

            }


            const date =
                formatContactMessageDate(
                    contactMessage.created_at
                );


            item.innerHTML = `

                <div class="admin-news-number">

                    ${String(index + 1).padStart(2, "0")}

                </div>


                <div class="admin-news-content">

                    <div class="admin-news-category">

                        ${
                            contactMessage.is_read
                                ? "CORRESPONDENCE"
                                : "NEW ENQUIRY"
                        }

                    </div>


                    <h4>

                        ${escapeContactHTML(
                            contactMessage.name
                        )}

                    </h4>


                    <p>

                        ${escapeContactHTML(
                            contactMessage.subject
                        )}

                    </p>


                    <div class="contact-message-meta">

                        <span class="contact-message-email">

                            ${escapeContactHTML(
                                contactMessage.email
                            )}

                        </span>


                        <span class="contact-message-date">

                            ${escapeContactHTML(
                                date
                            )}

                        </span>

                    </div>

                </div>


                <div
                    class="${
                        contactMessage.is_read
                            ? "contact-message-read-badge"
                            : "contact-message-unread-badge"
                    }"
                >

                    ${
                        contactMessage.is_read
                            ? "Read"
                            : "Unread"
                    }

                </div>

            `;


            adminContactMessageList.appendChild(
                item
            );


            /* =================================
               OPEN MESSAGE
            ================================== */

            item.addEventListener(
                "click",
                function () {

                    openContactMessage(
                        contactMessage
                    );

                }
            );

        }
    );

}


/* =========================================
   OPEN CONTACT MESSAGE
========================================= */

async function openContactMessage(
    contactMessage
) {

    selectedContactMessage =
        contactMessage;


    if (viewContactName) {

        viewContactName.textContent =
            contactMessage.name || "—";

    }


    if (viewContactEmail) {

        viewContactEmail.textContent =
            contactMessage.email || "—";

    }


    if (viewContactPhone) {

        viewContactPhone.textContent =
            contactMessage.phone || "Not provided";

    }


    if (viewContactSubject) {

        viewContactSubject.textContent =
            contactMessage.subject || "—";

    }


    if (viewContactDate) {

        viewContactDate.textContent =
            formatContactMessageDate(
                contactMessage.created_at
            );

    }


    if (viewContactMessage) {

        viewContactMessage.textContent =
            contactMessage.message || "—";

    }


    if (contactMessageHeading) {

        contactMessageHeading.textContent =
            contactMessage.subject ||
            "Contact Enquiry";

    }


    updateContactMessageStatus(
        contactMessage.is_read
    );


    if (contactMessageSaveMessage) {

        contactMessageSaveMessage.textContent =
            "";

    }


    if (adminContactMessageViewer) {

        adminContactMessageViewer.hidden =
            false;

        adminContactMessageViewer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =====================================
       AUTOMATICALLY MARK AS READ
    ====================================== */

    if (!contactMessage.is_read) {

        await markContactMessageAsRead(
            contactMessage.id
        );

    }

}


/* =========================================
   UPDATE STATUS DISPLAY
========================================= */

function updateContactMessageStatus(
    isRead
) {

    if (!contactMessageStatus) {
        return;
    }


    contactMessageStatus.classList.remove(
        "read",
        "unread"
    );


    if (isRead) {

        contactMessageStatus.textContent =
            "Read Message";

        contactMessageStatus.classList.add(
            "read"
        );

    } else {

        contactMessageStatus.textContent =
            "Unread Message";

        contactMessageStatus.classList.add(
            "unread"
        );

    }

}


/* =========================================
   MARK MESSAGE AS READ
========================================= */

async function markContactMessageAsRead(
    messageId
) {

    if (!messageId) {
        return;
    }


    try {

        const { error } =
            await kingdomAdminSupabase

                .from("contact_messages")

                .update({
                    is_read: true
                })

                .eq(
                    "id",
                    messageId
                );


        if (error) {
            throw error;
        }


        if (selectedContactMessage) {

            selectedContactMessage.is_read =
                true;

        }


        updateContactMessageStatus(
            true
        );


        if (markContactMessageReadButton) {

            markContactMessageReadButton.disabled =
                true;

            markContactMessageReadButton.textContent =
                "Message Read";

        }


        await loadContactMessages();


    } catch (error) {

        console.error(
            "Error marking contact message as read:",
            error
        );

    }

}


/* =========================================
   MANUAL MARK AS READ BUTTON
========================================= */

if (markContactMessageReadButton) {

    markContactMessageReadButton.addEventListener(
        "click",
        async function () {

            if (!selectedContactMessage) {
                return;
            }


            if (selectedContactMessage.is_read) {
                return;
            }


            await markContactMessageAsRead(
                selectedContactMessage.id
            );

        }
    );

}


/* =========================================
   REPLY BY EMAIL
========================================= */

if (replyContactMessageButton) {

    replyContactMessageButton.addEventListener(
        "click",
        function () {

            if (!selectedContactMessage) {
                return;
            }


            const email =
                selectedContactMessage.email;


            if (!email) {
                return;
            }


            const subject =
                encodeURIComponent(
                    `Re: ${selectedContactMessage.subject || "Your enquiry to Agbor Kingdom"}`
                );


            const body =
                encodeURIComponent(
                    `Dear ${selectedContactMessage.name || "Sir/Madam"},\n\n` +
                    `Thank you for contacting the Royal Kingdom of Agbor.\n\n` +
                    `We have received your enquiry regarding "${selectedContactMessage.subject || "your enquiry"}".\n\n` +
                    `Kind regards,\n` +
                    `Royal Kingdom of Agbor\n` +
                    `Official Correspondence`
                );


            window.location.href =
                `mailto:${email}?subject=${subject}&body=${body}`;

        }
    );

}


/* =========================================
   CLOSE MESSAGE VIEWER
========================================= */

if (cancelContactMessageButton) {

    cancelContactMessageButton.addEventListener(
        "click",
        function () {

            closeContactMessageViewer();

        }
    );

}


function closeContactMessageViewer() {

    if (adminContactMessageViewer) {

        adminContactMessageViewer.hidden =
            true;

    }


    selectedContactMessage =
        null;

}


/* =========================================
   DELETE CONFIRMATION
========================================= */

function showContactMessageDeleteConfirmation(
    messageId
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
    ====================================== */

    if (title) {

        title.textContent =
            "Delete Contact Message?";

    }


    /* =====================================
       MODAL MESSAGE
    ====================================== */

    const modalMessage =
        modal.querySelector(
            ".delete-confirm-content p"
        );


    if (modalMessage) {

        modalMessage.textContent =
            "Are you sure you want to delete this enquiry? This action cannot be undone.";

    }


    confirmButton.textContent =
        "Delete Message";


    /* =====================================
       SHOW MODAL
    ====================================== */

    modal.hidden = false;

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    /* =====================================
       CONFIRM DELETE
    ====================================== */

    confirmButton.onclick = async function () {

        confirmButton.blur();

        modal.hidden = true;

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        await performContactMessageDelete(
            messageId
        );

    };

}


/* =========================================
   DELETE BUTTON
========================================= */

if (deleteContactMessageButton) {

    deleteContactMessageButton.addEventListener(
        "click",
        function () {

            if (!selectedContactMessage) {
                return;
            }


            showContactMessageDeleteConfirmation(
                selectedContactMessage.id
            );

        }
    );

}


/* =========================================
   PERFORM DELETE
========================================= */

async function performContactMessageDelete(
    messageId
) {

    if (!messageId) {
        return;
    }


    if (contactMessageSaveMessage) {

        contactMessageSaveMessage.textContent =
            "Deleting enquiry...";

    }


    if (deleteContactMessageButton) {

        deleteContactMessageButton.disabled =
            true;

        deleteContactMessageButton.textContent =
            "Deleting...";

    }


    try {

        const { error } =
            await kingdomAdminSupabase

                .from("contact_messages")

                .delete()

                .eq(
                    "id",
                    messageId
                );


        if (error) {
            throw error;
        }


        if (contactMessageSaveMessage) {

            contactMessageSaveMessage.textContent =
                "Enquiry deleted successfully.";

        }


        selectedContactMessage =
            null;


        await loadContactMessages();


        setTimeout(
            function () {

                closeContactMessageViewer();

            },
            800
        );


    } catch (error) {

        console.error(
            "Error deleting contact message:",
            error
        );


        if (contactMessageSaveMessage) {

            contactMessageSaveMessage.textContent =
                error.message ||
                "Unable to delete enquiry.";

        }

    } finally {

        if (deleteContactMessageButton) {

            deleteContactMessageButton.disabled =
                false;

            deleteContactMessageButton.textContent =
                "Delete Message";

        }

    }

}


/* =========================================
   FORMAT DATE
========================================= */

function formatContactMessageDate(
    dateValue
) {

    if (!dateValue) {
        return "Unknown date";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }


    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeContactHTML(
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

