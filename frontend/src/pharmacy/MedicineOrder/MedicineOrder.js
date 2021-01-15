import React, { Component } from "react";
import axios from "axios";
import { connect } from 'react-redux';
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CImg,
    CRow,
    CCol,
    CFormGroup, CLabel, CInputGroup, CInputGroupPrepend, CInput,
    CSelect, CForm, CCardFooter, CListGroupItem, CTextarea
} from "@coreui/react";
import returnConfig from "../returnConfig";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";

class MedicineOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            medicineOrder: null,
            updateChoices: {},
            activeItem: {},
            medicineSearchValue: "",
            medicinesList: [],
            activeMedicine: null,
            orderItem: {},
            note: ""
        };
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleStatusUpdate = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    handleStatusSubmit = item => {
        this.toggle();
        const config = returnConfig();
        axios
            .put(`http://localhost:8000/medicineOrders/${item.id}/updateStatus/`, item, config)
            .then(res => this.getMedicineOrder());
    };

    handleDelete = item => {
        const config = {
            item,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .delete(`http://localhost:8000/medicineOrderItem/${item.id}`, config)
            .then(res => this.getMedicineOrder());
    };

    handleNoteDelete = item => {
        const config = returnConfig();
        axios
            .delete(`http://localhost:8000/orderNotes/${item.id}`, config)
            .then(res => this.getMedicineOrder());
    };

    onMedicineSearchChange = e => {
        let { name, value } = e.target;
        const medicineSearchValue = { [name]: value };
        this.setState({ medicineSearchValue });
    };


    onMedicineSearchSubmit = () => {
        let medicineSearchValue = this.state.medicineSearchValue;
        const config = {
            medicineSearchValue,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        if (medicineSearchValue) {
            axios
                .get(`http://localhost:8000/medicines/?name=${medicineSearchValue['name']}`, config)
                .then(res => {
                    this.setState({medicinesList: res.data});
                    let orderItem = this.state.orderItem;
                    orderItem.medicine = res.data[0].id;
                    this.setState({orderItem});
                })
                .catch(err => console.log(err));
        }
    };

    getMedicineOrder () {
        let id = this.props.match.params.id;
        const config = returnConfig();
        axios
            .get(`http://localhost:8000/medicineOrders/${id}/`, config)
            .then(res => this.setState({medicineOrder: res.data}))
            .catch(err => console.log(err));
    }

    onOrderItemChange = e => {
        let { name, value } = e.target;
        const orderItem = { ...this.state.orderItem, [name]: value };
        this.setState({ orderItem });
    };

    onNoteChange = e => {
        let { value } = e.target;
        const note = value;
        this.setState({ note });
    };

    renderMedicines = () => {
        const medicinesList = this.state.medicinesList;
        return medicinesList.map(medicine => (
            <option value={medicine.id}>
                {medicine.name}, {medicine.brand}, {medicine.dose}, {medicine.capacity}, {medicine.price} PLN, ilość: {medicine.quantity}
            </option>
        ));
    };

    onNoteAdd = (e) => {
        e.preventDefault();
        let {note, medicineOrder} = this.state;
        let author = "Pharmacist";
        let noteItem = {'content': note, 'order': medicineOrder.id, 'author': author};
        const config = returnConfig();
        axios
            .post("http://localhost:8000/orderNotes/", noteItem, config)
            .then(res => {
                this.getMedicineOrder();
            })
            .catch(err => console.log(err));
    };

    onMedicineOrderItemSave = (e) => {
        e.preventDefault();
        let {orderItem, medicineOrder} = this.state;
        let newOrderItem = {medicineOrder: medicineOrder.id, medicine: orderItem.medicine, amount: orderItem.amount};
        const config = returnConfig();
        axios
            .post("http://localhost:8000/medicineOrderItem/", newOrderItem, config)
            .then(res => {
                this.getMedicineOrder();
            })
            .catch(err => console.log(err));
    };

    componentDidMount() {
        this.getMedicineOrder();
        const config = returnConfig();
        axios
            .options("http://localhost:8000/medicineOrders/", config)
            .then(res => this.setState({updateChoices: res.data.actions['POST']['orderStatus'].choices}));
    }

    renderOrder = () => {
        const medicineOrder = this.state.medicineOrder;
        let orderItem = this.state.orderItem;
        let orderDetails = orderItem;
        delete orderDetails.medicineOrderItems;
        delete orderDetails.customer;
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <CRow>
                            <CCol lg="10" className="py-3">
                                <h3>Order nr {medicineOrder.id}</h3>
                            </CCol>
                            <CCol lg="2" className="py-3">
                                <CButton color="secondary" onClick={() => this.handleStatusUpdate(medicineOrder)} className="btn-brand mr-1 mb-1">
                                    Update status
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <table className="table table-striped table-hover">
                            <tbody>
                                <tr>
                                    <td>Data</td>
                                    <td>{medicineOrder.created}</td>
                                </tr>
                                <tr>
                                    <td>Klient</td>
                                    <td>{medicineOrder.customer.pesel} {medicineOrder.customer.name} {medicineOrder.customer.surname}</td>
                                </tr>
                                <tr>
                                    <td>Kwota</td>
                                    <td>{medicineOrder.total_price}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>{medicineOrder.orderStatus}</td>
                                </tr>
                            </tbody>
                        </table>
                        <CRow>
                            <CCol lg="1" className="py-3">
                            </CCol>
                            <CCol lg="2" className="py-3">
                                <p className="text-muted">Name</p>
                            </CCol>
                            <CCol lg="1" className="py-3">
                                <p className="text-muted">Brand</p>
                            </CCol>
                            <CCol lg="2" className="py-3">
                                <p className="text-muted">Dose</p>
                            </CCol>
                            <CCol lg="2" className="py-3">
                                <p className="text-muted">Capacity</p>
                            </CCol>
                            <CCol lg="1" className="py-3">
                                <p className="text-muted">Price</p>
                            </CCol>
                            <CCol lg="1" className="py-3">
                                <p className="text-muted">Amount</p>
                            </CCol>
                            <CCol lg="1" className="py-3">
                                <p className="text-muted">Total</p>
                            </CCol>
                            <CCol lg="1" className="py-3">
                                <p className="text-muted">Delete</p>
                            </CCol>
                        </CRow>
                        { medicineOrder.medicineOrderItems.map(orderitem => (
                            <CRow key={orderitem.id}>
                                <CCol lg="1" className="py-3">
                                    <CImg src={orderitem.medicine.image} height={70}/>
                                </CCol>
                                <CCol lg="2" className="py-3">
                                    <p>{orderitem.medicine.name}</p>
                                </CCol>
                                <CCol lg="1" className="py-3">
                                    <p>{orderitem.medicine.brand}</p>
                                </CCol>
                                <CCol lg="2" className="py-3">
                                    <p>{orderitem.medicine.dose}</p>
                                </CCol>
                                <CCol lg="2" className="py-3">
                                    <p>{orderitem.medicine.capacity}</p>
                                </CCol>
                                <CCol lg="1" className="py-3">
                                    <p>{orderitem.medicine.price}</p>
                                </CCol>
                                <CCol lg="1" className="py-3">
                                    <p>{orderitem.amount}</p>
                                </CCol>
                                <CCol lg="1" className="py-3">
                                    <p>{orderitem.amount * orderitem.medicine.price}</p>
                                </CCol>
                                <CCol lg="1" className="py-3">
                                    <CButton color="danger" onClick={() => this.handleDelete(orderitem)} className="btn-brand mr-1 mb-1">
                                        <DeleteIcon/>
                                    </CButton>
                                </CCol>
                            </CRow>
                        ))}
                    </CCardBody>
                </CCard>

                <CCard>
                    <CCardHeader>
                        <h4>Order notes</h4>
                    </CCardHeader>
                    <CCardBody>
                        {
                            medicineOrder.notes ?
                                (
                                    medicineOrder.notes.map(item => (
                                        <CListGroupItem key={item.id} action>
                                            <h5 className="d-flex w-100 justify-content-between">
                                                <div>
                                                    {item.author} wrote:
                                                </div>
                                                <div>
                                                    <small>{item.created_at}</small>
                                                    <CButton onClick={() => this.handleNoteDelete(item)} className="btn btn-danger ml-3">
                                                        <DeleteIcon/>
                                                    </CButton>
                                                </div>
                                            </h5>
                                            <p className="pl-2" >{item.content}</p>
                                        </CListGroupItem>
                                    ))
                                ) : null
                        }
                        <CForm id="addNote" onSubmit={e => this.onNoteAdd(e)}>
                            <CFormGroup>
                                <CLabel htmlFor="note" col="lg">Add note</CLabel>
                                <CTextarea
                                    name="note"
                                    id="note"
                                    rows="4"
                                    placeholder="Type your note..."
                                    value={this.state.note}
                                    onChange={this.onNoteChange}
                                    required
                                />
                            </CFormGroup>
                            <CButton form="addNote" type="submit" size="lg" color="primary">Add</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>

                <CCard>
                    <CCardHeader>
                        <h4>Add new order item</h4>
                    </CCardHeader>
                    <CCardBody>
                        <CForm id="newOrderItemForm" onSubmit={this.onMedicineOrderItemSave}>
                            <CFormGroup row>
                                <CLabel htmlFor="pesel" col="lg">Medicine</CLabel>
                                <CCol md="12">
                                    <CInputGroup>
                                        <CInputGroupPrepend>
                                            <CButton type="button" color="primary" onClick={this.onMedicineSearchSubmit}>
                                                <SearchIcon/> Search
                                            </CButton>
                                        </CInputGroupPrepend>
                                        <CInput
                                            size="lg"
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={this.state.medicineSearchValue.name}
                                            onChange={this.onMedicineSearchChange}
                                            placeholder="Enter medicine name"
                                        />
                                        <CSelect
                                            className="col-sm-8"
                                            size="lg"
                                            name="medicine"
                                            value={orderItem.medicine}
                                            onChange={this.onOrderItemChange}
                                            required
                                        >
                                            {this.renderMedicines()}
                                        </CSelect>
                                    </CInputGroup>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel htmlFor="amount" col="lg">Amount</CLabel>
                                <CCol md="12">
                                    <CInput
                                        size="lg"
                                        id="amount"
                                        type="number"
                                        name="amount"
                                        value={orderItem.amount}
                                        onChange={this.onOrderItemChange}
                                        placeholder="Enter medicine amount"
                                        min="1"
                                        max="50"
                                        step="1"
                                        required
                                    />
                                </CCol>
                            </CFormGroup>
                        </CForm>
                    </CCardBody>
                    <CCardFooter>
                        <CButton type="submit" form="newOrderItemForm" size="lg" color="primary">Submit</CButton>
                    </CCardFooter>
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
    };

    render () {
        return (
            <>
                { this.state.medicineOrder ?
                    this.renderOrder()
                    : null
                }
            </>
        );
    }

}

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(MedicineOrder);