function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function resetUI(message = "Search a city") {
  setText("city", message);
  setText("temp", "--");
  setText("humidity", "--");
  setText("wind", "--");
  setText("pressure", "--");
  setText("max", "--");
  setText("min", "--");
  setText("weatherType", "--");

  const icon = document.querySelector(".weather-icon");
  if (icon) icon.src = "images/clouds.png";
}

function getWeatherInfo(code) {
  if (code === 0) return { text: "Clear Sky", icon: "clear.png" };

  if ([1, 2, 3].includes(code)) return { text: "Cloudy", icon: "clouds.png" };

  if ([61, 63, 65].includes(code)) return { text: "Rainy", icon: "rain.png" };

  if ([71, 73, 75].includes(code)) return { text: "Snowy", icon: "snow.png" };

  if ([95, 96, 99].includes(code))
    return { text: "Thunderstorm", icon: "thunder.png" };

  return { text: "Cloudy", icon: "clouds.png" };
}

async function getFullWeather(city) {
  if (!city) {
    resetUI("Search a city");
    return;
  }

  resetUI("Loading...");

  try {

    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const geoData = await geoRes.json();

    if (!geoData.results) {
      resetUI("City not found");
      return;
    }

    const { latitude, longitude, name, admin1, country } = geoData.results[0];

    let cityLabel = name;

    if (admin1) {
      cityLabel += `, ${admin1}`;
    }

    if (country && country !== "India") {
      cityLabel += `, ${country}`;
    }

    const weatherRes = await fetch(`
https://api.open-meteo.com/v1/forecast
?latitude=${latitude}
&longitude=${longitude}
&current_weather=true
&hourly=relative_humidity_2m,pressure_msl
&daily=temperature_2m_max,temperature_2m_min
&timezone=auto
`);
    const data = await weatherRes.json();

    const weatherCode = data.current_weather.weathercode;
    const info = getWeatherInfo(weatherCode);

    setText("city", cityLabel);
    setText("temp", data.current_weather.temperature);
    setText("humidity", data.hourly.relative_humidity_2m[0]);
    setText("wind", data.current_weather.windspeed);
    setText("pressure", data.hourly.pressure_msl[0]);
    setText("max", data.daily.temperature_2m_max[0]);
    setText("min", data.daily.temperature_2m_min[0]);
    setText("weatherType", info.text);

    const icon = document.querySelector(".weather-icon");
    if (icon) icon.src = `images/${info.icon}`;
  } catch (error) {
    console.error(error);
    resetUI("Error fetching data");
  }
}

function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  getFullWeather(city);
}
resetUI();

const cityInput = document.getElementById("cityInput");

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCity();
  }
});
function setCityText(text) {
  const cityEl = document.getElementById("city");
  if (!cityEl) return;

  cityEl.innerText = text;

  const length = text.length;

  if (length <= 15) {
    cityEl.style.fontSize = "20px";
  } else if (length <= 25) {
    cityEl.style.fontSize = "18px";
  } else if (length <= 35) {
    cityEl.style.fontSize = "16px";
  } else {
    cityEl.style.fontSize = "14px";
  }
}

