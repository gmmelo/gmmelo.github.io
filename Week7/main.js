const locationLabel = document.getElementById("location");

async function init() {
    try {
        const [latitude, longitude] = await locationPromise;
        const weatherInfo = await getWeatherInfo(latitude, longitude);
        fillOutWeatherLabels(weatherInfo);
    }
    catch (error) {
        console.error("Couldn't fill all weather information: " + error);
    }
}

// Resolves to an array containing the user's latitude, longitude, and timezone, respectively.
// On error, return an error string.
const locationPromise = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition( 
        // Success
        async position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // Try to get city from latitude/longitude
            try {
                const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
                const response = await fetch(url);
                const data = await response.json();
                const city = data.city;
                locationLabel.textContent = city;
            } catch (error) {
                console.error("Error fetching city: " + error);
                const decimals = 2;
                const latStr = lat.toFixed(decimals).toString();
                const lngStr = lng.toFixed(decimals).toString();
                locationLabel.textContent = `Latitude: ${latStr}, Longitude: ${lngStr}`;
            }
            resolve([lat, lng]);
        }, 
        // Failure
        () => {
            locationLabel.textContent = "Unknown Location";
            reject("failed acquiring user location");
        }
    );
});

// Returns a JSON containing current temperature, weekly highs and lows, and weekly sunrise and sunset times
async function getWeatherInfo(lat, lng) {
    return new Promise(async (resolve, reject) => {
        try {  
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` + 
                `&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&current=temperature_2m&timezone=${timezone}&temperature_unit=fahrenheit`;
            const response = await fetch(url);
            const weatherInfo = await response.json();
            resolve(weatherInfo);
        } catch (error) {
            reject("error fetching weather info - " + error);
        }
    });
}

// Fills out the weather labels in the DOM using JSON-formatted weather information
function fillOutWeatherLabels(weatherInfo) {
    const today = new Date();
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;

    // Parse low/high temperatures for today and the next 6 days
    const [lowTemps, highTemps] = [weatherInfo.daily.temperature_2m_min, weatherInfo.daily.temperature_2m_max];

    // Set the current day labels
    {
        const topWeatherBlock = document.getElementById("top-weather-block");
        const curTempLabel = document.getElementById("current-temperature").getElementsByTagName("label")[0];
        const minLabel = topWeatherBlock.getElementsByClassName("low-temperature")[0];
        const maxLabel = topWeatherBlock.getElementsByClassName("high-temperature")[0];

        curTempLabel.textContent = Math.round(weatherInfo.current.temperature_2m);
        minLabel.textContent = Math.round(lowTemps[0]);
        maxLabel.textContent = Math.round(highTemps[0]);
    }

    // Set the labels for the next 6 days
    {
        const upcomingTemperatureLabelDivs = document.getElementsByClassName("upcoming-temperature");
        for (let i = 0; i < upcomingTemperatureLabelDivs.length; i++) {
            const labelDiv = upcomingTemperatureLabelDivs[i];
            const hiLabel = labelDiv.getElementsByClassName("high-temperature")[0];
            const loLabel = labelDiv.getElementsByClassName("low-temperature")[0];
            const dayLabel = labelDiv.getElementsByClassName("day-of-the-week")[0];

            // Set the lo/hi labels
            {
                loLabel.textContent = "Lo: " + Math.round(lowTemps[i + 1]);
                hiLabel.textContent = "Hi: " + Math.round(highTemps[i + 1]);
            }

            // Set the weekday labels
            {
                const curDay = new Date(today);
                curDay.setDate(today.getDate() + i + 1);
                const shortDayName = curDay.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase();
                dayLabel.textContent = shortDayName;
            }
        }
    }

    // Set the sunrise and sunset labels
    {
        const sunriseLabels = document.getElementsByClassName("sunrise");
        const sunsetLabels = document.getElementsByClassName("sunset");

        const sunriseTimes = weatherInfo.daily.sunrise;
        const sunsetTimes = weatherInfo.daily.sunset;

        for (let i = 0; i < sunsetTimes.length; i++) {
            sunriseLabels[i].textContent = sunriseTimes[i].split('T')[1];
            sunsetLabels[i].textContent = sunsetTimes[i].split('T')[1];
        }
    }
}

init();