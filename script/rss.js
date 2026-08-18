const shortDayNames = strings.shortDayNames;

var rssNews = []

fetchRSSFeeds().then(() => displayRSSNews());

async function fetchRSSFeeds() {
    var rssFeeds = JSON.parse(settings['rssFeeds']);
    if (settings['enableRSS'] === 'false') return;
    for (feed in rssFeeds) {
        try {
            const response = await fetch(rssFeeds[feed]);
            const xmlString = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const news = xmlDoc.querySelectorAll('item');
            for (i in news) {
                try {
                    rssNews.push({
                        "title": news[i].querySelector('title').textContent,
                        "link": news[i].querySelector('link').textContent,
                        "pubDate": new Date(news[i].querySelector('pubDate').textContent).getTime(),
                        "description": news[i].querySelector('description').textContent
                    })
                } catch (error) {}
            }
        } catch (error) {
            console.error('Error loading XML:', error);
        }
    }
    rssNews.sort((a, b) => b.pubDate - a.pubDate)
}

function displayRSSNews() {
    if (settings['enableRSS'] === 'false') return;
    const rssFeedDiv = document.getElementById("rssFeed")
    for (i in rssNews) {
        if (i >= parseInt(settings['maxNews'])) return
        var title = rssNews[i].title
        var description = rssNews[i].description
        var link = rssNews[i].link

        var pubDate = new Date(rssNews[i].pubDate);
        let hours = ("0" + pubDate.getHours()).slice(-2);
        let minutes = ("0" + pubDate.getMinutes()).slice(-2);
        let weekday = shortDayNames[pubDate.getDay()];
        let dayOfMonth = pubDate.getDate();
        let month = pubDate.getMonth() + 1;

        rssFeedDiv.innerHTML += (
            `<div class="newsCard">
                <h2 class="newsTitle">${title}</h2>
                <span class="newsDateTime">${weekday}, ${dayOfMonth}.${month} ${hours}:${minutes}</span>
                <p class="newsDesc">${description}</p>
                <a class="newsLink" href='${link}' target="blank">${strings.openNews}</a>
            </div>`
        )
    }
}
