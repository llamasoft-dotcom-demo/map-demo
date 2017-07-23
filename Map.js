var globalMap;
var infoWindow;
var markers = [];

$(function() {

    var MapFcns = {
        loadSiteList: function () {
            var airportList = $('#airport-list');

            airportList.html('');
            airportList.append('<option value=""></option>');

            var sortedSites = _.sortBy(sites, "Code");

            _.each(sortedSites, function(site) {
                var newOption = $('<option value="' + site.Code + '">' + site.Code + ' - ' + site.City + '</option>');

                airportList.append(newOption);
            });
        },
    
        siteListChange: function() {
            var ctl = $(this),

            airportCode = ctl.val();

            if (airportCode) {
                var existingMarker = _.findWhere(markers, {Code: airportCode});

                if (existingMarker) {
                    globalMap.panTo(existingMarker.Marker.getPosition());
                } else {
                    var airport = _.findWhere(sites, {Code: airportCode});

                    var markerPosition = new google.maps.LatLng(airport.Latitude, airport.Longitude);

                    var marker = new google.maps.Marker({
                        label: airport.Code,
                        map: globalMap,
                        position: markerPosition,
                        title: airport.FullSiteName
                    });

                    marker.addListener('click', function() {
                        showInfoWindow(marker);
                    });

                    marker.set("airport", airport);

                    globalMap.panTo(markerPosition);

                    markers.push({ Code: airport.Code, Marker: marker});
                }
            }
        }
    }

    MapFcns.loadSiteList();

    $('#airport-list').change(MapFcns.siteListChange);

    $('#exercise-toggle').click(function() {
        var  toggleCtl = $(this),

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
        center: {lat: 42.2814, lng: -83.7483},
        scrollwheel: true,
        zoom: 6
    });

    globalMap.addListener('click', function() {
        if (infoWindow) {
            infoWindow.close();
        }
    });

    infoWindow = new google.maps.InfoWindow();
}

function removeMarker(airportCode) {
    var marker = _.findWhere(markers, {Code: airportCode});

    if (marker) {
        marker.Marker.setMap(null);

        // Not sure this is the best way to remove the items from the arrays, but...
        markers = _.reject(markers, function(m) { return m.Code == airportCode; });

        // Reset the drop-down as well
        $('#airport-list').val("");
    }
}

function showInfoWindow(marker) {
    var airport = marker.get("airport");

    var contentString = '<div id="airport-settings">' +
        '<div id="setting-name">' +
            '<div>Code</div>' +
            '<div>City, State</div>' +
            '<div>Full Name</div>' +
            '<div>Lat/Long</div>' +
        '</div>' +
        '<div id="setting-value">' +
            '<div id="setting-code">' + airport.Code + '</div>' +
            '<div id="setting-city-state">' + airport.City + ', ' + airport.State + '</div>' +
            '<div id="setting-sitename">' + airport.FullSiteName + '</div>' +
            '<div id="setting-latlong">' + airport.Latitude + '/' + airport.Longitude + '</div>' +
         '</div>' +
     '</div>' +
     '<a href="javascript:removeMarker(\x27' + airport.Code + '\x27)">Remove</a>';

     infoWindow.setContent(contentString);

     infoWindow.open(globalMap, marker);
}
