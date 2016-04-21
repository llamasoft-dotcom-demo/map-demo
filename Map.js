var globalMap;

$(function() {
    var listItemTemplate;
    var markers = [];
    
    function initHandlebars() {
        var source = $('#airport-list-item-template').html();
        listItemTemplate = Handlebars.compile(source);
    }

    var MapFcns = {
        loadSiteList: function () {
            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            
            var sortedSites = _.sortBy(sites, 'Code');
            for (var i in sites) {
                var newOption = $('<option value="' + sortedSites[i].Code + '">' + sortedSites[i].Code + ' - ' + sortedSites[i].City + '</option>');
                airportList.append(newOption);
            }
        },
        
        siteListChange: function() {
            var ctl = $(this),
                airportCode = ctl.val();
            if(airportCode && !_.has(markers, airportCode)) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                
                // The FullSiteNameAbbr property contains some redundant information, in the form of AIRPORT_{Code}_{Name}. We only need the name.
                currAirport.FullSiteNameAbbr = currAirport.FullSiteName.split("_", 3)[2];
                
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code,
                    animation: google.maps.Animation.DROP
                });
                
                globalMap.setCenter(marker.getPosition());
                
                markers[currAirport.Code] = marker;
                
                var newListItem = listItemTemplate(currAirport);
                $('#selected-airport-list').append(newListItem)

                $('[data-delete="' + airportCode + '"]').click(MapFcns.deleteMarker);
                
                ctl.val(null).trigger('change'); // The trigger is so the dropdown actually shows the null value
            }
        },
        
        deleteMarker: function() {
            var btn = $(this);
            var code = btn.data('delete');
            
            // Deal with marker
            var marker = markers[code];
            marker.setMap(null);
            delete markers[code];
            
            // Deal with info card
            $('[data-code="' + code + '"]').remove();
        }
    };
    
    initHandlebars();
    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
    
    window['initMap'] = function() {
        // Callback function to create a map object and specify the DOM element for display.
        globalMap = new google.maps.Map(document.getElementById('airport-map'), {
            center: { lat: 42.2814, lng: -83.7483 },
            scrollwheel: true,
            zoom: 6
        });
    };
});