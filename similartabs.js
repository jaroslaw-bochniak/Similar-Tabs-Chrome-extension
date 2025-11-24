/**
 * Returns the hostname
 *
 * from http://beardscratchers.com/journal/using-javascript-to-get-the-hostname-of-a-url
 *
 * @param {String} url
 * @return {String}
 */
function getHost(url) {
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im'),
        m;

    if (url != null) {
        m = url.match(re);
        if (m != null) {
            return m[0];
        }
    }

    return url;
}

/**
 * Returns the current tab in the current window
 *
 * @param {Function} successHandler
 */
function getCurrentTab(successHandler) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs.length > 0) {
            successHandler(tabs[0]);
        }
    });
}

/**
 * Returns the tabs that have the same host in the current window
 *
 * @param {String} host
 * @param {Function} successHandler
 */
function getTabs(host, successHandler) {
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        var result = tabs.filter(function (tab, index, array) {
            var tabhost = getHost(tab.url);
            return tabhost == host;
        });

        successHandler(result);
    });
}

/**
 * Closes the tabs that have the same host as the current tab in the current window
 */
function closeSimilarTabs() {
    var tabhost, host;

    getCurrentTab(function (tab) {
        host = getHost(tab.url);
        // gets the tabs with the same host
        getTabs(host, function (tabs) {
            // closing the tabs
            tabs.forEach(function (tab, index, array) {
                chrome.tabs.remove(tab.id);
            });
        });

    });
}

function init() {
    chrome.action.onClicked.addListener(function (tab) {
        closeSimilarTabs();
    });
}

init();
