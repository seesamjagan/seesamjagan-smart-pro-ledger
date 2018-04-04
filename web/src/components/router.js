import React from 'react';
import { BrowserRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import Dashboard from './dashboard';
import logo from './../logo.svg';
import Login from './login';
import Summary from './summary';
import AddTransaction from './add-transaction';


const Header = ({ match, location }, context) => (<header className="app-header">
    <img src={logo} alt="logo" className="app-logo" />
    <h1 className="app-title">SmartProLedger™</h1>
    {window.firebase.auth().currentUser && <a className="right" onClick={()=>window.firebase.auth().signOut()}>Logout</a>}
</header>);

const Footer = (props, context) => (<footer className='app-footer'>
    © {new Date().getFullYear()} All rights reserved. SmartProLedger™
</footer>);

const NotFound = (props) => <p>What the hell!</p>

const Router = () => (
    <BrowserRouter>
        <div className="container">
            <Route component={Header} />
            {window.firebase.auth().currentUser && 
            <nav>
                <NavLink activeClassName="active-link" to="/dashboard">Dashboard</NavLink>
                <NavLink activeClassName="active-link" to="/summary">Summary</NavLink>
                <NavLink activeClassName="active-link" to="/add/cr">Add Credit</NavLink>
                <NavLink activeClassName="active-link" to="/add/dr">Add Debit</NavLink>
            </nav>
            }
            <Switch>
                <UserRoute exact path="/" component={Dashboard} />
                <Route path="/login" component={Login} />
                <UserRoute path="/summary" component={Summary} />
                <UserRoute path="/add/:transaction(cr|dr)" component={AddTransaction} />
                <UserRoute path="/dashboard" component={Dashboard} />
                <UserRoute component={NotFound} />
            </Switch>
            <Route component={Footer} />
        </div>

    </BrowserRouter>
)

const UserRoute = ({component: Component, ...rest}) => {
    const firebase = window.firebase;
    return <Route {...rest}
        render={props => firebase.auth().currentUser ? <Component  {...props} /> : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
        />
}


export default Router;