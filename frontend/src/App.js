import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import './scss/style.scss';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import Customers from "./pharmacy/Customer/Customers";
import Medicines from "./pharmacy/Medicine/Medicines";
import MedicinesUser from "./pharmacy/Medicine/MedicinesUser";
import SearchMedicines from "./pharmacy/Medicine/SearchMedicines";
import MedicineOrder from "./pharmacy/MedicineOrder/MedicineOrder";
import MedicineOrderUser from "./pharmacy/MedicineOrder/MedicineOrderUser";
import MedicineOrders from "./pharmacy/MedicineOrder/MedicineOrders";
import MedicineOrdersUSer from "./pharmacy/MedicineOrder/MedicineOrdersUser";
import AddMedicineOrder from "./pharmacy/MedicineOrder/AddMedicineOrder";
import AddMedicineOrderUser from "./pharmacy/MedicineOrder/AddMedicineOrderUser";
import Messages from "./pharmacy/Message/Messages";
import Statistics from "./pharmacy/Statistics/Statistics";
import Categories from "./pharmacy/Category/Categories";
import CategoriesUser from "./pharmacy/Category/CategoriesUser";
import Layout from './hocs/Layout';
import AddCustomer from "./pharmacy/Customer/AddCustomer";
import AddMedicine from "./pharmacy/Medicine/AddMedicine";
import AddCategory from "./pharmacy/Category/AddCategory";
import Info from "./pharmacy/Info"

const App = ({ isAuthenticated, user }) => {


    return (
        <Router>
            <Layout>
                {isAuthenticated && user ?
                    (user.is_staff ?
                            (
                                <Switch>
                                    <Route exact path='/' component={Home}/>
                                    <Route exact path='/login' component={Login}/>
                                    <Route exact path='/signup' component={Signup}/>
                                    <Route exact path='/reset_password' component={ResetPassword}/>
                                    <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm}/>
                                    <Route exact path='/activate/:uid/:token' component={Activate}/>
                                    <Route exact path="/customers">
                                        <Customers/>
                                    </Route>
                                    <Route exact path="/addCustomer">
                                        <AddCustomer/>
                                    </Route>
                                    <Route exact path="/medicines">
                                        <Medicines/>
                                    </Route>
                                    <Route exact path="/addMedicine">
                                        <AddMedicine/>
                                    </Route>
                                    <Route exact path="/searchMedicines">
                                        <SearchMedicines/>
                                    </Route>
                                    <Route exact path="/medicineOrders">
                                        <MedicineOrders/>
                                    </Route>
                                    <Route exact path="/medicineOrder/:id" component={MedicineOrder}/>
                                    <Route exact path="/newMedicineOrder">
                                        <AddMedicineOrder/>
                                    </Route>
                                    <Route exact path="/newOrderMessages">
                                        <Messages/>
                                    </Route>
                                    <Route exact path="/categories">
                                        <Categories/>
                                    </Route>
                                    <Route exact path="/addCategory">
                                        <AddCategory/>
                                    </Route>
                                    <Route exact path="/statistics">
                                        <Statistics/>
                                    </Route>
                                </Switch>
                            )
                            :
                            (
                                <Switch>
                                    <Route exact path='/' component={Home}/>
                                    <Route exact path='/login' component={Login}/>
                                    <Route exact path='/signup' component={Signup}/>
                                    <Route exact path='/reset_password' component={ResetPassword}/>
                                    <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm}/>
                                    <Route exact path='/activate/:uid/:token' component={Activate}/>
                                    <Route exact path="/customers">
                                        <Customers/>
                                    </Route>
                                    <Route exact path="/medicines">
                                        <MedicinesUser/>
                                    </Route>
                                    <Route exact path="/searchMedicines">
                                        <SearchMedicines/>
                                    </Route>
                                    <Route exact path="/medicineOrders">
                                        <MedicineOrdersUSer/>
                                    </Route>
                                    <Route exact path="/medicineOrder/:id" component={MedicineOrderUser}/>
                                    <Route exact path="/newMedicineOrder">
                                        <AddMedicineOrderUser/>
                                    </Route>
                                    <Route exact path="/categories">
                                        <CategoriesUser/>
                                    </Route>
                                    <Route exact path="/info">
                                        <Info/>
                                    </Route>
                                </Switch>
                            )

                    )
                    :
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/signup' component={Signup}/>
                        <Route exact path='/reset_password' component={ResetPassword}/>
                        <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm}/>
                        <Route exact path='/activate/:uid/:token' component={Activate}/>

                    </Switch>
                }
            </Layout>
        </Router>
    );

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps)(App);
