import React, { Component } from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Customers from "./components/Customer/Customers"
import Medicines from "./components/Medicine/Medicines"
import SearchMedicines from "./components/Medicine/SearchMedicines";
import MedicineOrders from "./components/MedicineOrder/MedicineOrders";
import AddMedicineOrder from "./components/MedicineOrder/AddMedicineOrder";
import Dashboard  from "./components/Dashboard/Dashboard";
import NavigationBar from "./components/Dashboard/NavigationBar";
import './App.css';
import MedicineOrder from "./components/MedicineOrder/MedicineOrder";



class App extends Component {

    render(){
        return(
            <BrowserRouter>
                <NavigationBar/>
                <Switch>
                    <Route exact path="/">
                        <Dashboard/>
                    </Route>
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
                </Switch>
            </BrowserRouter>
        );
    }

}

export default App;
