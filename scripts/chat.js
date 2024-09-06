console.log("KurageXtension - Init");
const delay = ms => new Promise(res => setTimeout(res, ms));

$(window).on('load', async function () {
    //This is temporal delay, because for some reason Twitch is slow as shit and overrides the DOM modifications
    await delay(10000);

    let $button = $('<img>');
    let $container = $('.chat-input__buttons-container > div:last-child');
    $button.attr('src', chrome.runtime.getURL('medusa_ico.png'));
    $button.css("width", "20px");
    $button.on("click", function () {
        createModal();
    })

    console.log("KurageXtension - Appending button");

    $container.prepend($button);
});

function createModal() {
    $.get(chrome.runtime.getURL('html/template/modal.html'), function(data) {

        const tempDiv = $('<div>').html(data);

        let modal = $(tempDiv).find('.modal').clone();
        modal.css({
            "display": "block",
            "position": "fixed",
            "z-index": "1",
            "top": "0%",
            "left": "0%",
            "width": "100%",
            "height": "100%",
            "overflow": "auto",
            "background-color": "rgba(0, 0, 0, 0.4)"
        });

        let modalContent = modal.find(".modal-content");
        modalContent.css({
            "background-color": "#fefefe",
            "margin": "15% auto",
            "padding": "20px",
            "border": "1px solid #888",
            "width": "80%"
        });

        let closeButton = modalContent.find(".close");
        closeButton.css({
            "color": "#aaa",
            "float": "right",
            "font-size": "28px",
            "font-weight": "bold",
            "cursor": "pointer" // Add cursor style to indicate clickable
        }).on('click', function() {
            modal.remove(); // Remove the modal when the close button is clicked
        });

        console.log(modal.html());  // Log the modal HTML to verify
        $("body").append(modal); // Append the entire modal element
    }).fail(function() {
        console.error("Failed to fetch the template");
    });
}
