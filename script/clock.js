const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");

const dayNames = strings.dayNames;

window.requestAnimationFrame(updateClock);
window.requestAnimationFrame(updateDate);

function updateClock() {
    let now = new Date();
    let clockType = settings['clockType'] || '24h';
    let timeString = '';

    if (clockType === '24h') {
        let hours = ("0" + now.getHours()).slice(-2);
        let minutes = ("0" + now.getMinutes()).slice(-2);
        timeString = `${hours}:${minutes}`;
    } else if (clockType === '12h') {
        let hours = now.getHours() % 12 || 12;
        let minutes = ("0" + now.getMinutes()).slice(-2);
        let period = now.getHours() >= 12 ? 'PM' : 'AM';
        timeString = `${hours}:${minutes} ${period}`;
    } else if (clockType === 'sec') {
        let hours = ("0" + now.getHours()).slice(-2);
        let minutes = ("0" + now.getMinutes()).slice(-2);
        let seconds = ("0" + now.getSeconds()).slice(-2);
        timeString = `${hours}:${minutes}:${seconds}`;
    } else if (clockType === 'min') {
        let hours = now.getHours();
        let minutes = ("0" + now.getMinutes()).slice(-2);
        timeString = `${hours}h ${minutes}m`;
    }

    if (clockElement.innerHTML !== timeString) {
        clockElement.innerHTML = timeString;
    }

    window.requestAnimationFrame(updateClock);
}

function updateDate() {
    let now = new Date();
    let weekday = dayNames[now.getDay()];
    let dayOfMonth = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    if (dateElement.innerHTML != `${weekday}, ${dayOfMonth}.${month}.${year}`) {
        dateElement.innerHTML = `${weekday}, ${dayOfMonth}.${month}.${year}`
    }

    window.requestAnimationFrame(updateDate);
}
