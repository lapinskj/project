import React, {Component} from 'react'
import {connect} from 'react-redux'
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

import nav_staff from './_nav_staff'
import nav_user from './_nav_user';
import nav_logged_out from './_nav_logged_out';
import logo from "../assets/pharmacy_logo.png"
import logo_big from "../assets/pharmacy_logo_big.png"


class Sidebar extends  Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            this.props.user ?
                (
                    <CSidebar>
                        <CSidebarBrand className="d-md-down-none" to="/">
                            <CImg
                                src={logo_big}
                                className="c-sidebar-brand-full"
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
                                    (this.props.user.is_staff ?
                                        nav_staff
                                        : nav_user)
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
                :
                (
                    <CSidebar>
                        <CSidebarBrand className="d-md-down-none" to="/">
                            <CImg
                                src={logo_big}
                                className="c-sidebar-brand-full"
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
                                items={nav_logged_out}
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

export default connect(mapStateToProps)(Sidebar);
