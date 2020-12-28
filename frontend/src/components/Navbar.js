import React, { Fragment , Component} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import Badge from '@material-ui/core/Badge';
import InboxIcon from '@material-ui/icons/Inbox';
import axios from "axios";




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
                <li className="nav-item">
                    <a className='nav-link' onClick={this.props.logout} href='/'>Logout</a>
                </li>
                <li className="nav-item">
                    <a className='nav-link' href='/customers'>Customers</a>
                </li>
                <li className="nav-item">
                    <a className='nav-link' href='/medicines'>Medicines</a>
                </li>
                <li className="nav-item">
                    <a className='nav-link' href='/searchMedicines'>Search Medicines</a>
                </li>
                <li className="nav-item">
                    <a className='nav-link' href='/medicineOrders'>Medicine Orders</a>
                </li>
                <li className="nav-item">
                    <a className='nav-link' href='/newMedicineOrder'>New Order</a>
                </li>
                <li className="nav-item">
                    <a className='nav-link' href='/categories'>Medicine categories</a>
                </li>
                <li className="nav-item">
                    <a className='nav-link' href='/statistics'>Statistics</a>
                </li>
                <li className="nav-item">
                    <a className='nav-link' href='/newOrderMessages'>
                        <Badge badgeContent={this.state.unreadMessagesCount} color="primary">
                            <InboxIcon />
                        </Badge>
                    </a>
                </li>
            </Fragment>
        )
    };

    renderGuestsLinks = () => {
        return(
            <Fragment>
                <li className="nav-item">
                    <NavLink className="nav-link" exact to='/login'>Login</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" exact to='/signup'>Sign Up</NavLink>
                </li>
            </Fragment>
        )
    };

    render () {
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to='/'>Auth System</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" exact to='/'>Home</NavLink>
                        </li>
                        { <Fragment>{ this.props.isAuthenticated ?
                            this.renderAuthLinks() :
                            this.renderGuestsLinks()
                        }</Fragment> }
                    </ul>
                </div>
            </nav>
        )
    }
}


function mapStateToProps(state){
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps, { logout })(Navbar);
