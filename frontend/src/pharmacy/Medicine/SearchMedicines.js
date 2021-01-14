import React, { Component } from "react";
import axios from "axios";
import {
    CBadge,
    CButton,
    CCard,
    CCardBody, CCardFooter,
    CCardHeader,
    CDataTable,
    CForm,
    CFormGroup,
    CImg, CInput,
    CLabel
} from "@coreui/react";
import medicines_user_fields from "../TableFields/medicinesUser";


class SearchMedicines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            medicinesList: [],
            searchValue: []
        };
    }

    handleChange = e => {
        let { name, value } = e.target;
        const searchValue = { ...this.state.searchValue, [name]: value };
        this.setState({ searchValue });
    };

    onSubmit = () => {
        let searchValue = this.state.searchValue;
        const config = {
            searchValue,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        if (searchValue) {
            let finalValue = "?";
            Object.keys(searchValue).forEach(function(key) {
                let varValue = key;
                varValue = varValue.concat("=", searchValue[key], "&");
                finalValue = finalValue.concat(varValue);
            });
            finalValue = finalValue.slice(0, -1);
            axios
                .get(`http://localhost:8000/medicines/${finalValue}`, config)
                .then(res => this.setState({ medicinesList: res.data }))
                .catch(err => console.log(err));
        }
    };

    render() {
        const medicinesList = this.state.medicinesList;
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h3>Search medicines</h3>
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
                                    value={this.state.searchValue.name}
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
                                    value={this.state.searchValue.dose}
                                    onChange={this.handleChange}
                                    placeholder="Enter medicine dose"
                                />
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="name" col="lg">Capacity</CLabel>
                                <CInput
                                    className="col-sm-6"
                                    size="lg"
                                    type="text"
                                    id="capacity"
                                    name="capacity"
                                    value={this.state.searchValue.capacity}
                                    onChange={this.handleChange}
                                    placeholder="Enter medicine capacity"
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
                                    value={this.state.searchValue.brand}
                                    onChange={this.handleChange}
                                    placeholder="Enter medicine brand"
                                />
                            </CFormGroup>
                        </CForm>
                    </CCardBody>
                    <CCardFooter>
                        <CButton size="lg" color="primary" onClick={this.onSubmit}>
                            Search
                        </CButton>
                    </CCardFooter>
                </CCard>
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
                                            <CImg
                                                src={item.image}
                                                height={100}
                                            />
                                        </td>
                                    ),
                                'category':
                                    (item)=>(
                                        <td>
                                            <CBadge color="primary">
                                                {item.category.name}
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

export default SearchMedicines;