$(function () { // call the function after the DOM is fully loaded

    var viewForcast = JSON.parse(localStorage.getItem('viewForcast'));

    $('.list-group-item').each(function () {
        $(this).find('.btn-link').click(function () {

            var citiId = $(this).attr('id');

            $("#forecast").html(viewForcast[citiId].forcastCode);
            //console.log(viewForcast[citiId].forcastCode);
        });
    });

    $("#search-button").click(function (event) {  // set a click function to get the textarea content
        event.preventDefault();
        var cityName = $("#search-value").val();

        // This is our API key
        var APIKey = "25065ba2f17283bae170c1725c000cbb";

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
        //api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURL,
            method: "GET",
            data: {
                units: "imperial",
                cnt: "5"
            },

            success: function (forecast) {

                var cardWrapper = "";

                for (var i = 0; i < 5; i++) {

                    var nextDay = new Date();
                    var addOne = 1;
                    var dd = String(nextDay.getDate() + i + addOne).padStart(2, '0');
                    var mm = String(nextDay.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = nextDay.getFullYear();

                    nextDay = mm + '/' + dd + '/' + yyyy;
                    //console.log(nextDay);

                    var forcastDateFormat = new Date(nextDay);
                    var eachDate = forcastDateFormat.toDateString();

                    var eachIcon = forecast.list[i].weather[0].icon;
                    //var description = response.weather[0].description;
                    var eachIconUrl = "http://openweathermap.org/img/wn/" + eachIcon + ".png";

                    var eachTemp = forecast.list[i].main.temp;
                    var eachHumidity = forecast.list[i].main.humidity;

                    cardWrapper += (
                        "<div class='card mr-3 ml-3 bg-primary' style='width: 15rem;'>" +
                        "<div class='card-body'>" +
                        "<h5 class='card-title'>" + eachDate + "</h5>" +
                        "<img src='" + eachIconUrl + "' alt=''>" +
                        "<h6 class='card-subtitle mb-4'>Temperature: " + eachTemp + "&degF" + "</h6>" +
                        "<h6 class='card-subtitle mb-4 font-italic'>Humidity: " + eachHumidity + "&degF" + "</h6>" +
                        "</div>" +
                        "</div>"
                    );
                }
                $(cardWrapper).appendTo("#forecast");

                var forcastHtmlCode = $("#forecast").html();
                viewForcast = viewForcast || [];
                viewForcast.push({
                    forcastCode: forcastHtmlCode,
                })
                localStorage.setItem('viewForcast', JSON.stringify(viewForcast));
                // 
            }
        });

        $("#forecast").empty();
    });
});