function getWeather() {
    const apiKey = '8f693fc6652796127e57be9888feb076';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            changeBackground(data.name);  
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayDailyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const dailyForecastDiv = document.getElementById('daily-forecast');

    weatherInfoDiv.innerHTML = '';
    dailyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); 
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayDailyForecast(forecastData) {
    const dailyForecastDiv = document.getElementById('daily-forecast');
    dailyForecastDiv.innerHTML = '';

    const daysForecast = {};

    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();  
        const temp = Math.round(item.main.temp - 273.15);  
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        if (!daysForecast[date]) {
            daysForecast[date] = {
                temp,
                description,
                iconUrl,
                count: 1
            };
        } else {
            daysForecast[date].temp = Math.round((daysForecast[date].temp * daysForecast[date].count + temp) / (daysForecast[date].count + 1));
            daysForecast[date].count += 1;
        }
    });

    const days = Object.keys(daysForecast).slice(0, 7);

    days.forEach(day => {
        const { temp, description, iconUrl } = daysForecast[day];

        const dailyItemHtml = `
            <div class="daily-item">
                <p>${day}</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>${temp}°C</p>
                <p>${description}</p>
            </div>
        `;

        dailyForecastDiv.innerHTML += dailyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; 
}

function changeBackground(city) {
    const backgroundImages = {
        Delhi: 'delhi-bg.jpg',
        Mumbai: 'mumbai-bg.jpg',
        Bengaluru: 'bengaluru-bg.jpg',
        Kochi: 'kochi-bg.jpg',
        Paris: 'paris-bg.jpg',
        Tokyo: 'tokyo-bg.jpg'
    };



    

    // this is extra requirement asked by pws assignment
    
    const backgroundImage = backgroundImages[city];

    if (backgroundImage) {
        document.body.style.backgroundImage = `url(${backgroundImage})`;
        document.body.style.backgroundSize = 'cover';  
        document.body.style.backgroundPosition = 'center';  
        document.body.style.backgroundRepeat = 'no-repeat';  
    } else {
        document.body.style.backgroundImage = '';  
    }
}
