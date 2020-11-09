import React from 'react';
import {
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink
} from 'reactstrap';

const NavigationBar = (props) => {

    return (
        <div>
            <Navbar color="light">
                <NavbarBrand href="/">Pharmacy</NavbarBrand>
                <NavItem>
                    <NavLink href="/customers">Customers</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/medicines">Medicines</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/searchMedicines">Search Medicines</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/medicineOrders">Medicine Orders</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/newMedicineOrder">New Order</NavLink>
                </NavItem>
            </Navbar>
        </div>
    );
}

export default NavigationBar;