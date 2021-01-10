import React, { Component } from "react";
import axios from "axios";
import {connect} from "react-redux";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CImg,
    CRow,
    CCol,
    CFormGroup, CLabel, CInputGroup, CInputGroupPrepend, CInput, CSelect, CForm, CCardFooter
} from "@coreui/react";
import LockIcon from "@material-ui/icons/Lock";
import EditIcon from "@material-ui/icons/Edit";
import * as actionCreators from "../../actions/auth";
import EditCategoryModal from "../Category/EditCategoryModal";
import ChangePasswordModal from "./ChangePasswordModal";
import EditAccountModal from "./EditAccountModal";

class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalEdit: false,
            modalPass: false,
            activeItem: {},
        };
    }

    componentDidMount() {
        this.setState({ activeItem: this.props.user });
    }

    toggleEdit = () => {
        this.setState({ modalEdit: !this.state.modalEdit });
    };

    togglePass = () => {
        this.setState({ modalPass: !this.state.modalPass });
    };

    editAccount = () => {
        this.setState({ modalEdit: !this.state.modalEdit });
    };

    changePass = () => {
        this.setState({ modalPass: !this.state.modalPass });
    };

    handleAccountEdit  = (account) => {
        delete account.pesel;
        this.props.updateAccount(account);
    };

    handlePasswordChange = (passwords) => {
        this.props.changePassword(passwords);
    };

    render() {
        return(
            this.props.user ?
                (
                    <>
                        <CCard>
                            <CCardHeader>
                                <h1>Your account</h1>
                            </CCardHeader>
                            <CCardFooter>
                                <CButton color="info" className="btn-brand mr-1 mb-1" onClick={this.editAccount}>
                                    <EditIcon/> Edit account
                                </CButton>
                                <CButton color="secondary" className="btn-brand mr-1 mb-1" onClick={this.changePass}>
                                    <LockIcon/> Change password
                                </CButton>
                            </CCardFooter>
                            <CCardBody>
                                <table className="table table-striped table-hover">
                                    <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{this.props.user.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Surname</td>
                                        <td>{this.props.user.surname}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{this.props.user.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone number</td>
                                        <td>{this.props.user.phone_number}</td>
                                    </tr>
                                    <tr>
                                        <td>Pesel</td>
                                        <td>{this.props.user.pesel}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </CCardBody>
                        </CCard>
                        {this.state.modalEdit ? (
                            <EditAccountModal
                                activeItem={this.state.activeItem}
                                toggle={this.toggleEdit}
                                onSave={this.handleAccountEdit}
                            />
                        ) : null}
                        {this.state.modalPass ? (
                            <ChangePasswordModal
                                toggle={this.togglePass}
                                onSave={this.handlePasswordChange}
                            />
                        ) : null}
                    </>
                ):
                (<h1>Loading</h1>)

        )
    }
}
const mapStateToProps = state => ({
    user: state.auth.user,
});

const mapDispatchToProps = dispatch => {
    return {
        updateAccount: (account) => dispatch(actionCreators.updateAccount(account)),
        changePassword: (passwords) => dispatch(actionCreators.changePassword(passwords))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);