import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './root/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import  {CapsuleProvider} from './context/Context'
import 'alertifyjs/build/css/alertify.min.css' 

ReactDOM.render(
<CapsuleProvider ><BrowserRouter><App /></BrowserRouter></CapsuleProvider>

, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
