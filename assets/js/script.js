var cityFormEl = document.querySelector("#city-form");

var cityInputEl = document.querySelector("#city");

var tempsEl = document.querySelectorAll(".temp");

var windsEl = document.querySelectorAll(".wind");

var skiezEl = document.querySelectorAll(".skies");

var humiditysEl = document.querySelectorAll(".humidity");

var uvisEl = document.querySelectorAll(".uvi");

var citySearchTerm = document.querySelector("#city-search-term");

var cityContainer = document.querySelector("#city-container");

var cityCoordsEl = document.querySelector("#city-coords");

var forecastEl = document.querySelector("#forecast");

//Form to search for city coords
var searchButton = function(event) {
    // prevent page from refreshing
    event.preventDefault();
  
    // get value from input element
    var cityName = cityInputEl.value.trim();
  
    if (cityName) {
      //get today's forecast
      getCityCoords();
      saveCity(cityName);
  
      cityInputEl.value = "";
      //5 day for cast is apart of onecall api

    } else {
      alert("Please enter a valid city name.");
    }
};

  var saveCity = function(cityName) {
    
    // retrieve cityNames item from localStorage. If none exist, return an empty array.
    // cityNames is an array which holds the names of the cities I have recently searched
    var cityMore = JSON.parse(localStorage.getItem("cityMore") || "[]");
    console.log(cityMore);
    
    if (cityMore.length < 10) {
        cityMore.unshift(cityName);   //adds cityName to front of array
    } else {
      cityMore.pop()                //removes last item from array
      cityMore.unshift(cityName)    //adds cityName to front of array
    }
    // Sets current value of cityMore to local storage
    localStorage.setItem("cityMore", JSON.stringify(cityMore));

    //Write cities to the page
    cityContainer.innerHTML = `city-container: ${cityMore}`;

  }

  var getCityCoords = function() {
    //Stringify
    //console.log("city coords", cityInputEl.value);

    //geo api ink, blue in link is template literal, is equivalent to + '' +
    var apiGeo = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInputEl.value}&appid=447f6bda6a74a93f49f0ddcc0ca1d17c`;

     // make a get request to url
    fetch(apiGeo)
    .then(function(response) {

    // request was successful
    if (response.ok) {
      //console.log(response);

      response.json().then(function(cityData) {
      //console.log("Coordinates", cityData);

      if (cityData.length > 0) {
        location.lon = cityData[0].lon;
        //console.log("Lon", location.lon);
        location.lat = cityData[0].lat;
       //console.log("Lat", location.lat);

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
      //console.log("get weather");
      //is calling for humidity, wind, weather, temp, uvi, & the 5 day forecast
    var apiOnecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=447f6bda6a74a93f49f0ddcc0ca1d17c&units=imperial";

    // make a get request to url
    fetch(apiOnecall)
      .then(function(response) {

        // request was successful
        if (response.ok) {
          //console.log("CW response", response);

          response.json().then(function(weatherdata) {
          //console.log("Weather Data", weatherdata);

          var forecast = [];

          for (var i = 0; i < 6; i++) {
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
              forecast.push(dailyResult);

            }

            //console.log('FORECAST', forecast);

            //Displays weather data with parameter of weatherdata
            displayForecast(forecast);
        

            });
          }
      })
  };

    //use a loop to display forecast.
   // give divs id= 1-6 etc for each value of day in loop

  
var displayForecast = function(forecast) {
  
  // i is the current iteration of the loop. tempsEl.length works for all bc they're all the same length. They're all the same day.
  // for (var i = 0; i < 6; i++)

  for (var i = 0; i < tempsEl.length; i++) {

    tempsEl[i].innerHTML= `temp: ${forecast[i].temp.day} F`;
    windsEl[i].innerHTML= `wind: ${forecast[i].wind} MPH`;
    skiezEl[i].innerHTML= `skies: ${forecast[i].skies}`;
    humiditysEl[i].innerHTML= `humidity: ${forecast[i].humidity}`;
    uvisEl[i].innerHTML= `uvi: ${forecast[i].uvi}`;

  }
};


  // makes divs in the html to display data
  //change uv color
  //Stringify data for local storage JSON.parse(localStorage.getItem(""));
  
  // add event listeners to form
  cityFormEl.addEventListener("submit", searchButton);