/* =========================================
   AGBOR KINGDOM ADMIN
   PAGE & PAGE SECTION MANAGEMENT
========================================= */

console.log("Agbor Kingdom Page JS loaded");


/* =========================================
   PAGE ELEMENTS
========================================= */

const adminPageList =
    document.getElementById("adminPageList");

const pageEditorEmpty =
    document.getElementById("pageEditorEmpty");

const pageEditorForm =
    document.getElementById("pageEditorForm");

const editPageId =
    document.getElementById("editPageId");

const editPageHeading =
    document.getElementById("editPageHeading");

const editPageTitle =
    document.getElementById("editPageTitle");

const editPageSubtitle =
    document.getElementById("editPageSubtitle");

const editPageHeroImage =
    document.getElementById("editPageHeroImage");

const editPagePublished =
    document.getElementById("editPagePublished");

const editPageStatus =
    document.getElementById("editPageStatus");


/* =========================================
   PAGE SECTION ELEMENTS
========================================= */

const adminSectionsPanel =
    document.getElementById("adminSectionsPanel");

const adminSectionList =
    document.getElementById("adminSectionList");

const adminSectionCount =
    document.getElementById("adminSectionCount");

const adminSectionEditor =
    document.getElementById("adminSectionEditor");

const pageSectionEditorForm =
    document.getElementById("pageSectionEditorForm");

const editSectionId =
    document.getElementById("editSectionId");

const editSectionHeading =
    document.getElementById("editSectionHeading");

const editSectionType =
    document.getElementById("editSectionType");

const editSectionLabel =
    document.getElementById("editSectionLabel");

const editSectionTitle =
    document.getElementById("editSectionTitle");

const editSectionSubtitle =
    document.getElementById("editSectionSubtitle");

const editSectionContent =
    document.getElementById("editSectionContent");

const editSectionImage =
    document.getElementById("editSectionImage");

const editSectionButtonText =
    document.getElementById("editSectionButtonText");

const editSectionButtonLink =
    document.getElementById("editSectionButtonLink");

const editSectionSortOrder =
    document.getElementById("editSectionSortOrder");

const editSectionActive =
    document.getElementById("editSectionActive");

const editSectionStatus =
    document.getElementById("editSectionStatus");

const sectionSaveMessage =
    document.getElementById("sectionSaveMessage");

const saveSectionButton =
    document.getElementById("saveSectionButton");

const addSectionButton =
    document.getElementById("addSectionButton");

    
/* =========================================
   MANAGE PAGES TOGGLE
========================================= */

const managePagesButton =
    document.getElementById("managePagesButton");

const pagesSection =
    document.getElementById("pagesSection");


if (managePagesButton && pagesSection) {

    managePagesButton.addEventListener(
        "click",
        function () {

            pagesSection.hidden =
                !pagesSection.hidden;

        }
    );

}

/* =========================================
   ESCAPE HTML
========================================= */

function escapePageHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   ADMIN TOAST
   USE EXISTING TOAST FROM ADMIN.JS
========================================= */

function pageToast(
    message,
    type = "warning",
    title = "Notice"
) {

    if (typeof showAdminToast === "function") {

        showAdminToast(
            message,
            type,
            title
        );

    } else {

        console.log(
            `[${type}] ${title}: ${message}`
        );

    }

}


/* =========================================
   CHECK SUPABASE
========================================= */

function pageSupabaseReady() {

    if (
        typeof kingdomAdminSupabase ===
        "undefined"
    ) {

        console.error(
            "Page JS: kingdomAdminSupabase is not available."
        );

        pageToast(
            "Supabase connection is not available.",
            "error",
            "Connection Error"
        );

        return false;
    }

    return true;
}


/* =========================================
   LOAD KINGDOM PAGES
========================================= */

async function loadAdminPages() {

    if (!adminPageList) {
        return;
    }

    if (!pageSupabaseReady()) {
        return;
    }

    adminPageList.innerHTML = `
        <p class="admin-loading">
            Loading kingdom pages...
        </p>
    `;

    try {

        console.log(
            "Loading kingdom pages..."
        );

        const {
            data: pages,
            error
        } =
            await kingdomAdminSupabase
                .from("kingdom_pages")
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
            "ADMIN KINGDOM PAGES:",
            pages
        );

        renderAdminPageList(
            pages || []
        );

    } catch (error) {

        console.error(
            "Admin pages loading failed:",
            error
        );

        adminPageList.innerHTML = `
            <p class="admin-loading">
                Unable to load kingdom pages.
            </p>
        `;

        pageToast(
            "Unable to load kingdom pages.",
            "error",
            "Loading Failed"
        );
    }
}


/* =========================================
   RENDER PAGE LIST
========================================= */

function renderAdminPageList(pages) {

    if (!adminPageList) {
        return;
    }

    if (!pages.length) {

        adminPageList.innerHTML = `
            <p class="admin-loading">
                No kingdom pages found.
            </p>
        `;

        return;
    }

    adminPageList.innerHTML =
        pages.map(page => {

            const title =
                escapePageHTML(
                    page.title ||
                    page.slug ||
                    "Untitled Page"
                );

            const slug =
                escapePageHTML(
                    page.slug || ""
                );

            const status =
                page.is_published
                    ? "Published"
                    : "Draft";

            return `
                <button
                    type="button"
                    class="admin-page-item"
                    data-page-id="${escapePageHTML(page.id)}"
                >

                    <span class="admin-page-item-title">
                        ${title}
                    </span>

                    <span class="admin-page-item-slug">
                        ${slug}
                    </span>

                    <span
                        class="admin-page-item-status ${
                            page.is_published
                                ? "published"
                                : "draft"
                        }"
                    >
                        ${status}
                    </span>

                </button>
            `;

        }).join("");


    const pageButtons =
        adminPageList.querySelectorAll(
            ".admin-page-item"
        );


    pageButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const pageId =
                    button.dataset.pageId;

                loadAdminPageForEditing(
                    pageId,
                    pages
                );

            }
        );

    });

}


/* =========================================
   LOAD SELECTED PAGE
========================================= */

function loadAdminPageForEditing(
    pageId,
    pages
) {

    if (!pageId) {
        return;
    }

    const page =
        pages.find(
            item => item.id === pageId
        );

    if (!page) {

        console.error(
            "Admin: Page not found:",
            pageId
        );

        return;
    }

    console.log(
        "ADMIN SELECTED PAGE:",
        page
    );


    /* STORE PAGE ID */

    if (editPageId) {
        editPageId.value =
            page.id || "";
    }


    /* SHOW PAGE EDITOR */

    if (pageEditorEmpty) {
        pageEditorEmpty.hidden = true;
    }

    if (pageEditorForm) {
        pageEditorForm.hidden = false;
    }


    /* PAGE HEADING */

    if (editPageHeading) {

        editPageHeading.textContent =
            page.title ||
            page.slug ||
            "Page";
    }


    /* PAGE TITLE */

    if (editPageTitle) {

        editPageTitle.value =
            page.title || "";
    }


    /* PAGE SUBTITLE */

    if (editPageSubtitle) {

        editPageSubtitle.value =
            page.subtitle || "";
    }


    /* HERO IMAGE */

    if (editPageHeroImage) {

        editPageHeroImage.value =
            page.hero_image || "";
    }


    /* PUBLISHED */

    if (editPagePublished) {

        editPagePublished.checked =
            page.is_published === true;
    }


    /* PAGE STATUS */

    if (editPageStatus) {

        editPageStatus.textContent =
            page.is_published
                ? "Published"
                : "Draft";

        editPageStatus.classList.toggle(
            "draft",
            !page.is_published
        );

        editPageStatus.classList.toggle(
            "published",
            page.is_published
        );
    }


    /* HIGHLIGHT PAGE */

    document
        .querySelectorAll(
            ".admin-page-item"
        )
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    const selectedButton =
        document.querySelector(
            `[data-page-id="${CSS.escape(page.id)}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "selected"
        );

    }


    /* LOAD PAGE SECTIONS */

    loadAdminPageSections(
        page.id
    );

}


/* =========================================
   LOAD PAGE SECTIONS
========================================= */

async function loadAdminPageSections(
    pageId
) {

    if (!adminSectionList) {
        return;
    }

    if (!pageId) {

        adminSectionList.innerHTML = `
            <p class="admin-loading">
                Select a page to view its sections.
            </p>
        `;

        if (adminSectionCount) {
            adminSectionCount.textContent =
                "0 sections";
        }

        return;
    }


    adminSectionList.innerHTML = `
        <p class="admin-loading">
            Loading sections...
        </p>
    `;


    try {

        console.log(
            "Loading sections for page:",
            pageId
        );


        const {
            data: sections,
            error
        } =
            await kingdomAdminSupabase
                .from("page_sections")
                .select(`
                    id,
                    page_id,
                    section_type,
                    label,
                    title,
                    subtitle,
                    content,
                    image_url,
                    button_text,
                    button_link,
                    sort_order,
                    is_active
                `)
                .eq(
                    "page_id",
                    pageId
                )
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
            "ADMIN PAGE SECTIONS:",
            sections
        );


        renderAdminPageSections(
            sections || []
        );


    } catch (error) {

        console.error(
            "Admin page sections loading failed:",
            error
        );

        adminSectionList.innerHTML = `
            <p class="admin-loading">
                Unable to load page sections.
            </p>
        `;

        if (adminSectionCount) {

            adminSectionCount.textContent =
                "Unable to load";

        }

    }

}


/* =========================================
   RENDER PAGE SECTIONS
========================================= */

function renderAdminPageSections(
    sections
) {

    if (!adminSectionList) {
        return;
    }


    if (!sections.length) {

        adminSectionList.innerHTML = `
            <div class="admin-no-sections">
                <p>
                    No sections found for this page.
                </p>
            </div>
        `;

        if (adminSectionCount) {

            adminSectionCount.textContent =
                "0 sections";

        }

        return;
    }


    if (adminSectionCount) {

        adminSectionCount.textContent =
            `${sections.length} ${
                sections.length === 1
                    ? "section"
                    : "sections"
            }`;

    }


    adminSectionList.innerHTML =
        sections.map(
            (section, index) => {

                const title =
                    escapePageHTML(
                        section.title ||
                        "Untitled Section"
                    );

                const label =
                    escapePageHTML(
                        section.label ||
                        ""
                    );

                const subtitle =
                    escapePageHTML(
                        section.subtitle ||
                        ""
                    );

                const type =
                    escapePageHTML(
                        section.section_type ||
                        "content"
                    );

                const image =
                    section.image_url ||
                    "";


                return `
                    <article
                        class="admin-section-item"
                        data-section-id="${escapePageHTML(section.id)}"
                    >

                        <div class="admin-section-number">
                            ${index + 1}
                        </div>

                        ${
                            image
                                ? `
                                    <div class="admin-section-image">
                                        <img
                                            src="${escapePageHTML(image)}"
                                            alt=""
                                        >
                                    </div>
                                `
                                : ""
                        }

                        <div class="admin-section-content">

                            ${
                                label
                                    ? `
                                        <div class="admin-section-label">
                                            ${label}
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="admin-section-type">
                                ${type}
                            </div>

                            <h4>
                                ${title}
                            </h4>

                            ${
                                subtitle
                                    ? `
                                        <p>
                                            ${subtitle}
                                        </p>
                                    `
                                    : ""
                            }

                        </div>


                        <div class="admin-section-actions">

                            <div
                                class="admin-section-status ${
                                    section.is_active
                                        ? "active"
                                        : "inactive"
                                }"
                            >
                                ${
                                    section.is_active
                                        ? "Active"
                                        : "Inactive"
                                }
                            </div>

                            <button
                                type="button"
                                class="admin-delete-section-button"
                                data-section-id="${escapePageHTML(section.id)}"
                            >
                                Delete
                            </button>

                        </div>

                    </article>
                `;

            }
        ).join("");


    /* DELETE */

    adminSectionList.onclick =
        function (event) {

            const deleteButton =
                event.target.closest(
                    ".admin-delete-section-button"
                );

            if (!deleteButton) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();


            const sectionId =
                deleteButton.dataset.sectionId;


            if (!sectionId) {

                pageToast(
                    "Unable to identify this section.",
                    "error",
                    "Delete Failed"
                );

                return;
            }


            showPageSectionDeleteConfirmation(
                sectionId
            );

        };


    /* SECTION CLICK */

    const sectionItems =
        adminSectionList.querySelectorAll(
            ".admin-section-item"
        );


    sectionItems.forEach(item => {

        item.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        ".admin-delete-section-button"
                    )
                ) {
                    return;
                }


                const sectionId =
                    item.dataset.sectionId;


                loadAdminSectionForEditing(
                    sectionId,
                    sections
                );

            }
        );

    });

}


/* =========================================
   LOAD SELECTED SECTION
========================================= */

function loadAdminSectionForEditing(
    sectionId,
    sections
) {

    const section =
        sections.find(
            item => item.id === sectionId
        );


    if (!section) {
        return;
    }


    if (adminSectionEditor) {

        adminSectionEditor.hidden =
            false;

    }


    if (editSectionId) {

        editSectionId.value =
            section.id || "";

    }


    if (editSectionHeading) {

        editSectionHeading.textContent =
            section.title ||
            "Edit Section";

    }


    if (editSectionType) {

        editSectionType.value =
            section.section_type ||
            "content";

        editSectionType.readOnly =
            false;

    }


    if (editSectionLabel) {

        editSectionLabel.value =
            section.label || "";

    }


    if (editSectionTitle) {

        editSectionTitle.value =
            section.title || "";

    }


    if (editSectionSubtitle) {

        editSectionSubtitle.value =
            section.subtitle || "";

    }


    if (editSectionContent) {

        editSectionContent.value =
            section.content || "";

    }


    if (editSectionImage) {

        editSectionImage.value =
            section.image_url || "";

    }


    if (editSectionButtonText) {

        editSectionButtonText.value =
            section.button_text || "";

    }


    if (editSectionButtonLink) {

        editSectionButtonLink.value =
            section.button_link || "";

    }


    if (editSectionSortOrder) {

        editSectionSortOrder.value =
            section.sort_order ?? 0;

    }


    if (editSectionActive) {

        editSectionActive.checked =
            section.is_active === true;

    }


    if (editSectionStatus) {

        editSectionStatus.textContent =
            section.is_active
                ? "Active"
                : "Inactive";

        editSectionStatus.classList.toggle(
            "active",
            section.is_active
        );

        editSectionStatus.classList.toggle(
            "inactive",
            !section.is_active
        );

    }


    if (saveSectionButton) {

        saveSectionButton.textContent =
            "Save Section";

    }


    if (sectionSaveMessage) {

        sectionSaveMessage.textContent =
            "";

        sectionSaveMessage.classList.remove(
            "success",
            "error"
        );

    }


    document
        .querySelectorAll(
            ".admin-section-item"
        )
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


    const selectedSection =
        document.querySelector(
            `[data-section-id="${CSS.escape(section.id)}"]`
        );


    if (selectedSection) {

        selectedSection.classList.add(
            "selected"
        );

    }

}


/* =========================================
   PREPARE NEW SECTION
========================================= */

function prepareNewSection() {

    const pageId =
        editPageId
            ? editPageId.value
            : "";


    if (!pageId) {

        pageToast(
            "Select a kingdom page before adding a new section.",
            "warning",
            "No Page Selected"
        );

        return;
    }


    if (adminSectionEditor) {

        adminSectionEditor.hidden =
            false;

    }


    if (editSectionId) {

        editSectionId.value = "";

    }


    if (editSectionType) {

        editSectionType.value =
            "content";

        editSectionType.readOnly =
            false;

        editSectionType.placeholder =
            "e.g. content, hero, timeline, card";

    }


    if (editSectionLabel) {
        editSectionLabel.value = "";
    }


    if (editSectionTitle) {
        editSectionTitle.value = "";
    }


    if (editSectionSubtitle) {
        editSectionSubtitle.value = "";
    }


    if (editSectionContent) {
        editSectionContent.value = "";
    }


    if (editSectionImage) {
        editSectionImage.value = "";
    }


    if (editSectionButtonText) {
        editSectionButtonText.value = "";
    }


    if (editSectionButtonLink) {
        editSectionButtonLink.value = "";
    }


    if (editSectionSortOrder) {
        editSectionSortOrder.value = "0";
    }


    if (editSectionActive) {
        editSectionActive.checked = true;
    }


    if (editSectionHeading) {

        editSectionHeading.textContent =
            "Create New Section";

    }


    if (editSectionStatus) {

        editSectionStatus.textContent =
            "New Section";

        editSectionStatus.classList.remove(
            "inactive"
        );

        editSectionStatus.classList.add(
            "active"
        );

    }


    if (saveSectionButton) {

        saveSectionButton.textContent =
            "Create Section";

    }


    if (sectionSaveMessage) {

        sectionSaveMessage.textContent = "";

        sectionSaveMessage.classList.remove(
            "success",
            "error"
        );

    }


    document
        .querySelectorAll(
            ".admin-section-item"
        )
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });

}


/* =========================================
   ADD SECTION BUTTON
========================================= */

if (addSectionButton) {

    addSectionButton.addEventListener(
        "click",
        prepareNewSection
    );

}


/* =========================================
   SAVE PAGE
========================================= */

if (pageEditorForm) {

    pageEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const pageId =
                editPageId
                    ? editPageId.value
                    : "";


            if (!pageId) {

                pageToast(
                    "Select a kingdom page before saving.",
                    "warning",
                    "No Page Selected"
                );

                return;
            }


            const title =
                editPageTitle
                    ? editPageTitle.value.trim()
                    : "";

            const subtitle =
                editPageSubtitle
                    ? editPageSubtitle.value.trim()
                    : "";

            const heroImage =
                editPageHeroImage
                    ? editPageHeroImage.value.trim()
                    : "";

            const isPublished =
                editPagePublished
                    ? editPagePublished.checked
                    : false;


            const saveMessage =
                document.getElementById(
                    "pageSaveMessage"
                );

            const saveButton =
                pageEditorForm.querySelector(
                    ".admin-save-button"
                );


            try {

                if (saveButton) {

                    saveButton.disabled =
                        true;

                    saveButton.textContent =
                        "Saving...";

                }


                const {
                    data,
                    error
                } =
                    await kingdomAdminSupabase
                        .from("kingdom_pages")
                        .update({

                            title: title,

                            subtitle: subtitle,

                            hero_image:
                                heroImage,

                            is_published:
                                isPublished

                        })
                        .eq(
                            "id",
                            pageId
                        )
                        .select()
                        .single();


                if (error) {
                    throw error;
                }


                if (saveMessage) {

                    saveMessage.textContent =
                        "Changes saved successfully.";

                    saveMessage.classList.add(
                        "success"
                    );

                }


                if (editPageHeading) {

                    editPageHeading.textContent =
                        data.title ||
                        "Page";

                }


                if (editPageStatus) {

                    editPageStatus.textContent =
                        data.is_published
                            ? "Published"
                            : "Draft";

                }


                await loadAdminPages();


                pageToast(
                    "The page has been updated successfully.",
                    "success",
                    "Page Updated"
                );


            } catch (error) {

                console.error(
                    "Admin page save failed:",
                    error
                );


                if (saveMessage) {

                    saveMessage.textContent =
                        "Unable to save changes.";

                    saveMessage.classList.add(
                        "error"
                    );

                }


                pageToast(
                    error.message ||
                    "Unable to save the page.",
                    "error",
                    "Save Failed"
                );


            } finally {

                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "Save Changes";

                }

            }

        }
    );

}


/* =========================================
   SAVE PAGE SECTION
========================================= */

if (pageSectionEditorForm) {

    pageSectionEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const pageId =
                editPageId
                    ? editPageId.value
                    : "";


            if (!pageId) {

                pageToast(
                    "Select a kingdom page before creating or editing a section.",
                    "warning",
                    "No Page Selected"
                );

                return;
            }


            const sectionId =
                editSectionId
                    ? editSectionId.value.trim()
                    : "";


            const sectionType =
                editSectionType
                    ? editSectionType.value.trim()
                    : "content";


            const label =
                editSectionLabel
                    ? editSectionLabel.value.trim()
                    : "";


            const title =
                editSectionTitle
                    ? editSectionTitle.value.trim()
                    : "";


            const subtitle =
                editSectionSubtitle
                    ? editSectionSubtitle.value.trim()
                    : "";


            const content =
                editSectionContent
                    ? editSectionContent.value.trim()
                    : "";


            const imageUrl =
                editSectionImage
                    ? editSectionImage.value.trim()
                    : "";


            const buttonText =
                editSectionButtonText
                    ? editSectionButtonText.value.trim()
                    : "";


            const buttonLink =
                editSectionButtonLink
                    ? editSectionButtonLink.value.trim()
                    : "";


            const sortOrder =
                editSectionSortOrder
                    ? Number(
                        editSectionSortOrder.value
                    ) || 0
                    : 0;


            const isActive =
                editSectionActive
                    ? editSectionActive.checked
                    : false;


            const wasNewSection =
                !sectionId;


            try {

                if (saveSectionButton) {

                    saveSectionButton.disabled =
                        true;

                    saveSectionButton.textContent =
                        "Saving...";

                }


                if (sectionSaveMessage) {

                    sectionSaveMessage.textContent =
                        "";

                    sectionSaveMessage.classList.remove(
                        "success",
                        "error"
                    );

                }


                let data = null;
                let error = null;


                /* =========================
                   UPDATE EXISTING SECTION
                ========================= */

                if (!wasNewSection) {

                    const result =
                        await kingdomAdminSupabase
                            .from("page_sections")
                            .update({

                                section_type:
                                    sectionType,

                                label:
                                    label,

                                title:
                                    title,

                                subtitle:
                                    subtitle,

                                content:
                                    content,

                                image_url:
                                    imageUrl,

                                button_text:
                                    buttonText,

                                button_link:
                                    buttonLink,

                                sort_order:
                                    sortOrder,

                                is_active:
                                    isActive

                            })
                            .eq(
                                "id",
                                sectionId
                            )
                            .eq(
                                "page_id",
                                pageId
                            )
                            .select()
                            .single();


                    data =
                        result.data;

                    error =
                        result.error;

                }


                /* =========================
                   CREATE NEW SECTION
                ========================= */

                else {

                    const result =
                        await kingdomAdminSupabase
                            .from("page_sections")
                            .insert({

                                page_id:
                                    pageId,

                                section_type:
                                    sectionType,
                                    

                                label:
                                    label,

                                title:
                                    title,

                                subtitle:
                                    subtitle,

                                content:
                                    content,

                                image_url:
                                    imageUrl,

                                button_text:
                                    buttonText,

                                button_link:
                                    buttonLink,

                                sort_order:
                                    sortOrder,

                                is_active:
                                    isActive

                            })
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


                /* =========================
                   UPDATE EDITOR
                ========================= */

                if (data) {

                    if (editSectionId) {

                        editSectionId.value =
                            data.id || "";

                    }

                    if (editSectionHeading) {

                        editSectionHeading.textContent =
                            data.title ||
                            "Edit Section";

                    }

                    if (editSectionType) {

                        editSectionType.value =
                            data.section_type ||
                            "content";

                        editSectionType.readOnly =
                            true;

                    }

                    if (editSectionLabel) {

                        editSectionLabel.value =
                            data.label || "";

                    }

                    if (editSectionTitle) {

                        editSectionTitle.value =
                            data.title || "";

                    }

                    if (editSectionSubtitle) {

                        editSectionSubtitle.value =
                            data.subtitle || "";

                    }

                    if (editSectionContent) {

                        editSectionContent.value =
                            data.content || "";

                    }

                    if (editSectionImage) {

                        editSectionImage.value =
                            data.image_url || "";

                    }

                    if (editSectionButtonText) {

                        editSectionButtonText.value =
                            data.button_text || "";

                    }

                    if (editSectionButtonLink) {

                        editSectionButtonLink.value =
                            data.button_link || "";

                    }

                    if (editSectionSortOrder) {

                        editSectionSortOrder.value =
                            data.sort_order ?? 0;

                    }

                    if (editSectionActive) {

                        editSectionActive.checked =
                            data.is_active === true;

                    }

                }


                if (sectionSaveMessage) {

                    sectionSaveMessage.textContent =
                        wasNewSection
                            ? "New section created successfully."
                            : "Section updated successfully.";

                    sectionSaveMessage.classList.add(
                        "success"
                    );

                }


                pageToast(
                    wasNewSection
                        ? "The new section has been created."
                        : "The section has been updated successfully.",
                    "success",
                    wasNewSection
                        ? "Section Created"
                        : "Section Updated"
                );


                await loadAdminPageSections(
                    pageId
                );


            } catch (error) {

                console.error(
                    "Admin section save failed:",
                    error
                );


                if (sectionSaveMessage) {

                    sectionSaveMessage.textContent =
                        "Unable to save section.";

                    sectionSaveMessage.classList.add(
                        "error"
                    );

                }


                pageToast(
                    error.message ||
                    "Unable to save the section.",
                    "error",
                    "Save Failed"
                );


            } finally {

                if (saveSectionButton) {

                    saveSectionButton.disabled =
                        false;

                    saveSectionButton.textContent =
                        "Save Section";

                }

            }

        }
    );

}


/* =========================================
   DELETE CONFIRMATION
========================================= */

function showPageSectionDeleteConfirmation(
    sectionId
) {

    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );

    const confirmButton =
        document.getElementById(
            "confirmDeleteButton"
        );


    if (!modal || !confirmButton) {

        console.error(
            "Page JS: Delete confirmation modal not found."
        );

        pageToast(
            "Delete confirmation is unavailable.",
            "error",
            "Delete Failed"
        );

        return;
    }


    modal.hidden = false;

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    confirmButton.onclick =
        async function () {

            modal.hidden = true;

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            await performAdminPageSectionDelete(
                sectionId
            );

        };

}


/* =========================================
   CLOSE DELETE CONFIRMATION
========================================= */

function closePageSectionDeleteConfirmation() {

    const modal =
        document.getElementById(
            "deleteConfirmModal"
        );

    if (!modal) {
        return;
    }

    modal.hidden = true;

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.closest(
                "[data-delete-cancel]"
            )
        ) {

            closePageSectionDeleteConfirmation();

        }

    }
);


/* =========================================
   DELETE PAGE SECTION
========================================= */

async function performAdminPageSectionDelete(
    sectionId
) {

    const pageId =
        editPageId
            ? editPageId.value
            : "";


    if (!sectionId || !pageId) {

        pageToast(
            "Select a page and section first.",
            "warning",
            "No Section Selected"
        );

        return;
    }


    try {

        const {
            error
        } =
            await kingdomAdminSupabase
                .from("page_sections")
                .delete()
                .eq(
                    "id",
                    sectionId
                )
                .eq(
                    "page_id",
                    pageId
                );


        if (error) {
            throw error;
        }


        if (adminSectionEditor) {

            adminSectionEditor.hidden =
                true;

        }


        if (editSectionId) {

            editSectionId.value =
                "";

        }


        await loadAdminPageSections(
            pageId
        );


        pageToast(
            "The section has been permanently deleted.",
            "success",
            "Section Deleted"
        );


    } catch (error) {

        console.error(
            "Admin section delete failed:",
            error
        );


        pageToast(
            error.message ||
            "Unable to delete the section.",
            "error",
            "Delete Failed"
        );

    }

}


/* =========================================
   INITIALIZE PAGE MANAGEMENT
========================================= */

function initializePageManagement() {

    console.log(
        "Initializing Kingdom Page Management..."
    );

    loadAdminPages();

}


/* =========================================
   START PAGE MANAGEMENT
========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializePageManagement
    );

} else {

    initializePageManagement();

}

