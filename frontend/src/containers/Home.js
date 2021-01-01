import React from 'react';
import {connect} from "react-redux";
import {CImg} from "@coreui/react";
import logo from "../assets/pharmacy_logo.png"

const home = ({ user }) => {
    if (user!==null){
        return (
            <div className='container'>
                <div className="jumbotron mt-5">
                    <h3 className="display-4">Welcome to Pharmacy System!</h3>
                    <hr className="my-4"/>
                    <p>{user.name}</p>
                    <CImg
                        src={logo}
                        className="c-sidebar-brand-minimized"
                        height={35}
                    />
                </div>
            </div>
        );
    }
    return null;


};

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(home);