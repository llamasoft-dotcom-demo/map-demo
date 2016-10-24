// This class contains all of the functions we need for the google map API.
// Lets do this with some OO design. We will scope this down so it isn't completely global. 
// We will just use private and priveledged members here. 
// Prototype and public methods are overkill for this. 
// We won't be using this for inheritance anyway.  
this.GoogleMapApi = new function () {
    'use strict';  // No undeclared varialbes for us. We want safe code.

    var map; // The map reference
    var TILE_SIZE = 256;
    var mapID = 'airport-map';

    // This contains references to the existing markers and infowindows
    var markers = {};

    //
    // the main init function used to initialize our map
    //
    this.initMap = function () {
        var latitude = 42.2814;
        var longitude = -83.7483;
        var centerPoint = new google.maps.LatLng(latitude, longitude);

        // Modify the prototype of the the google maps infoWindow object.
        // We need to know it the info window is open or closed.
        // Currently this isn't in the API
        google.maps.InfoWindow.prototype.opened = false;

        // Callback function to create a map object and specify the DOM element for display.
        this.map = new google.maps.Map(document.getElementById(mapID), {
            center: centerPoint,
            scrollwheel: true,
            zoom: 6
        });
    };

    //
    // the add marker function used to add a new or existing marker to our map
    //
    this.addMarker = function (currAirport) {
        var marker;
        var item = markers[currAirport.Code];

        // have we seen this marker before? if not then 
        // create one from scratch, otherwise re-use it
        if (item === undefined) {
            marker = new google.maps.Marker({
                position: { lat: currAirport.Latitude, lng: currAirport.Longitude },
                map: this.map,
                title: currAirport.Code
            });
        } else {
            marker = item.marker;
            marker.setMap(this.map);
        }

        var markerPosition = marker.getPosition();

        // move the map to the marker that was selected
        this.map.panTo(markerPosition);

        // show the info window for this marker
        var infoWindow = this.showInfoWindow(marker, currAirport);

        // keep track of this marker for next time
        markers[currAirport.Code] = { marker: marker, infoWindow: infoWindow };
    };

    //
    // the remove marker function used to remove an existing marker from our map
    //
    this.removeMarker = function (airportCode) {
        var item = markers[airportCode];
        if (item !== 'undefined') {
            item.marker.setMap(null);
            try {
                item.infoWindow.close();
            }
            catch (err) {
                // we are ok if this is an error. The info window may have been closed by the user.
            }
        }
    };

    //
    // the showInfoWindow function used to show an info window at a given marker for a given airport
    //
    this.showInfoWindow = function (marker, airport) {
        var coordInfoWindow = new google.maps.InfoWindow();
        var position = marker.getPosition();
        var self = this;

        // add content to this info window
        coordInfoWindow.setContent(createInfoWindowContent(position, airport, this.map.getZoom()));

        // Listener for the close and domready events on the infoWindow.
        // We need to set the new flag we created;
        google.maps.event.addListener(coordInfoWindow, "closeclick", function () {
            coordInfoWindow.opened = false;
        });

        google.maps.event.addListener(coordInfoWindow, "domready", function () {
            coordInfoWindow.opened = true;
        });

        // When the user changes the zoom we need to rezoom the info window
        this.map.addListener('zoom_changed', function () {
            coordInfoWindow.setContent(createInfoWindowContent(project(position), airport, self.map.getZoom()));
            if (coordInfoWindow.opened) {
                coordInfoWindow.open(self.map);
            }
        });

        // Listen to the click event on the marker
        marker.addListener('click', function () {
            self.map.setCenter(position);
            coordInfoWindow.open(marker.get(mapID), marker);
        });

        return coordInfoWindow;
    };


    //
    // the createInfoWindowContent function used compile the content text for an infoWindow
    //
    var createInfoWindowContent = function (latLng, airport, zoom) {
        return [
            'Code: ' + airport.Code,
            'City: ' + airport.City,
            'State: ' + airport.State,
            'Full Name: ' + airport.FullSiteName.substring(12),
            'Latitude: ' + airport.Latitude,
            'Longitude: ' + airport.Longitude
        ].join('<br>');
    };

    //
    // The mapping between latitude, longitude and pixels is defined by the web
    // mercator projection.
    //
    var project = function (latLng) {
        var siny = Math.sin(latLng.lat() * Math.PI / 180);

        // Truncating to 0.9999 effectively limits latitude to 89.189. This is
        // about a third of a tile past the edge of the world tile.
        siny = Math.min(Math.max(siny, -0.9999), 0.9999);

        return new google.maps.Point(
            TILE_SIZE * (0.5 + latLng.lng() / 360),
            TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
    };
};