const shortcutsContainer = document.getElementById("shortcuts");

showShortcuts();

async function showShortcuts() {
    const shortcuts = JSON.parse(settings["shortcuts"]);
    if (Object.keys(shortcuts).length === 0) {
        shortcutsContainer.innerHTML = strings.noShortcuts;
    }
    for (shortcutName in shortcuts) {
        shortcutsContainer.innerHTML += `
            <a id="shortcut-${shortcutName}" class="shortcut" href="${shortcuts[shortcutName]}" target="blank">
                <svg xmlns="http://www.w3.org/2000/svg" class="shortcutIcon" width="50px" height="50px" viewBox="0 -960 960 960" fill="var(--text-color)"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-7-.5-14.5T799-507q-5 29-27 48t-52 19h-80q-33 0-56.5-23.5T560-520v-40H400v-80q0-33 23.5-56.5T480-720h40q0-23 12.5-40.5T563-789q-20-5-40.5-8t-42.5-3q-134 0-227 93t-93 227h200q66 0 113 47t47 113v40H400v110q20 5 39.5 7.5T480-160Z"/></svg>
                <span>${shortcutName}</span>
            </a>
        `;
        fetchIcon(shortcutName).then((result) => {
            const iconURL = result[0];
            const shortcutName = result[1];

            if (iconURL !== null) {
                document.getElementById(`shortcut-${shortcutName}`).innerHTML = `
                    <img class="shortcutIcon" src="${iconURL}" width="50px">
                    <span>${shortcutName}</span>
                `;
            }
        })
    }
}

async function fetchIcon(shortcutName) {
    const shortcuts = JSON.parse(settings["shortcuts"]);
    const url = shortcuts[shortcutName]
    const host = new URL(url).hostname;
    const protocol = new URL(url).protocol;
    const possibleLinks = [];

    try {
        const response = await fetch(url);
        const htmlContent = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
        const iconLinks = htmlDoc.querySelectorAll(`link[rel*='icon']`);
        iconLinks.forEach((linkObject) => {
            possibleLinks.push(new URL(linkObject.href).pathname);
        });
    } catch (e) {
        console.error(e);
    }

    possibleLinks.push("favicon.ico");

    for (i in possibleLinks) {
        try {
            const link = `${protocol}//${host}/${possibleLinks[i]}`
            console.log(link)
            if (await iconExists(link)) {
                return [link, shortcutName];
            }
        } catch (e) {
            console.error(e);
        }
    }

    return [null, shortcutName];
}

function iconExists(iconURL) {
    return new Promise((resolve) => {
        const img = new Image();
        img.style.display = "none";

        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);

        img.src = iconURL;
    });
}
