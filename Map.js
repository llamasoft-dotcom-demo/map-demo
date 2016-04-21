var globalMap;

$(function() {
    var listItemTemplate;
    //var markers = [];
    var airports = [];
    
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
            
            if (!airportCode) return;    
            
            if(!_.findWhere(airports, { Code: airportCode })) {
                var currAirport = _.findWhere(sites, { Code: airportCode });
                
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
                
                currAirport.marker = marker;
                               
                airports.push(currAirport);
                airports = _.sortBy(airports, 'FullSiteNameAbbr');
                var newItemIndex = _.findIndex(airports, function(item) {
                    return item.Code == airportCode;
                });
                
                var newListItem = listItemTemplate(currAirport);
                $('.airport-list-item.active').removeClass('active');
                var newDomElement;
                if (newItemIndex == 0) {
                    newDomElement = $('#selected-airport-list').prepend(newListItem)
                } else {
                    newDomElement = $('.airport-list-item:nth-of-type(' + newItemIndex + ')').after(newListItem);
                }
                
                $('#sidebar').animate({
                   scrollTop: newDomElement.offset().top
                });
                

                $('[data-delete="' + airportCode + '"]').click(MapFcns.deleteMarker);
                $('[data-code="' + airportCode + '"]').click(MapFcns.selectAirport);
            }
            
            ctl.val(null).trigger('change'); // The trigger is so the dropdown actually shows the null value
        },
        
        deleteMarker: function() {
            var btn = $(this);
            var code = btn.data('delete');
            
            // Deal with marker
            var airportIndex = _.findIndex(airports, function(item) {
                return item.Code == code;
            });
            
            var marker = airports[airportIndex].marker;
            marker.setMap(null);
            airports.splice(airportIndex, 1);
            
            // Deal with info card
            $('[data-code="' + code + '"]').remove();
        },
        
        selectAirport: function() {
            var btn = $(this);
            var code = btn.data('code');
            
            var marker = _.findWhere(airports, { Code: code }).marker;
            if(!marker || btn.hasClass('active')) return;
            
            $('.airport-list-item.active').removeClass('active');
            btn.addClass('active');
            
            globalMap.setCenter(marker.getPosition());
            
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1400); // 14 seconds is about how long it takes for two bounces
        }
    };
    
    initHandlebars();
    MapFcns.loadSiteList();
    $('#airport-list').select2({
       placeholder: 'Select an airport' 
    });
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