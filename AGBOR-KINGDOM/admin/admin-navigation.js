/* =========================================
   ADMIN NAVIGATION
========================================= */

const adminNavLinks =
    document.querySelectorAll(
        ".admin-nav-link"
    );


const adminSections =
    document.querySelectorAll(
        ".admin-management-section"
    );


adminNavLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const sectionId =
                    link.dataset.adminSection;


                if (!sectionId) {

                    console.log(
                        "This navigation item has no section yet."
                    );

                    return;

                }


                /* =====================================
                   HIDE ALL MANAGEMENT SECTIONS
                ===================================== */

                adminSections.forEach(
                    function (section) {

                        section.hidden = true;

                    }
                );


                /* =====================================
                   REMOVE ACTIVE FROM ALL NAV LINKS
                ===================================== */

                adminNavLinks.forEach(
                    function (navLink) {

                        navLink.classList.remove(
                            "active"
                        );

                    }
                );


                /* =====================================
                   SHOW SELECTED SECTION
                ===================================== */

                const selectedSection =
                    document.getElementById(
                        sectionId
                    );


                if (!selectedSection) {

                    console.error(
                        "Admin section not found:",
                        sectionId
                    );

                    return;

                }


                selectedSection.hidden =
                    false;


                /* =====================================
                   ACTIVATE NAV LINK
                ===================================== */

                link.classList.add(
                    "active"
                );


                /* =====================================
                   SCROLL TO SECTION
                ===================================== */

                selectedSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


                /* =====================================
                   LOAD ANNOUNCEMENTS WHEN CLICKED
                ===================================== */

                if (
                    sectionId ===
                    "adminAnnouncementsSection"
                ) {

                    if (
                        typeof loadAdminAnnouncements ===
                        "function"
                    ) {

                        loadAdminAnnouncements();

                    }

                }

            }
        );

    }


);

const dashboardAnnouncementsButton =
    document.getElementById(
        "dashboardAnnouncementsButton"
    );


if (dashboardAnnouncementsButton) {

    dashboardAnnouncementsButton.addEventListener(
        "click",
        function () {

            const announcementNav =
                document.querySelector(
                    '[data-admin-section="adminAnnouncementsSection"]'
                );


            if (announcementNav) {

                announcementNav.click();

            }

        }
    );

}