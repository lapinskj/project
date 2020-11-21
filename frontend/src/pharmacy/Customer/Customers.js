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
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .get("http://localhost:8000/customers/", config)
            .then(res => this.setState({ customersList: res.data }))
            .catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = item => {
        this.toggle();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        if (item.id) {
            axios
                .put(`http://localhost:8000/customers/${item.id}/`, item, config)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("http://localhost:8000/customers/", item, config)
            .then(res => this.refreshList());
    };
    handleDelete = item => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .delete(`http://localhost:8000/customers/${item.id}`, config)
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
