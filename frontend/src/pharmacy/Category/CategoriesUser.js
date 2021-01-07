import React, { Component } from "react";
import axios from "axios";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CDataTable
} from '@coreui/react'
import categories_user_fields from "../FormFields/categoriesUser";
import returnConfig from "../returnConfig";


class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoriesList: [],
            activeItem: {},
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/categories/", config)
            .then(res => this.setState({ categoriesList: res.data }))
            .catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    render() {
        const categories = this.state.categoriesList;
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h3>Categories</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={categories}
                            fields={categories_user_fields}
                            itemsPerPage={5}
                            pagination
                            sorter
                            columnFilter
                        />
                    </CCardBody>
                </CCard>
            </>
        );
    }

}

export default Categories;
