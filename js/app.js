$(function () { // call the function after the DOM is fully loaded
    // get the current date

    //localStorage.clear();


    var viewCity = JSON.parse(localStorage.getItem('viewCity'));
    // localStorage.setItem('cities', JSON.stringify(cityName));

    $('.list-group-item').each(function () {
        $(this).find('.btn-link').click(function () {
            var citiId = $(this).attr('id');
            $("#today").html(viewCity[citiId].code);
        });
    });

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    $("#search-button").click(function (event) {  // set a click function to get the textarea content
        event.preventDefault();

        var cityName = $("#search-value").val();

        // This is our API key
        var APIKey = "25065ba2f17283bae170c1725c000cbb";

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                units: "imperial"
            },
        })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                var listCities = "";
                listCities += (
                    "<li class='list-group-item'>" +
                    "<button id='" + cityName + "'  type='button' class='btn btn-link'>" + cityName + "</button>" +
                    "</li>"
                );

                var cityNameTitle = $("<h1>").text(response.name + " " + today);

                //console.log(response);

                var currentTemp = response.main.temp;

                var cityTemperature = $("<div>").text("Temperature: " + currentTemp + " °F");
                var cityHumidity = $("<div>").text("Humidity: " + response.main.humidity + " %");
                var cityWind = $("<div>").text("Wind Speed: " + response.wind.speed.toFixed(1) + " MPH");


                var icon = response.weather[0].icon;
                var description = response.weather[0].description;
                var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

                var imageIcon = $("<img>");
                imageIcon.attr("src", iconUrl);
                imageIcon.attr("alt", description);

                //$("#history").prepend(cityList);
                $(listCities).appendTo("#history");

                // Transfer content to HTML
                $("#today").prepend(cityWind);
                $("#today").prepend(cityHumidity);
                $("#today").prepend(cityTemperature);
                $("#today").prepend(imageIcon);
                $("#today").prepend(cityNameTitle);

                var cityHtmlCode = $("#today").html();
                viewCity = viewCity || [];
                viewCity.push({
                    code: cityHtmlCode,
                })
                localStorage.setItem('viewCity', JSON.stringify(viewCity));

            });

        $("#today").empty();

    });

});
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

$(listCities).appendTo("#history");

$('#search-button').click(function () {
    var cityName = $("#search-value").val();
    cities = cities || [];
    cities.push({
        city: cityName,
    })
    localStorage.setItem('cities', JSON.stringify(cities));
});

