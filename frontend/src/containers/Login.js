import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow
} from '@coreui/react'
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        login(email, password);
    };

    if (isAuthenticated)
        return <Redirect to='/' />;
    
    return (
        <>
            <CRow className="justify-content-center">
                <CCol md="8">
                    <CCardGroup>
                        <CCard className="p-4">
                            <CCardBody>
                                <CForm onSubmit={e => onSubmit(e)}>
                                    <h1>Login</h1>
                                    <p className="text-muted">Sign In to your account</p>
                                    <CInputGroup className="mb-3">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <MailIcon className="c-icon"/>
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <CInput
                                            autoComplete="email"
                                            className='form-control'
                                            type='email'
                                            placeholder='Email'
                                            name='email'
                                            value={email}
                                            onChange={e => onChange(e)}
                                            required
                                        />
                                    </CInputGroup>
                                    <CInputGroup className="mb-4">
                                        <CInputGroupPrepend>
                                            <CInputGroupText>
                                                <LockIcon className="c-icon"/>
                                            </CInputGroupText>
                                        </CInputGroupPrepend>
                                        <CInput
                                            autoComplete="current-password"
                                            className='form-control'
                                            type='password'
                                            placeholder='Password'
                                            name='password'
                                            value={password}
                                            onChange={e => onChange(e)}
                                            required
                                        />
                                    </CInputGroup>
                                    <CRow>
                                        <CCol xs="6">
                                            <CButton type="submit" color="primary" className="px-4">Login</CButton>
                                        </CCol>
                                        <CCol xs="6" className="text-right">
                                            <Link to='/reset_password'>
                                                <CButton color="link" className="px-0">Forgot password?</CButton>
                                            </Link>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                        <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                            <CCardBody className="text-center">
                                <Link to="/signup">
                                    <h1 style={{ color: 'white' }}>Sign up</h1>
                                </Link>
                                <h6 className="m-4">If you don't have an account you can sign up to Pharmacy Platform</h6>
                            </CCardBody>
                        </CCard>
                    </CCardGroup>
                </CCol>
            </CRow>
        </>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
