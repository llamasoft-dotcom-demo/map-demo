/*global $, jQuery*/

var globalMap;
var markers = [];

$(function() {
    'use strict';
    var MapFcns = {
        loadSiteList: function() {
            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            var sortedSites = _.sortBy(sites, 'Code');
            _.each(sortedSites, function(site) {
                var newOption = $('<option value="' + site.Code + '">' + site.Code + '</option>');
                airportList.append(newOption);
            });
        },

        siteListChange: function() {
            var ctl = $(this),
                airportCode = ctl.val();
            if (airportCode) {
                var currAirport = _.findWhere(sites, {
                    Code: airportCode
                });
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-fullname').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                var marker = new google.maps.Marker({
                    position: {
                        lat: currAirport.Latitude,
                        lng: currAirport.Longitude
                    },
                    map: globalMap,
                    title: currAirport.Code
                });
                markers.push(marker);

                // from https://stackoverflow.com/questions/10917648/google-maps-api-v3-recenter-the-map-to-a-marker
                if (!globalMap.getBounds().contains(marker.getPosition())) {
                    globalMap.setCenter(marker.getPosition());
                    //OR map.panTo(marker.getPosition());  
                }
            }
        }
    };


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

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    'use strict';
    clearMarkers();
    markers = [];
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(globalMap);
    
    // zoom out to include all markers shown. 
    // from https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers
    var bounds = new google.maps.LatLngBounds();
    for (i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }
    globalMap.fitBounds(bounds);
}

function initMap() {
    'use strict';
    // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById('airport-map'), {
        center: {
            lat: 42.2814,
            lng: -83.7483
        },
        scrollwheel: false,
        zoom: 6
    });

}
