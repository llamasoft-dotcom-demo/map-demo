var globalMap;
var marker;

function initMap() {
    // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById('airport-map'), {
        center: {
            lat: 42.2814,
            lng: -83.7483
        },
        scrollwheel: true,
        zoom: 6
    });
}

$(function() {

    var MapFcns = {
        loadSiteList: function() {
            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            for (var i in sites) {
                // Changed dropdown to display "City: FullSiteName"
                var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].City + ": " + sites[i].FullSiteName + '</option>');
                airportList.append(newOption);
            }
        },

        siteListChange: function() {
            var ctl = $(this),
                airportCode = ctl.val();
            if (airportCode) {
                var currAirport = _.findWhere(sites, {
                    Code: airportCode
                });

                //Variables send info from current airport to the infoWindow
                $airCode = currAirport.Code;
                $airCity = currAirport.City;
                $airState = currAirport.State;
                $airSiteName = currAirport.FullSiteName;
                $airLat = currAirport.Latitude;
                $airLong = currAirport.Longitude;

                // Content String to send HTML to the infoWindow when user clicks on pin
                var contentString = '<table>' +
                    '<tr>' +
                    '<th>Code</th>' +
                    '<th>City</th>' +
                    '<th>State</th>' +
                    '<th>Full Name</th>' +
                    '<th>Latitude</th>' +
                    '<th>Longitude</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<td id="setting-code">' + $airCode + '</td>' +
                    '<td id="setting-city">' + $airCity + '</td>' +
                    '<td id="setting-state">' + $airState + '</td>' +
                    '<td id="setting-name">' + $airSiteName + '</td>' +
                    '<td id="setting-lat">' + $airLat + '</td>' +
                    '<td id="setting-long">' + $airLong + '</td>' +
                    '</tr>' +

                    '</table>' +
                    '<p>Closing window will remove marker</p>';

                // Creates an infoWindow
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                marker = new google.maps.Marker({
                    position: {
                        lat: currAirport.Latitude,
                        lng: currAirport.Longitude
                    },
                    map: globalMap,
                    title: currAirport.Code
                });

                // Causes infoWindow to open on user pin click
                globalMap.panTo(marker.position);
                marker.addListener('click', function() {
                    infowindow.open(globalMap, marker);
                });

                // Causes pin to be removed when user exits infoWindow
                google.maps.event.addListener(infowindow, 'closeclick', function() {
                    marker.setMap(null);
                });
            }
        }
    }

    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
    $('#exercise-toggle').click(function() {
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