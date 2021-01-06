import React, {Component} from "react";
import axios from "axios";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import returnConfig from "../returnConfig";
import {Link} from "react-router-dom";


class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messagesList: []
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    handleDone = (item) => {
        item.unread = !item.unread;
        const config = returnConfig();
        axios
            .put(`http://localhost:8000/newOrderMessages/${item.id}/updateMessageRead/`, item, config)
            .then(res => this.refreshList());
    };

    handleDeleteAllRead = () => {
        const config = returnConfig();
        axios
            .delete("http://localhost:8000/newOrderMessages/deleteAllRead/", config)
            .then(res => this.refreshList());
    };

    refreshList = () => {
        const config = returnConfig();
        axios
            .get("http://localhost:8000/newOrderMessages/", config)
            .then(res => {this.setState({ messagesList: res.data })})
            .catch(err => console.log(err));
    };

    renderUnreadMessages = () => {
        const messagesItems = this.state.messagesList.filter(
            item => item.unread === true
        );
        return messagesItems.map(item => (
            <CListGroupItem key={item.id} action>
                <h5 className="d-flex w-100 justify-content-between">
                    <div>
                        <CButton onClick={() => this.handleDone(item, messagesItems.indexOf(item))} className="btn-brand mr-1 mb-1">
                            <CheckBoxOutlineBlankIcon/>
                        </CButton>
                        <Link to={`/medicineOrder/${item.medicine_order.id}/` }>
                            Order nr {item.medicine_order.id}
                        </Link>
                    </div>
                    <small>{item.started}</small>
                </h5>
                <p className="pl-2" >Customer: {item.medicine_order.customer.name} {item.medicine_order.customer.surname} {item.medicine_order.customer.pesel}, total price: {item.medicine_order.total_price}</p>
                {item.medicine_order.medicineOrderItems.map( orderItem => (
                    <p><ChevronRightIcon/>{orderItem.medicine.name}, {orderItem.medicine.brand}, {orderItem.medicine.dose}, {orderItem.medicine.capacity} x {orderItem.amount}</p>
                ))}
            </CListGroupItem>
        ));
    };

    renderReadMessages = () => {
        const messagesItems = this.state.messagesList.filter(
            item => item.unread === false
        );
        return messagesItems.map(item => (
            <CListGroupItem key={item.id} action>
                <h5 className="d-flex w-100 justify-content-between">
                    <div>
                        <CButton onClick={() => this.handleDone(item, messagesItems.indexOf(item))} className="btn-brand mr-1 mb-1">
                            <CheckBoxIcon/>
                        </CButton>
                        <Link to={`/medicineOrder/${item.medicine_order.id}/` }>
                            Order nr {item.medicine_order.id}
                        </Link>
                    </div>
                    <small>{item.started}</small>
                </h5>
                <p className="pl-2" >Customer: {item.medicine_order.customer.name} {item.medicine_order.customer.surname} {item.medicine_order.customer.pesel}, total price: {item.medicine_order.total_price}</p>
                {item.medicine_order.medicineOrderItems.map( orderItem => (
                    <p><ChevronRightIcon/>{orderItem.medicine.name}, {orderItem.medicine.brand}, {orderItem.medicine.dose}, {orderItem.medicine.capacity} x {orderItem.amount}</p>
                ))}
            </CListGroupItem>
        ));
    };


    render() {
        return (
            <>
                <CCard>
                    <CCardHeader>
                        <h3>Reminders of new orders</h3>
                    </CCardHeader>
                    <CCardBody>
                        <CListGroup className="font-weight-bold">
                            {this.renderUnreadMessages()}
                        </CListGroup>
                        <div className="d-flex w-100 justify-content-between my-3">
                            <h4 className="pt-2">Completed</h4>
                            <CButton onClick={() => this.handleDeleteAllRead()} className="btn btn-danger">
                                <DeleteForeverIcon/> Delete all read messages
                            </CButton>
                        </div>
                        <CListGroup>
                            {this.renderReadMessages()}
                        </CListGroup>
                    </CCardBody>
                </CCard>
            </>
        );
    }
}

export default Messages;