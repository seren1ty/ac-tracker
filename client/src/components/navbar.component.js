import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {

    const history = useHistory();

    const logout = () => {
        axios.post('/session/logout')
            .then(() => {
                history.push('/login');
            });
    }

    return (
        <nav className="navbar navbar-expand-xs navbar-expand-sm navbar-expand-md navbar-dark bg-dark">
            <Link to="/" className="navbar-brand">AC Tracker</Link>
            <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link to="/" className="nav-link">Lap Records</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/addLap" className="nav-link">Add Lap</Link>
                    </li>
                </ul>
            </div>
            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a href="#" onClick={logout} className="nav-link">Logout</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;