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

export default class ChangePasswordModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: {}
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
                    <h4>Change password</h4>
                </CModalHeader>
                <CModalBody>
                    <CForm id="changePasswordForm" onSubmit={(e) => onSave(this.state.activeItem, e)}>
                        <CFormGroup>
                            <CLabel htmlFor="current_password">Current password</CLabel>
                            <CInput
                                className='form-control'
                                type='password'
                                placeholder='Current password'
                                name='current_password'
                                value={this.state.activeItem.current_password}
                                onChange={this.handleChange}
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="password">New password</CLabel>
                            <CInput
                                className='form-control'
                                type='password'
                                placeholder='New password'
                                name='new_password'
                                value={this.state.activeItem.new_password}
                                onChange={this.handleChange}
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Password must have at least one number and one uppercase and lowercase letter, and be 8 or more characters long"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="re_password">Confirm new password</CLabel>
                            <CInput
                                type="password"
                                placeholder="Confirm new password"
                                className='form-control'
                                name='re_new_password'
                                value={this.state.activeItem.re_new_password}
                                onChange={this.handleChange}
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title="Password must have at least one number and one uppercase and lowercase letter, and be 8 or more characters long"
                                required
                            />
                        </CFormGroup>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton type="submit" form="changePasswordForm" size="sm" color="primary">Save</CButton>
                </CModalFooter>
            </CModal>
        );
    }
}