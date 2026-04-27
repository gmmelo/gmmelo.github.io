const nameInput = document.getElementById('nameInput');
const greeting = document.getElementById('greeting');
const hintText = document.getElementById('hintText');
const audio = document.getElementById('bgMusic');
const muteBtn = document.getElementById('muteBtn');

let userName = "stranger";

function updateGreeting() {
    const hour = new Date().getHours();
    let timeMsg = "";
    let timeEmoji = "";
    if (hour < 12) { timeMsg = "Good morning"; timeEmoji = "🌅"; }
    else if (hour < 18) { timeMsg = "Good afternoon"; timeEmoji = "☀️"; }
    else { timeMsg = "Good evening"; timeEmoji = "🌙"; }
    
    greeting.innerText = `${timeEmoji} ${timeMsg}, ${userName}!`;
}

nameInput.addEventListener('input', (e) => {
    userName = e.target.value || "stranger";
    updateGreeting();
});

document.getElementById('greeting-container').addEventListener('mouseenter', () => {
    hintText.style.display = 'none';
});

async function fetchWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=33.4272&longitude=-111.9399&current=temperature_2m&temperature_unit=fahrenheit');
        const data = await response.json();
        document.getElementById('weather').innerText = `Tempe: ${data.current.temperature_2m}°F`;
    } catch (err) {
        document.getElementById('weather').innerText = "Weather unavailable";
    }
}

muteBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        muteBtn.innerText = "Mute Music";
    } else {
        audio.pause();
        muteBtn.innerText = "Play Music";
    }
});

updateGreeting();
fetchWeather();
// Attempt to autoplay (browsers often block this until first interaction)
audio.play().catch(() => {
    console.log("User interaction required to start music.");
    muteBtn.innerText = "Play Music";
});
nameInput.value = "";