import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import { fireAuth } from './firebase';

//ALT BETWEEN LOGIN/HOMEPAGE with !
if(fireAuth.currentUser != null)
{ // == true
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
  //simulate any clicks needed here
  document.getElementById('searchTab').click();
}
else
{
  ReactDOM.render(
    <React.StrictMode>
      <Login />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
