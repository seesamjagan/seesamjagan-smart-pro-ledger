import React, { Component } from 'react';
import './App.css';
import Router from './components/router';
let firebase = null;

class App extends Component {

  state = {
    currentUser: null,
    hasGotUserInfo: false,
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
            hasGotUserInfo: true,
          });
        });
      }
    });// end of dom content loaded
  }

  render() {
    if (!firebase) {
      return <div>Loading Firebase...</div>
    }

    if(!this.state.hasGotUserInfo) {
      return <div>Checking for Auth...</div>
    }

    return <Router />
  }
}

export default App;
