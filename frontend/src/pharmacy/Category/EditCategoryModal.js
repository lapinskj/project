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

export default class EditCategoryModal extends Component {
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
                    <CForm action="" method="post">
                        <CFormGroup>
                            <CLabel htmlFor="code">Code</CLabel>
                            <CInput
                                type="text"
                                id="code"
                                name="code"
                                value={this.state.activeItem.code}
                                onChange={this.handleChange}
                                placeholder="Enter category code"/>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="name">Name</CLabel>
                            <CInput
                                type="text"
                                id="name"
                                name="name"
                                value={this.state.activeItem.name}
                                onChange={this.handleChange}
                                placeholder="Enter category name"/>
                        </CFormGroup>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton size="sm" color="primary" onClick={() => onSave(this.state.activeItem)}>
                        Save
                    </CButton>
                </CModalFooter>
            </CModal>
        );
    }
}