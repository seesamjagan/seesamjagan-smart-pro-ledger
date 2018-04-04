import React, { Component } from 'react';

class Login extends Component {
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
        window.firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('logn error %O', error, errorCode, errorMessage);
            alert(errorCode + '\n\n' + errorMessage);
        });
    }

    componentWillMount() {
        const auth = window.firebase.auth();
        if (auth.currentUser) {
            this.props.history.push('/');
        }
        else {
            this.unsubscribeAuthStateChange = auth.onAuthStateChanged(currentUser => {
                if (currentUser) {
                    this.props.history.push(this.props.location.state ? this.props.location.state.from || '/' : '/');
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribeAuthStateChange) {
            this.unsubscribeAuthStateChange();
        }
    }

    render() {
        return (<div className="login route-view">
            <header>
                <h2>Login</h2>
            </header>
            <div className="form-control">
                <label>email</label>
                <input type="email" name='email' onChange={this.onChange} placeholder='user@domain.com' />
            </div>
            <div className="form-control">
                <label>password</label>
                <input type="password" name='password' onChange={this.onChange} placeholder='password' />
            </div>
            <footer>
                <button onClick={this.onLogin}>SignIn</button> <span>|</span> <button onClick={this.onLogin}>SignUp</button>
            </footer>
        </div>)
    }
}

export default Login;