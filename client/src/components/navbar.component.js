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
        <nav class="navbar navbar-expand-xs navbar-expand-sm navbar-expand-md navbar-dark bg-dark">
            <Link to="/" className="navbar-brand">AC Tracker</Link>
            <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <Link to="/" className="nav-link">Lap Records</Link>
                    </li>
                    <li class="nav-item">
                        <Link to="/addLap" className="nav-link">Add Lap</Link>
                    </li>
                </ul>
            </div>
            <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a href="#" onClick={logout} className="nav-link">Logout</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;