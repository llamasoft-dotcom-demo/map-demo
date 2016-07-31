var globalMap;
$(function() {
  //initializes an array to store all marker objects added to the map and assigns them an id for lookup purposes
  var markers = [];
  var uniqueId = 1;
  var MapFcns = {
    loadSiteList: function() {
      //initializes the dropdown menu plugin
      $('.js-example-basic-single').select2();
      var airportList = $('#airport-list');
      airportList.html('');
      airportList.append('<option value=""></option>');
      //Using underscore to sort by city name
      var _sites = _.sortBy(sites, 'City');
      for (var i in sites) {
        var newOption = $('<option value="' + _sites[i].Code + '">' + _sites[i].City + ', ' + _sites[i].State +
          ' (' + _sites[i].Code + ')</option>');
        airportList.append(newOption);
      }
    },
    //checks to see if the map already has a marker for a given location; used to place a new marker and add airport to selected
    //list of airports later
    containsMarkerAlready: function(marker, markers) {
      var i;
      for (i = 0; i < markers.length; i++) {
        if (markers[i].title === marker.title) {
          return true;
        }
      }
      return false;
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
        $('#setting-name').text(currAirport.FullSiteName);
        $('#setting-lat').text(currAirport.Latitude);
        MapFcns.addMarker(currAirport);
        globalMap.setCenter({
          lat: currAirport.Latitude,
          lng: currAirport.Longitude
        });
      }
    },
    //adds marker and airport info for selected airport.
    // Incomplete info that used to appear in a table below is now complete and appears in an info window when the marker is clicked
    addMarker: function(currAirport) {
      var marker = {
        position: {
          lat: currAirport.Latitude,
          lng: currAirport.Longitude
        },
        map: globalMap,
        title: currAirport.Code,
        icon: "images/airportmarker.png"
      };
      if (!(MapFcns.containsMarkerAlready(marker, markers))) {
        $('#selectedAirports').show();
        marker = new google.maps.Marker(marker);
        marker.id = uniqueId;
        uniqueId++; //new marker receives a unique ID
        markers.push(marker);
        //airports are added to a list of selected airports
        $('<li id="' + marker.id + '"></li>').html(currAirport.City + ", " + currAirport.State +
          "<span class=bold>" + " (" + currAirport.Code + ") " + "</span>").appendTo("#selectedAirports");
        //info window appears on click
        google.maps.event.addListener(marker, "click", function() {
          //unnecessary character are removed from the "full name" values
          var fullNameSliced = currAirport.FullSiteName.slice(currAirport.FullSiteName.lastIndexOf('_') + 1);
          //info window content below
          var content = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
            '<h2 id="firstHeading" class="firstHeading">' + currAirport.City + ', ' + currAirport.State +
            ' (' + currAirport.Code + ')</h2>' + '<div id="bodyContent">' + '<p>' + fullNameSliced + '</p>' +
            '<p><b>Latitude: </b>' + currAirport.Latitude + '<b> Longitude: </b>' + currAirport.Longitude +
            '</p>'
          '</div>'
          '</div>';
          content += "<br/><input type = 'button' value = 'remove' onclick = 'deleteMarker(" + marker.id +
            ");' value = 'remove'/>";
          var infoWindow = new google.maps.InfoWindow({
            content: content
          });
          infoWindow.open(globalMap, marker);
        });
        //added a delete marker option for any airport marker on the map.
        //This also removes the airport from the selected list of airports
        deleteMarker = function(id) {
          //Find and remove the marker from the Array
          for (var i = 0; i < markers.length; i++) {
            if (markers[i].id === id) {
              //Remove the marker from Map
              markers[i].setMap(null);
              $('#' + markers[i].id).remove();
              //Remove the marker from array.
              markers.splice(i, 1);
              //Remove marker from the selected list of airports
            }
          }
        };
        MapFcns.removeAllMarkers(marker);
      }
      //when the reset button is clicked, airports are removed from the selected list and markers are removed from the array and map
    },
    removeAllMarkers: function(marker) {
      $('#removeAllMarkers').on('click', function() {
        marker.setMap(null);
        markers = [];
        $('#selectedAirports').text('');
        $('#selectedAirports').hide();
      });
    },
  };
  MapFcns.loadSiteList();
  $('#airport-list').change(MapFcns.siteListChange);
});

function initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {
      lat: 42.2814,
      lng: -83.7483
    },
    scrollwheel: true,
    streetViewControl: false,
    mapTypeControl: false,
    zoom: 6,
    //added styling to the map
    styles: [{
      "stylers": [{
        "saturation": -100
      }, {
        "gamma": 1
      }]
    }, {
      "elementType": "labels.text.stroke",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.business",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.business",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.place_of_worship",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.place_of_worship",
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{
        "visibility": "simplified"
      }]
    }, {
      "featureType": "water",
      "stylers": [{
        "visibility": "on"
      }, {
        "saturation": 50
      }, {
        "gamma": 0
      }, {
        "hue": "#50a5d1"
      }]
    }, {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#333333"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "labels.text",
      "stylers": [{
        "weight": 0.5
      }, {
        "color": "#333333"
      }]
    }, {
      "featureType": "transit.station",
      "elementType": "labels.icon",
      "stylers": [{
        "gamma": 1
      }, {
        "saturation": 50
      }]
    }],
  });
}
