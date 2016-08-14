var globalMap;

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
    
    //Hilfmethode weil daten doppel
    selectAirport: function (airportCode) {
    	 var currAirport = _.findWhere(sites, {Code: airportCode});
         $('#setting-code').text(currAirport.Code);
         $('#setting-city').text(currAirport.City);
         $('#setting-state').text(currAirport.State);
         $('#setting-namefull').text(currAirport.FullSiteName);
         $('#setting-lat').text(currAirport.Latitude);
         $('#setting-long').text(currAirport.Longitude);
   	
    	
    	
    },

    
    siteListChange: function() {
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-namefull').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
               
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });
              
               // Select an airport with a click
                google.maps.event.addListener(marker,'click',function() {
                //get the airport code with this.title
                	MapFcns.selectAirport(this.title);
                	  //map.setZoom(9);
                	 // map.setCenter(marker.getPosition());
                	  }); 
                
                
                
                
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



//$('#map_canvas').gmap('clearMarkers');



    
function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });
  
    }