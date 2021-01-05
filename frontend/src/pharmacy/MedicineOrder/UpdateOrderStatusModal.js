import React, { Component } from "react";
import {
    CButton,
    CForm,
    CFormGroup,
    CLabel,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter, CSelect
} from '@coreui/react'

export default class UpdateOrderStatusModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            choices: this.props.choices
        };
    }

    handleChange = e => {
        let { value } = e.target;
        const newItem = this.state.activeItem;
        newItem.orderStatus = value;
        this.setState({ activeItem: newItem });
    };

    render() {
        const { toggle, onStatusSave } = this.props;
        return (
            <CModal show={true} onClose={toggle}>
                <CModalHeader closeButton>
                    <h4>Update order status</h4>
                </CModalHeader>
                <CModalBody>
                    <CForm action="" method="post">
                        <CFormGroup>
                            <CLabel htmlFor="orderStatus">New order status</CLabel>
                            <CSelect
                                name="orderStatus"
                                id="orderStatus"
                                value={this.state.activeItem.orderStatus}
                                onChange={this.handleChange}
                            >
                                {this.state.choices.map(element => (
                                        <option key={element.value} value={element.value}>
                                            {element.value}
                                        </option>
                                    )
                                )}
                            </CSelect>
                        </CFormGroup>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton size="sm" color="primary" onClick={() => onStatusSave(this.state.activeItem)}>
                        Save
                    </CButton>
                </CModalFooter>
            </CModal>
        );
    }
}