/* =========================================
   AGBOR KINGDOM
   REUSABLE FOOTER LOADER
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const footerContainer =
        document.getElementById("siteFooter");

    if (!footerContainer) {
        return;
    }

    try {

        const response =
            await fetch("footer.html");

        if (!response.ok) {

            throw new Error(
                `Footer failed to load: ${response.status}`
            );

        }

        const footerHTML =
            await response.text();

        footerContainer.innerHTML =
            footerHTML;


        const footerYear =
            document.getElementById("footerYear");

        if (footerYear) {

            footerYear.textContent =
                new Date().getFullYear();

        }


        /* =========================================
           TELL OTHER SCRIPTS THAT FOOTER IS READY
        ========================================= */

        document.dispatchEvent(
            new CustomEvent("agborFooterLoaded")
        );


    } catch (error) {

        console.error(
            "Footer loading failed:",
            error
        );

    }

});