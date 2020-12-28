import React, { Component } from "react";
import axios from "axios";
import {
    CRow,
    CCol,
    CWidgetIcon
} from '@coreui/react'
import CIcon from "@coreui/icons-react";

class Statistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ordersNumber: '',
            customersNumber: '',
            medicinesNumber: ''
        };
    }

    componentDidMount() {
        this.getOrdersNumber();
        this.getCustomersNumber();
        this.getMedicinesNumber();
    }

    getOrdersNumber = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .get("http://localhost:8000/medicineOrders/countOrders/", config)
            .then(res => {this.setState({ ordersNumber: res.data['count'] })})
            .catch(err => console.log(err));
    };

    getCustomersNumber = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .get("http://localhost:8000/customers/countCustomers/", config)
            .then(res => {this.setState({ customersNumber: res.data['count'] })})
            .catch(err => console.log(err));
    };

    getMedicinesNumber = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .get("http://localhost:8000/medicines/countMedicines/", config)
            .then(res => {this.setState({ medicinesNumber: res.data['count'] })})
            .catch(err => console.log(err));
    };


    render() {
        return (
            <main className="content">
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
                        <CWidgetIcon text="całkowita wartość zamówień" header="$1.999,50" color="warning" iconPadding={false}>
                            <CIcon width={24} name="cil-dollar"/>
                        </CWidgetIcon>
                    </CCol>
                    <CCol xs="12" sm="6" lg="3">
                        <CWidgetIcon text="Liczba produktów w sprzedaży" header={this.state.medicinesNumber} color="danger" iconPadding={false}>
                            <CIcon width={24} name="cil-medical-cross"/>
                        </CWidgetIcon>

                    </CCol>
                </CRow>
            </main>
        );
    }

}

export default Statistics;
