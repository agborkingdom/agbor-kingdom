/* =========================================
   PUBLICATION DETAILS
========================================= */



const publicationDetailsContainer =
    document.getElementById("publicationDetailsContainer");

const publicationDetailsError =
    document.getElementById("publicationDetailsError");


/* =========================================
   GET PUBLICATION ID
========================================= */

const publicationParams =
    new URLSearchParams(window.location.search);

const publicationId =
    publicationParams.get("id");


/* =========================================
   LOAD PUBLICATION
========================================= */

async function loadPublicationDetails() {

    if (!publicationId) {

        showPublicationError();

        return;
    }


    try {

        const {
            data,
            error
        } = await kingdomSupabase

            .from("publications")

            .select("*")

            .eq("id", publicationId)

            .eq("is_active", true)

            .maybeSingle();


        if (error) {
            throw error;
        }


        if (!data) {

            showPublicationError();

            return;
        }


        renderPublicationDetails(data);


    } catch (error) {

        console.error(
            "Publication details loading failed:",
            error
        );

        showPublicationError();

    }

}


/* =========================================
   RENDER
========================================= */

function renderPublicationDetails(publication) {



    if (publicationDetailsError) {
        publicationDetailsError.hidden = true;
    }


    if (publicationDetailsContainer) {
        publicationDetailsContainer.hidden = false;
    }


    const title =
        publication.title ||
        "Agbor Kingdom Publication";

        /* =========================================
   SEO & SOCIAL MEDIA META DATA
========================================= */

const publicationDescription =
    publication.description ||
    "Official publications from the Royal Kingdom of Agbor.";

const publicationUrl =
    "https://agborkingdom.org/publication-details.html?id=" +
    encodeURIComponent(publication.id);


/* ✅ FIXED ✅ */
const publicationImage =
    publication.cover_image_url
        ? new URL(
            publication.cover_image_url,
            window.location.origin // <--- replaced with window.location.origin
        ).href
        : "";

/* SEO DESCRIPTION */

const metaDescription =
    document.getElementById(
        "publicationMetaDescription"
    );

if (metaDescription) {

    metaDescription.setAttribute(
        "content",
        publicationDescription
    );

}


/* OPEN GRAPH */

const ogTitle =
    document.getElementById(
        "publicationOgTitle"
    );

const ogDescription =
    document.getElementById(
        "publicationOgDescription"
    );

const ogUrl =
    document.getElementById(
        "publicationOgUrl"
    );

const ogImage =
    document.getElementById(
        "publicationOgImage"
    );

const ogImageAlt =
    document.getElementById(
        "publicationOgImageAlt"
    );


if (ogTitle) {

    ogTitle.setAttribute(
        "content",
        title
    );

}


if (ogDescription) {

    ogDescription.setAttribute(
        "content",
        publicationDescription
    );

}


if (ogUrl) {

    ogUrl.setAttribute(
        "content",
        publicationUrl
    );

}


if (ogImage) {

    ogImage.setAttribute(
        "content",
        publicationImage
    );

}


if (ogImageAlt) {

    ogImageAlt.setAttribute(
        "content",
        title
    );

}


/* X / TWITTER */

const twitterTitle =
    document.getElementById(
        "publicationTwitterTitle"
    );

const twitterDescription =
    document.getElementById(
        "publicationTwitterDescription"
    );

const twitterImage =
    document.getElementById(
        "publicationTwitterImage"
    );


if (twitterTitle) {

    twitterTitle.setAttribute(
        "content",
        title
    );

}


if (twitterDescription) {

    twitterDescription.setAttribute(
        "content",
        publicationDescription
    );

}


if (twitterImage) {

    twitterImage.setAttribute(
        "content",
        publicationImage
    );

}


/* CANONICAL URL */

const canonical =
    document.getElementById(
        "publicationCanonical"
    );

if (canonical) {

    canonical.setAttribute(
        "href",
        publicationUrl
    );

}


document.title =
    title + " | Agbor Kingdom";

    document.getElementById(
        "publicationTitle"
    ).textContent = title;


    document.getElementById(
        "publicationCategory"
    ).textContent =
        publication.category ||
        "KINGDOM PUBLICATION";


    document.getElementById(
        "publicationDescription"
    ).textContent =
        publication.description ||
        "";


    document.getElementById(
        "publicationAuthor"
    ).textContent =
        publication.author ||
        "Agbor Kingdom";


    const dateElement =
        document.getElementById(
            "publicationDate"
        );


    if (publication.publication_date) {

        dateElement.textContent =
            new Date(
                `${publication.publication_date}T00:00:00`
            ).toLocaleDateString(
                "en-US",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    } else {

        dateElement.textContent =
            "Not specified";

    }


    const cover =
        document.getElementById(
            "publicationCover"
        );


    if (publication.cover_image_url) {

        cover.src =
            publication.cover_image_url;

        cover.alt = title;

        cover.hidden = false;

    } else {

        cover.hidden = true;

    }


    const openButton =
        document.getElementById(
            "publicationOpenButton"
        );


    if (publication.file_url) {

        openButton.href =
            publication.file_url;

        openButton.style.display =
            "flex";

    } else {

        openButton.style.display =
            "none";

    }

    /* =========================================
   SETUP PUBLICATION SHARING
========================================= */

if (
    typeof setupPublicationSharing ===
    "function"
) {

    setupPublicationSharing(
        publication
    );

}

}


/* =========================================
   ERROR
========================================= */

function showPublicationError() {

    


    if (publicationDetailsContainer) {
        publicationDetailsContainer.hidden = true;
    }


    if (publicationDetailsError) {
        publicationDetailsError.hidden = false;
    }

}


/* =========================================
   START
========================================= */

loadPublicationDetails();