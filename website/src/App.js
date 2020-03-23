import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LocationHistory from './Components/LocationHistory';
import Home from './Components/Home';
import Error from './Components/Error';
import Navigation from './Components/Navigation';
import AdminLogin from './Components/AdminLogin';
import AdminPortal from './Components/AdminPortal';

class App extends Component {
  state = { username: undefined };
  constructor(props) {
    super(props);
    this.state.username = sessionStorage.getItem("username");
    this.handleUserLogin = this.handleUserLogin.bind(this);
  }

  handleUserLogin(username) {
    sessionStorage.setItem("username", username);
    this.setState({ username: username });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navigation username={this.state.username} handleLogout={() => this.handleUserLogin("")} />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/login" render={() => <AdminLogin handleUserLogin={this.handleUserLogin} />} />
            <Route path="/portal" component={AdminPortal} />
            <Route path="/location" component={LocationHistory} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
