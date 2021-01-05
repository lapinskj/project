import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify } from '../actions/auth';
import {CButton, CCard, CCardBody, CCardHeader, CImg, CRow, CCol} from "@coreui/react";

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
            <CCard>
                <CCardBody>
                    <CRow className="justify-content-center">
                        <h2>To finish registration you need to verify your Account</h2>
                    </CRow>
                    <CRow className="justify-content-center">
                        <p>Please click the button below</p>
                    </CRow>
                    <CRow className="justify-content-center">
                        <CButton type="button" onClick={verify_account} color="primary">Verify</CButton>
                    </CRow>
                </CCardBody>
            </CCard>
        </>
    );
};

export default connect(null, { verify })(Activate);
