// Twitch Stuff
const CLIENT_ID = '1ju3ddgggyg1kwxh2oevr8q3xj4yt4';
const REDIRECT_URI = 'https://imlkpcjeobgjpindbbnfkghgjmgpbcbh.chromiumapp.org/';
const RESPONSE_TYPE = "token id_token";
const SCOPE = 'openid user:read:email';
const CLAIMS = JSON.stringify({
    "id_token": {"email": null, "email_verified": null},
    "userinfo": {"picture": null}
});
const STATE = 'meet' + generateRandomString();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "login") {
        let url = buildTwitchAuth();
        chrome.identity.launchWebAuthFlow({
            url: url,
            interactive: true,
        }, function (redirectUri) {
            if (chrome.runtime.lastError || redirectUri.includes('error=access_denied')) {
                sendResponse({ message: 'fail' });
            } else {

                let idToken = redirectUri.substring(redirectUri.indexOf('id_token=') + 9);
                idToken = idToken.substring(0, idToken.indexOf('&'));

                let userInfo = parseJwt(idToken);

                chrome.storage.sync.set({ "user_uid": userInfo.sub }, function() {});
                console.log("KurageXtension - User uid saved.");

                sendResponse({ message: 'success' });
            }
        });
        return true;
    }
});

function generateRandomString() {
    return Math.random().toString(36).substring(2, 15);
}

function buildTwitchAuth() {
    let nonce = generateRandomString() + generateRandomString();
    return `https://id.twitch.tv/oauth2/authorize
        ?client_id=${encodeURIComponent(CLIENT_ID)}
        &redirect_uri=${encodeURIComponent(REDIRECT_URI)}
        &response_type=${encodeURIComponent(RESPONSE_TYPE)}
        &scope=${encodeURIComponent(SCOPE)}
        &claims=${encodeURIComponent(CLAIMS)}
        &state=${encodeURIComponent(STATE)}
        &nonce=${encodeURIComponent(nonce)}`.replace(/\s+/g, '');
}

function parseJwt (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}