import React, { Fragment , Component} from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import MessagesCounter from "./MessagesCounter.js";
import {
    CHeader,
    CHeaderNav,
    CHeaderNavItem,
    CHeaderNavLink,
    CToggler
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

    handleClickMobile = (e) =>{
        e.preventDefault();
        let sidebar = document.getElementsByClassName("c-sidebar");
        sidebar = sidebar[0];
        if (sidebar.classList.contains("c-sidebar-lg-show")){
            sidebar.classList.remove("c-sidebar-lg-show");
            sidebar.classList.add("c-sidebar-show");
            let node = document.createElement("div");
            node.className = "c-sidebar-backdrop c-show";
            node.onclick = function() {
                this.parentElement.removeChild(this);
                let sidebar = document.getElementsByClassName("c-sidebar");
                sidebar = sidebar[0];
                sidebar.classList.remove("c-sidebar-show");
                sidebar.classList.add("c-sidebar-lg-show");
            };
            document.body.appendChild(node);
        }
    };

    handleClick = () =>{
        let sidebar = document.getElementsByClassName("c-sidebar");
        sidebar = sidebar[0];
        if (sidebar.classList.contains("c-sidebar-lg-show")){
            sidebar.classList.remove("c-sidebar-lg-show");
        } else {
            sidebar.classList.add("c-sidebar-lg-show");
        }
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
                        <CToggler
                            inHeader
                            className="ml-md-3 d-lg-none"
                            onClick={e => this.handleClickMobile(e)}

                        />
                        <CToggler
                            inHeader
                            className="ml-3 d-md-down-none"
                            onClick={this.handleClick}
                        />
                        <CHeaderNav className="d-md-down-none ml-auto">
                            {this.renderAuthLinks()}
                        </CHeaderNav>
                    </CHeader>
                )
                :
                (
                    <CHeader>
                        <CToggler
                            inHeader
                            className="ml-md-3 d-lg-none"
                            onClick={e => this.handleClickMobile(e)}
                        />
                        <CToggler
                            inHeader
                            className="ml-3 d-md-down-none"
                            onClick={this.handleClick}
                        />
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
        user: state.auth.user,
        show: state.toggleSidebar.sidebarShow
    }
}

export default connect(mapStateToProps, { logout, toggleSidebar, toggleSidebarMobile })(Navbar);
