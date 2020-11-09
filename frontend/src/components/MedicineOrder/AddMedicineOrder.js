import React, { Component } from "react";
import axios from "axios";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";



class AddMedicineOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customer: {
                id: null,
                name: "",
                surname: "",
                pesel: null,
                age: null
            },
            medicineSearchValues: [],
            orderItems: [{ medicine: "", amount: null}],
            customerSearchValue: {},
            activeCustomer: null,
            customersList: [],
            medicinesList: [[{}]]
        };
        this.onCustomerSearchChange = this.onCustomerSearchChange.bind(this);
        this.onCustomerChange = this.onCustomerChange.bind(this);
        this.onOrderItemChange = this.onOrderItemChange.bind(this);
    };

    onCustomerSearchChange = e => {
        let { name, value } = e.target;
        const customerSearchValue = { [name]: value };
        this.setState({ customerSearchValue });
    };


    onCustomerChange = e => {
        let customer = e.target.value;
        this.setState({activeCustomer: customer});
    };

    onCustomerSearchSubmit = () => {
        let customerSearchValue = this.state.customerSearchValue;
        if (customerSearchValue) {
            axios
                .get(`customers/?pesel=${customerSearchValue['pesel']}`, customerSearchValue)
                .then(res => {
                    this.setState({customersList: res.data});
                    this.setState({activeCustomer: res.data[0].id});
                })
                .catch(err => console.log(err));
        }
    };

    onMedicineSearchSubmit = (e) => {
        let id = e.target.id.slice(6);
        let medicineSearchValue = this.state.medicineSearchValues[id];
        let medicineSearchObject = {name: medicineSearchValue}
        if (medicineSearchObject) {
            axios
                .get(`medicines/?name=${medicineSearchObject["name"]}`, medicineSearchObject)
                .then(res => {
                    let medicinesList = [...this.state.medicinesList];
                    medicinesList[id] = res.data;
                    this.setState({medicinesList});
                    let orderItems = [...this.state.orderItems];
                    orderItems[id].medicine = res.data[0].id;
                    this.setState({orderItems});
                })
                .catch(err => console.log(err));
        }
    };


    renderCustomers = () => {
        const customersList = this.state.customersList;
        return customersList.map(customer => (
            <option value={customer.id}>
                {customer.id} {customer.name} {customer.surname} {customer.pesel}
            </option>
        ));
    };

    renderMedicines = (id) => {
        const medicinesList = this.state.medicinesList[id];
        if (medicinesList) {
            return medicinesList.map(medicineItem => (
                <option value={medicineItem.id}>
                    {medicineItem.id} {medicineItem.name} {medicineItem.price}
                </option>
            ));
        }
    };

    addOrderItem = (e) => {
        this.setState((prevState) => ({
            orderItems: [...prevState.orderItems, {medicine: "", amount: null}],
        }));
    };

    onMedicineOrderSubmit = (e) => {
        let {activeCustomer, orderItems} = this.state;
        let newOrder = {customer: activeCustomer, medicineOrderItems: orderItems};
        axios
            .post("medicineOrders/", newOrder)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    onOrderItemChange = (e) => {
        let orderItems = [...this.state.orderItems];
        let item = {...orderItems[e.target.dataset.id]};
        item[e.target.name]= e.target.value;
        orderItems[e.target.dataset.id] = item;
        this.setState( {orderItems});
    };

    onMedicineSearchChange = (e) => {
        let medicineSearchValues = [...this.state.medicineSearchValues];
        medicineSearchValues[e.target.dataset.id] = e.target.value;
        this.setState( {medicineSearchValues});
    };

    render () {
        let orderItems = this.state.orderItems;
        return (
            <div>
                <h3>
                    Dodaj nowe zamówienie
                </h3>
                <span>
                    <Form>
                        <FormGroup>
                            <Label for="pesel">Search customer by pesel</Label>
                            <Button color="primary" onClick={this.onCustomerSearchSubmit}>Search</Button>
                            <Input
                                type="text"
                                name="pesel"
                                value={this.state.customerSearchValue.pesel}
                                onChange={this.onCustomerSearchChange}
                                placeholder="Enter pesel"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="customer">Customer</Label>
                            <Input
                                type="select"
                                name="customer"
                                value={this.state.activeCustomer}
                                onChange={this.onCustomerChange}
                            >
                                {this.renderCustomers()}
                            </Input>
                        </FormGroup>
                        <wbr/>
                        <div>
                           <Button onClick={this.addOrderItem}>
                                Add another medicine
                            </Button>
                        </div>
                        <abbr/>
                        <FormGroup>
                            {
                                orderItems.map( (val, idx) => {
                                    let buttonId = `button${idx}`, medicineSearchId = `medicineSearch${idx}`, medicineId = `medicine${idx}`, amountId = `amount${idx}`;
                                    return (
                                        <div key={idx}>
                                            <abbr/>
                                            <Label>{`Order item #${idx + 1}`}</Label>
                                            <Button color="primary" id = {buttonId} onClick={this.onMedicineSearchSubmit}>Search</Button>
                                            <Input
                                                type="text"
                                                name="medicineSearch"
                                                data-id={idx}
                                                id={medicineSearchId}
                                                value={this.state.medicineSearchValues[idx]}
                                                onChange={this.onMedicineSearchChange}
                                                placeholder="Enter medicine name"
                                            />
                                            <br/>
                                            <Label for={medicineId}>Medicine</Label>
                                            <Input
                                                type="select"
                                                name="medicine"
                                                data-id={idx}
                                                id={medicineId}
                                                value={orderItems[idx].medicine}
                                                onChange={this.onOrderItemChange}
                                            >
                                                {this.renderMedicines(idx)}
                                            </Input>
                                            <Label for={amountId}>Amount</Label>
                                            <Input
                                                type="text"
                                                name="amount"
                                                data-id={idx}
                                                id={amountId}
                                                value={orderItems[idx].amount}
                                                onChange={this.onOrderItemChange}
                                                placeholder="Enter medicine amount"
                                            />
                                            <abbr/>
                                        </div>
                                    )
                                })
                            }
                        </FormGroup>
                    </Form>
                </span>
                <wbr/>
                <span>
                    <h4>
                        Podsumowanie
                    </h4>
                    <p>
                        Customer: {this.state.activeCustomer ? this.state.activeCustomer : null}
                    </p>
                    {orderItems.map((item) => {
                        return(
                            <p>Nazwa: {item.medicine} Ilość: {item.amount}</p>
                        )
                    })}
                </span>
                <Button onClick={this.onMedicineOrderSubmit}>
                    Submit
                </Button>
            </div>
        );
    }

}

export default AddMedicineOrder;