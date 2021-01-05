import React, { Fragment , Component} from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import Badge from '@material-ui/core/Badge';
import InboxIcon from '@material-ui/icons/Inbox';
import axios from "axios";
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
        this.getUnreadMessagesCount();
        this.interval = setInterval(() => {
            this.getUnreadMessagesCount();
        }, 60000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderAuthLinks = () => {
        return(
            <Fragment>
                {this.props.user.is_staff ?
                    (
                        <CHeaderNavItem  className="px-3">
                            <CHeaderNavLink to="/newOrderMessages">
                                <Badge badgeContent={this.state.unreadMessagesCount} color="primary">
                                    <InboxIcon />
                                </Badge>
                            </CHeaderNavLink>
                        </CHeaderNavItem>
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
            this.props.user ?
                (
                    <CHeader>
                        <CHeaderNav className="d-md-down-none ml-auto">
                            { this.props.isAuthenticated ?
                                this.renderAuthLinks() :
                                this.renderGuestsLinks()
                            }
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
