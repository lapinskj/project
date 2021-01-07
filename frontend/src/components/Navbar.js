import React, { Fragment , Component} from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import MessagesCounter from "./MessagesCounter.js";
import {
    CHeader,
    CHeaderNav,
    CHeaderNavItem,
    CHeaderNavLink,
} from '@coreui/react'


class Navbar extends Component {


    constructor(props) {
        super(props);
        this.state = {
            unreadMessagesCount: null
        };
    }



    renderAuthLinks = () => {
        return(
            <Fragment>
                {this.props.user.is_staff ?
                    (
                        <MessagesCounter/>
                    ):null
                }
                <CHeaderNavItem className="px-3" >
                    <CHeaderNavLink to="/" onClick={this.props.logout}>Logout</CHeaderNavLink>
                </CHeaderNavItem>
            </Fragment>
        )
    };

    renderGuestsLinks = () => {
        return(
            <Fragment>
                <CHeaderNavItem  className="px-3">
                    <CHeaderNavLink to="/signup">Sign up</CHeaderNavLink>
                </CHeaderNavItem>
                <CHeaderNavItem className="px-3" >
                    <CHeaderNavLink to="/login">Login</CHeaderNavLink>
                </CHeaderNavItem>
            </Fragment>
        )
    };

    render () {
        return(
            this.props.user && this.props.isAuthenticated ?
                (
                    <CHeader>
                        <CHeaderNav className="d-md-down-none ml-auto">
                            {this.renderAuthLinks()}
                        </CHeaderNav>
                    </CHeader>
                )
                :
                (
                    <CHeader>
                        <CHeaderNav className="d-md-down-none ml-auto">
                            {this.renderGuestsLinks()}
                        </CHeaderNav>
                    </CHeader>
                )
        )
    }
}


function mapStateToProps(state){
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user
    }
}

export default connect(mapStateToProps, { logout })(Navbar);
