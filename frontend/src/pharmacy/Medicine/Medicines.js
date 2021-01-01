import React, { Component } from "react";
import EditMedicineModal from "./EditMedicineModal";
import axios from "axios";
import {CImg} from '@coreui/react'

class Medicines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            medicinesList: [],
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
            .get("http://localhost:8000/medicines/", config)
            .then(res => this.setState({ medicinesList: res.data }))
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
                .patch(`http://localhost:8000/medicines/${item.id}/`, item, config)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("http://localhost:8000/medicines/", item, config)
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
            .delete(`http://localhost:8000/medicines/${item.id}`, config)
            .then(res => this.refreshList());
    };

    createItem = () => {
        const item = {};
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    renderMedicines = () => {
        const medicinesItems = this.state.medicinesList;
        return medicinesItems.map(item => (
            <li key={item.id}>
                <span>
                    <h6>
                        {item.name} {item.dose} {item.capacity} {item.brand} {item.price} {item.quantity}
                        <div>
                            <CImg
                                src={item.image}
                                height={100}
                            />
                        </div>
                    </h6>
                    <ul>
                        Kategorie:
                        {item.category.map(cat => (
                            <li key={cat.id}>
                                {cat.code} {cat.name}
                            </li>
                        ))}
                    </ul>
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
            <>
                <div>
                    <button onClick={this.createItem} className="btn btn-secondary">
                        Add medicine
                    </button>
                    <ul>
                        {this.renderMedicines()}
                    </ul>
                </div>
                {this.state.modal ? (
                    <EditMedicineModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </>
        );
    }

}

export default Medicines;
