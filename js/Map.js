// Lets do this with some OO design. We will scope this down so it isn't completely global. 
// We will just use private and priveledged members here. 
// Prototype and public methods are overkill for this. 
// We won't be using this for inheritance anyway.    
$(function () {
    'use strict';  // No undeclared varialbes for us. We want safe code.

    //
    // mapApp function. The main application function for this app.
    //
    var mapApp = new function () {
        
        //
        // loadListGroup function. used to load the initial sorted data into our application
        //
        this.loadListGroup = function () {
            var listGroup = $('#airport-list-group');
            listGroup.html('');

            var sites = SiteData.sortedSites();

            for (var i =0; i < sites.length;  i += 1) {
                var site = sites[i];
                var newItem = $('<li class="list-group-item"><label><input type="checkbox" id="' + site.Code + '"><strong>' +
                    site.Code + '</strong><br><small>' + site.FullSiteName.substring(12) + '</small></label></li>');

                listGroup.append(newItem);
            }
        };

        //
        // checkBoxChange function. event used to perform actions when an airport is selected or deselected
        //
        this.checkBoxChange = function () {
            var ctl = $(this),
                airportCode = ctl.attr('id');

            // were we able to find an airport code?
            if (airportCode) {
                var currAirport = _.findWhere(SiteData.sites, { Code: airportCode });

                if (this.checked) {
                    // the user checked the box
                    GoogleMapApi.addMarker(currAirport);
                } else {
                    // the user deselected the box
                    GoogleMapApi.removeMarker(currAirport.Code);
                }
            }
        };
    };

    //
    // Add the initial event handlers and load our initial data 
    //
    $(function () {
        mapApp.loadListGroup();
        $("input:checkbox").change(mapApp.checkBoxChange);
    });
});