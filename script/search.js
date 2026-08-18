const defaultSearchEngine = "DuckDuckGo";

var searchInput = document.getElementById("search");
var searchIcon = document.getElementById("searchIcon");

searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        search();
    }
});
searchInput.placeholder = strings.searchWith.replace("{searchEngine}", getSearch());

searchIcon.addEventListener("click", function(event) {
    search();
})

function getSearch() {
    if (settings['searchEngine'] in searchEngines) {
        return settings['searchEngine'];
    }
    return defaultSearchEngine;
}

function search() {
    var query = searchInput.value;
    if (query.trim() === "") return;
    var url = searchEngines[getSearch()];
    url = url.replace("{query}", query);
    window.open(url);
}
