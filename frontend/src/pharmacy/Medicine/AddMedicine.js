import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
    CButton,
    CForm,
    CFormGroup,
    CLabel,
    CInput,
    CSelect,
    CInputFile
} from '@coreui/react'
import returnConfig from "../returnConfig";
import axios from "axios";


class AddMedicine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            activeItem: {},
            categoriesList: [],
            image: null
        };
    }

    componentDidMount() {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/categories/", config)
            .then(res => this.setState({categoriesList: res.data}));
    }

    handleSubmit = () => {
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };
        let formData = new FormData();
        let item = this.state.activeItem;
        let image = this.state.image;
        Object.keys(item).forEach(function(key) {
            formData.append(key, item[key])
        });
        formData.append("image", image);
        axios
            .post("http://localhost:8000/medicines/", formData, config)
            .then(() => this.setState({ redirect: true }));
    };

    handleChange = e => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
        console.log(this.state)
    };

    handleFileChange = e => {
        let value = e.target.files[0];
        this.setState({ image: value });
    };

    renderCategories = () => {
        const categoriesList = this.state.categoriesList;
        return categoriesList.map(category => (
            <option value={category.id}>
                {category.id} {category.code} {category.name}
            </option>
        ));
    };

    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to='/medicines'/>;
        }
        return(
            <CCard>
                <CCardHeader>
                    <h3>Add medicine</h3>
                </CCardHeader>
                <CCardBody>
                    <CForm action="" method="post">
                        <CFormGroup>
                            <CLabel htmlFor="name" col="lg">Name</CLabel>
                            <CInput
                                className="col-sm-6"
                                size="lg"
                                type="text"
                                id="name"
                                name="name"
                                value={this.state.activeItem.name}
                                onChange={this.handleChange}
                                placeholder="Enter medicine name"
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="dose" col="lg">Dose</CLabel>
                            <CInput
                                className="col-sm-6"
                                size="lg"
                                type="text"
                                id="dose"
                                name="dose"
                                value={this.state.activeItem.dose}
                                onChange={this.handleChange}
                                placeholder="Enter dose"
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="capacity" col="lg">Capacity</CLabel>
                            <CInput
                                className="col-sm-6"
                                size="lg"
                                type="text"
                                id="capacity"
                                name="capacity"
                                value={this.state.activeItem.capacity}
                                onChange={this.handleChange}
                                placeholder="Enter capacity"
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="brand" col="lg">Brand</CLabel>
                            <CInput
                                className="col-sm-6"
                                size="lg"
                                type="text"
                                id="brand"
                                name="brand"
                                value={this.state.activeItem.brand}
                                onChange={this.handleChange}
                                placeholder="Enter brand"
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="price" col="lg">Price</CLabel>
                            <CInput
                                className="col-sm-6"
                                size="lg"
                                id="price"
                                type="number"
                                name="price"
                                value={this.state.activeItem.price}
                                onChange={this.handleChange}
                                placeholder="Enter medicine price"
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="quantity" col="lg">Quantity</CLabel>
                            <CInput
                                className="col-sm-6"
                                size="lg"
                                id="quantity"
                                type="number"
                                name="quantity"
                                value={this.state.activeItem.quantity}
                                onChange={this.handleChange}
                                placeholder="Enter medicine quantity"
                            />
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="category" col="lg">Category</CLabel>
                            <CSelect custom size="lg"
                                     name="category"
                                     id="category"
                                     value={this.state.activeItem.category}
                                     onChange={this.handleChange}
                            >
                                {this.renderCategories()}
                            </CSelect>
                        </CFormGroup>
                        <CFormGroup>
                            <CLabel htmlFor="image" col="lg">Image</CLabel>
                            <CInputFile
                                id="image"
                                type="file"
                                name="image"
                                onChange={this.handleFileChange}
                            />
                        </CFormGroup>
                    </CForm>
                </CCardBody>
                <CCardFooter>
                    <CButton size="lg" color="primary" onClick={this.handleSubmit}>
                        Submit
                    </CButton>
                </CCardFooter>
            </CCard>
        )
    }
}

export default AddMedicine;