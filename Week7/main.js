const locationLabel = document.getElementById("location");
let latitude, longitude = getLocation();

// Figure out user location
function getLocation() {
    navigator.geolocation.getCurrentPosition( 
    // Success
    async position => {
        // Try to get city from latitude/longitude
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        try {
            const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            const response = await fetch(url);
            const data = await response.json();
            const city = data.city;
            locationLabel.textContent = city;
        } catch (error) {
            console.log("Error finding city: " + error);
            const decimals = 2;
            const latStr = latitude.toFixed(decimals).toString();
            const lngStr = longitude.toFixed(decimals).toString();
            locationLabel.textContent = `Latitude: ${latStr}, Longitude: ${lngStr}`;
        }
        return latitude, longitude;
    }, 
    // Failure
    () => {
        alert("Couldn't get your location. Try checking the website permissions!");
        locationLabel.textContent = "Unknown Location";
        return null;
    });
}