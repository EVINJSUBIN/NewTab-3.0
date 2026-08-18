const greetingEl = document.getElementById('greeting');
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchEngine = document.getElementById('searchEngine');
const shortcutsContainer = document.getElementById('shortcuts');
const apodTitle = document.getElementById('apodTitle');
const apodMeta = document.getElementById('apodMeta');
const apodImage = document.getElementById('apodImage');

const searchTargets = {
  google: 'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  brave: 'https://search.brave.com/search?q=',
  wikipedia: 'https://en.wikipedia.org/wiki/Special:Search?search=',
};

const defaultShortcuts = [
  { label: 'GitHub', url: 'https://github.com', icon: '⌘' },
  { label: 'Hack Club', url: 'https://hackclub.com', icon: '✦' },
  { label: 'Docs', url: 'https://docs.github.com', icon: '⎇' },
  { label: 'YouTube', url: 'https://youtube.com', icon: '▶' },
  { label: 'Maps', url: 'https://maps.google.com', icon: '⌖' },
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateString = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  greetingEl.textContent = getGreeting();
  timeEl.textContent = timeString;
  dateEl.textContent = dateString;
}

function getShortcuts() {
  const stored = localStorage.getItem('minimal-new-tab-shortcuts');

  if (!stored) {
    localStorage.setItem('minimal-new-tab-shortcuts', JSON.stringify(defaultShortcuts));
    return defaultShortcuts;
  }

  try {
    const parsed = JSON.parse(stored);
    return parsed.length ? parsed : defaultShortcuts;
  } catch (error) {
    return defaultShortcuts;
  }
}

function renderShortcuts() {
  const shortcuts = getShortcuts();

  shortcutsContainer.innerHTML = ''; 

  shortcuts.forEach((shortcut) => {
    const link = document.createElement('a');
    link.href = shortcut.url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.className = 'shortcut';
    link.title = shortcut.label;

    const icon = document.createElement('span');
    icon.className = 'shortcut-icon';
    icon.textContent = shortcut.icon;

    const label = document.createElement('span');
    label.className = 'shortcut-label';
    label.textContent = shortcut.label;

    link.append(icon, label);
    shortcutsContainer.appendChild(link);
  });
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (!query) {
    searchInput.focus();
    return;
  }

  const engine = searchTargets[searchEngine.value] || searchTargets.google;
  const url = `${engine}${encodeURIComponent(query)}`;
  window.location.href = url;
});

async function loadApod() {
  try {
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');

    if (!response.ok) {
      throw new Error('NASA API request failed');
    }

    const data = await response.json();

    if (data && data.url) {
      apodImage.src = data.hdurl || data.url;
      apodImage.alt = data.title || 'NASA Picture of the Day';
      apodTitle.textContent = data.title || 'Picture of the Day';
      apodMeta.textContent = `${data.date || 'Today'} • ${data.copyright || 'NASA'}`;
    }
  } catch (error) {
    apodImage.src = 'https://images-assets.nasa.gov/image/iss056e023130/iss056e023130~orig.jpg';
    apodTitle.textContent = 'Picture of the Day';
    apodMeta.textContent = 'NASA • offline fallback';
  }
}

updateClock();
renderShortcuts();
loadApod();
setInterval(updateClock, 1000 * 30);
