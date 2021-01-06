import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signup } from '../actions/auth';
import {
    CButton,
    CCard,
    CCardBody,
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
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

const Signup = ({ signup, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        pesel: null,
        email: '',
        phone_number: null,
        password: '',
        re_password: ''
    });

    const [accountCreated, setAccountCreated] = useState(false);

    const { name, surname, pesel, email,  phone_number, password, re_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        if (password === re_password) {
            signup({ name, surname, pesel, email,  phone_number, password, re_password });
            setAccountCreated(true);
        }
    };

    if (isAuthenticated)
        return <Redirect to='/' />;
    if (accountCreated)
        return <Redirect to='login' />;
    
    return (
        <>
            <CRow className="justify-content-center">
                <CCol md="9" lg="7" xl="6">
                    <CCard className="mx-4">
                        <CCardBody className="p-4">
                            <CForm onSubmit={e => onSubmit(e)}>
                                <h1>Sign up</h1>
                                <p className="text-muted">Create your account</p>
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
                                <CInputGroup className="mb-3">
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <PersonIcon className="c-icon"/>
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput
                                        className='form-control'
                                        type='text'
                                        placeholder='Name'
                                        name='name'
                                        value={name}
                                        onChange={e => onChange(e)}
                                        pattern="[A-Z]{1}[a-z]{1,20}"
                                        title="First letter must be uppercase, 20 maximum characters"
                                        required
                                    />
                                </CInputGroup>
                                <CInputGroup className="mb-3">
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <PersonIcon className="c-icon"/>
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput
                                        className='form-control'
                                        type='text'
                                        placeholder='Surname'
                                        name='surname'
                                        value={surname}
                                        onChange={e => onChange(e)}
                                        pattern="[A-Z]{1}[a-z]{1,40}"
                                        title="First letter must be uppercase, 40 maximum characters"
                                        required
                                    />
                                </CInputGroup>
                                <CInputGroup className="mb-3">
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <PermIdentityIcon className="c-icon"/>
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput
                                        className='form-control'
                                        type='number'
                                        placeholder='Pesel'
                                        min='10000000000'
                                        max='99999999999'
                                        step="1"
                                        name='pesel'
                                        value={pesel}
                                        onChange={e => onChange(e)}
                                        required
                                    />
                                </CInputGroup>
                                <CInputGroup className="mb-3">
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <PhoneIcon className="c-icon"/>
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput
                                        className='form-control'
                                        type='tel'
                                        placeholder='Phone number'
                                        name='phone_number'
                                        value={phone_number}
                                        onChange={e => onChange(e)}
                                        pattern="^[+][0-9]{2}[0-9]{3}[0-9]{3}[0-9]{3}"
                                        title="Phone number must be in pattern '+48500500500'"
                                        required
                                    />
                                </CInputGroup>
                                <CInputGroup className="mb-3">
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <LockIcon className="c-icon"/>
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput
                                        autoComplete="new-password"
                                        className='form-control'
                                        type='password'
                                        placeholder='Password'
                                        name='password'
                                        value={password}
                                        onChange={e => onChange(e)}
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Password must have at least one number and one uppercase and lowercase letter, and be 8 or more characters long"
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
                                        autoComplete="new-password"
                                        type="password"
                                        placeholder="Confirm password"
                                        className='form-control'
                                        name='re_password'
                                        value={re_password}
                                        onChange={e => onChange(e)}
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Password must have at least one number and one uppercase and lowercase letter, and be 8 or more characters long"
                                        required
                                    />
                                </CInputGroup>
                                <CButton type='submit' value="Register" color="primary" block>Create Account</CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { signup })(Signup);
