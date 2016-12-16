import { routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth  from './auth'
import data  from './data'
import profile  from './profile'
import proposal  from './proposal'
import proposals  from './proposals'
import notification  from './notification'
import { LOGOUT_USER } from '../constants/index'

const appReducer = combineReducers({
    routing: routerReducer,
    auth,
    data,
    notification,
    proposals,
    proposal,
    profile,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT_USER') {
    // Clear all states except routing
    Object.keys(state).forEach(function(oneState,index) {
        if (oneState != "routing")
            state[oneState] = undefined;
    });
  }
  return appReducer(state, action);
}

export default rootReducer;
