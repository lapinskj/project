import React, { Component } from "react";
import axios from "axios";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import {Link} from "react-router-dom";
import {CBadge, CButton, CCard, CCardBody, CCardHeader, CDataTable, CCollapse, CImg, CRow, CCol} from "@coreui/react";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import medicine_orders_fields from "../FormFields/medicineOrders";
import returnConfig from "../returnConfig";



class MedicineOrders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            medicineOrdersList: [],
            updateChoices: {},
            activeItem: {},
            details: []
        };
    }
    componentDidMount() {
        this.refreshOrdersList();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .options("http://localhost:8000/medicineOrders/", config)
            .then(res => this.setState({updateChoices: res.data.actions['POST']['orderStatus'].choices}));
    }
    refreshOrdersList = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .get("http://localhost:8000/medicineOrders/", config)
            .then(res => {
                    this.setState({ medicineOrdersList: res.data });
                }
            ).catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    getBadge = (status)=>{
        switch (status) {
            case 'Rozpoczęte': return 'danger';
            case 'W trakcie realizacji': return 'warning';
            case 'Gotowe do odbioru': return 'info';
            case 'Zakończone': return 'success';
            default: return 'primary'
        }
    };

    toggleDetails = (index) => {
        const details = this.state.details;
        const position = details.indexOf(index);
        let newDetails = details.slice();
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...details, index]
        }
        this.setState({details: newDetails})
    };

    handleDelete = item => {
        const config = returnConfig();
        axios
            .delete(`http://localhost:8000/medicineOrders/${item.id}`, config)
            .then(res => this.refreshOrdersList());
    };

    handleStatusUpdate = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    handleStatusSubmit = (item, e)=> {
        e.preventDefault();
        this.toggle();
        const config = returnConfig();
        axios
            .put(`http://localhost:8000/medicineOrders/${item.id}/updateStatus/`, item, config)
            .then(res => this.refreshOrdersList());
    };


    render() {
        const medicineOrdersList = this.state.medicineOrdersList;
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h3>Medicine orders</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={medicineOrdersList}
                            fields={medicine_orders_fields}
                            itemsPerPage={10}
                            pagination
                            sorter
                            columnFilter
                            itemsPerPageSelect
                            scopedSlots = {{
                                'id':
                                    (item)=>(
                                        <td>
                                            <Link to={`/medicineOrder/${item.id}/` }>
                                                {item.id}
                                            </Link>
                                        </td>
                                    ),
                                'customer':
                                    (item)=>(
                                        <td>
                                            {item.customer.pesel} {item.customer.name} {item.customer.surname}
                                        </td>
                                    ),
                                'orderStatus':
                                    (item)=>(
                                        <td>
                                            <CBadge color={this.getBadge(item.orderStatus)}>
                                                {item.orderStatus}
                                            </CBadge>
                                        </td>
                                    ),
                                'update_status':
                                    (item)=>(
                                        <td>
                                            <CButton color="secondary" onClick={() => this.handleStatusUpdate(item)} className="btn-brand mr-1 mb-1">
                                                <ArrowUpwardIcon/>
                                            </CButton>
                                        </td>
                                    ),
                                'delete':
                                    (item)=>(
                                        <td>
                                            <CButton color="danger" onClick={() => this.handleDelete(item)} className="btn-brand mr-1 mb-1">
                                                <DeleteIcon/>
                                            </CButton>
                                        </td>
                                    ),
                                'show_details':
                                    (item, index)=>{
                                        return (
                                            <td>
                                                <CButton color="primary" onClick={()=>{this.toggleDetails(index)}} className="btn-brand mr-1 mb-1">
                                                    {this.state.details.includes(index) ? 'Hide' : 'Show'}
                                                </CButton>
                                            </td>
                                        )
                                    },
                                'details':
                                    (item, index)=> {
                                        return (
                                            <CCollapse show={this.state.details.includes(index)}>
                                                <CCardBody>
                                                    <h4>
                                                        Order items
                                                    </h4>
                                                    <CRow>
                                                        <CCol lg="1" className="py-3">
                                                        </CCol>
                                                        <CCol lg="2" className="py-3">
                                                            <p className="text-muted">
                                                                Name
                                                            </p>
                                                        </CCol>
                                                        <CCol lg="2" className="py-3">
                                                            <p className="text-muted">
                                                                Brand
                                                            </p>
                                                        </CCol>
                                                        <CCol lg="2" className="py-3">
                                                            <p className="text-muted">
                                                                Dose
                                                            </p>
                                                        </CCol>
                                                        <CCol lg="2" className="py-3">
                                                            <p className="text-muted">
                                                                Capacity
                                                            </p>
                                                        </CCol>
                                                        <CCol lg="1" className="py-3">
                                                            <p className="text-muted">
                                                                Price
                                                            </p>
                                                        </CCol>
                                                        <CCol lg="1" className="py-3">
                                                            <p className="text-muted">
                                                                Amount
                                                            </p>
                                                        </CCol>
                                                        <CCol lg="1" className="py-3">
                                                            <p className="text-muted">
                                                                Total
                                                            </p>
                                                        </CCol>
                                                    </CRow>
                                                    { item.medicineOrderItems.map(orderitem => (
                                                        <CRow key={orderitem.id}>
                                                            <CCol lg="1" className="py-3">
                                                                <CImg src={orderitem.medicine.image} height={70}/>
                                                            </CCol>
                                                            <CCol lg="2" className="py-3">
                                                                <p>
                                                                    {orderitem.medicine.name}
                                                                </p>
                                                            </CCol>
                                                            <CCol lg="2" className="py-3">
                                                                <p>
                                                                    {orderitem.medicine.brand}
                                                                </p>
                                                            </CCol>
                                                            <CCol lg="2" className="py-3">
                                                                <p>
                                                                    {orderitem.medicine.dose}
                                                                </p>
                                                            </CCol>
                                                            <CCol lg="2" className="py-3">
                                                                <p>
                                                                    {orderitem.medicine.capacity}
                                                                </p>
                                                            </CCol>
                                                            <CCol lg="1" className="py-3">
                                                                <p>
                                                                    {orderitem.medicine.price}
                                                                </p>
                                                            </CCol>
                                                            <CCol lg="1" className="py-3">
                                                                <p>
                                                                    {orderitem.amount}
                                                                </p>
                                                            </CCol>
                                                            <CCol lg="1" className="py-3">
                                                                <p>
                                                                    {orderitem.amount * orderitem.medicine.price}
                                                                </p>
                                                            </CCol>
                                                        </CRow>
                                                    ))}
                                                </CCardBody>
                                            </CCollapse>
                                        )
                                    }
                            }}
                        />
                    </CCardBody>
                </CCard>
                {this.state.modal ? (
                    <UpdateOrderStatusModal
                        activeItem={this.state.activeItem}
                        choices={this.state.updateChoices}
                        toggle={this.toggle}
                        onStatusSave={this.handleStatusSubmit}
                    />
                ) : null}
            </>
        );
    }

}

export default MedicineOrders;
