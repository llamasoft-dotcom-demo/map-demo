var MapFcns = {
    loadSiteList: function () {
        sites.sort(function(a, b) {
          //Sorts sites array by airport Code.
          var codeA = a.Code.toUpperCase();
          var codeB = b.Code.toUpperCase();
          if(codeA > codeB) {return 1;}
          if(codeA < codeB) {return -1;}
          return 0;
        });
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
        //loops through sites array. Sites is imported in the html.
        for (var i in sites) {
            //creates a new element w/ jquery. Accesses .Code property of each site.
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
            //adds new element to airport list el
            airportList.append(newOption);
        }
    },

    siteListChange: function() {
        //This refers to #airport-list in this use case
            if($(this).val()) {
              var ctl = $(this), airportCode = ctl.val();

            } else if($(this).text()) {
              var ctl = $(this), airportCode = ctl.text();
            }
            //sets airportCode var to equal airport Code from select el
            if(airportCode) {
                //sets currAir to whatever sites arr el has a Code equal to the select val
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-fullName').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);


                //set up test to see if airport is already marker
                if(!currAirport.toggled || currAirport.toggled === 0) {
                  //sets limit on markers
                  if(markers.length < 14) {
                    currAirport.toggled = 1;
                    MarkerFcns.addMarker(currAirport);
                    MarkerFcns.addToMarkerList();
                  }
                } else {globalMap.setCenter({lat: currAirport.Latitude, lng: currAirport.Longitude})}

            }
    }
}
