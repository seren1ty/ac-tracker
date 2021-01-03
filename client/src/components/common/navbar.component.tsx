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
        <nav className="navbar navbar-expand-xs navbar-expand-sm navbar-expand-md navbar-dark nav-colour">
            <Link to="/" className="navbar-brand nav-title pl-1">AC Tracker</Link>
            <div className="w-100 order-1 order-md-0 dual-collapse2">
                {/*<ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link nav-item sub-item">Lap Records</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/addLap" className="nav-link nav-item sub-item">Add Lap</Link>
                    </li>
                </ul>*/}
            </div>
            <div>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button onClick={logout} className="nav-link nav-item btn btn-link">Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;