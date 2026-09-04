/* =========================================
   PUBLICATIONS PAGE
========================================= */
/* =========================================
   PUBLICATIONS PAGE
========================================= */

const publicationsGrid =
    document.getElementById("publicationsGrid");


async function loadPublications() {

    if (!publicationsGrid) {
        return;
    }

    try {

        const {
            data,
            error
        } = await kingdomSupabase

            .from("publications")

            .select("*")

            .eq("is_active", true)

            .order("sort_order", {
                ascending: true
            })

            .order("publication_date", {
                ascending: false
            });


        if (error) {
            throw error;
        }


        console.log(
            "PUBLICATIONS:",
            data
        );


        if (!data || data.length === 0) {

            publicationsGrid.innerHTML = `
                <div class="publications-empty">

                    <h3>
                        No Publications Yet
                    </h3>

                    <p>
                        Kingdom publications will appear here.
                    </p>

                </div>
            `;

            return;
        }


        renderPublications(data);


    } catch (error) {

        console.error(
            "Publications loading failed:",
            error
        );


        publicationsGrid.innerHTML = `
            <div class="publications-empty">

                <h3>
                    Unable to Load Publications
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;

    }

}

/* =========================================
   RENDER PUBLICATIONS
========================================= */

function renderPublications(publications) {

    if (!publicationsGrid) {
        return;
    }


    publicationsGrid.innerHTML = publications

        .map(publication => {

            const title =
                escapePublicationText(
                    publication.title ||
                    "Agbor Kingdom Publication"
                );


            const description =
                escapePublicationText(
                    publication.description ||
                    "Official publication of Agbor Kingdom."
                );


            const category =
                escapePublicationText(
                    publication.category ||
                    "KINGDOM PUBLICATION"
                );


            const author =
                escapePublicationText(
                    publication.author ||
                    "Agbor Kingdom"
                );


            const date =
                publication.publication_date
                    ? new Date(
                        `${publication.publication_date}T00:00:00`
                    ).toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        }
                    )
                    : "";


            const coverImage =
                publication.cover_image_url
                    ? escapePublicationText(
                        publication.cover_image_url
                    )
                    : "";


            const fileUrl =
                publication.file_url
                    ? escapePublicationText(
                        publication.file_url
                    )
                    : "#";


            return `

                <article
                    class="publication-card"
                >

                    <div class="publication-cover">

                        ${
                            coverImage

                            ? `

                                <img
                                    src="${coverImage}"
                                    alt="${title}"
                                    loading="lazy"
                                >

                              `

                            : `

                                <div class="publication-cover-placeholder">

                                    <span>
                                        📖
                                    </span>

                                    <small>
                                        AGBOR KINGDOM
                                    </small>

                                </div>

                              `
                        }

                        <span class="publication-category">

                            ${category}

                        </span>

                    </div>


                    <div class="publication-content">

                        <h3>
                            ${title}
                        </h3>


                        <p class="publication-description">
                            ${description}
                        </p>


                        <div class="publication-meta">

                            <span>
                                ${author}
                            </span>

                            ${
                                date
                                    ? `
                                        <span>
                                            ${date}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>


                        <a
    href="publication-details.html?id=${encodeURIComponent(publication.id)}"
    class="publication-button"
>

                            Read Publication

                            <span>
                                →
                            </span>

                        </a>

                    </div>

                </article>

            `;

        })

        .join("");

}


/* =========================================
   ESCAPE TEXT
========================================= */

function escapePublicationText(text) {

    return String(text || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================
   START
========================================= */

loadPublications();