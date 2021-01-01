import React, { Component } from "react";
import axios from "axios";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";


class SearchMedicines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            medicinesList: [],
            searchValue: ""
        };
    }

    handleChange = e => {
        let { name, value } = e.target;
        const searchValue = { [name]: value };
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
            axios
                .get(`http://localhost:8000/medicines/?name=${searchValue['name']}`, config)
                .then(res => this.setState({ medicinesList: res.data }))
                .catch(err => console.log(err));
        }
    };

    renderMedicines = () => {
        const medicinesItems = this.state.medicinesList;
        return medicinesItems.map(item => (
            <li key={item.id}>
            <span>
              {item.name} {item.dose} {item.capacity} {item.brand} {item.price}
            </span>
            </li>
        ));
    };

    render() {
        return (
            <>
                <Form>
                    <FormGroup>
                        <Label for="name">Search medicine</Label>
                        <Input
                            type="text"
                            name="name"
                            onChange={this.handleChange}
                            placeholder="Search by medicine name"
                        />
                    </FormGroup>
                </Form>
                <Button color="primary" onClick={this.onSubmit}>
                    Search
                </Button>
                <div>
                    <h6>Results:</h6>
                    {this.renderMedicines()}
                </div>
            </>
        );
    }


}

export default SearchMedicines;