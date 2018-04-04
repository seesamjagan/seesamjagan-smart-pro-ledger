import React from 'react';
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
export default class Summary extends React.Component {

    state = {
        transactions: [],
        isLoading: false,
    };

    componentWillMount() {
        let uid = window.firebase.auth().currentUser.uid;
        let d = new Date()
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        this.currentUserData = window.firebase.database().ref(`${uid}/data/${year}-${month}`);
        this.setState({isLoading: true});

        this.currentUserData.on('value', (snapshot) => {
            let transactions = [];
            let monthData = snapshot.val();
            this.setState({isLoading: false});
            if(!monthData) {
                // no data returened.
                return;
            }
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

    componentWillUnmount() {
        this.currentUserData && this.currentUserData.off('value');
    }

    render() {
        let d = new Date();
        const { transactions, isLoading } = this.state;
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
                        //No Transactions found for the month ${MONTH_NAMES[d.getMonth()]}  
                        transactions.length === 0 && <tr>
                        <th className="center" colSpan={6}>{ isLoading ? 'Loading...' : `No Transactions found for the month ${MONTH_NAMES[d.getMonth()]}`}</th>
                    </tr>
                    }
                    {

                        transactions.map(transaction => {
                            if (transaction.type === 'cr') {
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
    <td className="currency-col">{type === 'dr' ? value.toLocaleString('en-IN', {style: 'currency', currency: 'INR', currencyDisplay: 'symbol', useGrouping: true}) : '-'}</td>
    <td className="currency-col">{type === 'cr' ? value.toLocaleString('en-IN', {style: 'currency', currency: 'INR', currencyDisplay: 'symbol', useGrouping: true}) : '-'}</td>
</tr>)
