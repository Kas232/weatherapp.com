const apiKey = "54fe8980e4fd94b5139d4fd7d9a7533d";

let searchHistory = [];

// Search Weather

async function getWeather() {

    const city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Please enter city name");
        return;
    }

    document.getElementById("loader").style.display = "block";

    try {

        const weatherUrl =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(weatherUrl);

        const data = await response.json();

        if (data.cod == "404") {

            document.getElementById("weather-box").innerHTML =
                `<h2>❌ City Not Found</h2>`;

            document.getElementById("loader").style.display = "none";
            return;
        }

        showWeather(data);

        addToHistory(city);

        getForecast(city);

    }

    catch (error) {

        console.log(error);

        document.getElementById("weather-box").innerHTML =
            `<h2>❌ Something Went Wrong</h2>`;

    }

    finally {

        document.getElementById("loader").style.display = "none";

    }

}

// Location Weather

async function getLocationWeather() {

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            document.getElementById("loader").style.display = "block";

            try {

                const url =
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                const response = await fetch(url);

                const data = await response.json();

                showWeather(data);

                addToHistory(data.name);

                getForecast(data.name);

            }

            catch (error) {

                console.log(error);

            }

            finally {

                document.getElementById("loader").style.display = "none";

            }

        },

        () => {

            alert("Location Access Denied");

        }

    );

}

// Display Weather

function showWeather(data) {

    const iconCode = data.weather[0].icon;

    const iconUrl =
        `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    document.getElementById("weather-box").innerHTML = `

        <div class="city-name">
            📍 ${data.name}
        </div>

        <div class="weather-icon">
            <img src="${iconUrl}" width="120">
        </div>

        <div class="temperature">
            ${Math.round(data.main.temp)}°C
        </div>

        <div class="description">
            ${data.weather[0].description}
        </div>

    `;

    document.getElementById("feelsLike").innerText =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("humidity").innerText =
        `${data.main.humidity}%`;

    document.getElementById("wind").innerText =
        `${data.wind.speed} m/s`;

    document.getElementById("pressure").innerText =
        `${data.main.pressure} hPa`;

    changeBackground(data.weather[0].main);

}

// Dynamic Background

function changeBackground(weather) {

    if (weather.includes("Clear")) {

        document.body.style.background =
            "linear-gradient(135deg,#0ea5e9,#38bdf8,#7dd3fc)";

    }

    else if (weather.includes("Clouds")) {

        document.body.style.background =
            "linear-gradient(135deg,#475569,#64748b,#94a3b8)";

    }

    else if (weather.includes("Rain")) {

        document.body.style.background =
            "linear-gradient(135deg,#1e293b,#334155,#475569)";

    }

    else if (weather.includes("Snow")) {

        document.body.style.background =
            "linear-gradient(135deg,#cbd5e1,#e2e8f0,#f8fafc)";

    }

    else {

        document.body.style.background =
            "linear-gradient(135deg,#0f172a,#1e293b,#334155)";

    }

}

// Forecast

async function getForecast(city) {

    try {

        const url =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        const data = await response.json();

        let forecastHTML = "";

        for (let i = 0; i < 5; i++) {

            const item = data.list[i * 8];

            const date = new Date(item.dt_txt);

            const day = date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );

            const icon =
                `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

            forecastHTML += `

                <div class="forecast-card">

                    <h3>${day}</h3>

                    <img src="${icon}" width="50">

                    <p>${Math.round(item.main.temp)}°C</p>

                    <p>${item.weather[0].main}</p>

                </div>

            `;
        }

        document.getElementById("forecast-box").innerHTML =
            forecastHTML;

    }

    catch (error) {

        console.log(error);

    }

}

// Search History

function addToHistory(city) {

    if (searchHistory.includes(city)) {
        return;
    }

    searchHistory.unshift(city);

    if (searchHistory.length > 5) {
        searchHistory.pop();
    }

    let html = "";

    searchHistory.forEach(item => {

        html +=
            `<li onclick="quickSearch('${item}')">${item}</li>`;

    });

    document.getElementById("history-list").innerHTML =
        html;

}

// Quick Search

function quickSearch(city) {

    document.getElementById("city").value = city;

    getWeather();

}

// Dark Mode

function toggleTheme() {

    document.body.classList.toggle("dark-theme");

}

// Enter Key

document.getElementById("city").addEventListener(

    "keypress",

    function (event) {

        if (event.key === "Enter") {

            getWeather();

        }

    }

);

// Default City

window.onload = () => {

    document.getElementById("city").value = "Delhi";

    getWeather();

};