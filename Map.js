var globalMap;
var markers = [];
var currAirport;
var currMarker;

function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }

 function addMarker(location,str1) {
        currMarker = new google.maps.Marker({
                    position: location,
                    map: globalMap,
                    title: str1
                });
        currMarker.id = str1 ;
        markers.push(currMarker);
        }

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

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(globalMap);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }
      function deleteAMarker() {
        
       // currMarker.setMap(null);  // remove the last added from map
       // markers.splice(-1, 1);    // remove the last added from array
        for (var i in markers) {
            if (markers[i].id == currAirport.Code) {
                //Remove previous markers from Map                  
                markers[i].setMap(null);
 
                //Remove previous markers from array.
                markers.splice(i, 1);
                //return;
            }  }
        
       
      }
      
      
$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        var vals = [];  // prepare array for sorting
        for (var i in sites) {
            vals.push(sites[i].Code);  // populate airport codes
                        
        }
        vals.sort();  // sort airport codes
        
        // populate dropdown list 
        for(var ind in vals){
            var newOption = $('<option value="' + vals[ind] + '">' + vals[ind] + '</option>');
            airportList.append(newOption);
        	}
        
    },
    
    siteListChange: function() {
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                
                // include the rest of airport info
                $('#setting-state').text(currAirport.State);
                $('#setting-portname').text(currAirport.FullSiteName.substring(12)); // trim to be more readable
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
                
                // rewrite add marker function
                /*var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });*/
                var latlng = {lat: currAirport.Latitude, lng: currAirport.Longitude};
                addMarker(latlng,currAirport.Code);
                globalMap.setCenter(new google.maps.LatLng(currAirport.Latitude, currAirport.Longitude));
                //globalMap.panTo(latlng);
                globalMap.setZoom(6);
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



    
