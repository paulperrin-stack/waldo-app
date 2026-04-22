import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserReact } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserReact>
    <App />
  </BrowserReact>
);