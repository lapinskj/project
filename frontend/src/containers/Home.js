import React from 'react';
import {connect} from "react-redux";
import {CImg, CJumbotron, CCard, CCardBody, CRow, CCol} from "@coreui/react";
import logo from "../assets/pharmacy_logo.png"

const home = ({ user }) => {
    if (user!==null){
        return (
            <CCard>
                <CCardBody>
                    <CRow>
                        <CCol md="4">
                            <CImg src={logo} className="mw-100" fluid/>
                        </CCol>
                        <CCol md="8">
                            <CJumbotron className="border">
                                <h3 className="display-3">Welcome back to Pharmacy System</h3>
                                <hr className="my-2" />
                                <p className="lead">You are logged in as {user.name} {user.surname}</p>
                            </CJumbotron>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        );
    } else {
        return (
            <CCard>
                <CCardBody>
                    <CRow>
                        <CCol md="4">
                            <CImg src={logo} className="mw-100" fluid/>
                        </CCol>
                        <CCol md="8">
                            <CJumbotron className="border">
                                <h3 className="display-3">Welcome to Pharmacy System</h3>
                                <hr className="my-2" />
                                <p className="lead">Please log in or sign up</p>
                            </CJumbotron>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        )
    }
};

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(home);