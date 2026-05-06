const locationLabel = document.getElementById("location");

getLocation();
let latitude, longitude = null;

// Figure out
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition( 
    // Success
    position => {
        // Try to get city from latitude/longitude
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        try {
            const url = `https://bigdatacloud.net?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
            const response = await fetch(url);
            const data = response.json();
            const city = data.city;
            locationLabel.textContent = city;
        } catch (error) {
            console.log("Error finding city: " + error);
            locationLabel.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
        }
        
    }, 
    // Failure
    () => {
        alert("Couldn't get your location. Try checking the website permissions!");
    });
} else {
    locationLabel.textContent = "Unknown Location"
}