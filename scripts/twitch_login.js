$(window).on('load', function() {
    $('#login').on('click', function () {
        $(this).attr('disabled', 'disabled');
        chrome.runtime.sendMessage({ message: 'login' }, function (response) {});
    });

    $('#test').on('click', getUserKurage);
});

async function getUserKurage() {
    let uid = await chrome.storage.sync.get(['user_uid']);
    let headers = await chrome.storage.sync.get(['api_headers']);

    $.ajax({
        url: `https://api.lasercatgames.com/api/kurage/uid/${uid.user_uid}`,
        type: "GET",
        dataType: "json",
        headers: headers.api_headers,
        success: function (response) {console.log(response)},
    });
}