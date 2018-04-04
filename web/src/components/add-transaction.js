import React, { Component } from 'react';
import "./add-transaction.css";

class AddTransaction extends Component {

    state = {
        settings: {},
        isLoading: false,
    }

    onInputChange = ({target}) => {
        this.setState({
            [target.name]: target.value
        });
    }

    onAddTransaction = e => {
        const {
            date,
            head,
            value,
            mode,
            note,
        } = this.state;

        const currentUser = window.firebase.auth().currentUser;
        const {uid} = currentUser;
        const parts = date.split('/');
        const ts = new Date().getTime();
        const path = `${uid}/data/${parts[2]}-${parts[1]}/${parts[0]}/${ts}`;
        const db = window.firebase.database().ref(path);
        const {match} = this.props;
        const transactionType = match.params.transaction;
        const setVal = db.set({
            head,
            value,
            type: transactionType === 'cr' ? '+' : '-',
            mode,
            note
        });

        console.log('setMethod return value', setVal);
    }

    componentWillMount() {
        const currentUser = window.firebase.auth().currentUser;
        const {uid} = currentUser;
        //const date = new Date();
        this.settingsData = window.firebase.database().ref(`${uid}/settings`);
        this.setState({isLoading: true});
        this.settingsData.on('value', snapshot=>{
            const settings = snapshot.val() || {};
            this.setState({
                settings,
                isLoading: false,
            });
        });
    }

    componentWillUnmount() {
        this.settingsData && this.settingsData.off('value');
    }

    render() {
        const {settings}=this.state;
        const {match} = this.props;
        const transactionType = match.params.transaction;
        const heads = settings[transactionType+'-heads'];
        const modes = settings['mode-heads']; 
        //const today = new Date();
        return (
            <div className="add-transaction route-view">
                <header>
                    <h2>Add New {transactionType}</h2>
                </header>
                <div className="form-control">
                    <label>Date</label>
                    <input onChange={this.onInputChange} type="text" name="date" placeholder="d/m/yyyy" />
                </div>
                <div className="form-control">
                    <label>Head</label>
                    <select onChange={this.onInputChange} name="head">
                        {heads && Object.keys(heads).map(head=><option key={head}>{head}</option>)}
                    </select>
                </div>
                <div className="form-control">
                    <label>Value</label>
                    <input onChange={this.onInputChange} type="number" name="value" placeholder="1000.50" defaultValue={0} />
                </div>
                <div className="form-control">
                    <label>Mode</label>
                    <select onChange={this.onInputChange} name="mode">
                        {heads && Object.keys(modes).map(mode=><option key={mode}>{mode}</option>)}
                    </select>
                </div>
                <div className="form-control">
                    <label>Note</label>
                    <input onChange={this.onInputChange} type="text" name="note" placeholder="a short note about the transaction" defaultValue="" />
                </div>
                <footer className="footer">
                    <button onClick={this.onAddTransaction}>Add {transactionType.toUpperCase()}</button>
                </footer>
            </div>
        );
    }
}

export default AddTransaction;