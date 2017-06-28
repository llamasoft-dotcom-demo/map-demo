var globalMap;
var id;
var arr = [];

$(function() {

    var MapFcns = {
        loadSiteList: function() {
            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            for (var i in sites) {
                var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
                arr.push(sites[i].Code);
                arr.sort();
                airportList.append(newOption);
            }

            $('#airport-list').autocomplete({
                source: arr
            });

        },

        siteListChange: function() {

            var airportCode = $(this).val();

            if (airportCode) {
                var currAirport = _.findWhere(sites, { Code: airportCode });
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-name').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                var airportName = currAirport.FullSiteName;
                var printName = airportName.slice(12);

                $('#setting-printName').text("You have added: " + printName + "!");

                var APinfo = '<div id="iw-container">' +
                    '<div class="iw-title">' + printName + '</div>' +
                    '<div class="iw-content">' +
                    '<table>' + '<tr>' + '<td>' +
                    "Code: " + '</td>' + '<td>' + currAirport.Code + '</td>' + '</tr>' +
                    '<tr>' + '<td>' + "City: " + '</td>' + '<td>' + currAirport.City + '</td>' + '</tr>' +
                    '<tr>' + '<td>' + "State: " + '</td>' + '<td>' + currAirport.State + '</td>' + '</tr>' +
                    '<tr>' + '<td>' + "Latitiude: " + '</td>' + '<td>' + currAirport.Latitude + '</td>' + '</tr>' +
                    '<tr>' + '<td>' + "Longitude: " + '</td>' + '<td>' + currAirport.Longitude + '</td>' + '</tr>' + '</table>' + '</div>' + '</div>';

                var marker = new google.maps.Marker({
                    position: { lat: currAirport.Latitude, lng: currAirport.Longitude },
                    map: globalMap,
                    title: currAirport.Code,
                    info: APinfo,
                    icon: 'airport.png'
                });

                $("#airport-list").val("");

                changeView(currAirport.Latitude, currAirport.Longitude);

                infoWindow = new google.maps.InfoWindow({ content: APinfo });

                google.maps.event.addListener(marker, 'click', function() {

                    infoWindow.setContent(this.info);
                    infoWindow.open(airportMap, this);
                    $('#setting-code').text(currAirport.Code);
                    $('#setting-city').text(currAirport.City);
                    $('#setting-lat').text(currAirport.Latitude);
                    $('#setting-long').text(currAirport.Longitude);

                });

                google.maps.event.addListener(marker, "rightclick", function(point) { delMarker(marker) });
                var delMarker = function(markerPar) {
                    markerPar.setMap(null);
                    $('#setting-printName').text(printName + " has been deleted!");
                }
            }
        }
    }

    function changeView(lat, long) {
        globalMap.panTo(new google.maps.LatLng(lat, long));
        globalMap.setZoom(10);
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

function initMap() {
    // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById('airportMap'), {
        center: { lat: 42.2814, lng: -83.7483 },
        scrollwheel: true,
        zoom: 6
    });

}