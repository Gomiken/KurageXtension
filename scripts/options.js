$(window).on('load', function() {
    $('#search').on('click', function () {
        const name = $("#user").val();
        search(name);
    })
});

function search(name) {
    if (name == null || name.length === 0) {
        setError(true, "Enter a name adobe.")
        return;
    }

    setError(false, null);

    getKuragePage({
        filter: {name: name},
        page: 0
    });
}

async function getKuragePage(data) {
    let headers = await chrome.storage.sync.get(['api_headers']);

    $.ajax({
        url: "https://api.lasercatgames.com/api/kurage/page",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        headers: headers,
        success: showResults,
        error: function(xhr, status, error) {
            setError(true, "Error occurred: " + error);
        }
    });
}

function setError(show, message) {
    if (show) {
        $("#error").show();
    } else {
        $("#error").hide();
    }

    if (message) {
        $("#error > p").text(message);
    }
}

function showResults(response) {
    if (response == null || response.totalElements === 0) {
        return;
    }

    $('#results-container').css('display', 'block');

    let $results = $('#results');
    $results.empty();

    for (var i = 0; i < response.content.length; i++) {
        $results.append(`<li><input type="radio" name="kurage">${response.content[i].name}</li>`);
    }
}