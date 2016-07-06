var globalMap;
var gMarkers = [];

$(function () {
//function to toggle instructions
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
        zoom: 6
    });
}
    
    

$(function () {
//Populates dropdown menu from siteData.js
    var MapFcns = {
             
            loadSiteList: function () {
                var airportList = $('#airport-list');
                airportList.html('');
                airportList.append('<option value=""></option>');
            
                //Create new array to sort airport list 
                var sortSites = [];
                sortSites = _.sortBy(sites, function(a) {
                    return a.Code;
                });
                for (var i in sortSites) {
                var newSort = $('<option value="' + sortSites[i].Code + '">' + sortSites[i].Code + '</option>');
                airportList.append(newSort);
                }
            },
    
            siteListChange: function() {
                var ctl = $(this),
                    airportCode = ctl.val();
                if (airportCode) {
                    var currAirport = _.findWhere(sites, {Code: airportCode});
                    $('#setting-code').text(currAirport.Code);
                    $('#setting-city').text(currAirport.City);
                    $('#setting-state').text(currAirport.State);
                    
                    //Added slice to show only name of airport,
                    //no need to show redundant information
                    $('#setting-name').text(currAirport.FullSiteName.slice(12));
                    $('#setting-lat').text(currAirport.Latitude);
                    $('#setting-long').text(currAirport.Longitude);
            
                    
                    //Checks array for matching codes from the arrayCheck function,
                    //not equal to -1 means a marker already exists, the two codes
                    //match, and therefore will simply pan to destination 
                    //and not add a new marker
                    if (arrayCheck(currAirport.Code) !== -1) {
                        var position = {
                            lat: currAirport.Latitude,
                            lng: currAirport.Longitude
                        };
                        globalMap.panTo(position);
                    }
                        //else equal to -1 means the codes do not match,
                        //no marker already on map, and will add a new marker
                        else{
                            //added llama marker icon just for fun
                            var image = {
                                url: '/img/Llama-Office-icon.png',
                                scaledSize: new google.maps.Size(50, 50), // scaled size
                            };
                            var marker = new google.maps.Marker({
                                position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                                map: globalMap,
                                title: currAirport.Code,
                                icon: image,
                            });
                            //Adds marker to array 
                            gMarkers.push(marker);
                            //Pans to new marker
                            globalMap.panTo(marker.position);
                            //Displays infowindow after pan
                            var contentString =
                                "<h6>Airport Table Information</h3>" +
                                "<p class='info'>Airport Code: " + currAirport.Code + "</p>" +
                                
                                //Added slice so only the airport name displays
                                "<p class='info'>Airport Name: " + currAirport.FullSiteName.slice(12) + "</p>" +
                                "<p class='info'>Airport Location: " + currAirport.City + ", " + currAirport.State + "</p>" +
                                "<p class='info'>Airport Coordinates: " + currAirport.Latitude + " (latitude), " + currAirport.Longitude + " (longitude)</p>";
                            var infowindow = new google.maps.InfoWindow({
                                content: contentString});
                            infowindow.open(globalMap, marker);
                    
                            //Dispaly infowindow on mouseover so user can
                            //see info again after exiting out of window
                            marker.addListener('mouseover', function () {
                                infowindow.open(globalMap, marker);
                            });
                            //removes marker from the map and gMarkers array on click
                            google.maps.event.addListener(marker, "click", function(){
                                var index = gMarkers.indexOf(marker);
                                gMarkers.splice(index, 1);
                                marker.setMap(null);
                                //removes values from table
                                $('#setting-code').text('');
                                $('#setting-city').text('');
                                $('#setting-state').text('');
                                $('#setting-name').text('');
                                $('#setting-lat').text('');
                                $('#setting-long').text('');
                            });
                        }
                }
            }
        }
    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
});


//function checks gMarkers array for matching airport code, if not found returns -1
function arrayCheck(code){
    var length = gMarkers.length;
    for(var i = 0; i < length; i++){
        if(code === gMarkers[i].title){
            return i;
        }
    }
    return -1;
};
                  
              
