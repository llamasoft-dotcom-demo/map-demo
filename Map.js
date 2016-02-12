var globalMap;
var airportData = false;
var previousState = false;
var previousStateActive = false;
var previousCity = false;
var previousCityActive = false;

var myAirports = []


var generatePage = generatePage | {}
var checkArray = checkArray | {}

var prevInfoWindow = false;


$(function () {



    generatePage = {
        makeListState: function () {
            airportList = $(".states.section-1");
            airportList.append('<div class="list state-list"></div>');
            listObj = $(".state-list");

            for (var i = 0; i < airportData.length; i++) {
                string = "<div class=\"item state-item\" id=\"" + airportData[i].state + "\"><div class=\"openCity\">" + airportData[i].state + "</div></div>";
                if (!document.getElementById(airportData[i].state)) {
                    listObj.append(string)
                }
            }
        },
        makeListCity: function () {
            airportList = $(".city.section-2");
            airportList.append('<div class="list city-list"></div>');
            listObj = $(".city-list");
            for (var i = 0; i < airportData.length; i++) {
                state = airportData[i].state
                cityTrim = airportData[i].city.replace(/(\s|, )/g, '');
                city = airportData[i].city;

                string = '<div class="item city-item ' + state + '" id="' + cityTrim + '" ><div class="' + state + " " + cityTrim + '">' + city + '</div></div>'

                listObj.append(string)
            }
        },
        makeListCode: function () {
            airportList = $(".airport.section-3");
            airportList.append('<div class="list airport-list"></div>');
            listObj = $(".airport-list");
            for (var i = 0; i < airportData.length; i++) {
                code = airportData[i].code
                cityTrim = airportData[i].city.replace(/(\s|, )/g, '');
                city = airportData[i].city;
                state = airportData[i].state;
                lat = airportData[i].lat;
                lng = airportData[i].lng;

                str = airportData[i].fullSiteName

                var myRegexp = /^AIRPORT_..._([\w\s]*)/g;
                var match = myRegexp.exec(str);


                string = '<div class="item code-item ' + cityTrim + '" data-state="' + state + '" data-city="' + city + '" data-lat="' + lat + '" data-lng="' + lng + '" data-title="' + match[1] + '" data-code="' + code + '">' +
                    '<div class=\"' + code + '\">[' + code + '] ' + match[1] + '</div></div>'

                listObj.append(string)
            }
        }
    }
    checkArray = {
        checkIfNotEmpty: function (data) {
            if (data.length > 0) {
                return true
            } else {
                return false
            };
        },
        containsObject: function (obj, list) {
            var i;
            for (i = 0; i < list.length; i++) {
                if (list[i].code == obj) {
                    return true;
                }
            }
            return false;
        },
        checkIfMax: function (data, num) {
            if (data.length > num) {
                return true
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
    });

    function initPageBuild() {
        generatePage.makeListState();
        generatePage.makeListCity();
        generatePage.makeListCode();
        loadEvents();


    }




    function loadEvents() {
        $(".state-item").click(function (e) {
            e.preventDefault();


            $this = $(this);
            state = $this.attr("id");
            if (previousState) {
                previousState.toggle();
            }

            $('.code-item.active').css({ "display": "none" });
            $('.code-item').removeClass("active");

            cityClass = $(".city-item." + state + "")
            cityClass.css({ "display": "table" });
            previousState = cityClass;

            return false;
        })
        $(".city-item").click(function (e) {
            e.preventDefault();


            $this = $(this);
            city = $this.attr("id");
            if (previousCity) {
                previousCity.css({ "display": "none" });
            }

            codeClass = $(".code-item." + city + "")
            codeClass.css({ "display": "table" });
            codeClass.addClass("active")
            previousCity = codeClass;

            return false;
        })
        $(".code-item").click(function (e) {
            e.preventDefault();

            var max = 2;

            $this = $(this);
            airportBtn = $(".my-airports_btn")

            title = $this.attr('data-title');
            code = $this.attr('data-code');
            state = $this.attr('data-state');
            city = $this.attr('data-city');
            lat = $this.attr('data-lat');
            lng = $this.attr('data-lng');
            airportObj = {
                "title": title,
                "code": code,
                "state": state,
                "city": city,
                "location": { "lat": parseInt(lat), "lng": parseInt(lng) }
            }
            if (checkArray.checkIfNotEmpty(myAirports)) {
                if (checkArray.containsObject(code, myAirports)) {
                    console.log("You have already selected this airport.\n" +
                        "Please select another.")
                    return false
                }

                if (checkArray.checkIfMax(myAirports, max)) {
                    console.log("You have more than " + max + " this airports selected.\n" +
                        "Please remove one to continue.")
                    return false
                }

            }

            myAirports.push(airportObj)
            console.log("Airport added.");
            updateMyAirports(myAirports)

            return false;
        })
        $("div.my-airports_btn").click(function (e) {
            e.preventDefault();

            containers = $(".container");
            openContainer = $(".my-airports-container");

            containers.animate({
                opacity: 0
            }, function () {
                containers.css({ "display": "none" });
                openContainer.css({ "display": "initial" })
                openContainer.animate({
                    opacity: 1
                })
            })




            $(".instructionText").text("My Airports");


            return false;
        })
        $("div.airport-finder_btn").click(function (e) {
            e.preventDefault();

            containers = $(".container");
            openContainer = $(".airport-container");

            containers.animate({
                opacity: 0
            }, function () {
                containers.css({ "display": "none" });
                openContainer.css({ "display": "initial" })
                openContainer.animate({
                    opacity: 1
                })
            })




            $(".instructionText").text("Airport Finder");


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

    function updateMyAirports(data) {
        myAirportsSection = $(".my-airports.section-1");
        myAirportsSection.html("");
        myAirportsSection.append("<ol class=\"my-airport-list\"></ol>");

        myAirportList = $(".my-airport-list");
        airportBtn.text("My Airports: " + myAirports.length);

        for (var i = 0; i < data.length; i++) {
            var title = data[i].title;
            var code = data[i].code;
            var city = data[i].city;
            var state = data[i].state;

      

            string = "<li><h3 class=\"my-airport-list-title\">" + code + " " + title + "</h3><p class=\"my-airport-list-city-state\">" + city + ", " + state + "</p><div data-code=\"" + code + "\" class=\"remove-airport_btn btn\">Delete</li>";
            myAirportList.append(string)
        }
        updateMarkers()
        $("div.remove-airport_btn").click(function (e) {
            e.preventDefault();
            $this = $(this);
            code = $this.attr("data-code");

            removeAirport(code);

            return false;
        })
    }


    function removeAirport(value) {
        var i;

        for (var i = myAirports.length - 1; i >= 0; i--) {
            if (myAirports[i].code == value) {
                myAirports.splice(i, 1);
            }
        }
        console.log("Airport removed.");
        updateMyAirports(myAirports)
    }
});






var markers = [];
var map;
function updateMarkers() {
    clearMarkers();
    markers = [];
    for (var i = 0; i < myAirports.length; i++) {


        var contentString = "<h5>[" + myAirports[i].code + "] " + myAirports[i].title + "</h5>"
                        

        marker = new google.maps.Marker({
            position: myAirports[i].location,
            map: map,
            title: myAirports[i].title,
        });

        marker.info = new google.maps.InfoWindow({
            content: contentString
        });


        marker.addListener('click', function () {
            if (prevInfoWindow) {
                prevInfoWindow.close();
            }



            prevInfoWindow = this.info;
            this.info.open(map, this);
        });


        markers.push(marker);
        marker.setMap(map);
    }
}
function initMap() {
    map = new google.maps.Map(document.getElementById('airport-map'), {
        center: { lat: 39.50, lng:  -98.35 },
        scrollwheel: true,
        zoom: 3
    });
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function clearMarkers() {
    setMapOnAll(null);
}

