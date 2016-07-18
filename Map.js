var globalMap;

$(function () {
  
//=================================================
//this fcn populates the dropdown from siteData.js
//created new array that's sorted and populated dropdown
//from that new array.
//=================================================


   var MapFcns = {
      loadSiteList: function () {
      var airportList = $('#airport-list');
          airportList.html('');
          airportList.append('<option value=""></option>');
          var array = [];
      for (var i in sites) {
              array.push(sites[i].City);
              array.sort();
            }
      for (var x in array) {
          var newOption = $('<option value="' + array[x] + '">' + array[x] + '</option>');
          airportList.append(newOption);
              }
          
  },
//=================================================
//diplays airport information on table 
//=================================================
      siteListChange: function() {
           var ctl = $(this),
                airportCity = ctl.val();
           if (airportCity) {
               var currAirport = _.findWhere(sites, {City: airportCity});
               $('#setting-code').text(currAirport.Code);
               $('#setting-city').text(currAirport.City);
               $('#setting-state').text(currAirport.State);
               $('#setting-fullname').text(currAirport.FullSiteName.slice(12));
               $('#setting-lat').text(currAirport.Latitude);
               $('#setting-long').text(currAirport.Longitude);
                             
//=================================================
//places a unique marker on the map.
//=================================================        
               var id;
               var markers = {};
               var marker = new google.maps.Marker({
                   position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                   map: globalMap,
                   title: currAirport.Code
               });

//=================================================
//solves duplicate marker issue.
//=================================================  
                $("#airport-list :selected").remove();

//=================================================
//function for the user to delete the marker
//=================================================
               var delMarker = function (id) {
                   marker = markers[id];
                   marker.setMap(null);
               };

//=================================================
//pans to the location of the marker.
//=================================================
               globalMap.panTo({lat: currAirport.Latitude, lng: currAirport.Longitude});
               id = marker._gm_id;
               markers[id] = marker;
                   google.maps.event.addListener(marker, "dblclick", function (point) { id = this.__gm_id; delMarker(id) });

//=================================================
//creates infowindow for better UX & conserves screen area.
//=================================================
               var contentString = 
                "<h3>Current Airport Table Information</h3>" +
                "<p>" + "Current Airport Code:" + " " + currAirport.Code + "</p>" + 
                "<p>" + "Current Airport Location:" + " " + currAirport.City + ", " + currAirport.State + "</p>" + 
                "<p>" + "Current Airport Coordinates:" + " " + currAirport.Latitude + " (latitude), " + currAirport.Longitude + " (longitude)</p>" + 
                "<p>" + "Full Name of Current Airport:" + " " + currAirport.FullSiteName + "</p>";
   
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
 
                marker.addListener('click', function() {
                  
                    infowindow.open(globalMap, marker);
                });
               
           }
       }
   };

   MapFcns.loadSiteList();
   $('#airport-list').change(MapFcns.siteListChange);

//=================================================
//toggles the instructions on and off
//=================================================
   $('#exercise-toggle').click(function() {
       var  toggleCtl = $(this),
           toggleVal = toggleCtl.text();
       if (toggleVal == 'Click to condense instructions') {
           toggleCtl.text('Click to show instructions');
           $('#exercise-instructions').hide();
       } else {
           toggleCtl.text('Click to condense instructions');
           $('#exercise-instructions').show();
       }
   });

});
//=================================================
// Callback function to create a map object and specify the DOM element for 
//display.
//================================================= 
function  initMap() {

   globalMap = new google.maps.Map(document.getElementById('airport-map'), {
       center: {lat: 42.2814, lng: -83.7483},
       scrollwheel: true,
       zoom: 6
   });
   
   
 
}