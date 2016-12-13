import {debug} from './debug';
export const DEBUG = (debug)?debug:false;

export const API_SPECIFICATION = 1;
export const API_PREFIX = "/api/v" + API_SPECIFICATION;

export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGOUT_USER = 'LOGOUT_USER';

export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';

export const FETCH_PROTECTED_DATA_REQUEST = 'FETCH_PROTECTED_DATA_REQUEST';
export const RECEIVE_PROTECTED_DATA = 'RECEIVE_PROTECTED_DATA';

export const RECOVER_USER_REQUEST = 'RECOVER_USER_REQUEST';
export const RECOVER_USER_SUCCESS = 'RECOVER_USER_SUCCESS';
export const RECOVER_USER_FAILURE = 'RECOVER_USER_FAILURE';

export const FETCH_PROPOSALS_REQUEST = 'FETCH_PROPOSALS_REQUEST';
export const RECEIVE_PROPOSALS = 'RECEIVE_PROPOSALS';

export const FETCH_PROPOSAL_REQUEST = 'FETCH_PROPOSAL_REQUEST';
export const RECEIVE_PROPOSAL = 'RECEIVE_PROPOSAL';

export const RUN_PROPOSAL_REQUEST = 'RUN_PROPOSAL_REQUEST';
export const RECEIVE_RUN_PROPOSAL = 'RECEIVE_RUN_PROPOSAL';

export const DUPLICATE_PROPOSAL_REQUEST = 'DUPLICATE_PROPOSAL_REQUEST';

export const FETCH_AGGREGATIONS_REQUEST = 'FETCH_AGGREGATIONS_REQUEST';
export const RECEIVE_AGGREGATIONS = 'RECEIVE_AGGREGATIONS';

export const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
export const RECEIVE_PROFILE_KO = 'RECEIVE_PROFILE_KO';

export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_OK = 'UPDATE_PROFILE_OK';
export const UPDATE_PROFILE_KO = 'UPDATE_PROFILE_KO';

export const APP_REMOVE_NODE = 'APP_REMOVE_NODE';
export const APP_TOGGLE_NAME = 'APP_TOGGLE_NAME';
export const APP_UPDATE_PATHS = 'APP_UPDATE_PATHS';
export const APP_CHANGE_OFFSET = 'APP_CHANGE_OFFSET';

export const colors = [
    '#db4939',
    '#f29913',
    '#3c8cba',
    '#00a658',
    '#B63D70',
    '#C0D849',
    '#2C355E',
    '#F2E9E1',
    '#A75899',
    '#4C9180',
    '#D5A7CC',
    '#A79C8E',
    '#6B5344',
    '#EB9F9F',
    '#000000',
];
