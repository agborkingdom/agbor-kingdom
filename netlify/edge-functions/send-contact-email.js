export default async (request) => {
    // Allow only POST requests
    if (request.method !== "POST") {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Method not allowed."
            }),
            {
                status: 405,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    try {
        const body = await request.json();

        const {
            name,
            email,
            phone,
            subject,
            message
        } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Name, email, subject and message are required."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const resendApiKey = Netlify.env.get("RESEND_API_KEY");

        if (!resendApiKey) {
            console.error("RESEND_API_KEY is not configured.");

            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Email service is not configured."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const emailResponse = await fetch(
            "https://api.resend.com/emails",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${resendApiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    from: "Agbor Kingdom <noreply@agborkingdom.org>",
                    to: ["agborkingdom@gmail.com"],
                    reply_to: email,
                    subject: `New Kingdom Enquiry: ${subject}`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <title>New Agbor Kingdom Enquiry</title>
                        </head>

                        <body style="
                            margin: 0;
                            padding: 30px;
                            background: #f5f1e8;
                            font-family: Arial, Helvetica, sans-serif;
                            color: #2d2417;
                        ">

                            <div style="
                                max-width: 680px;
                                margin: 0 auto;
                                background: #ffffff;
                                border: 1px solid #e4d7bd;
                                border-radius: 12px;
                                overflow: hidden;
                            ">

                                <div style="
                                    padding: 25px 30px;
                                    background: #2d2417;
                                    color: #ffffff;
                                ">
                                    <h1 style="
                                        margin: 0;
                                        font-size: 24px;
                                    ">
                                        Royal Kingdom of Agbor
                                    </h1>

                                    <p style="
                                        margin: 8px 0 0;
                                        color: #d8c49a;
                                        font-size: 14px;
                                    ">
                                        New Contact Form Enquiry
                                    </p>
                                </div>

                                <div style="padding: 30px;">

                                    <p style="
                                        margin-top: 0;
                                        font-size: 16px;
                                    ">
                                        A new enquiry has been received
                                        through the Agbor Kingdom website.
                                    </p>

                                    <hr style="
                                        border: 0;
                                        border-top: 1px solid #e5e5e5;
                                        margin: 25px 0;
                                    ">

                                    <p>
                                        <strong>Name</strong><br>
                                        ${escapeHtml(name)}
                                    </p>

                                    <p>
                                        <strong>Email</strong><br>
                                        ${escapeHtml(email)}
                                    </p>

                                    ${
                                        phone
                                            ? `
                                                <p>
                                                    <strong>Phone</strong><br>
                                                    ${escapeHtml(phone)}
                                                </p>
                                            `
                                            : ""
                                    }

                                    <p>
                                        <strong>Subject</strong><br>
                                        ${escapeHtml(subject)}
                                    </p>

                                    <p>
                                        <strong>Message</strong><br>
                                        ${escapeHtml(message)
                                            .replace(/\n/g, "<br>")}
                                    </p>

                                    <hr style="
                                        border: 0;
                                        border-top: 1px solid #e5e5e5;
                                        margin: 25px 0;
                                    ">

                                    <p style="
                                        margin-bottom: 0;
                                        color: #777777;
                                        font-size: 13px;
                                    ">
                                        This notification was generated by
                                        the contact form on
                                        agborkingdom.org.
                                    </p>

                                </div>
                            </div>

                        </body>
                        </html>
                    `
                })
            }
        );

        const result = await emailResponse.json();

        if (!emailResponse.ok) {
            console.error("Resend API error:", result);

            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Resend could not send the email."
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        console.log("Contact email sent successfully:", result);

        return new Response(
            JSON.stringify({
                success: true,
                message: "Email sent successfully."
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {
        console.error("Send contact email error:", error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "An unexpected email error occurred."
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
};


// Safely escape visitor-submitted content
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


