import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import data from './data';
import proposals from './proposals';

const rootReducer = combineReducers({
    routing: routerReducer,
    /* your reducers */
    auth,
    data,
    proposals,
});

export default rootReducer;
