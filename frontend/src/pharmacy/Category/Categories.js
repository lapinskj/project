import React, { Component } from "react";
import axios from "axios";
import EditCategoryModal from "./EditCategoryModal";
import {
    CCard,
    CCardBody,
    CCardHeader,
    CDataTable,
    CButton,
} from '@coreui/react'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import categories_fields from "../FormFields/categories";
import returnConfig from "../returnConfig";


class Categories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
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

    handleSubmit = item => {
        this.toggle();
        const config = returnConfig();
        if (item.id) {
            axios
                .put(`http://localhost:8000/categories/${item.id}/`, item, config)
                .then(res => this.refreshList());
            return;
        }
    };

    handleDelete = item => {
        const config = returnConfig();
        axios
            .delete(`http://localhost:8000/categories/${item.id}`, config)
            .then(res => this.refreshList());
    };

    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
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
                            fields={categories_fields}
                            itemsPerPage={5}
                            pagination
                            sorter
                            columnFilter
                            scopedSlots = {{
                                'edit':
                                    (item)=>(
                                        <td>
                                            <CButton color="info" onClick={() => this.editItem(item)} className="btn-brand mr-1 mb-1">
                                                <EditIcon/>
                                            </CButton>
                                        </td>
                                    ),
                                'delete':
                                    (item)=>(
                                        <td>
                                            <CButton color="danger" onClick={() => this.handleDelete(item)} className="btn-brand mr-1 mb-1">
                                                <DeleteIcon/>
                                            </CButton>
                                        </td>
                                    )

                            }}
                        />
                    </CCardBody>
                </CCard>
                <div>
                    {this.state.modal ? (
                        <EditCategoryModal
                            activeItem={this.state.activeItem}
                            toggle={this.toggle}
                            onSave={this.handleSubmit}
                        />
                    ) : null}
                </div>
            </>
        );
    }

}

export default Categories;
