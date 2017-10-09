var globalMap;

$(function () {
    var markers = {}, MapFcns = {
        loadSiteList: function () {
            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');

            sites.sort(function (a, b) {
                // a should be listed first if Code greater than b. Otherwise,
                // 0 if they're equal, and -1 if they're not. This is the basic
                // comparable interface.
                return a.Code > b.Code ? 1 :
                    b.Code === a.Code ? 0 : -1;
            });

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
                $('#setting-state').text(currAirport.State);
                // The regex /^AIRPORT_\w{3}_/ig specifies that we want beginning of string,
                // followed by AIRPORT, an underscore, three word chars (\w{3}), and another
                // underscore. The string.replace method accepts either a string or a regex
                // as a first argument. We could do other things to manage this complexity, but
                // it's pretty straight forward, and we're only rendering the data in one place.
                // If that were to change, then it may be a better idea to extend the objects
                // themselves.
                $('#setting-full-name').text(currAirport.FullSiteName.replace(/^AIRPORT_\w{3}_/ig, ''));
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                var pos = { lat: currAirport.Latitude, lng: currAirport.Longitude };

                // Check to see if a marker already exists. If it DOES, then we should not create
                // a new marker. Otherwise, go create and add a new marker to the map.
                if (!markers[airportCode]) {
                    console.log('Creating new marker on site [' + airportCode + ']');
                    markers[airportCode] = {};
                    var marker = new google.maps.Marker({
                        position: pos,
                        map: globalMap,
                        title: currAirport.Code
                    });
                    markers[airportCode].marker = marker;

                    marker.addListener('click', function () {
                        marker.setMap(null);
                        markers[airportCode].displayed = false;
                    });
                }
                else if (!markers[airportCode].displayed) {
                    console.log('Re-displaying marker (setting map ' + airportCode + ')');
                    marker = markers[airportCode].marker.setMap(globalMap);
                    markers[airportCode].displayed = true;
                }

                // Ensure that the marker is visible in the UI. It wouldn't be so nice if the user
                // selected a site, but did not get to see the site on the map.
                if (!globalMap.getBounds().contains(pos)) {
                    globalMap.setCenter(pos);
                }
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