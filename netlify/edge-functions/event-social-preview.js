export default async (request, context) => {
    const url = new URL(request.url);
    const eventId = url.searchParams.get("id");

    if (!eventId) return context.next();

    const userAgent = request.headers.get("user-agent") || "";
    const socialBots = /facebookexternalhit|Facebot|Twitterbot|WhatsApp|Slackbot|TelegramBot|LinkedInBot|Discordbot|Pinterest|Googlebot/i;

    if (!socialBots.test(userAgent)) return context.next();

    try {
        const supabaseUrl = Netlify.env.get("SUPABASE_URL");
        const supabaseKey = Netlify.env.get("SUPABASE_ANON_KEY");

        if (!supabaseUrl || !supabaseKey) return context.next();

        const response = await fetch(
            `${supabaseUrl}/rest/v1/events?select=id,title,description,image_url&id=eq.${encodeURIComponent(eventId)}&is_active=eq.true&limit=1`,
            {
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`
                }
            }
        );

        if (!response.ok) return context.next();

        const events = await response.json();
        const event = events?.[0];

        if (!event) return context.next();

        const title = event.title || "Agbor Kingdom Event";
        const description = event.description || "Upcoming events from the Royal Kingdom of Agbor.";
       /* Inside event-social-preview.js */
const eventUrl = `${url.origin}/event-details.html?id=${encodeURIComponent(event.id)}`;

        let image = event.image_url || "";
        if (image) {
            try {
                image = new URL(image, url.origin).href;
            } catch (e) {
                console.error("Invalid image URL:", image);
            }
        }

        if (!image) {
            image = `${url.origin}/images/events/event-default.jpg`;
        }

        const escapeHtml = str => String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${escapeHtml(eventUrl)}">

<!-- OPEN GRAPH -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Agbor Kingdom">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(eventUrl)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:secure_url" content="${escapeHtml(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(title)}">

<!-- TWITTER -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<p>${escapeHtml(description)}</p>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "content-type": "text/html; charset=UTF-8",
                "cache-control": "public, max-age=300"
            }
        });

    } catch (error) {
        console.error("Edge function error:", error);
        return context.next();
    }
};