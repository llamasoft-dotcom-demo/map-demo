const AirPortmarker = (function AirPortMarker() {
    let relatedMap;
    //store the code, marker, and info window to allow for easy tracking
    const VisibleAirports = new Map();

    function MarkAirport(airportCode) {
        if (airportCode && !VisibleAirports.has(airportCode)) {
            var currAirport = _.findWhere(sites, { Code: airportCode });
            console.log(currAirport);
            VisibleAirports.set(airportCode, { marker: AddMarkerToMap(currAirport), infowindow: {} });
            RefreshMarkerVisibility();
            AddToMarkedAirPortList(currAirport);
        }
    }
    function AssociateWithMap(map) {
        relatedMap = map
    }

    function RefreshMarkerVisibility() {
        if (VisibleAirports.size) {
            $('#tagged-airports').fadeIn(200);
        }
        else {
            $('#tagged-airports').fadeOut(200);
        }
    }

    function AddToMarkedAirPortList(airPort) {
        $('#tagged-airports').append(GetSelectedAirportTemplate(airPort));

        $(`#mark-${airPort.Code}`).click(airPort.Code, function (event) {
            ShowMarkerDetails(event.data);
        });

        $(`#mark-${airPort.Code} h4 a.remove-link`).click(airPort.Code, function (event) {
            //don't want this to bubble up to show, or try to navigate                
            event.stopPropagation();
            event.preventDefault();

            RemoveMarker(event.data);
        });
    }
    function FilterAirportFullname(name){
        return name.replace(/^AIRPORT_(.+)_/, '$1 ');
    }
    function GetSelectedAirportTemplate(airPort){
       return `
                   <div id="mark-${airPort.Code}" class="list-group-item marked-airport">
                        <h4 class="list-group-item-heading">${FilterAirportFullname(airPort.FullSiteName)} 
                                <a class="remove-link" href="#">
                                    <span class="badge" style="float:right">
                                        <i class="fa fa-minus-circle" aria-hidden="true"></i> Remove
                                    </span>
                                </a>  
                        </h4>
                        <p class="list-group-item-text">${airPort.City}, ${airPort.State}</p>                                              
                  </div>         
            `
    }
    function RemoveMarker(code) {
        var onMap = VisibleAirports.get(code);

        if (onMap.InfoWindow) {
            onMap.InfoWindow.close();
        }
        onMap.marker.setMap(null);

        VisibleAirports.delete(code);
        var sidePanelRow = $(`#mark-${code}`);
        $(sidePanelRow).fadeOut(100, function () {
            $(sidePanelRow).remove();
            RefreshMarkerVisibility();
        })

    }
    function ShowMarkerDetails(code) {
        var onMap = VisibleAirports.get(code);
        if (!onMap.InfoWindow) {
            var currAirport = _.findWhere(sites, { Code: code });
            onMap.InfoWindow = new google.maps.InfoWindow({
                content: `${FilterAirportFullname(currAirport.FullSiteName)} <br />
                ${currAirport.City}, ${currAirport.State} <br />
                (${currAirport.Latitude},${currAirport.Longitude})`
            });
        }
        onMap.InfoWindow.open(relatedMap, onMap.marker);
        relatedMap.panTo(onMap.marker.getPosition());
    }

    function AddMarkerToMap(airPort) {
        var marker = new google.maps.Marker({
            position: { lat: airPort.Latitude, lng: airPort.Longitude },
            map: relatedMap,
            title: airPort.Code
        });
        relatedMap.panTo(marker.getPosition());
        relatedMap.setZoom(6);
        marker.addListener('click', function markerClickHandler() { ShowMarkerDetails(airPort.Code) });
        return marker;
    }

    return {
        MarkAirport: MarkAirport,
        AssociateWithMap: AssociateWithMap
    };
})();