const headers = {
    "Authorization": "Basic cHVibGljOkYvLDtgNTM4XzXCo3ZfQ1YuS1N2Nk1RWDwpcDFPQlg1Zw==",
};

$(window).on('load', function() {
    $('#login').on('click', function () {
        $(this).attr('disabled', 'disabled');
        chrome.runtime.sendMessage({ message: 'login' }, function (response) {});
    });

    $('#test').on('click', function () {
        chrome.storage.sync.get(["user_uid"], function (item) {
            let user_uid = item.user_uid;
            $.ajax({
                url: `https://api.lasercatgames.com/api/kurage/uid/${user_uid}`,
                type: "GET",
                dataType: "json",
                headers: headers,
                success: function (response) {console.log(response)},
                error: function(xhr, status, error) {
                    setError(true, "Error occurred: " + error);
                }
            });
        });
    });
});