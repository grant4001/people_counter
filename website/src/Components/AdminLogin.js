import React from 'react';
import { Redirect } from 'react-router-dom';

class AdminLogin extends React.Component {

    state = { redirect: false };

    onSubmit = () => {
        let username = document.getElementById("username").value;
        this.props.handleUserLogin(username);
        this.setState({ redirect: true });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/portal" />;
        }
        return (<div>
            <h1><b>Admin Login</b></h1>
            <div>
                <div className="form-group col-md-6">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" placeholder="Username" />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" />
                </div>
                <button className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
            </div>
        </div>);
    }
}

export default AdminLogin;