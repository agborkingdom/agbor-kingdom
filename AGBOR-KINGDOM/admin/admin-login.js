console.log("Agbor Kingdom Admin Login JS loaded");


const adminLoginForm =
    document.getElementById("adminLoginForm");

const adminLoginMessage =
    document.getElementById("adminLoginMessage");


adminLoginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("adminEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("adminPassword")
                .value;


        if (!email || !password) {

            adminLoginMessage.textContent =
                "Please enter your email and password.";

            return;
        }


        adminLoginMessage.textContent =
            "Signing in...";


        try {

            const {
                data,
                error
            } = await kingdomAdminSupabase.auth.signInWithPassword({

                email: email,

                password: password

            });


            if (error) {

                throw error;

            }


            console.log(
                "Admin login successful:",
                data.user
            );


            window.location.href =
                "index.html";


        } catch (error) {

            console.error(
                "Admin login failed:",
                error
            );


            adminLoginMessage.textContent =
                error.message ||
                "Unable to sign in.";

        }

    }
);