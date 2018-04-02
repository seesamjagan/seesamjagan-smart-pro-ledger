import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

let firebase = null;

const MONTH_NAMES = [
  'January', // - 31 days
  'February', // - 28 days in a common year and 29 days in leap years
  'March', // - 31 days
  'April', // - 30 days
  'May', // - 31 days
  'June', // - 30 days
  'July', // - 31 days
  'August', // - 31 days
  'September', // - 30 days
  'October', // - 31 days
  'November', // - 30 days
  'December', // - 31 days
];

class App extends Component {

  state = {
    currentUser: null,
  };

  componentWillMount() {

    window.document.addEventListener('DOMContentLoaded', () => {
      // Get a reference to the database service

      firebase = window.firebase;

      if (firebase) {
        const currentUser = firebase.auth().currentUser;

        if (!currentUser) {
          console.debug('No Current User found on load!!!!');
        }

        this.setState({ currentUser });

        firebase.auth().onAuthStateChanged(currentUser => {
          console.log('currentUser %O, displayName: %s', currentUser, currentUser && currentUser.displayName);
          this.setState({
            currentUser: currentUser,
          });
        });
      }
    });// end of dom content loaded
  }

  onLogin = e => {
    
  }

  onLogout = e => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      alert('logged out');
    }).catch(function(error) {
      // An error happened.
      alert(error.message)
    });
  }

  render() {
    if (!firebase) {
      return <div>Loading...</div>
    }
    return (
      <Fragment>
        <Header currentUser={this.state.currentUser} onLogin={this.onLogin} onLogout={this.onLogout} />
        <Main currentUser={this.state.currentUser} />
        <Footer />
      </Fragment>
    );
  }
}

const Header = ({currentUser, onLogin, onLogout}, context) => (<header className="app-header">
  <img src={logo} alt="logo" className="app-logo" />
  <h1 className="app-title">SmartProLedger™</h1>
  <a onClick={currentUser?onLogout:onLogin}>{currentUser?'Logout': 'Login'}</a>
</header>);

const Footer = (props, context) => (<footer className='app-footer'>
  © {new Date().getFullYear()} All rights reserved. SmartProLedger™
</footer>);

class Main extends React.Component {
  render() {
    const { currentUser } = this.props;
    if (!currentUser) {
      return <Login />
    }
    return <Summary uid={currentUser.uid} />
  }
}

class Login extends React.Component {
  state = {
    email: '',
    password: ''
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onLogin = e => {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error('logn error %O', error);
      // ...
    });
  }

  render() {
    return (<div>
      <div>
        <label>email</label>
        <input type="email" name='email' onChange={this.onChange} placeholder='user@domain.com' />
      </div>
      <div>
        <label>password</label>
        <input type="password" name='password' onChange={this.onChange} placeholder='password' />
      </div>
      <div>
        <button onClick={this.onLogin}>Login</button>
      </div>
    </div>)
  }
}


class Summary extends React.Component {
  state = {
    transactions: []
  };

  componentWillMount() {
    let uid = this.props.uid;
    let d = new Date()
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    this.currentUserData = firebase.database().ref(`${uid}/data/${year}-${month}`);

    this.currentUserData.on('value', (snapshot) => {
      let transactions = [];
      let monthData = snapshot.val();
      Object.keys(monthData).forEach(date => {
        let dayData = monthData[date];
        Object.keys(dayData).forEach(ts => {
          let trans = dayData[ts];
          trans.date = new Date(year, month - 1, date);
          trans.id = ts;
          console.log(trans);
          transactions.push(trans);
        });
      });
      this.setState({ transactions }); // end of setstate // {achievements, experience, educations, title, desc, picture, name, skills}
    }); //end of on value
  }

  render() {
    let d = new Date();
    const { transactions } = this.state;
    let ins = 0;
    let outs = 0;
    return (<section>
      <table>
        <thead>
          <tr>
            <th className="center" colSpan={6}>Transactions of {MONTH_NAMES[d.getMonth()]}  {d.getFullYear()}</th>
          </tr>
          <tr>
            <th>Date</th>
            <th>Note</th>
            <th>Head</th>
            <th>Mode</th>
            <th className="currency-col">Expense</th>
            <th className="currency-col">Income</th>
          </tr>
        </thead>
        <tbody>
          {

            transactions.map(transaction => {
              if (transaction.type === '+') {
                ins += Number(transaction.value);
              } else {
                outs += Number(transaction.value);
              }
              return <Transaction {...transaction} key={transaction.id} />
            })
          }

        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>Total</td>
            <td></td>
            <td></td>
            <td className="currency-col">{outs}</td>
            <td className="currency-col">{ins}</td>
          </tr>
        </tfoot>
      </table>
    </section>)
  }
}

const Transaction = ({ head, mode, note, type, value, date }) => (<tr>
  <td>{date.getDate()}</td>
  <td>{note}</td>
  <td>{head}</td>
  <td>{mode}</td>
  <td className="currency-col">{type === '-' ? value : '-'}</td>
  <td className="currency-col">{type === '+' ? value : '-'}</td>
</tr>)

export default App;
