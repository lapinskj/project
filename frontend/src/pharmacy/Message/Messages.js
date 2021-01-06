import React, {Component} from "react";
import axios from "axios";
import {
    CRow,
    CCol,
    CWidgetIcon,
    CCard,
    CCardBody,
    CCardHeader,
    CListGroup,
    CListGroupItem,
} from '@coreui/react'
import Divider from '@material-ui/core/Divider';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


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

    handleDone = (item, index) => {
        item.unread = !item.unread;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .put(`http://localhost:8000/newOrderMessages/${item.id}/updateMessageRead/`, item, config)
            .then(res => this.refreshList());
        //const messagesList = this.state.messagesList;
        //messagesList.splice(index, 1);
        //this.setState({messagesList})
    };

    handleDeleteAllRead = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .delete("http://localhost:8000/newOrderMessages/deleteAllRead/", config)
            .then(res => this.refreshList());
    };

    refreshList = () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
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
            <li key={item.id}>
                <span>
                    <button onClick={() => this.handleDone(item, messagesItems.indexOf(item))} className="btn">
                        <CheckBoxOutlineBlankIcon/>
                    </button>
                </span>
                <span>
                    <b>
                        #{item.id}: Order nr {item.medicine_order} at {item.started}
                    </b>
                </span>
            </li>
        ));
    };

    renderReadMessages = () => {
        const messagesItems = this.state.messagesList.filter(
            item => item.unread === false
        );
        return messagesItems.map(item => (
            <li key={item.id}>
                <span>
                    <button onClick={() => this.handleDone(item, messagesItems.indexOf(item))} className="btn">
                        <CheckBoxIcon/>
                    </button>
                </span>
                <span>
                    #{item.id}: Order nr {item.medicine_order} at {item.started}
                </span>
            </li>
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
                        <div>
                            <ul>
                                {this.renderUnreadMessages()}
                            </ul>
                        </div>
                        <hr className="my-2" />
                        <div>
                            <h5 className="text-muted">Completed</h5>
                            <button onClick={() => this.handleDeleteAllRead()} className="btn btn-danger m-2">
                                <DeleteForeverIcon/> Delete all read messages
                            </button>
                            <ul className="text-muted">
                                {this.renderReadMessages()}
                            </ul>
                        </div>
                    </CCardBody>

                </CCard>
            </>
        );
    }
}

export default Messages;