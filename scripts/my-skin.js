$(window).on('load', function() {
    i18nStaticContent();
    getUserSkin();
});

async function getUserSkin() {
    let uid = await chrome.storage.sync.get(['user_uid']);
    let headers = await chrome.storage.sync.get(['api_headers']);

    $.ajax({
        url: `https://api.lasercatgames.com/api/kurage/uid/${uid.user_uid}`,
        type: "GET",
        dataType: "json",
        headers: headers.api_headers,
        success: function (response) {
            createSkin(response.skin);
        },
    });
}

//Dynamic i18n example
function createSkin(skin) {
    $.get(chrome.runtime.getURL('html/template/skin-test.html'), function(data) {

        const tempDiv = $('<div>').html(data);

        let skinContainer = $(tempDiv).find('.skin').clone();
        let skinContent = skinContainer.find(".skin-content");
        let skinImage = skinContent.find("#skin-image")
        let skinName = skinContent.find("#skin-name")
        let skinDescription = skinContent.find("#skin-description")

        skinImage.attr("src", skin.image);
        skinName.text(getMessage(skin.name));
        skinDescription.text(getMessage(skin.description));

        console.log(skinContainer.html());
        $("#skin-template").append(skinContainer);
    }).fail(function() {
        console.error("Failed to fetch the template");
    });
}

function getMessage(code) {
    return chrome.i18n.getMessage(code.replace(/\./g, '_').replace(/-/g, "_"));
}

function i18nStaticContent()
{
    let objects = document.getElementsByTagName('html');
    for (let j = 0; j < objects.length; j++)
    {
        let obj = objects[j];

        let valStrH = obj.innerHTML.toString();
        let valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1)
        {
            return v1 ? getMessage(v1) : "";
        });

        if(valNewH !== valStrH)
        {
            obj.innerHTML = valNewH;
        }
    }
}