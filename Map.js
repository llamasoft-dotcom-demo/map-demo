var globalMap;


$(function() {

var markers= [];
var uniqueId = 1;
 $(".js-example-basic-single").select2();

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].City + ', ' + sites[i].State + ' (' + sites[i].Code + ')</option>');
            airportList.append(newOption);
        }
    },

    siteListChange: function() {
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-name').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                MapFcns.addToolTip(currAirport);
                globalMap.setCenter({lat: currAirport.Latitude, lng: currAirport.Longitude});
            }
    },

    deleteMarkers: function(marker){
      $('#deleteMarkers').on('click', function(){
        marker.setMap(null);
        markers = [];
        $('#selectedAirports').text('');
         });
    },

    addToolTip: function(currAirport) {
        var marker = new google.maps.Marker({
            position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
            map: globalMap,
            title: currAirport.Code,
            icon: "images/airportmarker.png",
        });
        marker.id = uniqueId;
        uniqueId++;
        markers.push(marker);
        $('<li id="'+marker.id+'"></li>').text(currAirport.City + ", " + currAirport.State + ", " + currAirport.Code).appendTo("#selectedAirports");

         google.maps.event.addListener(marker, "click", function () {
              var fullNameSliced = currAirport.FullSiteName.slice(currAirport.FullSiteName.lastIndexOf('_') + 1);
               var content = '<div id="content">'+
                 '<div id="siteNotice">'+
                 '</div>'+
                 '<h1 id="firstHeading" class="firstHeading">' + currAirport.City + ', ' + currAirport.State + ' (' + currAirport.Code + ')</h1>'+
                 '<div id="bodyContent">'+
                 '<p>' + fullNameSliced +'</p>'+
                 '<p><b>Latitude: </b>'+ currAirport.Latitude + '<b> Longitude: </b>' + currAirport.Longitude + '</p>'
                 '</div>'
                 '</div>';
               content += "<br/><input type = 'button' value = 'remove' onclick = 'deleteMarker(" + marker.id + ");' value = 'remove'/>";
               var infoWindow = new google.maps.InfoWindow({
                   content: content
               });
               infoWindow.open(globalMap, marker);
           });

           deleteMarker = function (id) {
        //Find and remove the marker from the Array
            for (var i = 0; i < markers.length; i++) {
            if (markers[i].id == id) {
                //Remove the marker from Map
                markers[i].setMap(null);
                //Remove the marker from array.
                markers.splice(i, 1);
                //Remove marker from the selected list of airports
                $('#' + marker.id).remove();
            }
        }


    };
        MapFcns.deleteMarkers(marker);
    },

};

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


function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6,
    styles: [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}],
  });

      }
