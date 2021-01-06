import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { reset_password_confirm } from '../actions/auth';
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
} from "@coreui/react";
import LockIcon from '@material-ui/icons/Lock';

const ResetPasswordConfirm = (props) => {
    const [requestSent, setRequestSent] = useState(false);

    const [formData, setFormData] = useState({
        new_password: '',
        re_new_password: ''
    });

    const { new_password, re_new_password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        
        const uid = props.match.params.uid;
        const token = props.match.params.token;

        props.reset_password_confirm(uid, token, new_password, re_new_password);
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
                                <p className="text-muted">Please enter your new password</p>
                                <CInputGroup className="mb-3">
                                    <CInputGroupPrepend>
                                        <CInputGroupText>
                                            <LockIcon className="c-icon"/>
                                        </CInputGroupText>
                                    </CInputGroupPrepend>
                                    <CInput
                                        className='form-control'
                                        type='password'
                                        placeholder='New password'
                                        name='new_password'
                                        value={new_password}
                                        onChange={e => onChange(e)}
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Password must have at least one number and one uppercase and lowercase letter, and be 8 or more characters long"
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
                                        className='form-control'
                                        type='password'
                                        placeholder='Repeat new password'
                                        name='re_new_password'
                                        value={re_new_password}
                                        onChange={e => onChange(e)}
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Password must have at least one number and one uppercase and lowercase letter, and be 8 or more characters long"
                                        required
                                    />
                                </CInputGroup>
                                <p className="text-muted">Log in after redirecting to home page</p>
                                <CButton type='submit' color="primary" block>Reset</CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};

export default connect(null, { reset_password_confirm })(ResetPasswordConfirm);
