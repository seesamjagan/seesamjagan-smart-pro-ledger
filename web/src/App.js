import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="logo" />
          <h1 className="App-title">Smart Pro Ledger</h1>
        </header>
        <p className="App-intro">
        Welcome to Smart Pro Ledger
        </p>
      </div>
    );
  }
}

export default App;
