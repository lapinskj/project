import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    AUTHENTICATED_FAIL,
    AUTHENTICATED_SUCCESS,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    ACCOUNT_UPDATE_SUCCESS,
    ACCOUNT_UPDATE_FAIL,
    PASSWORD_CHANGE_SUCCESS,
    PASSWORD_CHANGE_FAIL
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    authenticationError: false
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            };
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh,
                authenticationError: true
            };
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload
            };
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            };
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false
            };
        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null
            };
        case SIGNUP_FAIL:
        case LOGIN_FAIL:
            return {
                ...state,
                authenticationError: true
            };
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                authenticationError: false
            };
        case ACCOUNT_UPDATE_SUCCESS:
            return {
                ...state,
                user: payload,
                loading: false,
                redirect: true
            };
        case ACCOUNT_UPDATE_FAIL:
            return {
                ...state,
                loading: false
            };
        case PASSWORD_CHANGE_SUCCESS:
            return {
                ...state,
                loading: false,
                redirect: true
            };
        case PASSWORD_CHANGE_FAIL:
            return {
                ...state,
                loading: false
            };

        default:
            return state
    }
}
