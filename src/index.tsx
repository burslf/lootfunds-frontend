import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { MoralisProvider } from "react-moralis";
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    // <MoralisProvider serverUrl={process.env["REACT_APP_SERVER_URL"]} appId={process.env["REACT_APP_APP_ID"]}>
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    // </MoralisProvider>,
  document.getElementById('root')
);

reportWebVitals();