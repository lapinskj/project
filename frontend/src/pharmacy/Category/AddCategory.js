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
    CInput
} from '@coreui/react'
import returnConfig from "../returnConfig";
import axios from "axios";


class AddCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            activeItem: {},
        };
    }

    handleSubmit = () => {
        const config = returnConfig();
        const item = this.state.activeItem;
        axios
            .post("http://localhost:8000/categories/", item, config)
            .then(() => this.setState({ redirect: true }));
    };

    handleChange = e => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Redirect to='/categories'/>;
        }
        return(
            <CCard>
                <CCardHeader>
                    <h3>Add category</h3>
                </CCardHeader>
                <CCardBody>
                    <CForm action="" method="post">
                        <CFormGroup>
                            <CLabel htmlFor="code" col="lg">Code</CLabel>
                            <CInput
                                className="col-sm-6"
                                size="lg"
                                type="text"
                                id="code"
                                name="code"
                                value={this.state.activeItem.code}
                                onChange={this.handleChange}
                                placeholder="Enter category code"
                            />
                        </CFormGroup>
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
                                placeholder="Enter category name"
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

export default AddCategory;