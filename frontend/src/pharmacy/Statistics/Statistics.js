import React, { Component } from "react";
import axios from "axios";
import {
    CRow,
    CCol,
    CWidgetIcon,
    CCard,
    CCardBody,
    CCardHeader
} from '@coreui/react'
import CIcon from "@coreui/icons-react";
import returnConfig from "../returnConfig";

class Statistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ordersNumber: '',
            customersNumber: '',
            medicinesNumber: '',
            revenue: null
        };
    }

    componentDidMount() {
        this.getOrdersNumber();
        this.getCustomersNumber();
        this.getRevenue();
        this.getMedicinesNumber();
    }

    getOrdersNumber = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/medicineOrders/countOrders/", config)
            .then(res => {this.setState({ ordersNumber: res.data['count'] })})
            .catch(err => console.log(err));
    };

    getRevenue = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/medicineOrders/countRevenue/", config)
            .then(res => {this.setState({ revenue: res.data['revenue'] })})
            .catch(err => console.log(err));
    };

    getCustomersNumber = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/customers/countCustomers/", config)
            .then(res => {this.setState({ customersNumber: res.data['count'] })})
            .catch(err => console.log(err));
    };

    getMedicinesNumber = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/medicines/countMedicines/", config)
            .then(res => {this.setState({ medicinesNumber: res.data['count'] })})
            .catch(err => console.log(err));
    };


    render() {
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h4>Statistics</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol xs="12" sm="6" lg="3">
                                <CWidgetIcon text="liczba klientów" header={this.state.customersNumber} color="primary" iconPadding={false}>
                                    <CIcon width={24} name="cil-people"/>
                                </CWidgetIcon>
                            </CCol>
                            <CCol xs="12" sm="6" lg="3">
                                <CWidgetIcon text="liczba zamówień" header={this.state.ordersNumber} color="info" iconPadding={false}>
                                    <CIcon width={24} name="cil-basket"/>
                                </CWidgetIcon>
                            </CCol>
                            <CCol xs="12" sm="6" lg="3">
                                <CWidgetIcon text="całkowita wartość zamówień" header={this.state.revenue} color="warning" iconPadding={false}>
                                    <CIcon width={24} name="cil-dollar"/>
                                </CWidgetIcon>
                            </CCol>
                            <CCol xs="12" sm="6" lg="3">
                                <CWidgetIcon text="Liczba produktów w sprzedaży" header={this.state.medicinesNumber} color="danger" iconPadding={false}>
                                    <CIcon width={24} name="cil-medical-cross"/>
                                </CWidgetIcon>

                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </>
        );
    }

}

export default Statistics;
