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

export default class EditAccountModal extends Component {
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
                    <h4>Edit account details</h4>
                </CModalHeader>
                <CModalBody>
                    <CForm id="editAccountForm" onSubmit={(e) => onSave(this.state.activeItem, e)}>
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
                            <CLabel htmlFor="phone_number">Phone number</CLabel>
                            <CInput
                                className='form-control'
                                type='tel'
                                placeholder='Phone number'
                                name='phone_number'
                                value={this.state.activeItem.phone_number}
                                onChange={this.handleChange}
                                pattern="^[+][0-9]{2}[0-9]{3}[0-9]{3}[0-9]{3}"
                                title="Phone number must be in pattern '+48500500500'"
                                required
                            />
                        </CFormGroup>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton type="submit" form="editAccountForm" size="sm" color="primary">Save</CButton>
                </CModalFooter>
            </CModal>
        );
    }
}