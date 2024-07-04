import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ShopContextProvider from './Context/ShopContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

ReactDOM.render(
  <React.StrictMode>
    <PayPalScriptProvider options={{ 
      "client-id": "AZKZtZ-zoGzqkDoPOLGRQoocJGv6Uu-yI-fBOp5eOAy6PelONLq8apjQEnsTSMbwac2pqleSAE_ChS6Y"
    }}>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </PayPalScriptProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
