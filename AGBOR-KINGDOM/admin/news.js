/* =========================================
   AGBOR KINGDOM ADMIN
   NEWS MANAGEMENT
========================================= */
console.log("NEWS JS LOADED");
console.log("Agbor Kingdom News JS loaded");


/* =========================================
   NEWS ELEMENTS
========================================= */

const adminNewsPanel =
    document.getElementById("adminNewsPanel");

const adminNewsList =
    document.getElementById("adminNewsList");

const adminNewsCount =
    document.getElementById("adminNewsCount");

const adminNewsEditor =
    document.getElementById("adminNewsEditor");

const newsEditorForm =
    document.getElementById("newsEditorForm");

const editNewsId =
    document.getElementById("editNewsId");

const editNewsHeading =
    document.getElementById("editNewsHeading");

const editNewsTitle =
    document.getElementById("editNewsTitle");

const editNewsSlug =
    document.getElementById("editNewsSlug");

const editNewsExcerpt =
    document.getElementById("editNewsExcerpt");

const editNewsContent =
    document.getElementById("editNewsContent");

const editNewsImage =
    document.getElementById("editNewsImage");

const editNewsCategory =
    document.getElementById("editNewsCategory");

const editNewsAuthor =
    document.getElementById("editNewsAuthor");

const editNewsPublishedAt =
    document.getElementById("editNewsPublishedAt");

const editNewsSortOrder =
    document.getElementById("editNewsSortOrder");

const editNewsPublished =
    document.getElementById("editNewsPublished");

const editNewsFeatured =
    document.getElementById("editNewsFeatured");

const editNewsStatus =
    document.getElementById("editNewsStatus");

const newsSaveMessage =
    document.getElementById("newsSaveMessage");

const saveNewsButton =
    document.getElementById("saveNewsButton");

const deleteNewsButton =
    document.getElementById("deleteNewsButton");

const cancelNewsButton =
    document.getElementById("cancelNewsButton");

const addNewsButton =
    document.getElementById("addNewsButton");


/* =========================================
   ADDITIONAL NEWS PHOTOS
========================================= */

const newsMediaList =
    document.getElementById("newsMediaList");

const addNewsMediaButton =
    document.getElementById("addNewsMediaButton");


function addNewsMediaRow(media = {}) {

    if (!newsMediaList) {
        return;
    }


    const row =
        document.createElement("div");

    row.className =
        "news-media-row";


    row.innerHTML = `

        <div class="admin-form-group">

            <label>
                Photo URL
            </label>

            <input
                type="url"
                class="news-media-image-url"
                placeholder="https://..."
                value="${escapeAdminHTML(media.image_url || "")}"
            >

        </div>


        <div class="admin-form-group">

            <label>
                Caption
            </label>

            <input
                type="text"
                class="news-media-caption"
                placeholder="Optional photo caption"
                value="${escapeAdminHTML(media.caption || "")}"
            >

        </div>


        <div class="admin-form-group">

            <label>
                Position
            </label>

            <select class="news-media-position">

                <option
                    value="middle"
                    ${
                        media.position === "middle"
                            ? "selected"
                            : ""
                    }
                >
                    Middle of Article
                </option>

                <option
                    value="bottom"
                    ${
                        media.position === "bottom"
                            ? "selected"
                            : ""
                    }
                >
                    Bottom of Article
                </option>

            </select>

        </div>


        <div class="admin-form-group">

            <label>
                Display Order
            </label>

            <input
                type="number"
                class="news-media-sort-order"
                value="${
                    Number.isFinite(
                        Number(media.sort_order)
                    )
                        ? Number(media.sort_order)
                        : 0
                }"
                min="0"
            >

        </div>


        <div class="admin-toggle-row">

            <div>

                <strong>
                    Active
                </strong>

                <span>
                    Show this photo on the news article.
                </span>

            </div>


            <label class="admin-switch">

                <input
                    type="checkbox"
                    class="news-media-active"
                    ${
                        media.is_active !== false
                            ? "checked"
                            : ""
                    }
                >

                <span
                    class="admin-switch-slider"
                ></span>

            </label>

        </div>


        <button
            type="button"
            class="admin-delete-button news-media-remove"
        >
            Remove Photo
        </button>

    `;


    newsMediaList.appendChild(row);


    const removeButton =
        row.querySelector(
            ".news-media-remove"
        );


    if (removeButton) {

        removeButton.addEventListener(
            "click",
            function () {

                row.remove();

            }
        );

    }

}


if (addNewsMediaButton) {

    addNewsMediaButton.addEventListener(
        "click",
        function () {

            addNewsMediaRow();

        }
    );

}



/* =========================================
   LOAD NEWS
========================================= */

async function loadAdminNews() {

    if (!adminNewsList) {
        return;
    }

    if (
        typeof kingdomAdminSupabase ===
        "undefined"
    ) {

        console.error(
            "News: Supabase is not available."
        );

        adminNewsList.innerHTML = `
            <p class="admin-loading">
                Supabase connection is not available.
            </p>
        `;

        return;
    }


    adminNewsList.innerHTML = `
        <p class="admin-loading">
            Loading kingdom news...
        </p>
    `;


    try {

        console.log(
            "Loading kingdom news..."
        );


        const {
            data: news,
            error
        } = await kingdomAdminSupabase

            .from("news")

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
            "ADMIN NEWS:",
            news
        );


        renderAdminNewsList(
            news || []
        );


    } catch (error) {

        console.error(
            "News loading failed:",
            error
        );


        adminNewsList.innerHTML = `
            <p class="admin-loading">
                Unable to load kingdom news.
            </p>
        `;


        if (adminNewsCount) {

            adminNewsCount.textContent =
                "Unable to load";

        }

    }

}


/* =========================================
   RENDER NEWS LIST
========================================= */

function renderAdminNewsList(news) {

    if (!adminNewsList) {
        return;
    }


    if (!news.length) {

        adminNewsList.innerHTML = `
            <div class="admin-no-news">

                <p>
                    No kingdom news found.
                </p>

            </div>
        `;


        if (adminNewsCount) {

            adminNewsCount.textContent =
                "0 articles";

        }

        return;
    }


    if (adminNewsCount) {

        adminNewsCount.textContent =
            `${news.length} ${
                news.length === 1
                    ? "article"
                    : "articles"
            }`;

    }


    adminNewsList.innerHTML =
        news
            .map((article, index) => {

                const title =
                    escapeAdminHTML(
                        article.title ||
                        "Untitled News"
                    );


                const category =
                    escapeAdminHTML(
                        article.category ||
                        "KINGDOM"
                    );


                const author =
                    escapeAdminHTML(
                        article.author ||
                        "Kingdom"
                    );


                const image =
                    article.image_url ||
                    "";


                const status =
                    article.is_published
                        ? "Published"
                        : "Draft";


                return `

                    <article
                        class="admin-news-item"
                        data-news-id="${escapeAdminHTML(article.id)}"
                    >

                        <div
                            class="admin-news-number"
                        >
                            ${String(
                                index + 1
                            ).padStart(2, "0")}
                        </div>


                        ${
                            image
                                ? `
                                    <div
                                        class="admin-news-image"
                                    >

                                        <img
                                            src="${escapeAdminHTML(image)}"
                                            alt=""
                                        >

                                    </div>
                                `
                                : ""
                        }


                        <div
                            class="admin-news-content"
                        >

                            <div
                                class="admin-news-category"
                            >
                                ${category}
                            </div>


                            <h4>
                                ${title}
                            </h4>


                            <p>
                                ${author}
                            </p>

                        </div>


                        <div
                            class="admin-news-status ${
                                article.is_published
                                    ? "published"
                                    : "draft"
                            }"
                        >
                            ${status}
                        </div>

                    </article>

                `;

            })
            .join("");


    /* =====================================
       CLICK NEWS ARTICLE
    ===================================== */

    const newsItems =
        adminNewsList.querySelectorAll(
            ".admin-news-item"
        );


    newsItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const newsId =
                    item.dataset.newsId;


                loadAdminNewsForEditing(
                    newsId,
                    news
                );

            }
        );

    });

}


/* =========================================
   LOAD NEWS FOR EDITING
========================================= */

function loadAdminNewsForEditing(
    newsId,
    news
) {

    const article =
        news.find(
            item =>
                item.id === newsId
        );


    if (!article) {

        console.warn(
            "News article not found:",
            newsId
        );

        return;
    }


    console.log(
        "SELECTED NEWS:",
        article
    );


    /* =====================================
       SHOW EDITOR
    ===================================== */

    if (adminNewsEditor) {

        adminNewsEditor.hidden =
            false;

    }


    /* =====================================
       NEWS ID
    ===================================== */

    if (editNewsId) {

        editNewsId.value =
            article.id || "";

    }


    /* =====================================
       HEADING
    ===================================== */

    if (editNewsHeading) {

        editNewsHeading.textContent =
            article.title ||
            "Edit News";

    }


    /* =====================================
       TITLE
    ===================================== */

    if (editNewsTitle) {

        editNewsTitle.value =
            article.title || "";

    }


    /* =====================================
       SLUG
    ===================================== */

    if (editNewsSlug) {

        editNewsSlug.value =
            article.slug || "";

    }


    /* =====================================
       EXCERPT
    ===================================== */

    if (editNewsExcerpt) {

        editNewsExcerpt.value =
            article.excerpt || "";

    }


    /* =====================================
       CONTENT
    ===================================== */

    if (editNewsContent) {

        editNewsContent.value =
            article.content || "";

    }


    /* =====================================
       IMAGE
    ===================================== */

    if (editNewsImage) {

        editNewsImage.value =
            article.image_url || "";

    }

    /* =====================================
   LOAD ADDITIONAL PHOTOS
===================================== */

loadNewsMedia(article.id);

    /* =====================================
       CATEGORY
    ===================================== */

    if (editNewsCategory) {

        editNewsCategory.value =
            article.category ||
            "KINGDOM";

    }


    /* =====================================
       AUTHOR
    ===================================== */

    if (editNewsAuthor) {

        editNewsAuthor.value =
            article.author || "";

    }


    /* =====================================
       PUBLISHED DATE
    ===================================== */

    if (editNewsPublishedAt) {

        if (article.published_at) {

            editNewsPublishedAt.value =
                new Date(
                    article.published_at
                )
                .toISOString()
                .slice(
                    0,
                    16
                );

        } else {

            editNewsPublishedAt.value =
                "";

        }

    }


    /* =====================================
       SORT ORDER
    ===================================== */

    if (editNewsSortOrder) {

        editNewsSortOrder.value =
            article.sort_order ?? 0;

    }


    /* =====================================
       PUBLISHED
    ===================================== */

    if (editNewsPublished) {

        editNewsPublished.checked =
            article.is_published === true;

    }


    /* =====================================
       FEATURED
    ===================================== */

    if (editNewsFeatured) {

        editNewsFeatured.checked =
            article.is_featured === true;

    }


    /* =====================================
       STATUS
    ===================================== */

    if (editNewsStatus) {

        editNewsStatus.textContent =
            article.is_published
                ? "Published"
                : "Draft";


        editNewsStatus.classList.toggle(
            "published",
            article.is_published
        );


        editNewsStatus.classList.toggle(
            "draft",
            !article.is_published
        );

    }


    /* =====================================
       SHOW DELETE BUTTON
    ===================================== */

    if (deleteNewsButton) {

        deleteNewsButton.hidden =
            false;

    }


    /* =====================================
       BUTTON
    ===================================== */

    if (saveNewsButton) {

        saveNewsButton.textContent =
            "Save Changes";

    }


    /* =====================================
       HIGHLIGHT SELECTED
    ===================================== */

    document
        .querySelectorAll(
            ".admin-news-item"
        )
        .forEach(item => {

            item.classList.remove(
                "selected"
            );

        });


    const selectedNews =
        document.querySelector(
            `[data-news-id="${CSS.escape(article.id)}"]`
        );


    if (selectedNews) {

        selectedNews.classList.add(
            "selected"
        );

    }

}


/* =========================================
   LOAD ADDITIONAL NEWS PHOTOS
========================================= */

async function loadNewsMedia(newsId) {

    if (!newsMediaList) {
        return;
    }


    newsMediaList.innerHTML = "";


    if (!newsId) {
        return;
    }


    try {

        const {
            data: media,
            error
        } = await kingdomAdminSupabase

            .from("news_media")

            .select(`
                id,
                news_id,
                image_url,
                caption,
                position,
                sort_order,
                is_active
            `)

            .eq(
                "news_id",
                newsId
            )

            .order(
                "position",
                {
                    ascending: true
                }
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


        (media || []).forEach(item => {

            addNewsMediaRow(item);

            const rows =
                newsMediaList.querySelectorAll(
                    ".news-media-row"
                );

            const row =
                rows[rows.length - 1];


            if (row) {

                row.dataset.mediaId =
                    item.id;

            }

        });


    } catch (error) {

        console.error(
            "Unable to load additional news photos:",
            error
        );


        newsMediaList.innerHTML = `
            <p class="admin-loading">
                Unable to load additional photos.
            </p>
        `;

    }

}


/* =========================================
   PREPARE NEW NEWS
========================================= */

function prepareNewNews() {

    console.log(
        "Preparing new news..."
    );


    if (adminNewsEditor) {

        adminNewsEditor.hidden =
            false;

    }


    if (editNewsId) {

        editNewsId.value = "";

    }


    if (editNewsTitle) {

        editNewsTitle.value = "";

    }


    if (editNewsSlug) {

        editNewsSlug.value = "";

    }


    if (editNewsExcerpt) {

        editNewsExcerpt.value = "";

    }


    if (editNewsContent) {

        editNewsContent.value = "";

    }


    if (editNewsImage) {

        editNewsImage.value = "";

    }

    if (newsMediaList) {

    newsMediaList.innerHTML = "";

}

    if (editNewsCategory) {

        editNewsCategory.value =
            "KINGDOM";

    }


    if (editNewsAuthor) {

        editNewsAuthor.value = "";

    }


    if (editNewsPublishedAt) {

        editNewsPublishedAt.value = "";

    }


    if (editNewsSortOrder) {

        editNewsSortOrder.value = "0";

    }


    if (editNewsPublished) {

        editNewsPublished.checked =
            false;

    }


    if (editNewsFeatured) {

        editNewsFeatured.checked =
            false;

    }


    if (editNewsHeading) {

        editNewsHeading.textContent =
            "Create News";

    }


    if (editNewsStatus) {

        editNewsStatus.textContent =
            "New Article";

        editNewsStatus.classList.remove(
            "published",
            "draft"
        );

    }


    if (deleteNewsButton) {

        deleteNewsButton.hidden =
            true;

    }


    if (saveNewsButton) {

        saveNewsButton.textContent =
            "Create News";

    }


    if (newsSaveMessage) {

        newsSaveMessage.textContent =
            "";

        newsSaveMessage.classList.remove(
            "success",
            "error"
        );

    }

}


/* =========================================
   ADD NEWS BUTTON
========================================= */

if (addNewsButton) {

    addNewsButton.addEventListener(
        "click",
        prepareNewNews
    );

}

/* =========================================
   NOTIFY INDEXNOW
========================================= */

async function notifyIndexNow(urls) {
    try {
        const response = await fetch("/api/indexnow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                urls: urls
            })
        });

        if (!response.ok) {
            console.error(
                "IndexNow notification failed:",
                response.status
            );

            return false;
        }

        console.log("IndexNow notification sent successfully.");

        return true;

    } catch (error) {
        console.error(
            "IndexNow request error:",
            error
        );

        return false;
    }
}

/* =========================================
   SAVE ADDITIONAL NEWS PHOTOS
========================================= */

async function saveNewsMedia(newsId) {

    if (!newsId || !newsMediaList) {
        return;
    }


    const rows =
        newsMediaList.querySelectorAll(
            ".news-media-row"
        );


    /* -----------------------------------------
       Get existing media IDs
    ----------------------------------------- */

    const existingMediaIds = [];


    rows.forEach(row => {

        const mediaId =
            row.dataset.mediaId;

        if (mediaId) {
            existingMediaIds.push(mediaId);
        }

    });


    /* -----------------------------------------
       Load existing photos
    ----------------------------------------- */

    const {
        data: existingMedia,
        error: existingMediaError
    } = await kingdomAdminSupabase

        .from("news_media")

        .select("id")

        .eq(
            "news_id",
            newsId
        );


    if (existingMediaError) {
        throw existingMediaError;
    }


    /* -----------------------------------------
       Delete removed photos
    ----------------------------------------- */

    const mediaToDelete =
        (existingMedia || [])
            .filter(
                media =>
                    !existingMediaIds.includes(
                        media.id
                    )
            )
            .map(
                media => media.id
            );


    if (mediaToDelete.length) {

        const {
            error: deleteError
        } = await kingdomAdminSupabase

            .from("news_media")

            .delete()

            .in(
                "id",
                mediaToDelete
            );


        if (deleteError) {
            throw deleteError;
        }

    }


    /* -----------------------------------------
       Save current photo rows
    ----------------------------------------- */

    for (const row of rows) {

        const imageInput =
            row.querySelector(
                ".news-media-image-url"
            );

        const captionInput =
            row.querySelector(
                ".news-media-caption"
            );

        const positionInput =
            row.querySelector(
                ".news-media-position"
            );

        const sortOrderInput =
            row.querySelector(
                ".news-media-sort-order"
            );

        const activeInput =
            row.querySelector(
                ".news-media-active"
            );


        const imageUrl =
            imageInput
                ? imageInput.value.trim()
                : "";


        /* Ignore completely empty rows */

        if (!imageUrl) {
            continue;
        }


        const caption =
            captionInput
                ? captionInput.value.trim()
                : "";


        const position =
            positionInput
                ? positionInput.value
                : "middle";


        const sortOrder =
            sortOrderInput
                ? Number(
                    sortOrderInput.value
                ) || 0
                : 0;


        const isActive =
            activeInput
                ? activeInput.checked
                : true;


        const mediaId =
            row.dataset.mediaId;


        /* -------------------------------------
           UPDATE EXISTING PHOTO
        ------------------------------------- */

        if (mediaId) {

            const {
                error
            } = await kingdomAdminSupabase

                .from("news_media")

                .update({

                    image_url:
                        imageUrl,

                    caption:
                        caption || null,

                    position:
                        position,

                    sort_order:
                        sortOrder,

                    is_active:
                        isActive

                })

                .eq(
                    "id",
                    mediaId
                );


            if (error) {
                throw error;
            }

        }


        /* -------------------------------------
           INSERT NEW PHOTO
        ------------------------------------- */

        else {

            const {
                data: insertedMedia,
                error
            } = await kingdomAdminSupabase

                .from("news_media")

                .insert({

                    news_id:
                        newsId,

                    image_url:
                        imageUrl,

                    caption:
                        caption || null,

                    position:
                        position,

                    sort_order:
                        sortOrder,

                    is_active:
                        isActive

                })

                .select()

                .single();


            if (error) {
                throw error;
            }


            if (insertedMedia) {

                row.dataset.mediaId =
                    insertedMedia.id;

            }

        }

    }

}



/* =========================================
   SAVE NEWS
========================================= */

if (newsEditorForm) {

    newsEditorForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const newsId =
                editNewsId
                    ? editNewsId.value
                    : "";


            const title =
                editNewsTitle
                    ? editNewsTitle.value.trim()
                    : "";


            const slug =
                editNewsSlug
                    ? editNewsSlug.value.trim()
                    : "";


            const excerpt =
                editNewsExcerpt
                    ? editNewsExcerpt.value.trim()
                    : "";


            const content =
                editNewsContent
                    ? editNewsContent.value.trim()
                    : "";


            const imageUrl =
                editNewsImage
                    ? editNewsImage.value.trim()
                    : "";


            const category =
                editNewsCategory
                    ? editNewsCategory.value.trim()
                    : "KINGDOM";


            const author =
                editNewsAuthor
                    ? editNewsAuthor.value.trim()
                    : "";


            const publishedAt =
                editNewsPublishedAt
                    ? editNewsPublishedAt.value
                    : "";


            const sortOrder =
                editNewsSortOrder
                    ? Number(
                        editNewsSortOrder.value
                    ) || 0
                    : 0;


            const isPublished =
                editNewsPublished
                    ? editNewsPublished.checked
                    : false;


            const isFeatured =
                editNewsFeatured
                    ? editNewsFeatured.checked
                    : false;


            /* =================================
               VALIDATION
            ================================= */

            if (!title) {

                showAdminToast(
                    "Enter a news title.",
                    "warning",
                    "Title Required"
                );

                return;

            }


            if (!slug) {

                showAdminToast(
                    "Enter a news slug.",
                    "warning",
                    "Slug Required"
                );

                return;

            }


            try {

                if (saveNewsButton) {

                    saveNewsButton.disabled =
                        true;

                    saveNewsButton.textContent =
                        "Saving...";

                }


                let data = null;
                let error = null;


                /* =================================
                   UPDATE EXISTING NEWS
                ================================= */

                if (newsId) {

                    console.log(
                        "Updating news:",
                        newsId
                    );


                    const result =
                        await kingdomAdminSupabase

                            .from("news")

                            .update({

                                title:
                                    title,

                                slug:
                                    slug,

                                excerpt:
                                    excerpt ||
                                    null,

                                content:
                                    content ||
                                    null,

                                image_url:
                                    imageUrl ||
                                    null,

                                category:
                                    category ||
                                    "KINGDOM",

                                author:
                                    author ||
                                    null,

                                published_at:
                                    publishedAt
                                        ? new Date(
                                            publishedAt
                                        ).toISOString()
                                        : null,

                                is_published:
                                    isPublished,

                                is_featured:
                                    isFeatured,

                                sort_order:
                                    sortOrder

                            })

                            .eq(
                                "id",
                                newsId
                            )

                            .select()
                            .single();


                    data = result.data;
                    error = result.error;

                }


                /* =================================
                   CREATE NEW NEWS
                ================================= */

                else {

                    console.log(
                        "Creating new news..."
                    );


                    const result =
                        await kingdomAdminSupabase

                            .from("news")

                            .insert({

                                title:
                                    title,

                                slug:
                                    slug,

                                excerpt:
                                    excerpt ||
                                    null,

                                content:
                                    content ||
                                    null,

                                image_url:
                                    imageUrl ||
                                    null,

                                category:
                                    category ||
                                    "KINGDOM",

                                author:
                                    author ||
                                    null,

                                published_at:
                                    publishedAt
                                        ? new Date(
                                            publishedAt
                                        ).toISOString()
                                        : null,

                                is_published:
                                    isPublished,

                                is_featured:
                                    isFeatured,

                                sort_order:
                                    sortOrder

                            })

                            .select()
                            .single();


                    data = result.data;
                    error = result.error;

                }


                if (error) {
                    throw error;
                }


                console.log(
                    "NEWS SAVED SUCCESSFULLY:",
                    data
                );

                /* =================================
   SAVE ADDITIONAL NEWS PHOTOS
================================= */

if (data && data.id) {

    await saveNewsMedia(data.id);

}
  

                /* =========================================
                INDEXNOW NOTIFICATION
                ========================================= */

                if (data && data.is_published && data.slug) {
                    const newsUrl =
                        `https://agborkingdom.org/news.html?slug=${encodeURIComponent(data.slug)}`;

                    await notifyIndexNow([newsUrl]);
                }


                /* =================================
                   UPDATE EDITOR
                ================================= */

                if (data) {

                    if (editNewsId) {

                        editNewsId.value =
                            data.id || "";

                    }

                    if (editNewsHeading) {

                        editNewsHeading.textContent =
                            data.title ||
                            "Edit News";

                    }

                    if (editNewsStatus) {

                        editNewsStatus.textContent =
                            data.is_published
                                ? "Published"
                                : "Draft";

                    }

                    if (deleteNewsButton) {

                        deleteNewsButton.hidden =
                            false;

                    }

                }


                /* =================================
                   SUCCESS
                ================================= */

                const wasNewNews =
                    !newsId;


                if (newsSaveMessage) {

                    newsSaveMessage.textContent =
                        wasNewNews
                            ? "News created successfully."
                            : "News updated successfully.";

                    newsSaveMessage.classList.add(
                        "success"
                    );

                }


                showAdminToast(
                    wasNewNews
                        ? "The news article has been created."
                        : "The news article has been updated.",
                    "success",
                    wasNewNews
                        ? "News Created"
                        : "News Updated"
                );


                await loadAdminNews();


            } catch (error) {

                console.error(
                    "Admin news save failed:",
                    error
                );


                if (newsSaveMessage) {

                    newsSaveMessage.textContent =
                        "Unable to save news.";

                    newsSaveMessage.classList.add(
                        "error"
                    );

                }


                showAdminToast(
                    error.message ||
                    "Unable to save the news article.",
                    "error",
                    "Save Failed"
                );

            } finally {

                if (saveNewsButton) {

                    saveNewsButton.disabled =
                        false;

                    saveNewsButton.textContent =
                        "Save News";

                }

            }

        }
    );

}


/* =========================================
   DELETE NEWS
========================================= */

async function performAdminNewsDelete(
    newsId
) {

    if (!newsId) {

        showAdminToast(
            "No news article was selected.",
            "warning",
            "No News Selected"
        );

        return;
    }


    try {

        console.log(
            "Deleting news:",
            newsId
        );


        const {
            error
        } =
            await kingdomAdminSupabase

                .from("news")

                .delete()

                .eq(
                    "id",
                    newsId
                );


        if (error) {
            throw error;
        }


        console.log(
            "NEWS DELETED SUCCESSFULLY:",
            newsId
        );


        if (adminNewsEditor) {

            adminNewsEditor.hidden =
                true;

        }


        if (editNewsId) {

            editNewsId.value = "";

        }


        await loadAdminNews();


        showAdminToast(
            "The news article has been permanently deleted.",
            "success",
            "News Deleted"
        );


    } catch (error) {

        console.error(
            "Admin news delete failed:",
            error
        );


        showAdminToast(
            error.message ||
            "Unable to delete the news article.",
            "error",
            "Delete Failed"
        );

    }

}


/* =========================================
   DELETE NEWS BUTTON
========================================= */

if (deleteNewsButton) {

    deleteNewsButton.addEventListener(
        "click",
        function () {

            const newsId =
                editNewsId
                    ? editNewsId.value
                    : "";


            if (!newsId) {

                showAdminToast(
                    "Select a news article first.",
                    "warning",
                    "No News Selected"
                );

                return;

            }


            showNewsDeleteConfirmation(
                newsId
            );

        }
    );

}


/* =========================================
   NEWS DELETE CONFIRMATION
========================================= */

function showNewsDeleteConfirmation(
    newsId
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
            "Admin: Delete confirmation modal not found."
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


            await performAdminNewsDelete(
                newsId
            );

        };

}


/* =========================================
   CANCEL NEWS EDITING
========================================= */

if (cancelNewsButton) {

    cancelNewsButton.addEventListener(
        "click",
        function () {

            if (adminNewsEditor) {

                adminNewsEditor.hidden =
                    true;

            }

            if (editNewsId) {

                editNewsId.value = "";

            }

            document
                .querySelectorAll(
                    ".admin-news-item"
                )
                .forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });

        }
    );

}

/* =========================================
   OPEN NEWS MANAGEMENT
========================================= */

const manageNewsButton =
    document.getElementById("manageNewsButton");

if (manageNewsButton) {

    manageNewsButton.addEventListener(
        "click",
        function () {

            console.log(
                "Opening News Management..."
            );

            if (adminNewsPanel) {

                adminNewsPanel.hidden = false;

            }

        }
    );

}

/* =========================================
   INITIALIZE NEWS
========================================= */

function initializeAdminNews() {

    console.log(
        "Initializing News Management..."
    );

    loadAdminNews();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAdminNews
    );

} else {

    initializeAdminNews();

}