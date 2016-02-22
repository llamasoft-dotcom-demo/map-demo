var globalMap;
// Colleen added 'markers' to support marker removal 'delMarker' and add markers 'addMarker'

var markers = {}

$(function() {
		
  var MapFcns = {
    loadSiteList: function () {

        //alert("loadSiteList");                TEST
        var airportList = $('#airport-list');
        airportList.html('');
        airportList.append('<option value=""></option>');
        
        sites.sort(function(a, b){
            var codeA=a.Code
            var codeB=b.Code;
            if (codeA < codeB) //sort string ascending
                return -1;
            if (codeA > codeB)
                return 1;
            return 0; //default return value (no sorting)
});
        
        for (var i in sites) {
            //alert("Hello: "+sites[i].Code);   TEST
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
            airportList.append(newOption);
        }
    },  

		siteListChange: function() {
		    //alert("siteListChange!");		    TEST
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                var airport = currAirport.FullSiteName.split("_");
                $('#setting-airportName').text(airport[2]);   
                $('#setting-lat').text(currAirport.Latitude);
				$('#setting-long').text(currAirport.Longitude);
                
                addMarker( currAirport );
            }
    }
}

//alert("Defining some functions");           TEST
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


//alert("Defining global functions");       TEST
function  initMap() {
//Colleen added alert for test purposes     TEST
  //alert("hello");
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
};

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function delMarker(id) {
		// Used the random uuid to find the marker and remove it from the map                         
		marker = markers[ id ];
		marker.setMap(null);
		delete markers[ id ];
}

function addMarker(currAirport) {
  var marker = new google.maps.Marker({
         position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
         map: globalMap,
         title: currAirport.Code
   });
	center = new google.maps.LatLng( currAirport.Latitude, currAirport.Longitude );
	globalMap.panTo( center );
	// Allow the user to remove the marker     TEST
	// Save the marker object to the markers dictionary	
	id = uuid();
	marker.__markerId = id;
	markers[ id ] = marker;	
	google.maps.event.addListener(marker, "rightclick",
			function (point) {
					delMarker( this.__markerId );
			}
	 );  		
}

