export default async function (request, context) {
    const response = await context.next();

    const html = await response.text();

    const updatedHtml = html.replace(
        "</head>",
        `<!-- NEWS EDGE FUNCTION IS RUNNING -->
</head>`
    );

    const headers = new Headers(response.headers);

    headers.set(
        "content-type",
        "text/html; charset=UTF-8"
    );

    headers.set(
        "x-news-edge-function",
        "active"
    );

    return new Response(updatedHtml, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

export const config = {
    path: "/news.html"
};