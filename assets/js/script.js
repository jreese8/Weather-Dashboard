var cityFormEl = document.querySelector("#city-form");

var cityInputEl = document.querySelector("#city");

var tempEl = document.querySelector("#temp");

var windEl = document.querySelector("#wind");

var skiesEl = document.querySelector("#skies");

var humidityEl = document.querySelector("#humidity");

var uviEl = document.querySelector("#uvi");

var citySearchTerm = document.querySelector("#city-search-term");

var cityCoordsEl = document.querySelector("#city-coords");

//Form to search for city coords
var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
  
    // get value from input element
    var cityCoords = cityInputEl.value.trim();
  
    if (cityCoords) {
      //get today's forecast
      getCityCoords();
  
      cityInputEl.value = "";
      //5 day for cast is apart of onecall api

    } else {
      alert("Please enter a valid city name.");
    }
  };

  ////////////////////////////////
  // One day forecast functions //
  ////////////////////////////////

  var getCityCoords = function(){
    console.log("city coords", cityInputEl.value);

    //geo api ink, blue in link is template literal, is equivalent to + '' +
    var apiGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInputEl.value}&appid=447f6bda6a74a93f49f0ddcc0ca1d17c`;

     // make a get request to url
    fetch(apiGeo)
    .then(function(response) {

    // request was successful
    if (response.ok) {
      console.log(response);

      response.json().then(function(cityData) {
      console.log("Coordinates", cityData);

      if (cityData.length > 0) {
        location.lon = cityData[0].lon;
        console.log("Lon", location.lon);
        location.lat = cityData[0].lat;
        console.log("Lat", location.lat);

      }

      getCityWeather(location.lat, location.lon);
    });
    
    } else {
      alert("Error: " + response.statusText);
    }
  })
};
  
  //gets the city weather
  var getCityWeather = function(lat, lon) {
      console.log("get weather");
      //is calling for humidity, wind, weather, temp, uvi, & the 5 day forecast
    var apiOnecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=447f6bda6a74a93f49f0ddcc0ca1d17c&units=imperial";

    // make a get request to url
    fetch(apiOnecall)
      .then(function(response) {

        // request was successful
        if (response.ok) {
          console.log("CW response", response);

          response.json().then(function(weatherdata) {
          console.log("Weather", weatherdata);

          //Displays weather data with parameter of weatherdata
          formatWeatherData(weatherdata);
        
         // get 5 day forecast
         getFiveForecast(weatherdata);
        });
        
      //  } else {
      //    alert("Error: " + response.statusText);
        }
      })
  };
  
  var displayWeather = function(temp, humidity, wind, skies, uvi) {
   tempEl.innerHTML= `temp: ${temp} F`;
   windEl.innerHTML= `wind: ${wind} MPH`;
   skiesEl.innerHTML= `skies: ${skies}`;
   humidityEl.innerHTML= `humidity: ${humidity}`;
   uviEl.innerHTML= `uvi: ${uvi}`;
  }

  var formatWeatherData = function(weatherdata) {
    console.log(weatherdata["current"]["temp"], weatherdata["current"]["humidity"], weatherdata["current"]["wind_speed"], weatherdata["current"]["weather"][0]["main"], weatherdata["current"]["uvi"]);
    
    var temp = weatherdata["current"]["temp"]
    var humidity = weatherdata["current"]["humidity"]
    var wind = weatherdata["current"]["wind_speed"]
    //weather is an array
    var skies = weatherdata["current"]["weather"][0]["main"]
    var uvi = weatherdata["current"]["uvi"]

    displayWeather(temp, humidity, wind, skies, uvi);
  
  }

  /////////////////////////////////
  // five day forecast functions //
  /////////////////////////////////
  var getFiveForecast = function(weatherdata) {
    console.log(weatherdata, "forecast");
    
    var fiveForecast = [];

    for (var i = 1; i < 6; i++) {
    // get temp, weather, wind speed, humidity, & uvi

        var temp = weatherdata["daily"][i]["temp"]
        var humidity = weatherdata["daily"][i]["humidity"]
        var wind = weatherdata["daily"][i]["wind_speed"]
         //weather is an array
        var skies = weatherdata["daily"][i]["weather"][0]["main"]
        var uvi = weatherdata["daily"][i]["uvi"]
        
        // this is the resulting data for each day's forecast
       var dailyResult = {
          //right side of colon is changing, daily value
          //left is a key
          "temp":temp,
          "humidity":humidity,
          "wind":wind,
          "skies":skies,
          "uvi":uvi
        }

        //alternative as an array
        //var dailyResult = [temp, humidity, wind, skies, uvi]

        //Accumulator
        fiveForecast.push(dailyResult);

    }

    console.log('FIVE DAY FORECAST', fiveForecast);

    //use a loop to display five forecast.
   // give divs id= 0,1 etc for each value of day in loop

  }
  
  // makes divs in the html to display data
  //change uv color
  //Stringify data for local storage JSON.parse(localStorage.getItem(""));
  
  // add event listeners to form
  cityFormEl.addEventListener("submit", formSubmitHandler);