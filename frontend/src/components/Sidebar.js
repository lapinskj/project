import React, {Component} from 'react'
import {useSelector, useDispatch, connect} from 'react-redux'
import {
    CCreateElement,
    CSidebar,
    CSidebarBrand,
    CSidebarNav,
    CSidebarNavDivider,
    CSidebarNavTitle,
    CSidebarMinimizer,
    CSidebarNavDropdown,
    CSidebarNavItem,
    CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import nav_staff from './_nav_staff'
import nav_user from './_nav_user';
import nav_logged_out from './_nav_logged_out';
import logo from "../assets/pharmacy_logo.png"


class Sidebar extends  Component{

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const is_staff = localStorage.getItem('is_staff');
        console.log("HVNFJV",is_staff);
        console.log(localStorage.getItem('is_staff'));
        return (
            <CSidebar>
                <CSidebarBrand className="d-md-down-none" to="/">
                    <CIcon
                        className="c-sidebar-brand-full"
                        name="logo-negative"
                        height={35}
                    />
                    <CImg
                        src={logo}
                        className="c-sidebar-brand-minimized"
                        height={35}
                    />
                </CSidebarBrand>
                <CSidebarNav>

                    <CCreateElement
                        items={this.props.isAuthenticated ?
                                    nav_staff
                                : nav_logged_out
                            }
                        components={{
                            CSidebarNavDivider,
                            CSidebarNavDropdown,
                            CSidebarNavItem,
                            CSidebarNavTitle
                        }}
                    />
                </CSidebarNav>
                <CSidebarMinimizer className="c-d-md-down-none"/>
            </CSidebar>
        )
    }

}

function mapStateToProps(state){
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps)(Sidebar);
