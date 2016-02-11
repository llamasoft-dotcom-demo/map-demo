var globalMap;
var airportData = false;
var previousState = false;
var previousStateActive = false;
var previousCity = false;
var previousCityActive = false;


var generatePage = generatePage | {}




$(function () {



    generatePage = {
        makeListState: function () {
            console.log(airportData);
            airportList = $(".airportList-new");
            airportList.append('<ul class="airport-List-new"></ul>');
            listObj = $(".airport-List-new")

            for (var i = 0; i < airportData.length; i++) {
                string = "<li class=\"state-item\" id=\"" + airportData[i].state + "\"><a href=\"#\" class=\"openCity\">" + airportData[i].state + "</a></li>";
                if (!document.getElementById(airportData[i].state)) {
                    listObj.append(string)
                }
            }
        },
        addAirportCitysToState: function () {
            for (var i = 0; i < airportData.length; i++) {


                state = airportData[i].state
                cityTrim = airportData[i].city.replace(/ /g, '');
                city = airportData[i].city;

                li = '<li><a href=\"#\" class=\"openCode\">' + city + '</a></li>'
                ul = '<ul id="' +cityTrim + '" class="sub-list-city ' + cityTrim + '">' + li + '</ul>';

                if (document.getElementById(state)) {
                    document.getElementById(state).innerHTML += ul
                }
            }
        },
        addAirportCodeToCity: function () {
            for (var i = 0; i < airportData.length; i++) {

                str = airportData[i].fullSiteName

                cityTrim = airportData[i].city.replace(/ /g, '');
                city = airportData[i].city;
                code = airportData[i].code;


                var myRegexp = /^AIRPORT_..._([\w\s]*)/g;
                var match = myRegexp.exec(str);



                li = '<li>' + match[1]+ " (" + code + ')</li>'
                ul = '<ul id="' + code + '" class="sub-list-code ' + code + '">' + li + '</ul>';

                

                if (document.getElementById(cityTrim)) {
                    document.getElementById(cityTrim).innerHTML += ul
                }
            }
        }
    }


    $.ajax({
        url: "/siteData.json",
        dataType: "json",
        error: function (error) {
            console.log(error);
        },
        success: function (data) {
            airportData = data.airports
            initPageBuild()
        },
    })

    function initPageBuild() {
        generatePage.makeListState()
        generatePage.addAirportCitysToState()
        generatePage.addAirportCodeToCity()
        loadEvents()
    }




    function loadEvents() {
        $("a.openCity").click(function (e) {
            e.preventDefault();


            $this = $(this);


           if ($this.hasClass("active")) {
               return false
           }

            $(".instructionText").text("Please select a city")
           $this.addClass("active");

            thisState = "#" + $this.text() + " ul"
            thisStateText = "#" + $this.text()



            if (previousState) {
                previousState.css({ "display": "none" })
                previousStateActive.removeClass("active")
            }

            if (previousCity) {
                previousCity.css({ "display": "none" });
                previousCityActive.removeClass("active");
            }

            previousState = $(thisState)
            previousStateActive = $($this)

            $(thisState).toggle()
            $(".sub-list-code").css({ "display": "none" })


            return false;
        })
        $("a.openCode").click(function (e) {
            e.preventDefault();
            $this = $(this);

            if ($this.hasClass("active")) {
                return false
            }
            $(".instructionText").text("Please select an airport")
            $this.addClass("active");

            thisCity = "#" + $this.text().replace(/ /g, '') + " ul"

            if (previousCity) {
                previousCity.css({ "display": "none" })
                previousCityActive.removeClass("active");

            }

            previousCity = $(thisCity);
            previousCityActive = $($this);

            $(thisCity).css({ "display": "block" })



            return false;
        })
        $("div.reset_btn").click(function (e) {
            e.preventDefault();
            $(".instructionText").text("Please select a state")
            if (previousState) {
                previousState.css({ "display": "none" })
                previousStateActive.removeClass("active")
            }

            if (previousCity) {
                previousCity.css({ "display": "none" });
                previousCityActive.removeClass("active");
            }




            return false;
        })
    }


    var MapFcns = {
        loadSiteList: function () {
            var airportList = $('#airport-list');

            airportList.html('');
            airportList.append('<option value=""></option>');
            for (var i in sites) {
                var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
                airportList.append(newOption);
            }
        },

        siteListChange: function () {
            var ctl = $(this),
                airportCode = ctl.val();
            if (airportCode) {
                var currAirport = _.findWhere(sites, { Code: airportCode });
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);

                var marker = new google.maps.Marker({
                    position: { lat: currAirport.Latitude, lng: currAirport.Longitude },
                    map: globalMap,
                    title: currAirport.Code
                });
            }
        }
    }


    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
    $('#exercise-toggle').click(function () {
        var toggleCtl = $(this),
             toggleVal = toggleCtl.text();
        if (toggleVal == '-') {
            toggleCtl.text('+');
            $('#exercise-instructions').hide();
        } else {
            toggleCtl.text('-');
            $('#exercise-instructions').show();
        }
    });



});








function initMap() {
    // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById('airport-map'), {
        center: { lat: 42.2814, lng: -83.7483 },
        scrollwheel: true,
        zoom: 6
    });

}