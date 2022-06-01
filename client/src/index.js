import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Account } from './components/Account';
import reportWebVitals from './reportWebVitals';
import store from './redux/Store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import SignUp from './components/SignUp'
import Login from './components/Login'
import { PrivateRoute } from './PrivateRoute';
import { useSelector } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));
const userStatus = useSelector((state) => state.user.value.user[0].isLoggedIn);
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={store}>
        <Account>
          <Routes>
            <Route exact path='/' element={<App />} />
            <Route path='login' element={<Login />} />
            <Route path='SignUp' element={<SignUp />} />
          </Routes>
        </Account>
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
