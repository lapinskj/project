import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import axios from "axios";

class ClientAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            activeItem : {
                name: "",
                surname: "",
                email: "",
                phone_number: ""
            }
        };
    }
    handleChange = e => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };

    saveClient = item => {
        console.log(item);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        if (item.id) {
            console.log(item);

            axios
                .put(`http://localhost:8000/clients/${item.id}/`, item, config)
                .then(res => this.refreshList());
            return;
        }
        axios
            .post("http://localhost:8000/clients/", item, config)
            .then(() => this.setState({ redirect: true }));
    };

    renderRedirect = () => {
        return <Redirect to='/clients' />
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/clients'/>;
        }


        return (
            <div>
                <p>Add customer</p>
                <Form>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={this.state.activeItem.name}
                            onChange={this.handleChange}
                            placeholder="Enter Customer Name"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="surname">Surname</Label>
                        <Input
                            type="text"
                            name="surname"
                            value={this.state.activeItem.surname}
                            onChange={this.handleChange}
                            placeholder="Enter Customer Surname"
                        />
                    </FormGroup>
                    <FormGroup check>
                        <Label for="email">Email</Label>
                        <Input
                            type="text"
                            name="email"
                            value={this.state.activeItem.email}
                            onChange={this.handleChange}
                            placeholder="Enter Customer Email"
                        />
                    </FormGroup>
                    <FormGroup check>
                        <Label for="phone_number">Phone number</Label>
                        <Input
                            type="text"
                            name="phone_number"
                            value={this.state.activeItem.phone_number}
                            onChange={this.handleChange}
                            placeholder="Enter Customer Phone Number"
                        />
                    </FormGroup>
                    <Button color="success" onClick={() => this.saveClient(this.state.activeItem)}>
                        Save
                    </Button>
                </Form>
            </div>
        );
    }
}

export default ClientAdd;
