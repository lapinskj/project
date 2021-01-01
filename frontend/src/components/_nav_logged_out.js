import React from 'react'
import HomeIcon from '@material-ui/icons/Home';

const _nav_logged_out =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Home',
    to: '/',
    icon: <HomeIcon className="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavDivider',
    className: 'm-1'
  },
];

export default _nav_logged_out
