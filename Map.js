var globalMap, airportList;
$(function () {
    var instructions = $("#exercise-instructions");
    instructions.hide();
    var MapFcns = {
        loadSiteList: function () {
            airportList = $("#airport-list");
            airportList.html("<option value='-- Select an Airport --'></option>");
            for (var i in sites) {
                var newOption = $("<option value='" + sites[i].Code + "'>" + sites[i].Code + "</option>");
                airportList.append(newOption);
            }
        },
        siteListChange: function () {
            var ctl = $(this), airportCode = ctl.val();
            if (airportCode) {
                var currAirport = _.findWhere(sites, { Code: airportCode });
                $("#setting-code").text(currAirport.Code);
                $("#setting-city").text(currAirport.City);
                $("#setting-state").text(currAirport.State);
                $("#setting-name").text(currAirport.FullSiteName);
                $("#setting-lat").text(currAirport.Latitude);
                $("#setting-long").text(currAirport.Longitude);
                var marker = new google.maps.Marker({
                    position: {
                        lat: currAirport.Latitude,
                        lng: currAirport.Longitude
                    },
                    map: globalMap,
                    title: currAirport.Code
                });
                var airportLocation = new google.maps.LatLng(currAirport.Latitude, currAirport.Longitude);
                globalMap.setCenter(airportLocation);
            }
        }
    };
    MapFcns.loadSiteList();
    airportList.change(MapFcns.siteListChange);
    $("#exercise-toggle").click(function () {
        var toggleCtl = $(this), toggleVal = toggleCtl.text();
        if (toggleVal == '-') {
            toggleCtl.text('+');
            instructions.hide();
        } else {
            toggleCtl.text('-');
            instructions.show();
        }
    });
});
function initMap() {
    // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById("airport-map"), {
        center: {
            lat: 42.2814,
            lng: -83.7483
        },
        scrollwheel: true,
        zoom: 6
    });
}