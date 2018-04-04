import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
    render() {
        return (
            <div>
                This is dashboard! got to <Link to="/summary">Summary</Link>
            </div>
        );
    }
}

export default Dashboard;