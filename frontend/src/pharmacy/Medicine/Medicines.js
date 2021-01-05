import React, { Component } from "react";
import EditMedicineModal from "./EditMedicineModal";
import EditMedicineImageModal from "./EditMedicineImageModal";
import axios from "axios";
import {CButton, CCard, CCardBody, CCardHeader, CDataTable, CImg, CBadge} from '@coreui/react'
import medicines_fields from "../FormFields/medicines";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import returnConfig from "../returnConfig";

class Medicines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            modalImage: false,
            medicinesList: [],
            activeItem: {},
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/medicines/", config)
            .then(res => this.setState({ medicinesList: res.data }))
            .catch(err => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    toggleImage = () => {
        this.setState({ modalImage: !this.state.modalImage });
    };


    handleSubmit = item => {
        this.toggle();
        const config = returnConfig();
        let data = item;
        delete data.image;
        if (item.id) {
            axios
                .patch(`http://localhost:8000/medicines/${item.id}/`, data, config)
                .then(res => this.refreshList());
        }
    };


    handleImageSubmit = (itemId, image) => {
        this.toggleImage();
        const config = {
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };
        let formData = new FormData();
        formData.append('image', image);
        if (image) {
            axios
                .patch(`http://localhost:8000/medicines/${itemId}/`, formData, config)
                .then(res => this.refreshList());
        }
    };

    handleDelete = item => {
        const config = returnConfig();
        axios
            .delete(`http://localhost:8000/medicines/${item.id}`, config)
            .then(res => this.refreshList());
    };

    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editImage = (item) => {
        this.setState({ activeItem: item, modalImage: !this.state.modalImage });
    };

    render() {
        const medicinesList = this.state.medicinesList;
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h3>Medicines</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={medicinesList}
                            fields={medicines_fields}
                            itemsPerPage={5}
                            pagination
                            sorter
                            columnFilter
                            scopedSlots = {{
                                'image':
                                    (item)=>(
                                        <td>
                                            <CButton onClick={() => this.editImage(item)}>
                                                <CImg
                                                    src={item.image}
                                                    height={100}
                                                />
                                            </CButton>
                                        </td>
                                    ),
                                'category':
                                    (item)=>(
                                        <td>
                                            <CBadge color="primary">
                                                {item.category.code} {item.category.name}
                                            </CBadge>
                                        </td>
                                    ),
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
                {this.state.modal ? (
                    <EditMedicineModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
                {this.state.modalImage ? (
                    <EditMedicineImageModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggleImage}
                        onSave={this.handleImageSubmit}
                    />
                ) : null}
            </>
        );
    }
}

export default Medicines;
