var globalMap;
var markers =[];

$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
		var airportChildren = $('#airport-list')
            airportList.html('');
            airportList.append('<option value=""></option>');
        for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
            airportList.append(newOption);
        }
		var optionList = $('#airport-list option');
		optionList.sort(function(a, b){
			if (a.text > b.text)
				return 1;
			else if (a.text < b.text)
				return -1;
			else
				return 0;
		});
		$("#airport-list").empty().append(optionList);
    },
    
    siteListChange: function() {
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
				$('#setting-state').text(currAirport.State);
				var fullsiteName = currAirport.FullSiteName.split("_");
				$('#setting-fullname').text(fullsiteName[2]);
				$('#setting-lat').text(currAirport.Latitude);
				$('#setting-long').text(currAirport.Longitude);
                
				globalMap.panTo({lat: currAirport.Latitude, lng: currAirport.Longitude});
				
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });
				markers.push(marker);
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

$(function() {
   $('#toggleBtn').click(function() {
	   var airportCode = $('#airport-list').val();
	   var check = false;
	   if (airportCode)
	   {
		   var currAirport = _.findWhere(sites, {Code: airportCode});
		   for (var i in markers){
			   if (currAirport.Code == markers[i].title)
			   {
				   markers[i].setMap(null);
				   markers.splice(i, 1);
				   check = true;
			   }
		   }
		   if (check == false)
		   {
				var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });
				markers.push(marker);
		   }
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