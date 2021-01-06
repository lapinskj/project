import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password } from '../actions/auth';
import {
    CButton,
    CCard,
    CCardBody,
    CCol,
    CForm,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText, CRow
} from "@coreui/react";
import MailIcon from "@material-ui/icons/Mail";

const ResetPassword = (props) => {
    const [requestSent, setRequestSent] = useState(false);

    const [formData, setFormData] = useState({
        email: ''
    });

    const { email } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        props.reset_password(email);
        setRequestSent(true);
    };

    if (requestSent)
        return <Redirect to='/' />
    return (
        <>
            <CRow className="justify-content-center">
                <CCol md="9" lg="7" xl="6">
                    <CCard className="mx-4">
                        <CCardBody className="p-4">
                            <CForm onSubmit={e => onSubmit(e)}>
                                <h1>Reset password</h1>
                                <p className="text-muted">Please enter your email</p>
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
                                <p className="text-muted">You will receive email with link to reset your password</p>
                                <CButton type='submit' color="primary" block>Reset</CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};

export default connect(null, { reset_password })(ResetPassword);
