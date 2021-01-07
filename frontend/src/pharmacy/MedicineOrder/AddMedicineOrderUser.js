import React, { Component } from "react";
import axios from "axios";
import {
    CButton, CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
    CSelect,
    CCol,
    CInputGroup,
    CInputGroupPrepend,
    CListGroup,
    CListGroupItem,
    CRow, CImg
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {Redirect} from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import returnConfig from "../returnConfig";


class AddMedicineOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            customer: {
                id: null,
                name: "",
                surname: "",
                pesel: null,
                age: null
            },
            medicineSearchValues: [],
            orderItems: [{}],
            customerSearchValue: {},
            activeCustomer: null,
            customersList: [],
            medicinesList: [[]]
        };
        this.onOrderItemChange = this.onOrderItemChange.bind(this);
    };

    componentDidMount() {
        this.getCustomer();
    }

    getCustomer = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/customers/", config)
            .then(res => {
                this.setState({activeCustomer: res.data[0].id});
                console.log(this.state.activeCustomer)
            })
            .catch(err => console.log(err));

    };

    onMedicineSearchSubmit = (e) => {
        let id = e.target.id.slice(6);
        let medicineSearchValue = this.state.medicineSearchValues[id];
        let medicineSearchObject = {name: medicineSearchValue};
        const config = {
            medicineSearchObject,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        if (medicineSearchObject) {
            axios
                .get(`http://localhost:8000/medicines/?name=${medicineSearchObject["name"]}`, config)
                .then(res => {
                    let medicinesList = [...this.state.medicinesList];
                    medicinesList[id] = res.data;
                    this.setState({medicinesList});
                    let orderItems = [...this.state.orderItems];
                    orderItems[id].medicine = res.data[0].id;
                    console.log(orderItems)
                    this.setState({orderItems});
                })
                .catch(err => console.log(err));
        }
    };

    renderMedicines = (id) => {
        const medicinesList = this.state.medicinesList[id];
        if (medicinesList) {
            return medicinesList.map(medicineItem => (
                <option value={medicineItem.id}>
                    {medicineItem.name}, {medicineItem.brand}, {medicineItem.dose}, {medicineItem.capacity}, {medicineItem.price} PLN, ilość: {medicineItem.quantity}
                </option>
            ));
        }
    };

    renderMedicine = (idx) => {
        let orderItem = this.state.orderItems[idx];
        let medicinesList = this.state.medicinesList;
        let medicines = medicinesList[idx].filter(med => {
                return med.id == orderItem.medicine}
            );
        let medicine = medicines[0];
        return(
            <CRow id={idx}>
                <CCol lg="2" className="py-3">
                    <CImg src={medicine.image} height={70}/>
                </CCol>
                <CCol lg="2" className="py-3">
                    <p>{medicine.name}</p>
                </CCol>
                <CCol lg="2" className="py-3">
                    <p>{medicine.brand}</p>
                </CCol>
                <CCol lg="2" className="py-3">
                    <p>{medicine.dose}</p>
                </CCol>
                <CCol lg="2" className="py-3">
                    <p>{medicine.capacity}</p>
                </CCol>
                <CCol lg="1" className="py-3">
                    <p>{medicine.price}</p>
                </CCol>
                <CCol lg="1" className="py-3">
                    <p>{medicine.quantity}</p>
                </CCol>
            </CRow>
        )
    };

    addOrderItem = (e) => {
        this.setState((prevState) => ({
            orderItems: [...prevState.orderItems, {medicine: "", amount: null}],
        }));
    };

    onMedicineOrderSubmit = (e) => {
        e.preventDefault();
        let {activeCustomer, orderItems} = this.state;
        let newOrder = {customer: activeCustomer, medicineOrderItems: orderItems};
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .post("http://localhost:8000/medicineOrders/", newOrder, config)
            .then(() => this.setState({ redirect: true }))
            .catch(err => console.log(err));
    };

    onOrderItemChange = (e) => {
        let orderItems = [...this.state.orderItems];
        let item = {...orderItems[e.target.dataset.id]};
        item[e.target.name]= e.target.value;
        orderItems[e.target.dataset.id] = item;
        console.log(orderItems)
        this.setState( {orderItems});
    };

    onMedicineSearchChange = (e) => {
        let medicineSearchValues = [...this.state.medicineSearchValues];
        medicineSearchValues[e.target.dataset.id] = e.target.value;
        this.setState( {medicineSearchValues});
    };

    render () {
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to='/medicineOrders'/>;
        }
        let orderItems = this.state.orderItems;
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h3>Create new order</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={this.onMedicineOrderSubmit} id="newOrderForm">
                            <CRow>
                                <CCol md="12" className="d-flex w-100 mb-3 justify-content-between">
                                    <CLabel col="lg">Order items</CLabel>
                                    <CButton type="button" color="secondary" onClick={this.addOrderItem}>
                                        <CIcon name="cil-plus"/> Add another medicine
                                    </CButton>
                                </CCol>
                            </CRow>
                            <CListGroup>
                                {
                                    orderItems.map( (val, idx) => {
                                        let buttonId = `button${idx}`, medicineSearchId = `medicineSearch${idx}`, medicineId = `medicine${idx}`, amountId = `amount${idx}`;
                                        return (
                                            <CListGroupItem key={idx}>
                                                <CFormGroup row>
                                                    <CLabel htmlFor="pesel" col="lg">Medicine</CLabel>
                                                    <CCol md="12">
                                                        <CInputGroup>
                                                            <CInputGroupPrepend>
                                                                <CButton type="button" color="primary" id={buttonId}
                                                                         onClick={this.onMedicineSearchSubmit}>
                                                                    <SearchIcon/> Search
                                                                </CButton>
                                                            </CInputGroupPrepend>
                                                            <CInput
                                                                size="lg"
                                                                id={medicineSearchId}
                                                                type="text"
                                                                name="medicineSearch"
                                                                data-id={idx}
                                                                value={this.state.medicineSearchValues[idx]}
                                                                onChange={this.onMedicineSearchChange}
                                                                placeholder="Enter medicine name"
                                                            />
                                                            <CSelect
                                                                size="lg"
                                                                id={medicineId}
                                                                type="select"
                                                                name="medicine"
                                                                data-id={idx}
                                                                value={orderItems[idx].medicine}
                                                                onChange={this.onOrderItemChange}
                                                                required
                                                            >
                                                                {this.renderMedicines(idx)}
                                                            </CSelect>
                                                        </CInputGroup>
                                                    </CCol>
                                                </CFormGroup>
                                                <CFormGroup row>
                                                    <CLabel htmlFor={amountId} col="lg">Amount</CLabel>
                                                    <CCol md="12">
                                                        <CInput
                                                            size="lg"
                                                            id={amountId}
                                                            type="number"
                                                            name="amount"
                                                            data-id={idx}
                                                            value={orderItems[idx].amount}
                                                            onChange={this.onOrderItemChange}
                                                            placeholder="Enter medicine amount"
                                                            min="1"
                                                            max="50"
                                                            step="1"
                                                            required
                                                        />
                                                    </CCol>
                                                </CFormGroup>

                                                {orderItems[idx].medicine ?
                                                    (this.renderMedicine(idx))  : null}

                                            </CListGroupItem>)
                                    })
                                }
                            </CListGroup>
                        </CForm>
                    </CCardBody>
                    <CCardFooter>
                        <CButton type="submit" size="lg" color="primary" form="newOrderForm">Submit</CButton>
                    </CCardFooter>
                </CCard>
            </>
        );
    }

}

export default AddMedicineOrder;