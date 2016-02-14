var globalMap;

$(function() {

var MapFcns = {
    loadSiteList: function () {
        var siteList = SitesModel.Sites;
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            for (var i in siteList) {
                var newOption = $('<option value="' + siteList[i].Code + '">' + siteList[i].Code + '</option>');
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

                // RP - Add the other fields to the display results
                $('#setting-state').text(currAirport.State);
                $('#setting-fullname').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
                
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code,
                    hasClickListenerRegistered: false
                });

                globalMarkers.push(marker);

                marker.addListener("click", function () {
                    
                    $("#airport-settings").toggle("fade", { easing: "swing", duration: 500 });
                    $("#airport-settings").position({ my: "center bottom", at: "center bottom", of: $("#airport-map") });
                    
                    // TODO:  there's some cool airport status information at
                    //        http://services.faa.gov/airport/status/IAD?format=json
                    //        that could be included as well. Consider using custom Marker
                    //        image if the airport is closed/experiencing delays
                });

                // Center the map on the newly selected marker
                globalMap.setCenter(marker.getPosition());

                if ($("#airport-settings").is(':visible') == false)
                {
                    $("#airport-settings").toggle("fade", { easing: "swing", duration: 500 });
                    $("#airport-settings").position({ my: "center bottom", at: "center bottom", of: $("#airport-map") });
                }
            }
    },

    findAlternateAirport: function () {
        // depending upon who the target audience is for this form
        // We may have to support a more 'open' searching scheme
        //   [user searches, refines based on results, chooses to 'add']

        var airportCode = $("#searchCode").val();

        // longer term I'd suggest wiring this sort of validation
        // into something similar to a wpf valiationRules
        // ASSERTION: users will most likely use the 3,4 or 5 letter FAA identifier
        //            -if FAA identifier
        if(!airportCode || airportCode.length < 3 || airportCode.length > 5)
        {
            // additional validations
            //      -Has only A-Z/a-z characters
            alert("Please enter a valid code");
        }

        // TODO:  implement invokation of suitable "search" service to 
        //        Search by FAA identifier, retrieve lat/lon and turn
        //        into a marker for display on the map
    }
}


MapFcns.loadSiteList();
$("#alternateCodeSearch").on("click", function () {
    MapFcns.findAlternateAirport();
});
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
    zoom: 6
  });

  globalMarkers = [];

  $("#removeMarkersBtn").on("click", function () {
      $.each(globalMarkers, function (index, value) {
          value.setMap(null);
      });

      if ($("#airport-settings").is(':visible'))
      {
          $("#airport-settings").toggle("fade", { easing: "swing", duration: 500 });
      }
  });
}