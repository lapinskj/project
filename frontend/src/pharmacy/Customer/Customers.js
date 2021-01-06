import React, {Component, useState} from "react";
import EditCustomerModal from "./EditCustomerModal";
import axios from "axios";
import {CButton, CCard, CCardBody, CCardHeader, CDataTable} from "@coreui/react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import customers_fields from "../FormFields/customers";
import returnConfig from "../returnConfig";

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
        const config = returnConfig();
        axios
            .get("http://localhost:8000/customers/", config)
            .then(res => this.setState({ customersList: res.data }))
            .catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item, e) => {
        e.preventDefault();
        this.toggle();
        const config = returnConfig()
        if (item.id) {
            axios
                .patch(`http://localhost:8000/customers/${item.id}/`, item, config)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("http://localhost:8000/customers/", item, config)
            .then(res => this.refreshList());
    };
    handleDelete = item => {
        const config = returnConfig()
        axios
            .delete(`http://localhost:8000/customers/${item.id}`, config)
            .then(res => this.refreshList());
    };

    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    render() {
        const customers = this.state.customersList;
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h3>Customers</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={customers}
                            fields={customers_fields}
                            itemsPerPage={10}
                            pagination
                            sorter
                            columnFilter
                            scopedSlots = {{
                                'edit':
                                    (item)=>(
                                        <td>
                                            <CButton color="info" onClick={() => this.editItem(item)} className="btn-brand mr-1 mb-1">
                                                <EditIcon/>
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
                                    )

                            }}
                        />
                    </CCardBody>
                </CCard>
                {this.state.modal ? (
                    <EditCustomerModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </>
        );
    }

}

export default Customers;
