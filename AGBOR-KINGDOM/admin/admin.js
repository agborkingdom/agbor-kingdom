/* =========================================
   AGBOR KINGDOM ADMIN
   AUTHENTICATION & LOGOUT
========================================= */

console.log("Agbor Kingdom Admin JS loaded");


/* =========================================
   ESCAPE HTML
========================================= */

function escapeAdminHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   ADMIN TOAST
========================================= */

function showAdminToast(
    message,
    type = "warning",
    title = "Notice"
) {
    const toast = document.getElementById("adminToast");

    if (!toast) {
        return;
    }

    toast.className = `admin-toast ${type}`;

    toast.innerHTML = `
        <span class="admin-toast-title">
            ${escapeAdminHTML(title)}
        </span>

        <span class="admin-toast-message">
            ${escapeAdminHTML(message)}
        </span>
    `;

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    clearTimeout(window.adminToastTimer);

    window.adminToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}


/* =========================================
   CHECK SUPABASE
========================================= */

function isSupabaseReady() {

    if (
        typeof kingdomAdminSupabase === "undefined"
    ) {
        console.error(
            "Admin: kingdomAdminSupabase is not available."
        );

        showAdminToast(
            "Supabase connection is not available.",
            "error",
            "Connection Error"
        );

        return false;
    }

    return true;
}


/* =========================================
   CHECK ADMIN AUTHENTICATION
========================================= */

async function checkAdminAuth() {

    if (!isSupabaseReady()) {
        return;
    }

    try {

        const {
            data: {
                session
            },
            error
        } = await kingdomAdminSupabase
            .auth
            .getSession();

        if (error) {
            throw error;
        }


        /* =====================================
           NO SESSION
        ===================================== */

        if (!session) {

            console.warn(
                "No authenticated admin session."
            );

            window.location.href = "login.html";

            return;
        }


        /* =====================================
           ADMIN AUTHENTICATED
        ===================================== */

        console.log(
            "Admin authenticated:",
            session.user.email
        );

    } catch (error) {

        console.error(
            "Admin authentication check failed:",
            error
        );

        window.location.href = "login.html";
    }
}


/* =========================================
   LOGOUT
========================================= */

async function adminLogout(event) {

    if (event) {
        event.preventDefault();
    }

    if (!isSupabaseReady()) {
        return;
    }

    const logoutButton =
        document.getElementById("adminLogoutButton");


    try {

        /* =====================================
           DISABLE LOGOUT BUTTON
        ===================================== */

        if (logoutButton) {

            logoutButton.disabled = true;

            logoutButton.textContent =
                "Logging out...";
        }


        console.log(
            "Logging out admin..."
        );


        /* =====================================
           SIGN OUT FROM SUPABASE
        ===================================== */

        const {
            error
        } = await kingdomAdminSupabase
            .auth
            .signOut();

        if (error) {
            throw error;
        }


        /* =====================================
           CONFIRM LOGOUT
        ===================================== */

        console.log(
            "Admin logged out successfully."
        );


        /* =====================================
           REDIRECT TO LOGIN
        ===================================== */

        window.location.replace(
            "login.html"
        );

    } catch (error) {

        console.error(
            "Admin logout failed:",
            error
        );


        /* =====================================
           RESTORE BUTTON
        ===================================== */

        if (logoutButton) {

            logoutButton.disabled = false;

            logoutButton.textContent =
                "Logout";
        }


        showAdminToast(
            error.message ||
            "Unable to log out.",
            "error",
            "Logout Failed"
        );
    }
}


/* =========================================
   LOGOUT BUTTON
========================================= */

function initializeLogoutButton() {

    const adminLogoutButton =
        document.getElementById(
            "adminLogoutButton"
        );

    if (!adminLogoutButton) {

        console.warn(
            "Admin logout button not found."
        );

        return;
    }


    /* =====================================
       PREVENT MULTIPLE LISTENERS
    ===================================== */

    adminLogoutButton.addEventListener(
        "click",
        adminLogout
    );
}


/* =========================================
   INITIALIZE ADMIN
========================================= */

function initializeAdmin() {

    console.log(
        "Initializing Agbor Kingdom Admin..."
    );

    initializeLogoutButton();
}


/* =========================================
   START ADMIN
========================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            checkAdminAuth();
            initializeAdmin();

        }
    );

} else {

    checkAdminAuth();
    initializeAdmin();
}