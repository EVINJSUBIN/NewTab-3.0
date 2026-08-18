const langs = {
    "en": {
        "dayNames": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "shortDayNames": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "searchWith": "Search with {searchEngine}",
        "openNews": "Open",
        "noShortcuts": "You don't have any shortcuts",
    }, 
    "de": {
        "dayNames": ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
        "shortDayNames": ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
        "searchWith": "Mit {searchEngine} suchen",
        "openNews": "Öffnen",
        "noShortcuts": "Du hast noch keine Verknüpfungen angelegt",
    }
};

var strings = langs.en;

if (navigator.language.slice(0, 2) == "de") {
    strings = langs.de;
}
