import React from 'react'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import MessageIcon from '@material-ui/icons/Message';

const _nav_user =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Home',
    to: '/',
    icon: <HomeIcon className="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Orders']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'My orders',
    to: '/medicineOrders',
    icon: <ShoppingCartIcon className="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'New order',
    to: '/newMedicineOrder',
    icon: <AddShoppingCartIcon className="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Customers']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Customers list',
    to: '/customers',
    icon: <PeopleIcon className="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Medicines']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Search medicine',
    to: '/searchMedicines',
    icon: <SearchIcon className="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Medicines list',
    to: '/medicines',
    icon: 'cil-medical-cross',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Contact']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Contact form',
    to: '/',
    icon: <MessageIcon className="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-1'
  },
];

export default _nav_user
