import React from 'react';
import 'core-js';
import ReactDOM from 'react-dom';
import App from './App';

import { icons } from './assets/icons'
React.icons = icons;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
