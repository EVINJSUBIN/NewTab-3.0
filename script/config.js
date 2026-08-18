document.addEventListener("DOMContentLoaded", () => {
    const colorSelect = document.getElementById("colorSelect");
    const themeModeSelect = document.getElementById("themeModeSelect");
    const clockTypeSelect = document.getElementById("clockTypeSelect");
    const clockColorInput = document.getElementById("clockColorInput");
    const resetClockColorBtn = document.getElementById("resetClockColorBtn");
    
    const clockShadowTypeSelect = document.getElementById("clockShadowTypeSelect");
    const clockShadowColorInput = document.getElementById("clockShadowColorInput");

    const fontPresetSelect = document.getElementById("fontPresetSelect");
    const customFontInput = document.getElementById("customFontInput");

    const bgTypeSelect = document.getElementById("bgTypeSelect");
    const bgColorInput = document.getElementById("bgColorInput");
    const bgImageInput = document.getElementById("bgImageInput");
    const searchEngineSelect = document.getElementById("searchEngineSelect");

    if (colorSelect) colorSelect.value = settings.colorScheme || "cyan";
    if (themeModeSelect) themeModeSelect.value = settings.themeMode || "auto";
    if (clockTypeSelect) clockTypeSelect.value = settings.clockType || "24h";
    if (clockColorInput) clockColorInput.value = settings.clockColor || "#ffffff";
    
    if (clockShadowTypeSelect) clockShadowTypeSelect.value = settings.clockShadowType || "theme";
    if (clockShadowColorInput) clockShadowColorInput.value = settings.clockShadowColor || "#22d3ee";

    if (fontPresetSelect) fontPresetSelect.value = settings.fontPreset || "dynapuff";
    if (customFontInput) customFontInput.value = settings.customFontName || "";

    if (bgTypeSelect) bgTypeSelect.value = settings.bgType || "theme";
    if (bgColorInput) bgColorInput.value = settings.bgColor || "#0f172a";
    if (bgImageInput) bgImageInput.value = settings.bgImage || "";
    if (searchEngineSelect) searchEngineSelect.value = settings.searchEngine || "DuckDuckGo";

    updateVisibility();

    themeModeSelect?.addEventListener("change", (e) => { set("themeMode", e.target.value); applyTheme(); });
    colorSelect?.addEventListener("change", (e) => { set("colorScheme", e.target.value); applyTheme(); });
    bgTypeSelect?.addEventListener("change", (e) => { set("bgType", e.target.value); updateVisibility(); applyTheme(); });
    bgColorInput?.addEventListener("input", (e) => { set("bgColor", e.target.value); applyTheme(); });
    bgImageInput?.addEventListener("change", (e) => { set("bgImage", e.target.value.trim()); applyTheme(); });

    fontPresetSelect?.addEventListener("change", (e) => { set("fontPreset", e.target.value); updateVisibility(); applyFont(); });
    customFontInput?.addEventListener("change", (e) => { set("customFontName", e.target.value.trim()); applyFont(); });

    clockTypeSelect?.addEventListener("change", (e) => { set("clockType", e.target.value); updateClock(); });
    clockColorInput?.addEventListener("input", (e) => { set("clockColor", e.target.value); updateClock(); });
    resetClockColorBtn?.addEventListener("click", () => { set("clockColor", ""); if (clockColorInput) clockColorInput.value = "#ffffff"; updateClock(); });

    clockShadowTypeSelect?.addEventListener("change", (e) => { set("clockShadowType", e.target.value); updateVisibility(); updateClock(); });
    clockShadowColorInput?.addEventListener("input", (e) => { set("clockShadowColor", e.target.value); updateClock(); });
    searchEngineSelect?.addEventListener("change", (e) => set("searchEngine", e.target.value));

    initShortcutsManager();
});

function updateVisibility() {
    const bgType = document.getElementById("bgTypeSelect")?.value;
    const fontPreset = document.getElementById("fontPresetSelect")?.value;
    const shadowType = document.getElementById("clockShadowTypeSelect")?.value;

    const colorSec = document.getElementById("colorSection");
    const bgPick = document.getElementById("bgPickerSection");
    const bgImg = document.getElementById("bgImageSection");
    const customFont = document.getElementById("customFontSection");
    const shadowPick = document.getElementById("clockShadowPickerSection");

    if (colorSec) colorSec.style.display = bgType === "theme" ? "flex" : "none";
    if (bgPick) bgPick.style.display = bgType === "color" ? "flex" : "none";
    if (bgImg) bgImg.style.display = bgType === "image" ? "flex" : "none";
    if (customFont) customFont.style.display = fontPreset === "custom" ? "flex" : "none";
    if (shadowPick) shadowPick.style.display = shadowType === "custom" ? "flex" : "none";
}

function initShortcutsManager() {
    const list = document.getElementById("shortcutsList");
    const addBtn = document.getElementById("addShortcutBtn");
    const nameIn = document.getElementById("shortcutName");
    const urlIn = document.getElementById("shortcutUrl");

    function render() {
        if (!list) return;
        let items = {};
        try { items = JSON.parse(settings.shortcuts || "{}"); } catch (e) {}
        list.innerHTML = "";

        const keys = Object.keys(items);
        if (!keys.length) { list.innerHTML = `<p class="empty-msg">No shortcuts added.</p>`; return; }

        for (const k of keys) {
            const row = document.createElement("div");
            row.className = "shortcut-config-item";
            row.innerHTML = `<div><strong>${k}</strong> <br><small style="opacity:0.6">${items[k]}</small></div>`;
            const btn = document.createElement("button");
            btn.className = "btn-delete";
            btn.textContent = "Remove";
            btn.onclick = () => {
                delete items[k];
                set("shortcuts", JSON.stringify(items));
                render();
            };
            row.appendChild(btn);
            list.appendChild(row);
        }
    }

    addBtn?.addEventListener("click", () => {
        const n = nameIn.value.trim();
        let u = urlIn.value.trim();
        if (!n || !u) return alert("Please enter name and URL.");
        if (!u.startsWith("http")) u = "https://" + u;

        let items = {};
        try { items = JSON.parse(settings.shortcuts || "{}"); } catch (e) {}
        items[n] = u;
        set("shortcuts", JSON.stringify(items));
        nameIn.value = "";
        urlIn.value = "";
        render();
    });

    render();
}
