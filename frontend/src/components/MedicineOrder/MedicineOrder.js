import React, { Component } from "react";
import axios from "axios";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import {Button, Input, Label} from "reactstrap";

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
            orderItem: { medicine: null, amount: null},
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
        axios
            .put(`/medicineOrders/${item.id}/updateStatus/`, item)
            .then(res => this.getMedicineOrder());
    };

    handleDelete = item => {
        axios
            .delete(`/medicineOrderItem/${item.id}`)
            .then(res => this.getMedicineOrder());
    };

    onMedicineSearchChange = e => {
        let { name, value } = e.target;
        const medicineSearchValue = { [name]: value };
        this.setState({ medicineSearchValue });
    };


    onMedicineSearchSubmit = () => {
        let medicineSearchValue = this.state.medicineSearchValue;
        if (medicineSearchValue) {
            axios
                .get(`/medicines/?name=${medicineSearchValue['name']}`, medicineSearchValue)
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
        axios
            .get(`/medicineOrders/${id}/`)
            .then(res => this.setState({medicineOrder: res.data}))
            .catch(err => console.log(err));
    }

    onOrderItemChange = e => {
        let { name, value } = e.target;
        const orderItem = { ...this.state.orderItem, [name]: value };
        this.setState({ orderItem });
    };

    renderMedicines = () => {
        const medicinesList = this.state.medicinesList;
        return medicinesList.map(medicine => (
            <option value={medicine.id}>
                {medicine.id} {medicine.name} {medicine.price}
            </option>
        ));
    };

    onMedicineOrderItemSave = (e) => {
        let {orderItem, medicineOrder} = this.state;
        let newOrderItem = {medicineOrder: medicineOrder.id, medicine: orderItem.medicine, amount: orderItem.amount};
        axios
            .post("/medicineOrderItem/", newOrderItem)
            .then(res => {
                this.getMedicineOrder();
            })
            .catch(err => console.log(err));
    };

    componentDidMount() {
        this.getMedicineOrder();
        axios
            .options("/medicineOrders/")
            .then(res => this.setState({updateChoices: res.data.actions['POST']['orderStatus'].choices}));
    }

    renderOrder = () => {
        const medicineOrder = this.state.medicineOrder;
        let orderItem = this.state.orderItem;
        return (
            <div>
                <button onClick={() => this.handleStatusUpdate(medicineOrder)} className="btn btn-light ml-2"> Update status </button>
                <h3>Zamówienie nr {medicineOrder.id}</h3>
                <p>
                    Data: {medicineOrder.created}
                </p>
                <p>
                    Klient: {medicineOrder.customer.pesel} {medicineOrder.customer.name} {medicineOrder.customer.surname}
                </p>
                <p>
                    Kwota: {medicineOrder.total_price}
                </p>
                <p>
                    Status: {medicineOrder.orderStatus}
                </p>

                { medicineOrder.medicineOrderItems.map(orderitem => (
                    <span key={orderitem.id}>
                        <p>
                            {orderitem.medicine.name} {orderitem.medicine.price} x {orderitem.amount}
                        </p>
                        <button onClick={() => this.handleDelete(orderitem)} className="btn btn-danger"> Delete </button>
                    </span>

                ))}
                <span>
                    <wbr/>
                    <h6>Dodaj nowy element zamówienia</h6>
                    <Button color="primary" onClick={this.onMedicineSearchSubmit}>Search</Button>
                    <Input
                        type="text"
                        name="name"
                        value={this.state.medicineSearchValue.name}
                        onChange={this.onMedicineSearchChange}
                        placeholder="Enter medicine name"
                    />
                    <Label for="medicine">Medicine</Label>
                    <Input
                        type="select"
                        name="medicine"
                        value={orderItem.medicine}
                        onChange={this.onOrderItemChange}
                    >
                        {this.renderMedicines()}
                    </Input>
                    <Label for="amount">Amount</Label>
                    <Input
                        type="number"
                        name="amount"
                        value={orderItem.amount}
                        onChange={this.onOrderItemChange}
                        placeholder="Enter medicine amount"
                    />
                    <Button onClick={this.onMedicineOrderItemSave}>
                        Save
                    </Button>
                    <abbr/>
                </span>
                {this.state.modal ? (
                    <UpdateOrderStatusModal
                        activeItem={this.state.activeItem}
                        choices={this.state.updateChoices}
                        toggle={this.toggle}
                        onStatusSave={this.handleStatusSubmit}
                    />
                ) : null}
            </div>
        );
    }

    render () {
        return (
            <div>
                { this.state.medicineOrder ?
                    this.renderOrder()
                    : null
                }
            </div>
        );
    }

}

export default MedicineOrder;