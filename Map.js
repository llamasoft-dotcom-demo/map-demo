// Globals
let globalMap;
let markerManager;

$(function() {

var MapFcns = {
    loadSiteList: function () {
        let airportList = $('#airport-list');

            // Sort the sites before processing them
            let sortedSites = _.chain(sites).sortBy('Code');

            // Loop over each of the sites and create an element for the airport list
            sortedSites.forEach(function(site) {
                let element = $("<div/>", {class: "site-row"}).append(
                    $("<span/>", {class: "site-name"}).text(site.Code)
                ).append(
                    $("<input/>", {type: "checkbox", class: "toggle-button"}).attr('checked', false).on('change', function() {
                        let wasChecked = $(this).prop('checked');
                        if(wasChecked) {
                            markerManager.showMarker(site.Code);
                        } else {
                            // Must have been unchecked
                            markerManager.hideMarker(site.Code);
                        }
                    })
                )
                
                airportList.append(element);
                
            });

            // Once all the elements have been added we need to bootstrap the toggle buttons
            $(".toggle-button").bootstrapToggle();

            // Setup the listener for the filter field
            $(".filter-field").keyup(this._handleFilterChange);
    },

    /**
     * Handler for when the filter value changes.
     */
    _handleFilterChange: function() {
        let filterValue = this.value;
        $(".site-row").each(function(index) {
            let item = $(this);
            let itemName = item.children(0).text().toUpperCase();
            if(itemName.indexOf(filterValue.toUpperCase()) !== -1) {
                item.show();
            } else {
                item.hide();
            }
        });
    }
}

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

    /**
     * Callback function for when google maps is done loading. This is setup on the window object
     * so it remains global for when the site list is loaded. This makes it impossible to interact
     * with the map before it is loaded.
     */
    window.initMap = function() {
        // Callback function to create a map object and specify the DOM element for display.
        globalMap = new google.maps.Map(document.getElementById('airport-map'), {
            center: {lat: 42.2814, lng: -83.7483},
            scrollwheel: true,
            zoom: 5
        });

        // Once google maps is ready then load all of the markers
        sites.forEach(function(site) {
            markerManager.createMarker(site);
        });

        // Setup the list of airports as they are ready to be interacted with now
        MapFcns.loadSiteList();
    }

});

/**
 * Closure for managing the markers of the map.
 */
markerManager = (function() {
    // A private map of markers from airport code -> google.maps.Marker
    let markers = {};

    /**
     * @private
     * Creates an InfoWindow for when a marker is clicked.
     */
    var createInfoWindow = function(site) {
        let siteName = site.FullSiteName.substring(12);
        let messageBox = $("<div/>", {class: 'infoBox'}).append(
            $("<div/>").text(site.Code).css("font-weight","Bold")
        ).append(
            $("<div/>").text(siteName) 
        ).append(
            $("<span/>").text(site.City + ", ")
        ).append(
            $("<span/>").text(site.State)
        ).append(
            $("<br>")
        ).append(
            $("<span/>").text("(" + site.Latitude + ", ")
        ).append(
            $("<span/>").text(site.Longitude + ")")
        )

        return infoWindow = new google.maps.InfoWindow({
            content: messageBox.html()
        });
    }

    return {
        /**
         * Creates and adds it to the manager. The marker is originally hidden.
         * Also sets up the listener for the pop-up window when a marker is clicked.
         */
        createMarker: function(site) {
            let marker = new google.maps.Marker({
                position: {
                    lat: site.Latitude,
                    lng: site.Longitude
                },
                map: null, // Keeps the marker hidden for now
                title: site.Code,
                animation: google.maps.Animation.DROP
            });
            markers[site.Code] = marker;

            // Sets up a listener on the marker for when it is clicked
            google.maps.event.addListener(marker, "click", function (e) {
                let infoWindow = createInfoWindow(site);
                infoWindow.open(globalMap, marker);
            }.bind(this));

        },

        /**
         * Hides a marker (does not delete it)
         */
        hideMarker: function(code) {
            markers[code].setMap(null);
        },

        /**
         * Shows a marker and pans to it.
         */
        showMarker: function(code) {
            markers[code].setMap(globalMap);
            globalMap.panTo(markers[code].getPosition());
        }
    }
}());