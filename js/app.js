$(function () { // call the function after the DOM is fully loaded
    //localStorage.clear(); // was left committed out in case we want to cleaner the local store 
    var viewCity = JSON.parse(localStorage.getItem('viewCity')); // print the local store on load if it exists

    // get the respective id when clicked to displace the corresponding data from the local storage
    $('.list-group-item').each(function () {
        $(this).find('.btn-link').click(function () {
            var citiId = $(this).attr('id');
            $("#today").html(viewCity[citiId].code);
        });
    });
    // end

    // get today date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    // end

    // set a click function to trigger the event listner
    $("#search-button").click(function (event) {
        event.preventDefault(); // any default action will not be executed  

        var cityName = $("#search-value").val(); // get the input value (city name)

        // This is our API key
        var APIKey = "25065ba2f17283bae170c1725c000cbb";

        // API url
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

        // run AJAX call to extrait the API data
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                units: "imperial" // the temp will be render in fahrenheit 
            },
        })
            // Store retrieved data from API
            .then(function (response) {

                // generated the list of city and make it clickable
                var listCities = "";
                listCities += (
                    "<li class='list-group-item'>" +
                    "<button id='" + cityName + "'  type='button' class='btn btn-link'>" + cityName + "</button>" +
                    "</li>"
                );
                // end

                var cityNameTitle = $("<h1>").text(response.name + " " + today); // store city name and date

                var lat = response.coord.lat; // store lat
                var lon = response.coord.lon; // store lon
                var descriptionT = response.weather[0].description; // store description of weather

                // store second API url to have access to the UV data
                var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

                // run second AJAX call to store the UV
                $.ajax({
                    url: queryURL2,
                    method: "GET",
                    data: {
                        units: "imperial"
                    },
                })
                    .then(function (oneCall) {

                        var uvi = oneCall.current.uvi; //store the UV data

                        uviBadge = "";
                        uviBadge += (
                            "<span class='badge badge-light'>Sun radiation index (UV):</span> " +
                            "<span class='badge badge-danger'> " + uvi + "</span>"
                        )

                        $(uviBadge).appendTo("#today");
                    });
                // end second API call

                // store the city weather specs
                var currentTemp = response.main.temp;

                var cityTemperature = $("<div>").text("Temperature: " + currentTemp + " °F");
                var cityHumidity = $("<div>").text("Humidity: " + response.main.humidity + " %");
                var cityWind = $("<div>").text("Wind Speed: " + response.wind.speed.toFixed(1) + " MPH");


                var icon = response.weather[0].icon; //get icon code
                var description = response.weather[0].description;
                var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; //generated icon image url
                var imageIcon = $("<img>");
                imageIcon.attr("src", iconUrl);
                imageIcon.attr("alt", description);

                var descriptionEl = $("<h4><span class='badge badge-info'>" + descriptionT + "</span></h4>")
                // end

                $(listCities).appendTo("#history"); // print all cities name in list

                // Print city weather specs
                $("#today").prepend(cityWind);
                $("#today").prepend(cityHumidity);
                $("#today").prepend(cityTemperature);
                $("#today").prepend(descriptionEl);
                $("#today").prepend(imageIcon);
                $("#today").prepend(cityNameTitle);
                // end

                var cityHtmlCode = $("#today").html(); //store the city weather spec in HTML
                viewCity = viewCity || []; // store in array
                viewCity.push({
                    code: cityHtmlCode,
                })
                localStorage.setItem('viewCity', JSON.stringify(viewCity)); // send it to local storage

            });

        $("#today").empty(); //clean the city spec when user click on another city

    });
    // end event listner
});

// get the cities list from local storage
var cities = [{ city: "text city" }];
var cities = JSON.parse(localStorage.getItem('cities')); //.reverse()
var listCities = "";
$.each(cities, function (i) {
    listCities += (
        "<li class='list-group-item'>" +
        "<button id='" + [i] + "'  type='button' class='btn btn-link'>" + cities[i].city + "</button>" +
        "</li>"
    );
});

$(listCities).appendTo("#history"); // print the stored cities list HTML
// end

// send the cities list to the local storage
$('#search-button').click(function () {
    var cityName = $("#search-value").val();
    cities = cities || [];
    cities.push({
        city: cityName,
    })
    localStorage.setItem('cities', JSON.stringify(cities));
});
// end
