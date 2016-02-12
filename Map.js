//placeholders
var previousState = false;
var previousStateActive = false;
var previousCity = false;
var previousCityActive = false;
var prevInfoWindow = false;

//arrays and data
var airportData_arr = [];
var myAirports_arr = [];
var markers_arr = [];

//objects
var generatePage = generatePage | {}
var checkArray = checkArray | {}
var manageArray = manageArray | {}
var mapControls = mapControls | {}
var map_obj = map_obj | {};

//onload function
$(function () {
    //loads airport data
    //starts page build
    $.ajax({
        url: "/siteData.json",
        dataType: "json",
        error: function (error) {
            console.log(error);
        },
        success: function (data) {
            airportData_arr = data.airports
            initPageBuild()
        },
    });
});

//this will generate state/city/airport-code list(s)
generatePage = {
    makeListState: function () {

        $airportList = $(".states.section-1");
        $airportList.append('<div class="list state-list"></div>');
        $listObj = $(".state-list");

        for (var i = 0; i < airportData_arr.length; i++) {
            string = "<div class=\"item state-item\" id=\"" + airportData_arr[i].state + "\"><div class=\"openCity\">" + airportData_arr[i].state + "</div></div>";
            if (!document.getElementById(airportData_arr[i].state)) {
                $listObj.append(string)
            }
        }
    },
    makeListCity: function () {
        $airportList = $(".city.section-2");
        $airportList.append('<div class="list city-list"></div>');
        $listObj = $(".city-list");
        for (var i = 0; i < airportData_arr.length; i++) {
            state = airportData_arr[i].state
            cityTrim = airportData_arr[i].city.replace(/(\s|, )/g, '');
            city = airportData_arr[i].city;

            string = '<div class="item city-item ' + state + '" id="' + cityTrim + '" ><div class="' + state + " " + cityTrim + '">' + city + '</div></div>'

            $listObj.append(string)
        }
    },
    makeListCode: function () {
        $airportList = $(".airport.section-3");
        $airportList.append('<div class="list airport-list"></div>');
        $listObj = $(".airport-list");
        for (var i = 0; i < airportData_arr.length; i++) {
            code = airportData_arr[i].code
            cityTrim = airportData_arr[i].city.replace(/(\s|, )/g, '');
            city = airportData_arr[i].city;
            state = airportData_arr[i].state;
            lat = airportData_arr[i].lat;
            lng = airportData_arr[i].lng;

            str = airportData_arr[i].fullSiteName

            myRegexp = /^AIRPORT_..._([\w\s]*)/g;
            match = myRegexp.exec(str);


            string = '<div class="item code-item ' + cityTrim + '" data-state="' + state + '" data-city="' + city + '" data-lat="' + lat + '" data-lng="' + lng + '" data-title="' + match[1] + '" data-code="' + code + '">' +
                '<div class=\"' + code + '\">[' + code + '] ' + match[1] + '</div></div>'

            $listObj.append(string)
        }
    }
}

//updates array
manageArray = {
    updateMyAirports: function (data) {
        $myAirportList = $(".my-airport-list");
        $myAirportList.html("");
        $airportBtn.text("My Airports: " + myAirports_arr.length);

        for (var i = 0; i < data.length; i++) {
            title = data[i].title;
            code = data[i].code;
            city = data[i].city;
            state = data[i].state;

            string = "<li><h3 class=\"my-airport-list-title\">" + code + " " + title + "</h3><p class=\"my-airport-list-city-state\">" + city + ", " + state + "</p><div data-code=\"" + code + "\" id=\"remove-airport_btn-" + i + "\" class=\"remove-airport_btn btn\">Delete</li>";
            $myAirportList.append(string);
            deleteBtn(i);
        };

        
    },
    removeAirport: function (value) {
        var i;

        for (var i = myAirports_arr.length - 1; i >= 0; i--) {
            if (myAirports_arr[i].code == value) {
                myAirports_arr.splice(i, 1);
            }
        }
        console.log("Airport removed.");
    }
}

//controls map
mapControls = {
    initMap: function () {
        map_obj = new google.maps.Map(document.getElementById('airport-map'), {
            center: { lat: 39.50, lng: -98.35 },
            scrollwheel: true,
            zoom: 3
        });
    },
    updateMarkers: function () {
        markers_arr = [];
        for (var i = 0; i < myAirports_arr.length; i++) {
            var string = "<h5>[" + myAirports_arr[i].code + "] " + myAirports_arr[i].title + "</h5>"


            marker_obj = new google.maps.Marker({
                position: myAirports_arr[i].location,
                map: map_obj,
                title: myAirports_arr[i].title,
            });

            marker_obj.info = new google.maps.InfoWindow({
                content: string
            });


            marker_obj.addListener('click', function () {
                if (prevInfoWindow) {
                    prevInfoWindow.close();
                }



                prevInfoWindow = this.info;
                this.info.open(map_obj, this);
            });
            markers_arr.push(marker_obj);
        }
    },
    setMapOnAll: function (map_obj) {
        for (var i = 0; i < markers_arr.length; i++) {
            markers_arr[i].setMap(map_obj);
        }
    }
}

//error checks array
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

//starts generating state/city/airport-code list in respected sections
//loads events after lists are generated
function initPageBuild() {
    generatePage.makeListState();
    generatePage.makeListCity();
    generatePage.makeListCode();
    loadEvents();
}

//loads event after dom change after init page load
function loadEvents() {
    $codeItem = $(".code-item");
    $cityItem = $(".city-item");
    $stateItem = $(".state-item");
    $airportBtn = $(".my-airports_btn");
    $containers = $(".container");
    $instructionText = $(".instructionText");
    $airportFinderBtn = $(".airport-finder_btn");
   

    //shows available citys in state
    $stateItem.click(function (e) {
        e.preventDefault();

        $codeItemActive = $('.code-item.active');
        $codeItem = $(".code-item");

        $this = $(this);
        $state = $this.attr("id");

        if (previousState) {
            previousState.toggle();
        }

        $codeItemActive.css({ "display": "none" });
        $codeItem.removeClass("active");

        $cityClass = $(".city-item." + $state + "");
        $cityClass.css({ "display": "table" });

        previousState = $cityClass;

        return false;
    });

    //shows availible airports in city
    $cityItem.click(function (e) {
        e.preventDefault();


        $this = $(this);
        $city = $this.attr("id");


        if (previousCity) {
            previousCity.css({ "display": "none" });
        }

        $codeClass = $(".code-item." + $city + "");
        $codeClass.css({ "display": "table" });
        $codeClass.addClass("active");

        previousCity = $codeClass;

        return false;
    })

    //creates airport object and adds to array
    $codeItem.click(function (e) {
        e.preventDefault();
        max = 2;

        $this = $(this);
        $title = $this.attr('data-title');
        $code = $this.attr('data-code');
        $state = $this.attr('data-state');
        $city = $this.attr('data-city');
        $lat = $this.attr('data-lat');
        $lng = $this.attr('data-lng');

        airport_Obj = {
            "title": $title,
            "code": $code,
            "state": $state,
            "city": $city,
            "location": { "lat": parseInt($lat), "lng": parseInt($lng) }
        };

        //checks that array is not empty
        if (checkArray.checkIfNotEmpty(myAirports_arr)) {

            //checks for duplicate
            if (checkArray.containsObject($code, myAirports_arr)) {
                console.log("You have already selected this airport.\n" +
                    "Please select another.");
                return false;
            };

            //checks if max amount of airports are in the object
            if (checkArray.checkIfMax(myAirports_arr, max)) {
                console.log("You have more than " + max + 1 + " this airports selected.\n" +
                    "Please remove one to continue.");
                return false;
            };

        };

        myAirports_arr.push(airport_Obj);

        manageArray.updateMyAirports(myAirports_arr);
        console.log("Airport added.");

        mapControls.setMapOnAll(null);
        mapControls.updateMarkers();
        mapControls.setMapOnAll(map_obj);

        return false;
    })

    //hides all containers and opens the selected airports and maps
    $airportBtn.click(function (e) {
        e.preventDefault();

        $openContainer = $(".my-airports-container");

        $containers.animate({
            opacity: 0
        },100, function () {
            $containers.css({ "display": "none" });
            $openContainer.css({ "display": "initial" });
            $openContainer.animate({
                opacity: 1
            },100);
        });




        $instructionText.text("My Airports");


        return false;
    });

    //hides all containers and opens the airport finder
    $airportFinderBtn.click(function (e) {
        e.preventDefault();

        $openContainer = $(".airport-container");

        $containers.animate({
            opacity: 0
        },100, function () {
            $containers.css({ "display": "none" });
            $openContainer.css({ "display": "initial" });
            $openContainer.animate({
                opacity: 1
            },100);
        });

        $instructionText.text("Airport Finder");

        return false;
    })
};

function deleteBtn(id) {
    //remove array event
    $removeAirportBtn = $("#remove-airport_btn-"+id+"");
    $removeAirportBtn.click(function (e) {
        e.preventDefault();
        $this = $(this);
        $code = $this.attr("data-code");

        manageArray.removeAirport($code);
        manageArray.updateMyAirports(myAirports_arr);
        mapControls.setMapOnAll(null);
        mapControls.updateMarkers();
        mapControls.setMapOnAll(map_obj);
        return false;
    });
}
