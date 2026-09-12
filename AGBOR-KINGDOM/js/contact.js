
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("kingdomContactForm");
    const formMessage = document.getElementById("contactFormMessage");
    const submitButton = document.getElementById("contactSubmitButton");

    if (!form) {
        console.error("Kingdom contact form not found.");
        return;
    }

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        // -----------------------------------------
        // GET FORM VALUES
        // -----------------------------------------

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const phone = document.getElementById("contactPhone").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        // -----------------------------------------
        // CLEAR PREVIOUS ERRORS
        // -----------------------------------------

        document.getElementById("contactNameError").textContent = "";
        document.getElementById("contactEmailError").textContent = "";
        document.getElementById("contactSubjectError").textContent = "";
        document.getElementById("contactMessageError").textContent = "";

        formMessage.textContent = "";
        formMessage.className = "contact-form-message";

        // -----------------------------------------
        // VALIDATION
        // -----------------------------------------

        let hasError = false;

        if (!name) {
            document.getElementById("contactNameError").textContent =
                "Please enter your full name.";
            hasError = true;
        }

        if (!email) {
            document.getElementById("contactEmailError").textContent =
                "Please enter your email address.";
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById("contactEmailError").textContent =
                "Please enter a valid email address.";
            hasError = true;
        }

        if (!subject) {
            document.getElementById("contactSubjectError").textContent =
                "Please enter a subject.";
            hasError = true;
        }

        if (!message) {
            document.getElementById("contactMessageError").textContent =
                "Please enter your message.";
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // -----------------------------------------
        // LOADING STATE
        // -----------------------------------------

        submitButton.disabled = true;

        const buttonText = submitButton.querySelector("span");

        if (buttonText) {
            buttonText.textContent = "Sending...";
        }

        // -----------------------------------------
        // SAVE TO SUPABASE
        // -----------------------------------------

        try {

            const { error: databaseError } =
    await kingdomSupabase
        .from("contact_messages")
        .insert([
            {
                name: name,
                email: email,
                phone: phone || null,
                subject: subject,
                message: message
            }
        ]);
            

            if (databaseError) {
                console.error(
                    "Contact message database error:",
                    databaseError
                );

                throw databaseError;
            }


            // -----------------------------------------
// SEND EMAIL NOTIFICATION
// -----------------------------------------

try {

    const emailResponse = await fetch(
        "/.netlify/functions/send-contact-email",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone || "",
                subject: subject,
                message: message
            })
        }
    );

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {

        console.error(
            "Contact email error:",
            emailResult
        );

    } else {

        console.log(
            "Contact email sent:",
            emailResult
        );

    }

} catch (emailError) {

    // Email failure should NOT erase the saved enquiry.

    console.error(
        "Unable to send contact email:",
        emailError
    );
}

            // -----------------------------------------
            // SUCCESS MESSAGE
            // -----------------------------------------

            formMessage.className =
                "contact-form-message success";

                formMessage.textContent =
    "Your correspondence has been received by the Royal Kingdom of Agbor. Thank you for contacting the Kingdom.";
           
            form.reset();

        } catch (error) {

            console.error(
                "Failed to receive contact enquiry:",
                error
            );

            // -----------------------------------------
            // ERROR MESSAGE
            // -----------------------------------------

            formMessage.className =
                "contact-form-message error";

            formMessage.textContent =
                "We were unable to receive your enquiry at this time. Please try again shortly.";

        } finally {

            submitButton.disabled = false;

            if (buttonText) {
                buttonText.textContent = "Send Enquiry";
            }

        }

    });

});

