import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import axios from "axios";

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

    handleCategoriesChange = event => {
        let opts = [], opt;
        for (let i = 0, len = event.target.options.length; i < len; i++) {
            opt = event.target.options[i];
            if (opt.selected) {
                opts.push(opt.value);
            }
        }
        let activeItem = this.state.activeItem;
        activeItem.category = opts;
        this.setState({activeItem});
    };

    renderCategories = () => {
        const categoriesList = this.state.categoriesList;
        return categoriesList.map(category => (
            <option value={category.id}>
                {category.id} {category.code} {category.name}
            </option>
        ));
    };

    componentDidMount() {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .get("http://localhost:8000/categories/", config)
            .then(res => this.setState({categoriesList: res.data}));
        console.log(this.state.activeItem);
    }

    render() {
        const { toggle, onSave } = this.props;
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}> Medicine </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={this.state.activeItem.name}
                                onChange={this.handleChange}
                                placeholder="Enter medicine name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="dose">Dose</Label>
                            <Input
                                type="text"
                                name="dose"
                                value={this.state.activeItem.dose}
                                onChange={this.handleChange}
                                placeholder="Enter dose"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="capacity">Capacity</Label>
                            <Input
                                type="text"
                                name="capacity"
                                value={this.state.activeItem.capacity}
                                onChange={this.handleChange}
                                placeholder="Enter capacity"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="brand">Brand</Label>
                            <Input
                                type="text"
                                name="brand"
                                value={this.state.activeItem.brand}
                                onChange={this.handleChange}
                                placeholder="Enter brand"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="price">Price</Label>
                            <Input
                                type="number"
                                name="price"
                                value={this.state.activeItem.price}
                                onChange={this.handleChange}
                                placeholder="Enter medicine price"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="category">Category</Label>
                            <Input
                                type="select"
                                name="category"
                                value={this.state.activeItem.category}
                                onChange={this.handleCategoriesChange}
                                multiple
                            >
                                {this.renderCategories()}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="quantity">Quantity</Label>
                            <Input
                                type="number"
                                name="quantity"
                                value={this.state.activeItem.quantity}
                                onChange={this.handleChange}
                                placeholder="Enter medicine quantity"
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => onSave(this.state.activeItem)}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}