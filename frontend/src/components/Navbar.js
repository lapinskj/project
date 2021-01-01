import React, { Fragment , Component} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import Badge from '@material-ui/core/Badge';
import InboxIcon from '@material-ui/icons/Inbox';
import axios from "axios";
import {
    CHeader,
    CToggler,
    CHeaderBrand,
    CHeaderNav,
    CHeaderNavItem,
    CHeaderNavLink,
    CBreadcrumbRouter,
    CLink
} from '@coreui/react'


class Navbar extends Component {


    constructor(props) {
        super(props);
        this.state = {
            unreadMessagesCount: null
        };
    }

    getUnreadMessagesCount () {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        };
        axios
            .get("http://localhost:8000/newOrderMessages/countUnread/", config)
            .then(res => {
                this.setState({ unreadMessagesCount: res.data['count'] })
            }
            )
            .catch(err => console.log(err));
    }

    componentDidMount() {
        if (this.props.isAuthenticated){
            this.getUnreadMessagesCount();
            this.interval = setInterval(() => {
                this.getUnreadMessagesCount();
            }, 60000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderAuthLinks = () => {
        return(
            <Fragment>
                <CHeaderNavItem  className="px-3">
                    <CHeaderNavLink to="/newOrderMessages">
                        <Badge badgeContent={this.state.unreadMessagesCount} color="primary">
                            <InboxIcon />
                        </Badge>
                    </CHeaderNavLink>
                </CHeaderNavItem>
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
            <CHeader>
                <CHeaderNav className="d-md-down-none ml-auto">
                    { this.props.isAuthenticated ?
                        this.renderAuthLinks() :
                        this.renderGuestsLinks()
                    }
                </CHeaderNav>
            </CHeader>
        )
    }
}


function mapStateToProps(state){
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { logout })(Navbar);
