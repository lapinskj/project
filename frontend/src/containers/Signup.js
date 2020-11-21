import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { signup } from '../actions/auth';
import axios from "axios";
import {SIGNUP_SUCCESS} from "../actions/types";

const Signup = ({ signup, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        re_password: ''
    });

    const [accountCreated, setAccountCreated] = useState(false);

    const { name, email, password, re_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        if (password === re_password) {
            signup({ name, email, password, re_password });
            setAccountCreated(true);
        }
    };

    const onSave = () => {
        const body = { name, email, password, re_password };

        if (password === re_password) {
            axios
                .post("http://localhost:8000/auth/users/", body)
                .then(res => {
                    setAccountCreated(true);
                });
        }
    };


    const onConfirm = () => {
        const body = {
            uid: "MQ",
            token: "acvqed-9941b1c49f70bad04d6c3e5583c5f2f1"
             };

        axios
            .post("http://localhost:8000/auth/users/activation/", body)
            .then(res => {
                setAccountCreated(true);
            });

    };



    if (isAuthenticated)
        return <Redirect to='/' />;
    if (accountCreated)
        return <Redirect to='login' />;
    
    return (
        <div className='container mt-5'>
            <h1>Sign Up</h1>
            <p>Create your Account</p>
            <form onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <input 
                        className='form-control'
                        type='text'
                        placeholder='Name*'
                        name='name'
                        value={name}
                        onChange={e => onChange(e)}
                        required 
                    />
                </div>
                <div className='form-group'>
                    <input 
                        className='form-control'
                        type='email'
                        placeholder='Email*'
                        name='email'
                        value={email}
                        onChange={e => onChange(e)}
                        required 
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Password*'
                        name='password'
                        value={password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        className='form-control'
                        type='password'
                        placeholder='Confirm Password*'
                        name='re_password'
                        value={re_password}
                        onChange={e => onChange(e)}
                        minLength='6'
                        required
                    />
                </div>
                <button className='btn btn-primary' type='submit' onClick={() => onSave()}>Register</button>
                <button className='btn btn-primary' type='submit' onClick={() => onConfirm()}>Confirm</button>
            </form>
            <p className='mt-3'>
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </div>
    );

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { signup })(Signup);
