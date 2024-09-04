console.log("KurageXtension - Init");
const delay = ms => new Promise(res => setTimeout(res, ms));

$(window).on('load', async function () {
    //This is temporal delay, because for some reason Twitch is slow as shit and overrides the DOM modifications
    await delay(10000);

    let $button = $('<img>');
    let $container = $('.chat-input__buttons-container > div:last-child');
    $button.attr('src', chrome.runtime.getURL('medusa_ico.png'));
    $button.css("width", "20px");

    console.log("KurageXtension - Appending button");

    $container.prepend($button);
});