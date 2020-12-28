import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './scss/style.scss';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import Customers from "./pharmacy/Customer/Customers";
import Medicines from "./pharmacy/Medicine/Medicines";
import SearchMedicines from "./pharmacy/Medicine/SearchMedicines";
import MedicineOrder from "./pharmacy/MedicineOrder/MedicineOrder";
import MedicineOrders from "./pharmacy/MedicineOrder/MedicineOrders";
import AddMedicineOrder from "./pharmacy/MedicineOrder/AddMedicineOrder";
import Messages from "./pharmacy/Message/Messages";
import Statistics from "./pharmacy/Statistics/Statistics";
import Categories from "./pharmacy/Category/Categories";
import { Provider } from 'react-redux';
import store from './store';
import Layout from './hocs/Layout';

const App = () => (

    <Provider store={store}>
        <Router>
            <Layout>
                {localStorage.getItem("is_staff") ?
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
                            <Medicines/>
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
                        <Route exact path="/statistics">
                            <Statistics/>
                        </Route>
                    </Switch>
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
    </Provider>
);

export default App;
