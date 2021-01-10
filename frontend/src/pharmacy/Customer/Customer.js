import React, { Component } from "react";
import axios from "axios";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCardFooter
} from "@coreui/react";
import EditIcon from "@material-ui/icons/Edit";
import returnConfig from "../returnConfig";
import EditCustomerModalUser from "./EditCustomerModalUser";

class Customer extends Component {



    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            activeItem: {},
        };
    }

    componentDidMount() {
        this.refreshCustomer();
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    refreshCustomer = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/customers/", config)
            .then(res => this.setState({ activeItem: res.data[0] }))
            .catch(err => console.log(err));
    };

    handleSubmit = (item, e) => {
        e.preventDefault();
        this.toggle();
        const config = returnConfig();
        delete item.pesel;
        if (item.id) {
            axios
                .patch(`http://localhost:8000/customers/${item.id}/`, item, config)
                .then(res => this.refreshCustomer());
        }
    };

    editItem = () => {
        this.setState({ modal: !this.state.modal });
    };

    render() {
        return(
            this.state.activeItem ?
                (
                    <>
                        <CCard>
                            <CCardHeader>
                                <h1>Your customer details</h1>
                            </CCardHeader>
                            <CCardFooter>
                                <CButton color="info" onClick={() => this.editItem()} className="btn-brand mr-1 mb-1">
                                    <EditIcon/> Edit details
                                </CButton>
                            </CCardFooter>
                            <CCardBody>
                                <table className="table table-striped table-hover">
                                    <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{this.state.activeItem.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Surname</td>
                                        <td>{this.state.activeItem.surname}</td>
                                    </tr>
                                    <tr>
                                        <td>Pesel</td>
                                        <td>{this.state.activeItem.pesel}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </CCardBody>
                        </CCard>
                        {this.state.modal ? (
                            <EditCustomerModalUser
                                activeItem={this.state.activeItem}
                                toggle={this.toggle}
                                onSave={this.handleSubmit}
                            />
                        ) : null}
                    </>
                ):
                (<h1>Loading</h1>)

        )
    }
}

export default Customer;