var globalMap,
    airportList,
    airportList2,
    confirmPopup,
    page,
    currAirport,
    controlButtons,
    instructions,
    removeButton,
    selectedAirport,
    infoWindow,
    searchInput,
    results;
var markers = {};
$(function () {
    instructions = $("#exercise-instructions");
    controlButtons = $(".button");
    removeButton = $("#remove-marker");
    searchInput = $("#airport-search");
    instructions.hide();
    controlButtons.hide();

    var MapFcns = {
        loadSiteList: function () {
            airportList = $("#airport-list");
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
                $("#airport-header").text(formattedSiteName);

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
        },
        siteSearch: function (query) {
            query = query.toUpperCase();
            results = $("#search-results");
            results.empty();
            var counter = 0;
            var airports = $("option:contains('" + query + "'), option[value*='" + query +"']");
            console.log("option:contains('" + query + "'), option[value*='" + query +"']");
            $.each(airports, function (i, v) {
                if (counter < 10) {
                    results.append("<li id='" + airports[i].value + "'>" + airports[i].innerText + "</li>");
                }
                counter++;
            });
            if (counter == 0) {
                results.append("<li>No Results Found</li>");
                return;
            }
            results.find("li").click(function () {
                var searchSelection = $(this).attr("id");
                results.empty();
                airportList.val(searchSelection).trigger("change");
            });
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
    searchInput.keyup(function () {
        if ($(this).val() != "")
            MapFcns.siteSearch($(this).val());
        else
            results.empty();
    });
    searchInput.focus(function () {
        if ($(this).val() != "")
            MapFcns.siteSearch($(this).val());
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

// Extending jQuery Contains selector to be case-insensitive
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});