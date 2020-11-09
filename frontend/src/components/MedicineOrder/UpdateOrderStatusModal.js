import React, { Component } from "react";
import {
    Button,
    Form,
    FormGroup,
    FormControl
} from 'react-bootstrap';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

export default class UpdateOrderStatusModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem,
            choices: this.props.choices
        };
    }
    handleChange = e => {
        let { value } = e.target;
        const newItem = this.state.activeItem;
        newItem.orderStatus = value;
        this.setState({ activeItem: newItem });
    };
    render() {
        const { toggle, onStatusSave } = this.props;
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}> Update status </ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <FormControl as="select" onChange={this.handleChange}>
                                {this.state.choices.map(element => (
                                    <option key={element.value} value={element.value}>
                                        {element.value}
                                    </option>
                                    )
                                )}
                            </FormControl>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => onStatusSave(this.state.activeItem)}>
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}