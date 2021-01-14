import React, { Component } from "react";
import axios from "axios";
import {CButton, CCard, CCardBody, CCardHeader, CDataTable, CImg, CBadge} from '@coreui/react'
import medicines_user_fields from "../TableFields/medicinesUser"
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


    handleSubmit = (item, e) => {
        e.preventDefault();
        this.toggle();
        const config = returnConfig();
        let data = item;
        delete data.image;
        if (data.category.id){
            data.category = data.category.id
        }

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
                            fields={medicines_user_fields}
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
                                    )
                            }}
                        />
                    </CCardBody>
                </CCard>
            </>
        );
    }
}

export default Medicines;
