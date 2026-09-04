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