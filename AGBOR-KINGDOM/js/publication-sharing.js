/* =========================================
   AGBOR KINGDOM
   PUBLICATION SOCIAL SHARING
========================================= */

function setupPublicationSharing(publication) {

    const whatsappButton =
        document.getElementById(
            "shareWhatsApp"
        );

    const facebookButton =
        document.getElementById(
            "shareFacebook"
        );

    const twitterButton =
        document.getElementById(
            "shareTwitter"
        );

    const copyButton =
        document.getElementById(
            "shareCopyLink"
        );


    /* =====================================
       PUBLICATION DETAILS
    ===================================== */

    const publicationTitle =
        publication?.title ||
        "Publication from Agbor Kingdom";


    const publicationUrl =
        window.location.origin +
        "/publication-details.html?id=" +
        encodeURIComponent(
            publication?.id || ""
        );


    /* =====================================
       WHATSAPP
    ===================================== */

    if (whatsappButton) {

        whatsappButton.addEventListener(
            "click",
            function () {

                const text =
                    publicationTitle +
                    "\n\n" +
                    publicationUrl;


                const shareUrl =
                    "https://wa.me/?text=" +
                    encodeURIComponent(text);


                window.open(
                    shareUrl,
                    "_blank"
                );

            }
        );

    }


    /* =====================================
       FACEBOOK
    ===================================== */

    if (facebookButton) {

        facebookButton.addEventListener(
            "click",
            function () {

                const shareUrl =
                    "https://www.facebook.com/sharer/sharer.php?u=" +
                    encodeURIComponent(
                        publicationUrl
                    );


                window.open(
                    shareUrl,
                    "_blank",
                    "width=650,height=500"
                );

            }
        );

    }


    /* =====================================
       X / TWITTER
    ===================================== */

    if (twitterButton) {

        twitterButton.addEventListener(
            "click",
            function () {

                const shareUrl =
                    "https://twitter.com/intent/tweet?text=" +
                    encodeURIComponent(
                        publicationTitle
                    ) +
                    "&url=" +
                    encodeURIComponent(
                        publicationUrl
                    );


                window.open(
                    shareUrl,
                    "_blank",
                    "width=650,height=500"
                );

            }
        );

    }


    /* =====================================
       COPY LINK
    ===================================== */

    if (copyButton) {

        copyButton.addEventListener(
            "click",
            async function () {

                const copyText =
                    document.getElementById(
                        "shareCopyText"
                    );


                try {

                    await navigator.clipboard.writeText(
                        publicationUrl
                    );


                    if (copyText) {

                        const previousText =
                            copyText.textContent;


                        copyText.textContent =
                            "Copied!";


                        setTimeout(
                            function () {

                                copyText.textContent =
                                    previousText;

                            },
                            2000
                        );

                    }

                } catch (error) {

                    console.error(
                        "Unable to copy publication link:",
                        error
                    );

                }

            }
        );

    }

}