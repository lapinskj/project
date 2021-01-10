import React, { Component } from "react";
import {
    CButton,
    CForm,
    CFormGroup,
    CLabel,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CInputFile
} from '@coreui/react'

export default class EditMedicineImageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            image: null
        };
    }

    handleFileChange = e => {
        let value = e.target.files[0];
        this.setState({ image: value });
    };


    render() {
        const { toggle, onSave } = this.props;
        return (
            <CModal show={true} onClose={toggle}>
                <CModalHeader closeButton>
                    <h4>Upload new medicine image</h4>
                </CModalHeader>
                <CModalBody>
                    <CForm action="" method="post">
                        <CFormGroup>
                            <CLabel htmlFor="image">Image</CLabel>
                            <CInputFile
                                id="image"
                                type="file"
                                name="image"
                                onChange={this.handleFileChange}
                                accept="image/*"
                                required
                            />
                        </CFormGroup>

                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => onSave(this.state.activeItem.id, this.state.image)}>
                        Save
                    </CButton>
                </CModalFooter>
            </CModal>
        )
    }
}