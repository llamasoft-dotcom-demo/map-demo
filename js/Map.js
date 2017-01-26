var globalMap,
    airportList,
    confirmPopup,
    page,
    currAirport,
    controlButtons,
    instructions,
    removeButton,
    selectedAirport,
    infoWindow;
var markers = {};
$(function () {
    instructions = $("#exercise-instructions");
    controlButtons = $(".button");
    removeButton = $("#removeMarkerButton");
    instructions.hide();
    controlButtons.hide();
    var MapFcns = {
        loadSiteList: function () {
            airportList = $("#airport-list");
            airportList.html("<option value='-1'>-- Select an Airport --</option>");
            var ordSites = sortByKey(sites, "Code");

            for (var s in ordSites) {
                var airport = $("<option value='" + ordSites[s].Code + "'>" + ordSites[s].Code + " - " + ordSites[s].City + "</option>");
                airportList.append(airport);
            }
        },
        siteListChange: function () {
            var ctl = $(this), airportCode = ctl.val();
            if (airportCode && airportCode != -1) {
                currAirport = _.findWhere(sites, {Code: airportCode});
                var siteName = currAirport.FullSiteName;
                var formattedSiteName = siteName.substring(siteName.lastIndexOf("_")+1);
                $(".row.code").find("div.value").text(currAirport.Code);
                $(".row.city").find("div.value").text(currAirport.City);
                $(".row.state").find("div.value").text(currAirport.State);
                $(".row.name").find("div.value").text(formattedSiteName);
                $(".row.latitude").find("div.value").text(currAirport.Latitude);
                $(".row.longitude").find("div.value").text(currAirport.Longitude);

                infoWindow = new google.maps.InfoWindow({
                    content: "<div class='table'>" + $("#airport-settings").html() + "</div>",
                    maxWidth: 400
                });
                if (!(currAirport.Code in markers)) {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: currAirport.Latitude,
                            lng: currAirport.Longitude
                        },
                        map: globalMap,
                        title: currAirport.Code,
                        animation: google.maps.Animation.DROP
                    });
                    //infoWindow.open(globalMap, marker);
                    marker.addListener('click', function() {
                        infoWindow.open(globalMap, marker);
                    });
                    markers[currAirport.Code] = marker;
                }
                MapFcns.goToLocation();
                controlButtons.show();
            } else {
                controlButtons.hide();
            }
        },
        removeMarker: function () {
            selectedAirport = airportList.val();
            if (selectedAirport && selectedAirport != -1) {
                markers[currAirport.Code].setMap(null);
                delete markers[currAirport.Code];
                airportList.val(-1).trigger("change");
                $("div.value").text("");
            }
        },
        goToLocation: function () {
            moveMap(currAirport.Latitude, currAirport.Longitude);
        }
    };
    MapFcns.loadSiteList();
    airportList.change(MapFcns.siteListChange);
    removeButton.click(MapFcns.removeMarker);
    $("#instruction-toggle").click(function () {
        var toggleCtl = $(this).find("#exercise-toggle"), toggleVal = toggleCtl.text();
        if (toggleVal == '-') {
            toggleCtl.text('+');
            instructions.slideUp();
        } else {
            toggleCtl.text('-');
            instructions.slideDown();
        }
    });
});
function printMarkers() {
    console.clear();
    for (var m in markers) {
        console.log(m + ": %o", markers[m]);
    }

}
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
function moveMap(lat, long) {
    globalMap.panTo(new google.maps.LatLng(lat, long));
    globalMap.setZoom(13);
}
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}