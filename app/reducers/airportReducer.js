export const airport = (state = {}, action) => {
    switch (action.type) {
        case 'SET_AIRPORT':
            return {
                ...state,
                code: action.airport.Code,
                city: action.airport.City,
                state: action.airport.State,
                name: action.airport.FullSiteName,
                lat: action.airport.Latitude,
                long: action.airport.Longitude
            };
        case 'REMOVE_AIRPORT':
            return {
                ...state,
                code: null,
                city: null,
                state: null,
                name: null,
                lat: null,
                long: null
            };
        case 'SET_ALL_CODES':
            return {
                ...state,
                sortedSites: action.sortedSites
            };
        default:
            return state;
    }
};
