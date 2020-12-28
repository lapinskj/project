import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { connect } from 'react-redux';
import { checkAuthenticated, load_user } from '../actions/auth';

const Layout = (props) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                await props.checkAuthenticated();
                await props.load_user();
                console.log(props)
            } catch (err) {

            }
        }

        fetchData();
    }, []);

    return (
        <div className="c-app c-default-layout">
            <div className="c-wrapper">
                <Navbar />
                <div className="c-body">
                    {props.children}
                </div>
            </div>
        </div>

    );
};

export default connect(null, { checkAuthenticated, load_user })(Layout);
