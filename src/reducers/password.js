import { CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_OK, CHANGE_PASSWORD_KO, CHANGE_PASSWORD_INI } from '../constants'
import { createReducer } from '../utils/misc'

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [CHANGE_PASSWORD_INI]: (state, payload) =>
        Object.assign({}, state, {
            isUpdating: false,
            statusText: null,
            done: false,
        }),

    [CHANGE_PASSWORD_REQUEST]: (state, payload) =>
        Object.assign({}, state, {
            isUpdating: true,
            statusText: payload.statusText,
            done: false,
        }),

    [CHANGE_PASSWORD_OK]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isUpdating: false,
            loaded: true,
            statusText: payload.statusText,
            statusType: payload.statusType,
            done: true,
        }),
    [CHANGE_PASSWORD_KO]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isUpdating: false,
            loaded: true,
            status: payload.status,
            statusText: payload.statusText,
            statusType: payload.statusType,
            done: false,
        }),
});
