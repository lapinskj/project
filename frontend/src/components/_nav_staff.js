import React from 'react'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import BarChartIcon from '@material-ui/icons/BarChart';
import PersonIcon from '@material-ui/icons/Person';

const _nav_staff =  [
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
    name: 'Orders list',
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
    _tag: 'CSidebarNavItem',
    name: 'Add customer',
    to: '/addCustomer',
    icon: <PersonAddIcon className="c-sidebar-nav-icon"/>,
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
    _tag: 'CSidebarNavItem',
    name: 'Add medicine',
    to: '/addMedicine',
    icon: 'cil-plus',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Medicine categories']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Categories list',
    to: '/categories',
    icon: 'cil-list',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Add category',
    to: '/addCategory',
    icon: 'cil-plus',
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Statistics']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Statistics',
    to: '/statistics',
    icon: <BarChartIcon className="c-sidebar-nav-icon"/>,

  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Account']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Account',
    to: '/account',
    icon: <PersonIcon className="c-sidebar-nav-icon"/>,

  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-1'
  },
];

export default _nav_staff
