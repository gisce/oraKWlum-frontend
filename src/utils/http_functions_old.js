/* eslint camelcase: 0 */

import { API_PREFIX } from '../constants/index'
import axios  from 'axios'

import { browserHistory } from 'react-router';


const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function dispatchNewRoute(route, event=false) {

    //if event is provided handle opening in a new tab/window
    if (event) {
        if (event.metaKey || event.ctrlKey) {
            const new_window = window.open(route, '_blank');
            return;
        }
        event.preventDefault();
    }

    //software update detection -> enforce a full refresh of the window to reach the updated version!
    if (window.softwareUpdate)
        return (window.location = route);

    browserHistory.push(route);
}

export function define_token(token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = token;
}

export function undefine_token() {
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
}

export function validate_token(token) {
    return axios.post(API_PREFIX + '/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password) {
    return axios.post(API_PREFIX + '/user/', {
        email,
        password,
    });
}

export function get_token(email, password) {
    return axios.post(API_PREFIX + '/get_token', {
        email,
        password,
    });
}

export function ask_recover(email) {
    return axios.post(API_PREFIX + '/recover', {
        email,
    });
}

export function has_github_token(token) {
    return axios.get(API_PREFIX + '/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get(API_PREFIX + '/user/', tokenConfig(token));
}

export function data_fetch_api_resource(token, resource) {
    return axios.get(API_PREFIX + "/" + resource);
}

export function data_download_api_resource(token, resource) {
    return axios.get(API_PREFIX + "/" + resource, {responseType: 'blob'});
}

export function data_create_api_resource(token, resource, new_data) {
    return axios.post(API_PREFIX + "/" + resource, new_data);
}

export function data_update_api_resource(token, resource, new_data) {
    return axios.put(API_PREFIX + "/" + resource, new_data);
}

export function data_delete_api_resource(token, resource) {
    return axios.delete(API_PREFIX + "/" + resource);
}
