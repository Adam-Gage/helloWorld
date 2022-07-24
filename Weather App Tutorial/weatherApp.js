
window.addEventListener('load', function () {
    var long, lat;
    var location = document.getElementsByClassName('location');
    var temperatureDescription = document.querySelector('.temperature-description');
    var temperatureDegree = document.querySelector('.temperature-degree');
    var locationTimezone = document.querySelector('.location-timezone');
    var iconArea = document.querySelector('.icon');
    var degreeSection = document.querySelector(".degree-section");
    var unit = document.querySelector(".degree-section span");
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locationFound);
    } 
    else {
        location.textContent = "Feature not available - Location not detected"
    }
    
    function locationFound (pos) {
        long = pos.coords.longitude;
        lat = pos.coords.latitude;
    
        var api = `http://api.weatherapi.com/v1/current.json?key=b02a9445c2174436b56104435210302&q=${lat},${long}`;
        
        fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            var {temp_c, temp_f, condition} = data.current;
            var {name} = data.location;
            var {text, is_day} = condition;

            // Set DOM elements from API
            temperatureDegree.textContent = temp_c;
            unit.textContent = "C";
            temperatureDescription.textContent = text;
            locationTimezone.textContent = name;

            // Set Icon
            setIcons(text, iconArea, is_day);
            
            function changeUnits() {
                if (unit.textContent === "F") {
                    temperatureDegree.textContent = temp_c;
                    unit.textContent = "C";
                }
                else {
                    temperatureDegree.textContent = temp_f;
                    unit.textContent = "F";
                };
            };
            
            // Change temperature units
            degreeSection.addEventListener('click', changeUnits);
        });
    };

    function setIcons(icon, iconId, is_day) {
        var skycons = new Skycons({ color: "white" });
        var dayNight;
        if (icon == "Partly cloudy" || icon == "Clear") dayNight = (is_day == 1) ? "_DAY" : "_NIGHT";
        var currentIcon = icon.replace(/ /g, "_").toUpperCase() + dayNight;

        skycons.play();
        return skycons.set(iconId, Skycons[currentIcon]);
    };

});
