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
    CModalFooter,
    CSelect
} from '@coreui/react'
import axios from "axios";
import returnConfig from "../returnConfig";

export default class EditMedicineModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            categoriesList: [],
            categories: []
        };
    }

    handleChange = e => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    renderCategories = () => {
        const categoriesList = this.state.categoriesList;
        return categoriesList.map(category => (
            <option value={category.id}>
                {category.code} {category.name}
            </option>
        ));
    };

    componentDidMount() {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/categories/", config)
            .then(res => this.setState({categoriesList: res.data}));
    }

    render() {
        const { toggle, onSave } = this.props;
        return (
            <CModal show={true} onClose={toggle}>
                <CModalHeader closeButton>
                    <h4>Medicine edit</h4>
                </CModalHeader>
                <CModalBody>
                    <CForm id="updateMedicineForm" onSubmit={(e) => onSave(this.state.activeItem, e)}>
                        <CFormGroup>
                            <CLabel htmlFor="name">Name</CLabel>
                            <CInput
                                type="text"
                                id="name"
                                name="name"
                                value={this.state.activeItem.name}
                                onChange={this.handleChange}
                                placeholder="Enter name"
                                pattern="[A-Z]{1}[a-z]{1,50}"
                                title="First letter must be uppercase, 50 maximum characters"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="dose">Dose</CLabel>
                            <CInput
                                type="text"
                                id="dose"
                                name="dose"
                                value={this.state.activeItem.dose}
                                onChange={this.handleChange}
                                placeholder="Enter dose"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="capacity">Capacity</CLabel>
                            <CInput
                                type="text"
                                id="capacity"
                                name="capacity"
                                value={this.state.activeItem.capacity}
                                onChange={this.handleChange}
                                placeholder="Enter capacity"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="brand">Brand</CLabel>
                            <CInput
                                type="text"
                                id="brand"
                                name="brand"
                                value={this.state.activeItem.brand}
                                onChange={this.handleChange}
                                placeholder="Enter brand"
                                pattern="[A-Z]{1}[a-z]{1,50}"
                                title="First letter must be uppercase, 50 maximum characters"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="price">Price</CLabel>
                            <CInput
                                type="number"
                                id="price"
                                name="price"
                                value={this.state.activeItem.price}
                                onChange={this.handleChange}
                                placeholder="Enter price"
                                min="0.01"
                                step="0.01"
                                max="9999"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="quantity">Quantity</CLabel>
                            <CInput
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={this.state.activeItem.quantity}
                                onChange={this.handleChange}
                                placeholder="Enter quantity"
                                min="0"
                                step="1"
                                required
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="category">Category</CLabel>
                            <CSelect
                                name="category"
                                id="category"
                                value={this.state.activeItem.category.id}
                                onChange={this.handleChange}
                                required
                            >
                                {this.renderCategories()}
                            </CSelect>
                        </CFormGroup>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton type="submit" form="updateMedicineForm" size="sm" color="primary">Save</CButton>
                </CModalFooter>
            </CModal>
        )
    }
}