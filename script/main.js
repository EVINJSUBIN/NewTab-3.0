const settings = {
    colorScheme: "cyan",
    themeMode: "auto",
    bgType: "theme",
    bgColor: "#0f172a",
    bgImage: "",
    clockColor: "",
    clockShadowType: "theme",
    clockShadowColor: "#22d3ee",
    fontPreset: "dynapuff",
    customFontName: "",
    clockType: "24h",
    searchEngine: "DuckDuckGo",
    shortcuts: JSON.stringify({
        "GitHub": "https://github.com",
        "Hack Club": "https://hackclub.com",
        "YouTube": "https://youtube.com",
        "Dev.to": "https://dev.to"
    }),
    enableRSS: "true",
    maxNews: "12",
    rssFeeds: "[]"
};

const searchEngines = {
    "DuckDuckGo": "https://duckduckgo.com/?q={query}",
    "Google": "https://www.google.com/search?q={query}",
    "Ecosia": "https://www.ecosia.org/search?method=index&q={query}",
    "Brave": "https://search.brave.com/search?q={query}"
};

const presetFonts = {
    "dynapuff": { family: "'DynaPuff', system-ui, sans-serif", url: null },
    "inter": { family: "'Inter', sans-serif", url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" },
    "pacifico": { family: "'Pacifico', cursive", url: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap" },
    "quicksand": { family: "'Quicksand', sans-serif", url: "https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap" },
    "caveat": { family: "'Caveat', cursive", url: "https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" },
    "lobster": { family: "'Lobster', display", url: "https://fonts.googleapis.com/css2?family=Lobster&display=swap" },
    "playfair": { family: "'Playfair Display', serif", url: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&display=swap" },
    "anton": { family: "'Anton', sans-serif", url: "https://fonts.googleapis.com/css2?family=Anton&display=swap" },
    "orbitron": { family: "'Orbitron', sans-serif", url: "https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap" },
    "fredoka": { family: "'Fredoka', sans-serif", url: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap" }
};

function get(key) {
    try {
        const val = localStorage.getItem(key);
        if (val !== null) return val;
    } catch (e) {}
    const match = document.cookie.match(new RegExp('(^| )' + encodeURIComponent(key) + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

function set(key, value) {
    settings[key] = value;
    try { localStorage.setItem(key, value); } catch (e) {}
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/; max-age=31536000`;
}

function loadSettings() {
    for (const k of Object.keys(settings)) {
        const val = get(k);
        if (val !== null) settings[k] = val;
    }
    applyTheme();
    applyFont();
}

function applyTheme() {
    const body = document.getElementById("body");
    if (!body) return;

    const color = settings.colorScheme || "cyan";
    const mode = settings.themeMode || "auto";
    const modeClass = mode === "dark" ? " dark-mode" : mode === "light" ? " light-mode" : "";
    body.className = `${color}${modeClass}`;

    if (settings.bgType === "image" && settings.bgImage) {
        body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${settings.bgImage.trim()}')`;
        body.style.backgroundSize = "cover";
        body.style.backgroundAttachment = "fixed";
    } else if (settings.bgType === "color" && settings.bgColor) {
        body.style.backgroundImage = "none";
        body.style.backgroundColor = settings.bgColor;
    } else {
        body.style.backgroundImage = "";
        body.style.backgroundColor = "";
    }
}

function applyFont() {
    const preset = settings.fontPreset || "dynapuff";
    const custom = (settings.customFontName || "").trim();
    let link = document.getElementById("customFontLink");

    if (!link) {
        link = document.createElement("link");
        link.id = "customFontLink";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }

    let fontStr = "'DynaPuff', system-ui, sans-serif";
    if (preset === "custom" && custom) {
        link.href = `https://fonts.googleapis.com/css2?family=${custom.replace(/\s+/g, "+")}:wght@400;600;700&display=swap`;
        fontStr = `'${custom}', 'DynaPuff', system-ui, sans-serif`;
    } else if (presetFonts[preset] && presetFonts[preset].url) {
        link.href = presetFonts[preset].url;
        fontStr = presetFonts[preset].family;
    } else {
        link.removeAttribute("href");
    }

    document.body.style.fontFamily = "";
    const clockEl = document.getElementById("clock");
    const dateEl = document.getElementById("date");
    if (clockEl) clockEl.style.fontFamily = fontStr;
    if (dateEl) dateEl.style.fontFamily = fontStr;
}

function updateClock() {
    const clockEl = document.getElementById("clock");
    if (!clockEl) return;

    const now = new Date();
    const type = settings.clockType || "24h";
    let html = "";

    if (type === "24h") {
        html = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    } else if (type === "12h") {
        const h = String(now.getHours() % 12 || 12).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const p = now.getHours() >= 12 ? "PM" : "AM";
        html = `${h}:${m}<small class="clock-period">${p}</small>`;
    } else if (type === "sec") {
        html = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    } else if (type === "min") {
        html = `${now.getHours()}h ${String(now.getMinutes()).padStart(2, '0')}m`;
    }

    if (clockEl.innerHTML !== html) clockEl.innerHTML = html;

    if (settings.clockColor) {
        clockEl.style.setProperty("--clock-color", settings.clockColor);
    } else {
        clockEl.style.removeProperty("--clock-color");
    }

    const periodEl = clockEl.querySelector(".clock-period, small");
    if (settings.clockShadowType === "none") {
        clockEl.style.textShadow = "none";
        if (periodEl) periodEl.style.textShadow = "none";
    } else if (settings.clockShadowType === "custom" && settings.clockShadowColor) {
        clockEl.style.textShadow = `10px 10px 0 ${settings.clockShadowColor}`;
        if (periodEl) periodEl.style.textShadow = `4px 4px 0 ${settings.clockShadowColor}`;
    } else {
        clockEl.style.textShadow = "";
        if (periodEl) periodEl.style.textShadow = "";
    }
}

function updateDate() {
    const dateEl = document.getElementById("date");
    if (!dateEl) return;
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const str = `${days[now.getDay()]}, ${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    if (dateEl.textContent !== str) dateEl.textContent = str;
}

function initSearch() {
    const input = document.getElementById("search");
    const icon = document.getElementById("searchIcon");
    if (!input) return;

    const engine = searchEngines[settings.searchEngine] ? settings.searchEngine : "DuckDuckGo";
    input.placeholder = `Search with ${engine}`;

    function doSearch() {
        const q = input.value.trim();
        if (!q) return;
        const template = searchEngines[engine] || searchEngines.DuckDuckGo;
        window.location.href = template.replace("{query}", encodeURIComponent(q));
    }

    input.addEventListener("keypress", (e) => { if (e.key === "Enter") doSearch(); });
    icon?.addEventListener("click", doSearch);
}

function showShortcuts() {
    const box = document.getElementById("shortcuts");
    if (!box) return;

    let items = {};
    try { items = JSON.parse(settings.shortcuts || "{}"); } catch (e) {}
    box.innerHTML = "";

    for (const [name, url] of Object.entries(items)) {
        const tile = document.createElement("a");
        tile.className = "shortcut-tile";
        tile.href = url;
        tile.target = "_blank";
        tile.rel = "noopener noreferrer";

        let favicon = "favicon.ico";
        try { favicon = `${new URL(url).origin}/favicon.ico`; } catch (e) {}

        tile.innerHTML = `
            <div class="shortcut-icon-wrapper">
                <img class="shortcut-favicon" src="${favicon}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'white\\'><path d=\\'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z\\'/></svg>'" alt="${name}">
            </div>
            <span class="shortcut-label">${name}</span>
        `;
        box.appendChild(tile);
    }
}

const TODO_KEY = "newtab-todos";
function getTodos() {
    try { return JSON.parse(get(TODO_KEY) || "[]"); } catch (e) { return []; }
}

function loadTodos() {
    const list = document.getElementById("todoList");
    if (!list) return;
    const todos = getTodos();
    list.innerHTML = "";

    todos.forEach((t) => {
        const li = document.createElement("li");
        if (t.completed) li.className = "todoComplete";

        const span = document.createElement("span");
        span.textContent = t.text;
        span.style.cursor = "pointer";
        span.onclick = () => {
            t.completed = !t.completed;
            set(TODO_KEY, JSON.stringify(todos));
            loadTodos();
        };

        const btn = document.createElement("button");
        btn.className = "todoDelete";
        btn.textContent = "×";
        btn.onclick = (e) => {
            e.stopPropagation();
            const updated = todos.filter(item => item.id !== t.id);
            set(TODO_KEY, JSON.stringify(updated));
            loadTodos();
        };

        li.append(span, btn);
        list.appendChild(li);
    });
}

function initTodos() {
    const input = document.getElementById("todoText");
    const addBtn = document.getElementById("todoAdd");
    if (!input || !addBtn) return;

    function add() {
        const text = input.value.trim();
        if (!text) return;
        const todos = getTodos();
        todos.push({ id: Date.now(), text, completed: false });
        set(TODO_KEY, JSON.stringify(todos));
        input.value = "";
        loadTodos();
    }

    addBtn.onclick = add;
    input.onkeypress = (e) => { if (e.key === "Enter") add(); };
    loadTodos();
}

const demoNews = [
    { title: "Hack Club Hosts Largest Hackathon of Summer", link: "https://hackclub.com", pubDate: Date.now(), description: "Over 500 students gathered today for the biggest hackathon event of the season.", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop" },
    { title: "New Tab Extension Reaches 10K Users", link: "https://github.com", pubDate: Date.now() - 86400000, description: "Our minimal new tab page extension has officially reached 10,000 active users!", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop" },
    { title: "Web Performance: Making Sites 50% Faster", link: "https://web.dev", pubDate: Date.now() - 172800000, description: "Learn practical techniques to improve your site's performance and UX scores.", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop" }
];

function loadRSS() {
    const box = document.getElementById("rssFeed");
    if (!box || settings.enableRSS === "false") return;

    const max = parseInt(settings.maxNews, 10) || 12;

    fetch(`https://dev.to/api/articles?per_page=${max}`)
        .then(res => res.json())
        .then(articles => {
            if (!articles || !articles.length) throw new Error("Empty feed");
            box.innerHTML = "";
            let imgCount = 0;
            articles.forEach((item) => {
                const card = document.createElement("div");
                card.className = "newsCard";
                const d = new Date(item.published_at || item.published_timestamp || Date.now());
                const desc = item.description || (item.title + "...");
                const url = item.url || item.canonical_url;
                const cover = item.cover_image || item.social_image;

                let imgHtml = "";
                if (cover && imgCount < 3) {
                    imgHtml = `<img class="newsImg" src="${cover}" alt="${item.title}">`;
                    imgCount++;
                }

                card.innerHTML = `
                    ${imgHtml}
                    <span class="newsDateTime">${d.toLocaleDateString()} • ${item.reading_time_minutes || 3} min read</span>
                    <h3 class="newsTitle">${item.title}</h3>
                    <p class="newsDesc">${desc}</p>
                    <a class="newsLink" href="${url}" target="_blank" rel="noopener noreferrer">Read Article →</a>
                `;
                box.appendChild(card);
            });
        })
        .catch(() => {
            box.innerHTML = "";
            const items = demoNews.slice(0, max);
            let imgCount = 0;
            items.forEach((item) => {
                const card = document.createElement("div");
                card.className = "newsCard";
                const d = new Date(item.pubDate);
                let imgHtml = "";
                if (item.img && imgCount < 3) {
                    imgHtml = `<img class="newsImg" src="${item.img}" alt="${item.title}">`;
                    imgCount++;
                }
                card.innerHTML = `
                    ${imgHtml}
                    <span class="newsDateTime">${d.toLocaleDateString()}</span>
                    <h3 class="newsTitle">${item.title}</h3>
                    <p class="newsDesc">${item.description}</p>
                    <a class="newsLink" href="${item.link}" target="_blank" rel="noopener noreferrer">Read Article →</a>
                `;
                box.appendChild(card);
            });
        });
}

function initTopCustomize() {
    const colorSel = document.getElementById("colorSelect");
    const clockSel = document.getElementById("clockType");

    if (colorSel) {
        colorSel.value = settings.colorScheme || "cyan";
        colorSel.onchange = (e) => {
            set("colorScheme", e.target.value);
            applyTheme();
        };
    }

    if (clockSel) {
        clockSel.value = settings.clockType || "24h";
        clockSel.onchange = (e) => {
            set("clockType", e.target.value);
            updateClock();
        };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    updateClock();
    updateDate();
    initSearch();
    showShortcuts();
    initTodos();
    loadRSS();
    initTopCustomize();
    setInterval(updateClock, 1000);
});
