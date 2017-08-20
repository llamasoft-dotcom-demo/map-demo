import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import { airport } from './airportReducer.js';
import { mapState as map } from './mapReducer.js';

const rootReducer = combineReducers({
    airport,
    map,
    routing
});

export default rootReducer;
