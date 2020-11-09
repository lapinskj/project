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

export default class EditMedicineModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem
        };
    }
    handleChange = e => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
    };
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