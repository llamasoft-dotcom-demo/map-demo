$(function () {
    var listItemTemplate;
    var selectListItemTemplate;
    var airports = [];
    var globalMap;

    // Init functions
    function init() {
        initHandlebars();
        ListFunctions.loadAirportSelectList();
        $('#airport-list').select2({
            placeholder: 'Select an airport'
        });
        $('#airport-list').change(ListFunctions.newAirportSelected);
    }

    function initMap() {
        // Callback function to create a map object and specify the DOM element for display.
        globalMap = new google.maps.Map(document.getElementById('airport-map'), {
            center: { lat: 42.2814, lng: -83.7483 },
            scrollwheel: true,
            zoom: 6
        });
    }

    function initHandlebars() {
        var source = $('#airport-list-item-template').html();
        listItemTemplate = Handlebars.compile(source);

        source = $('#select-list-item-template').html();
        selectListItemTemplate = Handlebars.compile(source);
    }
    // eo init functions

    // Helper functions
    function findAirportIndex(code) {
        return _.findIndex(airports, function (item) {
            return item.Code == code;
        });
    }

    function scrollTo(element) {
        $('#sidebar').animate({
            scrollTop: element.offset().top
        });
    }
    // eo helper functions

    // Functions for controlling data in and interacting with the airport list
    var ListFunctions = {
        deleteAirport: function (code, index) {
            airports.splice(index, 1);
            $('[data-code="' + code + '"]').remove();
        },

        loadAirportSelectList: function () {
            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');

            var sortedSites = _.sortBy(sites, 'Code');
            for (var i in sites) {
                var newOption = selectListItemTemplate(sortedSites[i]);
                airportList.append(newOption);
            }
        },

        newAirportSelected: function () {
            var listItem = $(this);
            var code = listItem.val();

            if (!code) return;

            if (!_.findWhere(airports, { Code: code })) {
                var selectedAirport = _.findWhere(sites, { Code: code });

                // The FullSiteNameAbbr property contains some redundant information, 
                // in the form of AIRPORT_{Code}_{Name}. We only need the name.
                selectedAirport.FullSiteNameAbbr = selectedAirport.FullSiteName.split("_", 3)[2];

                var marker = MapFunctions.addMarker(selectedAirport);
                selectedAirport.marker = marker;

                airports.push(selectedAirport);
                airports = _.sortBy(airports, 'FullSiteNameAbbr');

                // Finding the index here allows us to add it in the correct order to the html list
                var newAirportIndex = findAirportIndex(code);

                var newListItem = listItemTemplate(selectedAirport);
                $('.airport-list-item.active').removeClass('active');

                var newDomElement;
                if (newAirportIndex == 0) {
                    newDomElement = $('#selected-airport-list').prepend(newListItem)
                } else {
                    newDomElement = $('.airport-list-item:nth-of-type(' + newAirportIndex + ')').after(newListItem);
                }

                scrollTo(newDomElement);

                $('[data-delete="' + code + '"]').click(MapFunctions.deleteMarker);
                $('[data-code="' + code + '"]').click(ListFunctions.selectExistingAirport);
            } else {
                ListFunctions.selectExistingAirport(code);
            }

            listItem.val(null).trigger('change'); // The trigger is so the dropdown actually shows the null value
        },

        selectExistingAirport: function (code) {
            if (code.target) { // This is an event, passed through a click handler
                var btn = $(this);
                code = btn.data('code');
            } else { // Code was passed directly from another function
                var btn = $('[data-code="' + code + '"]');
            }

            scrollTo(btn);

            var airport = _.findWhere(airports, { Code: code });
            if (!airport || btn.hasClass('active')) return;

            $('.airport-list-item.active').removeClass('active');
            btn.addClass('active');

            MapFunctions.selectMarker(airport);
        }
    };

    // Functions for controlling data in and interacting with the map
    var MapFunctions = {
        addMarker: function (selectedAirport) {
            var marker = new google.maps.Marker({
                position: { lat: selectedAirport.Latitude, lng: selectedAirport.Longitude },
                map: globalMap,
                title: selectedAirport.Code + ' - ' + selectedAirport.FullSiteNameAbbr + ' (' + selectedAirport.City + ') - Click for more info...',
                animation: google.maps.Animation.DROP
            });

            marker.addListener('click', function () {
                ListFunctions.selectExistingAirport(selectedAirport.Code);
            });

            globalMap.setCenter(marker.getPosition());

            return marker;
        },

        deleteMarker: function () {
            var btn = $(this);
            var code = btn.data('delete');

            var index = findAirportIndex(code);
            var marker = airports[index].marker;
            marker.setMap(null);

            ListFunctions.deleteAirport(code, index);
        },

        selectMarker: function (airport) {
            var marker = airport.marker;
            globalMap.setCenter(marker.getPosition());

            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                marker.setAnimation(null);
            }, 1400); // 14 seconds is about how long it takes for two bounces
        }
    };

    // Global variables
    window['globalMap'] = globalMap;
    window['initMap'] = initMap;

    init();
});