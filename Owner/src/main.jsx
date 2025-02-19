import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import AlertProvider from './context/AlertContext';

const root = ReactDOM.createRoot (document.getElementById ('root'));
root.render (
  <BrowserRouter>
      <AlertProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AlertProvider>
  </BrowserRouter>
);
