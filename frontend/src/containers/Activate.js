import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify } from '../actions/auth';
import {
    CButton,
    CCard,
    CCardBody,
    CRow,
    CCol,
} from "@coreui/react";

const Activate = (props) => {
    const [verified, setVerified] = useState(false);

    const verify_account = e => {
        const uid = props.match.params.uid;
        const token = props.match.params.token;

        props.verify(uid, token);
        setVerified(true);
    };

    if (verified)
        return <Redirect to='/' />
    return (
        <>
            <CRow className="justify-content-center">
                <CCol md="8" lg="6" xl="5">
                    <CCard className="mx-4">
                        <CCardBody className="p-4">
                            <h2>Verify your account</h2>
                            <h6>To finish the registration you need to verify your account</h6>
                            <p className="text-muted">Please click the button below</p>
                            <CButton type="button" onClick={verify_account} color="primary" block>Verify</CButton>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
};

export default connect(null, { verify })(Activate);
