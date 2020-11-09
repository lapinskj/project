import React, { Component } from "react";
import EditCustomerModal from "./EditCustomerModal";
import axios from "axios";


class Customers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            customersList: [],
            activeItem: {},
        };
    }
    componentDidMount() {
        this.refreshList();
    }
    refreshList = () => {
        axios
            .get("customers/")
            .then(res => this.setState({ customersList: res.data }))
            .catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = item => {
        this.toggle();
        if (item.id) {
            axios
                .put(`customers/${item.id}/`, item)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("customers/", item)
            .then(res => this.refreshList());
    };
    handleDelete = item => {
        axios
            .delete(`customers/${item.id}`)
            .then(res => this.refreshList());
    };
    createItem = () => {
        const item = { name: "", surname: "", age: null, pesel: null };
        this.setState({ activeItem: item, modal: !this.state.modal });
    };
    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    renderCustomers = () => {
        const customersItems = this.state.customersList;
        return customersItems.map(item => (
            <li key={item.id}>
            <span>
                {item.pesel} {item.name} {item.surname}
            </span>
            <span>
                <button onClick={() => this.editItem(item)} className="btn btn-info ml-2"> Edit </button>
                <button onClick={() => this.handleDelete(item)} className="btn btn-danger ml-2"> Delete </button>
            </span>
            </li>
        ));
    };

    render() {
        return (
            <main className="content">
                <button onClick={this.createItem} className="btn btn-secondary">
                    Add customer
                </button>
                <ul>
                    {this.renderCustomers()}
                </ul>
                {this.state.modal ? (
                    <EditCustomerModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </main>
        );
    }

}

export default Customers;
