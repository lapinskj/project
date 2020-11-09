import React, { Component } from "react";
import EditMedicineModal from "./EditMedicineModal";
import axios from "axios";


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
        axios
            .get("medicines/")
            .then(res => this.setState({ medicinesList: res.data }))
            .catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = item => {
        this.toggle();
        if (item.id) {
            axios
                .put(`medicines/${item.id}/`, item)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("medicines/", item)
            .then(res => this.refreshList());
    };
    handleDelete = item => {
        axios
            .delete(`medicines/${item.id}`)
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
              {item.name} {item.dose} {item.capacity} {item.brand} {item.price}
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
            </main>
        );
    }

}

export default Medicines;
