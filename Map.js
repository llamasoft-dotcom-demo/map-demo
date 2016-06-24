var globalMap;

var activeMarkers = [];
/*
this array was made in reference to the following problem:
"Regarding markers, what happens with the existing code when you select an item multiple times?"

In the start of the problem, if a user selected an airport multiple times, it would place multiple markers in the same space. 
This array was created so that every time a marker was created, the marker would be added to this array
*/
$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
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
                /*this addition addresses the following problem:
                Fill in the rest of the data in the table when a user selects an airport.
                */
                $('#setting-state').text(currAirport.State);
                $('#setting-fullname').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                /*
                the if statement below this line is another part of the following problem:
                Regarding markers, what happens with the existing code when you select an item multiple times?
                
                this if statment calls a function below that returns -1 if the airport code is not a part of the activeMarkers array.
                if this statement returns a number other than -1, then it means that there is crrently an activeMarker that matches the AirportCode,
                and instead of creating a new marker, it will just move the map to the position of the current marker.
                */
                if(contains(currAirport.Code) !== -1){
                   var position ={
                    lat: currAirport.Latitude,
                    lng: currAirport.Longitude
                   } 
                   globalMap.panTo(position)
                }

                else{
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code,

                        });
                /*
                after the marker is instantiated, the marker is pushed onto the activemarkers array, the map also immediately pans to the position of 
                the newly instantiated marker.
                */
                activeMarkers.push(marker);
                globalMap.panTo(marker.position);

/*
the code below adds an eventListener that will delete a marker, and remove the marker from the activeMarkers array once it is right-clicked, 
solving the problem of allowing the user to remove a marker.
*/
 google.maps.event.addListener(marker, "rightclick", function(){
   var index = activeMarkers.indexOf(marker);
   activeMarkers.splice(index, 1);
    marker.setMap(null);

 });
}

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





function contains(airportCode){
    //this function returns the spot in the activemarkers array for where the airportcode is. if the airportcode isn't found, 
    //the function returns -1
    var length = activeMarkers.length;
    for(var i = 0; i < length; i++){
        if(airportCode === activeMarkers[i].title){
            return i;
        }
    }
    return -1;
}


function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }