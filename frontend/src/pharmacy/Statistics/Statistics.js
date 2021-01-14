import React, { Component } from "react";
import axios from "axios";
import {
    CRow,
    CCol,
    CWidgetIcon,
    CCard,
    CCardBody,
    CCardHeader, CImg, CButton, CBadge, CDataTable
} from '@coreui/react'
import {
    CChartLine
} from '@coreui/react-chartjs'
import CIcon from "@coreui/icons-react";
import returnConfig from "../returnConfig";
import medicines_statistics_fields from "../TableFields/medicinesStatistics";

class Statistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ordersNumber: '',
            customersNumber: '',
            medicinesNumber: '',
            revenue: '',
            orderChartDays: null,
            orderChartNum: null,
            medicineStats: null
        };
    }

    componentDidMount() {
        this.getOrdersNumber();
        this.getCustomersNumber();
        this.getRevenue();
        this.getMedicinesNumber();
        this.getOrdersStatistics();
        this.getMedicinesStatistics()
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

    getMedicinesStatistics = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/medicines/medicineStatistics/", config)
            .then(res => {this.setState({ medicineStats: res.data })})
            .catch(err => console.log(err));
    };

    getOrdersStatistics = () => {
        const config = returnConfig();
        axios
            .get(`http://localhost:8000/medicineOrders/orderStatistics/`, config)
            .then(res => {
                let days = [];
                let numbers = [];
                res.data.map(item => {
                    days.push(item.day);
                    numbers.push(item.count);
                });
                this.setState({orderChartDays: days, orderChartNum: numbers});
            })
            .catch(err => console.log(err));
    };

    renderMedicineStatistic = () => {
        const medicineStats = this.state.medicineStats;
        return (
            <CDataTable
                items={medicineStats}
                fields={medicines_statistics_fields}
                itemsPerPage={5}
                pagination
                itemsPerPageSelect
                scopedSlots = {{
                    'image':
                        (item)=>(
                            <td>
                                <CImg src={'http://localhost:8000'.concat(item.medicine.image)} height={50}/>
                            </td>
                        ),
                    'medicine':
                        (item)=>(
                            <td>
                                {item.medicine.name}, {item.medicine.brand}, {item.medicine.dose}, {item.medicine.capacity}
                            </td>
                        ),
                    'category':
                        (item)=>(
                            <td>
                                <CBadge color="primary">
                                    {item.medicine.category.name}
                                </CBadge>
                            </td>
                        ),
                    'sold':
                        (item)=>(
                            <td>
                                {item.total_amount}
                            </td>
                        )
                }}
            />
        )
    }

    render() {
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h3>Statistics</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol xs="12" sm="6" lg="3">
                                <CWidgetIcon text="total customers" header={this.state.customersNumber} color="primary" iconPadding={false}>
                                    <CIcon width={24} name="cil-people"/>
                                </CWidgetIcon>
                            </CCol>
                            <CCol xs="12" sm="6" lg="3">
                                <CWidgetIcon text="finished orders in current month" header={this.state.ordersNumber} color="info" iconPadding={false}>
                                    <CIcon width={24} name="cil-basket"/>
                                </CWidgetIcon>
                            </CCol>
                            <CCol xs="12" sm="6" lg="3">
                                <CWidgetIcon text="total price of orders in current month" header={this.state.revenue} color="warning" iconPadding={false}>
                                    <CIcon width={24} name="cil-dollar"/>
                                </CWidgetIcon>
                            </CCol>
                            <CCol xs="12" sm="6" lg="3">
                                <CWidgetIcon text="products on sale" header={this.state.medicinesNumber} color="danger" iconPadding={false}>
                                    <CIcon width={24} name="cil-medical-cross"/>
                                </CWidgetIcon>

                            </CCol>
                        </CRow>
                        <CRow className="mt-2 p-2">
                            <CCol lg="7">
                                <h4 className="pb-1">Number of orders per day in current month</h4>
                                <CChartLine
                                    datasets={[
                                        {
                                            label: 'Number of orders',
                                            backgroundColor: 'rgb(228,102,81,0.9)',
                                            pointHoverBackgroundColor: 'rgba(69,29,25,0.9)',
                                            data: this.state.orderChartNum
                                        }
                                    ]}
                                    options={{
                                        tooltips: {
                                            enabled: true
                                        }
                                    }}
                                    labels={this.state.orderChartDays}
                                />
                            </CCol>
                            <CCol lg="5">
                                <h4>Top selling products</h4>
                                {this.state.medicineStats ? this.renderMedicineStatistic() : null}
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </>
        );
    }

}

export default Statistics;
