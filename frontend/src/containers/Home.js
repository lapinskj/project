import React from 'react';
import {connect} from "react-redux";

const home = ({ user }) => {
    if (user!==null){
        return (
            <div className='container'>
                <div className="jumbotron mt-5">
                    <h3 className="display-4">Welcome to Pharmacy System!</h3>
                    <hr className="my-4"/>
                    <p>{user.name}</p>
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