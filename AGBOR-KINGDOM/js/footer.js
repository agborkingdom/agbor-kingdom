
/* =========================================
   AGBOR KINGDOM
   FOOTER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const footerYear =
        document.getElementById("footerYear");

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }

});

