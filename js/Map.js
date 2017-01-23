var globalMap,
    airportList,
    confirmPopup,
    page,
    currAirport,
    controlButtons,
    instructions,
    removeButton,
    goToButton,
    selectedAirport;
var markers = {};
$(function () {
    instructions = $("#exercise-instructions");
    controlButtons = $(".button");
    console.log("%o", controlButtons);
    removeButton = $("#removeMarkerButton");
    goToButton = $("#goToMarkerButton");
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
                $("#setting-code").find("div.value").text(currAirport.Code);
                $("#setting-city").find("div.value").text(currAirport.City);
                $("#setting-state").find("div.value").text(currAirport.State);
                $("#setting-name").find("div.value").text(formattedSiteName);
                $("#setting-lat").find("div.value").text(currAirport.Latitude);
                $("#setting-long").find("div.value").text(currAirport.Longitude);
                var marker = new google.maps.Marker({
                    position: {
                        lat: currAirport.Latitude,
                        lng: currAirport.Longitude
                    },
                    map: globalMap,
                    title: currAirport.Code
                });
                markers[currAirport.Code] = marker;
                //moveMap(currAirport.Latitude, currAirport.Longitude);
                controlButtons.show();
            } else {
                controlButtons.hide();
            }
        },
        removeMarker: function () {
            selectedAirport = airportList.val();
            if (selectedAirport && selectedAirport != -1) {
                console.log("Removing marker...");
                markers[currAirport.Code].setMap(null);
            }
        },
        goToLocation: function () {
            moveMap(currAirport.Latitude, currAirport.Longitude);
        }
    };
    MapFcns.loadSiteList();
    airportList.change(MapFcns.siteListChange);
    removeButton.click(MapFcns.removeMarker);
    goToButton.click(MapFcns.goToLocation);
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
function confirmation(title) {
    confirmPopup = $("<div class='popup'></div>");
    var buttonContainer = $("<div id='buttonContainer'></div>");
    var yesButton = $("<input type='button' id='confirmUpdate' value='yes'/>");
    var noButton = $("<input type='button' id='cancelUpdate' value='no'/>");
    buttonContainer.append(confirm);
    buttonContainer.append(noButton);
    confirmPopup.append("<h3>" + title + "</h3>");
    confirmPopup.append(buttonContainer);
    //confirmPopup.css("top", header.height());
    confirmPopup.append(confirmPopup);
    page.prepend(confirmPopup);
    bindEnterKey(yesButton);
    yesButton.click(function () {
        moveMap(currAirport.Latitude, currAirport.Longitude);
        bindEnterKey(submit);
    });
    noButton.click(function () {
        confirmPopup.fadeOut(function () {
            confirmPopup.remove();
        });
        bindEnterKey(submit);
    });
}
function moveMap(lat, long) {
    globalMap.setCenter(new google.maps.LatLng(lat, long));
    globalMap.setZoom(13);
}
function bindEnterKey(button) {
    $(document).unbind("keypress.key13");
    $(document).bind("keypress.key13", function (e) {
        if (e.which == 13) {
            e.preventDefault();
            button.click();
        }
    });
}
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}