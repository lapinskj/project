import axios from 'axios';
import {
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    LOGOUT,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_FAIL,
    AUTHENTICATED_SUCCESS,
    ACCOUNT_UPDATE_SUCCESS,
    ACCOUNT_UPDATE_FAIL,
    PASSWORD_CHANGE_SUCCESS,
    PASSWORD_CHANGE_FAIL
} from './types';


export const checkAuthenticated = () => async dispatch => {
    if (typeof window == 'undefined') {
        dispatch({
            type: AUTHENTICATED_FAIL
        });
    }
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        try {
            const body = JSON.stringify({ token: localStorage.getItem('access') });
            const res = await axios.post(`http://localhost:8000/auth/jwt/verify/`, body, config);
            if (res.status === 200) {
                dispatch({
                    type: AUTHENTICATED_SUCCESS
                });
            }
        }
        catch {
            try {
                const body = JSON.stringify({ refresh: localStorage.getItem('refresh') });
                const res = await axios.post(`http://localhost:8000/auth/jwt/refresh/`, body, config);
                if (res.status === 200){
                    localStorage.setItem("access", res.data.access);
                    dispatch ({
                        type: AUTHENTICATED_SUCCESS
                    });
                }
            }
            catch {
                dispatch ({
                    type: AUTHENTICATED_FAIL
                });
            }
        }
    } else {
        dispatch ({
            type: AUTHENTICATED_FAIL
        });
    }
};


export const load_user = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        try {
            const res = await axios.get(`http://localhost:8000/auth/users/me/`, config);
            const user = res.data;
            dispatch ({
                type: USER_LOADED_SUCCESS,
                payload: user
            });
        } catch (err) {
            dispatch ({
                type: USER_LOADED_FAIL
            });
        }
    } else {
        dispatch ({
            type: USER_LOADED_FAIL
        });
    }
};


export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify({ email, password });
    try {
        const res = await axios.post(`http://localhost:8000/auth/jwt/create/`, body, config);
        dispatch ({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch (load_user());
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL
        });
    }
};


export const signup = ({ name, surname, pesel, email,  phone_number, password, re_password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ name, surname, pesel, email,  phone_number, password, re_password });
    try {
        axios
            .post("http://localhost:8000/auth/users/", body, config)
            .then(res => {
                dispatch({
                    type: SIGNUP_SUCCESS,
                    payload: res.data
            });
        });
    } catch (err) {
        dispatch ({
            type: SIGNUP_FAIL
        });
    }
};


export const verify = (uid, token) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ uid, token });
    try {
        const res = await axios.post(`http://localhost:8000/auth/users/activation/`, body, config);
        dispatch ({
            type: ACTIVATION_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch ({
            type: ACTIVATION_FAIL
        });
    }
};


export const reset_password = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ email });
    try {
        const res = await axios.post(`http://localhost:8000/auth/users/reset_password/`, body, config);
        dispatch ({
            type: RESET_PASSWORD_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch ({
            type: RESET_PASSWORD_FAIL
        });
    }
};


export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ uid, token, new_password, re_new_password });
    try {
        const res = await axios.post(`http://localhost:8000/auth/users/reset_password_confirm/`, body, config);
        dispatch ({
            type: RESET_PASSWORD_CONFIRM_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch ({
            type: RESET_PASSWORD_CONFIRM_FAIL
        });
    }
};


export const logout = () => dispatch => {
    dispatch ({ type: LOGOUT });
};

export const updateAccount = (account) => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.put(`http://localhost:8000/auth/users/me/`,account, config);
            console.log(res.data)
            dispatch({
                type: ACCOUNT_UPDATE_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: ACCOUNT_UPDATE_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};

export const changePassword = (passwords) => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };

        try {
            const res = await axios.post(`http://localhost:8000/auth/users/set_password/`,passwords, config);
            console.log(res.data)
            dispatch({
                type: PASSWORD_CHANGE_SUCCESS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: PASSWORD_CHANGE_FAIL
            });
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
    }
};