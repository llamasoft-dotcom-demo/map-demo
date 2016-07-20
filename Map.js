// Array to hold google markers
var gmarkers = [];
// Array to hold lat lang positions
var lookup = [];
// Global map variable
var map = null;

function initialize() {
    /* ------------------- Content wrapper and sidebar initialization -------------------------*/
    var myWrapper = $("#wrapper");
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        myWrapper.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
            google.maps.event.trigger(map, 'resize');
        });
    });
        /* --------------------------------------------*/

    /* --------------- Google map initialization ------------------------*/
    var myOptions = {
        zoom: 8,
        center: new google.maps.LatLng(42.2814, -83.7483),
        mapTypeControl: true,
        scrollwheel: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map_container"),
      myOptions);

    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });
    /* --------------------------------------------*/

    // Load site list function to populate airport drop down
    // Please not underscore js is used to sort the list before populating 
    function loadSiteList() {
        var airportList = $('#airport-list');
        airportList.html('');
        airportList.append('<option value=""></option>');
        var _sites = _.sortBy(sites, 'Code');
        for (var i in _sites) {
            var newOption = $('<option value="' + _sites[i].Code + '">' + _sites[i].Code + '</option>');
            airportList.append(newOption);
        }
    }

    // Site list change function 
    // Calls core function 'createMarker' of application to create marker and UI elements and to bind functions to it
    function siteListChange(parameters) {
        var airportCode = $(this).val();
        if (airportCode) {
            var currAirport = _.findWhere(sites, { Code: airportCode });
            createMarker(currAirport);
        }
    }

    // Create Marker Function
    // Checks if position is free and creates markers according to that 
    // Adds event listener to markers single click opens info window
    // Right click on marker deletes marker from the map and li from sidebar as well
    // List element on sidebar shows airport details on click in modal display 
    function createMarker(currentAirport) {
        var point = new google.maps.LatLng(currentAirport.Latitude, currentAirport.Longitude);
        if (isMarkerFree([currentAirport.Latitude, currentAirport.Longitude])) {
            var contentString = currentAirport.FullSiteName;

            var marker = new google.maps.Marker({
                position: point,
                map: map,
                zIndex: Math.round(point.lat() * -100000) << 5
            });

            map.panTo(marker.getPosition());

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });

            google.maps.event.addListener(marker, 'rightclick', function () {
                marker.setMap(null);
                gmarkers = _.without(gmarkers, _.findWhere(gmarkers, { position: point }));
                lookup = _.without(lookup, _.findWhere(lookup, [currentAirport.Latitude, currentAirport.Longitude]));
                sidebar_entry.remove();
                $('#airport-list').get(0).selectedIndex = 0;
            });

            lookup.push([currentAirport.Latitude, currentAirport.Longitude]);
            gmarkers.push(marker);

            var sidebar = $('#side_bar');
            var sidebar_entry = $('<li/>', {
                'html': currentAirport.City,
                'click': function () {
                    map.panTo(marker.getPosition());
                    $('#setting-code').text(currentAirport.Code);
                    $('#setting-city').text(currentAirport.City);
                    $('#setting-state').text(currentAirport.State);
                    $('#setting-fullSiteName').text(currentAirport.FullSiteName);
                    $('#setting-latitude').text(currentAirport.Latitude);
                    $('#setting-longitude').text(currentAirport.Longitude);
                    $('#airportDetailsModal').modal('show');
                },
                'mouseenter': function () {
                    $(this).css('color', '#0d5aa7');
                },
                'mouseleave': function () {
                    $(this).css('color', '#999999');
                }
            }).appendTo(sidebar);
        }

        map.panTo(point);
    }
    function isMarkerFree(search) {
        for (var i = 0, l = lookup.length; i < l; i++) {
            if (lookup[i][0] === search[0] && lookup[i][1] === search[1]) {
                return false;
            }
        }
        return true;
    }

    loadSiteList();
    $('#airport-list').change(siteListChange);
}

var infowindow = new google.maps.InfoWindow({
    size: new google.maps.Size(150, 50)
});

google.maps.event.addDomListener(window, 'load', initialize);