import React, { Component } from "react";
import axios from "axios";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import {Link} from "react-router-dom";



class MedicineOrders extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            medicineOrdersList: [],
            updateChoices: {},
            activeItem: {}
        };
    }
    componentDidMount() {
        this.refreshOrdersList();
        axios
            .options("medicineOrders/")
            .then(res => this.setState({updateChoices: res.data.actions['POST']['orderStatus'].choices}));
    }
    refreshOrdersList = () => {
        axios
            .get("medicineOrders/")
            .then(res => {
                    this.setState({ medicineOrdersList: res.data });
                }
            ).catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleDelete = item => {
        axios
            .delete(`medicineOrders/${item.id}`)
            .then(res => this.refreshOrdersList());
    };

    handleStatusUpdate = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    handleStatusSubmit = item => {
        this.toggle();
        axios
            .put(`medicineOrders/${item.id}/updateStatus/`, item)
            .then(res => this.refreshOrdersList());
    };

    renderOrders = () => {
        const medicineOrdersList = this.state.medicineOrdersList;
        return medicineOrdersList.map(item => (
            <li key={item.id}>
            <div>
                <span>
                    <Link to={`/medicineOrder/${item.id}/` }>
                        <h3>
                            Zamówienie nr: {item.id}
                        </h3>
                    </Link>
                    <button onClick={() => this.handleDelete(item)} className="btn btn-danger ml-2"> Delete </button>
                    <button onClick={() => this.handleStatusUpdate(item)} className="btn btn-light ml-2"> Update status </button>
                </span>
                <span>
                    <p>
                        Data: {item.created}
                    </p>
                    <p>
                        Klient: {item.customer.pesel} {item.customer.name} {item.customer.surname}
                    </p>
                    <p>
                        Kwota: {item.total_price}
                    </p>
                    <p>
                        Status: {item.orderStatus}
                    </p>
                </span>
               <span>
                   { item.medicineOrderItems.map(orderitem => (
                       <span key={orderitem.id}>
                           <p>
                                -> {orderitem.medicine.name} {orderitem.medicine.price} x {orderitem.amount}
                           </p>
                       </span>
                   ))}
               </span>
            </div>
            </li>
        ));
    };

    render() {
        return (
            <main className="content">
                <h3>
                    Zamówienia
                </h3>
                <ul>
                    {this.renderOrders()}
                </ul>
                {this.state.modal ? (
                    <UpdateOrderStatusModal
                        activeItem={this.state.activeItem}
                        choices={this.state.updateChoices}
                        toggle={this.toggle}
                        onStatusSave={this.handleStatusSubmit}
                    />
                ) : null}
            </main>
        );
    }

}

export default MedicineOrders;
