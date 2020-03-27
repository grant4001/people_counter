import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = ({ username, handleLogout }) => {
    let logout = !!username ? <div>
        <div>Hello, {username}</div>
        <a href="/" onClick={handleLogout}>Logout</a>
    </div> : <div />;
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <a className="navbar-brand" href="/">Navbar</a>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/login">Admin Login</NavLink>
                    </li>
                </ul>
            </div>
            {logout}
        </nav>
    );
}

export default Navigation;