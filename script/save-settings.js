const settings = {
    "enableRSS": "true",
    "rssFeeds": "[]",
    "maxNews": "12",
    "colorScheme": "cyan",
    "searchEngine": "DuckDuckGo",
    "shortcuts": "{}",
    "clockType": "24h",
}

const searchEngines = {
    "DuckDuckGo": "https://duckduckgo.com/?q={query}",
    "Google": "https://www.google.com/search?q={query}",
    "Ecosia": "https://www.ecosia.org/search?method=index&q={query}"
};

loadSettings();

function loadSettings() {
    for (key in settings) {
        settings[key] = getOrDefault(key, settings[key]);
    }
}

function resetSettings() {
    for (key in settings) {
        remove(key);
    }
}

function set(key, value) {
    document.cookie = `${key}=${value}; path=/`;
    document.cookie = `${key}=${value}; path=/config`;
}

function get(key) {
    var cookies = document.cookie.split('; ');
    for (i in cookies) {
        cookie = cookies[i]
        if (cookie.startsWith(key + "=")) {
            return cookie.replace(key + "=", "");
        }
    }
    return null;
}

function getOrDefault(key, defaultVal) {
    var cookies = document.cookie.split('; ');
    for (i in cookies) {
        cookie = cookies[i]
        if (cookie.startsWith(key + "=")) {
            return cookie.replace(key + "=", "");
        }
    }
    return defaultVal;
}

function remove(key) {
    var cookies = document.cookie.split('; ');
    for (i in cookies) {
        var cookie = cookies[i]
        if (cookie.startsWith(key + "=")) {
            document.cookie = cookie + "; expires=Thur, 1 Jan 2009 12:00:00 UTC"
        }
    }
}
