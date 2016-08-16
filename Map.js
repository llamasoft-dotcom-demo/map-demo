var globalMap;
var mapMarkers = [];
var bounds;

//Handles loading of airport options and process selections and output
$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            
         //sort the array of airports by Code
        sites.sort(function(a, b) {
            return a.Code.localeCompare(b.Code); 
        });
            
        for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + ' - ' + sites[i].City + '</option>');
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
                $('#setting-fullname').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
                $('#short-result').empty();
                $('#short-result').html('<p></p>').text(currAirport.City + ", " + currAirport.State);
                $('#display-toggle').text("+");
                
                $('#remove-marker').empty();
                var inputTag = '<input id="remover2" onclick="deleteSingleMarker(\'' + currAirport.Code + '\');" type=button value="Remove This Marker">';
                $('#remove-marker').html(inputTag);
                
                //content for InfoWindow
                var displayContent = '<div id="airport-info">' +
                    '<h3>' + currAirport.Code + '</h3>' +
                    '<div id="setting-name">' +
                    '<div>Code</div>' +
                    '<div>City</div>' +
                    '<div>State</div>' +
                    '<div>Full Name</div>' +
                    '<div>Latitude</div>' +
                    '<div>Longitude</div>' +
                    '</div>' +
                    '<div id="setting-value">' +
                    '<div id="setting-code">' + currAirport.Code  + '</div>' +
                    '<div id="setting-city">'  + currAirport.City  + '</div>' +
                    '<div id="setting-state">'  + currAirport.State  + '</div>' +
                    '<div id="setting-fullname">' + currAirport.FullSiteName  + '</div>' +
                    '<div id="setting-lat">'  + currAirport.Latitude  + '</div>' +
                    '<div id="setting-long">' +  + currAirport.Longitude  + '</div>' + 
                    '</div>' +
                    '<input id="remover" onclick="deleteSingleMarker(\'' + currAirport.Code + '\');" type=button value="Remove Marker">' +
                    '</div>'; 

                var infowindow = new google.maps.InfoWindow({
                  content: displayContent
                });
                
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });
                          
                //add marker to array
                mapMarkers.push(marker);
                
                //update bounds
                updateBounds();           
                
                marker.addListener('click', function() {;
                    infowindow.open(globalMap, marker);              
                });   
            }
    }
    
};




MapFcns.loadSiteList();
$('#airport-list').change(MapFcns.siteListChange);

//Toggles exercise intruction display
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

//Toggle controlling results display
$(document).on('click','#display-toggle',function(){
    var togbtn = $(this),
          togbtnTxt = togbtn.text();
           if (togbtnTxt === '+') {
               togbtn.text('-'); 
               $("#airport-settings").show();
           } else {
                togbtn.text('+'); 
                $("#airport-settings").hide();
           }  
});


//Initializes the Google Map    
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
  //initialize bounds
  bounds = new google.maps.LatLngBounds();
  
}

// Adds all markers in array to the map.
function setMapOnAll(globalMap) {
    for (var i = 0; i < mapMarkers.length; i++) {
        mapMarkers[i].setMap(globalMap);
    }
}

// Removes all markers from the map. Markers remain in the array, allowing on/off toggle.
function clearAllMarkers() {
    setMapOnAll(null);
}

// Displays all of the markers in the array list.
function showMarkers() {
    setMapOnAll(globalMap);
}

// Deletes all markers from both map and array list
function deleteMarkers() {
    clearAllMarkers();
    mapMarkers = [];
    updateBounds();
}

//Deletes a single marker from both map and array list
function deleteSingleMarker(code){
    
   var tempMarker = _.findWhere(mapMarkers, {title: code});
   tempMarker.setMap(null);
   mapMarkers =  _.without(mapMarkers, tempMarker);
   
   updateBounds();
}

// Adjusts the center and scale for map when markers are added or deleted
function updateBounds(){
    var initialCenter = {lat: 42.2814, lng: -83.7483};
    
    for(i=0;i<mapMarkers.length;i++) {
       bounds.extend(mapMarkers[i].getPosition());
    } 
    
    if (mapMarkers.length > 1){      
        globalMap.setCenter(bounds.getCenter());
        globalMap.panToBounds(bounds);
        globalMap.fitBounds(bounds);
    } else if (mapMarkers.length === 1){         
        globalMap.setZoom(6);
        globalMap.setCenter(mapMarkers[0].getPosition());
    } else {
        globalMap.setZoom(6);
        globalMap.setCenter(initialCenter);            
    }
    
}