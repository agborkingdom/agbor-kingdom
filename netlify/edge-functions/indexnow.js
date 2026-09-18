/**
 * =========================================
 * AGBOR KINGDOM
 * INDEXNOW NOTIFICATION
 * NETLIFY EDGE FUNCTION
 * =========================================
 */

export default async function (request) {
    if (request.method !== "POST") {
        return new Response(
            JSON.stringify({
                error: "Only POST requests are allowed."
            }),
            {
                status: 405,
                headers: {
                    "content-type": "application/json"
                }
            }
        );
    }

    const indexNowKey = Netlify.env.get("INDEXNOW_API_KEY");

    if (!indexNowKey) {
        console.error("Missing INDEXNOW_API_KEY environment variable.");

        return new Response(
            JSON.stringify({
                error: "IndexNow API key is not configured."
            }),
            {
                status: 500,
                headers: {
                    "content-type": "application/json"
                }
            }
        );
    }

    try {
        const body = await request.json();

        const urls = Array.isArray(body.urls)
            ? body.urls
            : [];

        const validUrls = urls
            .filter(url => typeof url === "string")
            .filter(url => {
                try {
                    const parsedUrl = new URL(url);

                    return (
                        parsedUrl.protocol === "https:" &&
                        parsedUrl.hostname === "agborkingdom.org"
                    );
                } catch {
                    return false;
                }
            })
            .slice(0, 10);

        if (!validUrls.length) {
            return new Response(
                JSON.stringify({
                    error: "No valid URLs were provided."
                }),
                {
                    status: 400,
                    headers: {
                        "content-type": "application/json"
                    }
                }
            );
        }

        const indexNowResponse = await fetch(
            "https://api.indexnow.org/indexnow",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    host: "agborkingdom.org",
                    key: indexNowKey,
                    urlList: validUrls
                })
            }
        );

        console.log(
            "IndexNow response status:",
            indexNowResponse.status
        );

        if (!indexNowResponse.ok) {
            return new Response(
                JSON.stringify({
                    error: "IndexNow notification failed.",
                    status: indexNowResponse.status
                }),
                {
                    status: 502,
                    headers: {
                        "content-type": "application/json"
                    }
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                submittedUrls: validUrls
            }),
            {
                status: 200,
                headers: {
                    "content-type": "application/json"
                }
            }
        );

    } catch (error) {
        console.error("IndexNow function error:", error);

        return new Response(
            JSON.stringify({
                error: "Unable to process IndexNow notification."
            }),
            {
                status: 500,
                headers: {
                    "content-type": "application/json"
                }
            }
        );
    }
}