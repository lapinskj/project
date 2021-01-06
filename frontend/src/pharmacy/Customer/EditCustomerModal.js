import React, { Component } from "react";
import {
    CButton,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter
} from '@coreui/react'

export default class EditCustomerModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem
        };
    }
    handleChange = e => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };
    render() {
        const { toggle, onSave } = this.props;
        return (
            <CModal show={true} onClose={toggle}>
                <CModalHeader closeButton>
                    <h4>Category edit</h4>
                </CModalHeader>
                <CModalBody>
                    <CForm id="editCustomerForm" onSubmit={(e) => onSave(this.state.activeItem, e)}>
                        <CFormGroup>
                            <CLabel htmlFor="name">Name</CLabel>
                            <CInput
                                type="text"
                                id="name"
                                name="name"
                                value={this.state.activeItem.name}
                                onChange={this.handleChange}
                                placeholder="Enter customer name"
                                pattern="[A-Z]{1}[a-z]{1,20}"
                                title="First letter must be uppercase, 20 maximum characters"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="surname">Surname</CLabel>
                            <CInput
                                type="text"
                                id="surname"
                                name="surname"
                                value={this.state.activeItem.surname}
                                onChange={this.handleChange}
                                placeholder="Enter customer surname"
                                pattern="[A-Z]{1}[a-z]{1,40}"
                                title="First letter must be uppercase, 40 maximum characters"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="pesel">Pesel</CLabel>
                            <CInput
                                type="number"
                                id="pesel"
                                name="pesel"
                                value={this.state.activeItem.pesel}
                                onChange={this.handleChange}
                                placeholder="Enter customer pesel"
                                min='10000000000'
                                max='99999999999'
                                step="1"
                                required
                            />
                        </CFormGroup>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton type="submit" form="editCustomerForm" size="sm" color="primary">Save</CButton>
                </CModalFooter>
            </CModal>
        );
    }
}