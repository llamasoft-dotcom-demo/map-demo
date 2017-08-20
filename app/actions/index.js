import sites from '../assets/siteData'; // pretending like this data was returned from an async call to the backend
import _ from 'lodash';


export const setAirport = airportInfo => ({
    type: 'SET_AIRPORT',
    airport: airportInfo
});


export const removeAirport = () => ({
    type: 'REMOVE_AIRPORT'
});


export const setSortedCodes = sortedSites => ({
    type: 'SET_ALL_CODES',
    sortedSites: sortedSites
});


// simulate getting data from an API based on "code"
export const simulateAsyncFetchAirportData = code => {
    const airport = sites.find( site => site.Code === code );
    const siteInfo = airport || {};

    return setAirport(siteInfo);
};


// simulate getting all site codes from an API
export const simulateAsyncFetchAllSiteCodes = () => {
    const sortedSites = _.sortBy(sites, 'Code');

    return setSortedCodes(sortedSites || []);
};

