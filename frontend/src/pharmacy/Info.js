import {CCard, CCardBody, CCol, CImg, CJumbotron, CRow} from "@coreui/react";
import logo from "../assets/pharmacy_logo.png";
import React from "react";

const Info = () => {

    return (
        <CCard>
            <CCardBody>
                <CRow>
                    <CCol md="4">
                        <CImg src={logo} className="mw-100" fluid/>
                    </CCol>
                    <CCol md="8">
                        <CJumbotron className="border">
                            <h3 className="display-5">Welcome to Pharmacy System</h3>
                            <h6 className="display-6">This is an internal system for Pharmacy</h6>
                            <hr className="my-2"/>
                            <p>If you have any questions or problems please write to <b>pharmacy@gmail.com</b> or phone <b>605755850</b></p>
                            <p>Collecting orders is possible during opening hours: <b>Monday-Friday 7:00-22:00, Saturday 8:00-20:00, Sunday closed</b></p>
                            <p>Pharmacy address: <b>15 Queensway London EC51 4ZC</b></p>
                        </CJumbotron>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    );

};

export default Info;