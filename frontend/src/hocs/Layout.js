import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { connect } from 'react-redux';
import { checkAuthenticated, load_user } from '../actions/auth';
import {Suspense} from "react";
import { CContainer, CFooter } from '@coreui/react'
import Sidebar from "../components/Sidebar";


const Layout = (props) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                await props.checkAuthenticated();
                await props.load_user();
            } catch (err) {
                console.log(err)
            }
        };
        fetchData();
    }, []);

    return (
        <div className="c-app c-default-layout">
            <Sidebar {...props}/>
            <div className="c-wrapper">
                <Navbar {...props}/>
                <div className="c-body">
                    <main className="c-main">
                        <CContainer fluid>
                                {props.children}
                        </CContainer>
                    </main>
                </div>
                <CFooter fixed={false}>
                    <div>
                        <span className="ml-1">Politechnika Warszawska</span>
                    </div>
                    <div className="mfs-auto">
                        <span className="mr-1">Justynan Łapińska 291086</span>
                    </div>
                </CFooter>
            </div>
        </div>

    );
};

export default connect(null, { checkAuthenticated, load_user })(Layout);
