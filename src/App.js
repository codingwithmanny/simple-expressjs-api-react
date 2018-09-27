import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

class App extends Component {
  notFound () {
    return (
      <div className="Notfound">
        <div className="container">
          <div className="row">
            <div className="col">
              <h1>Not found.</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <main>
          <Switch>
            <Route exact path="/login" render={() => {
              if (localStorage.token) {
                return (<Redirect to="/dashboard" />)
              }
              return (<Login />)
            }} />

            <Route exact path="/dashboard" render={() => {
              if (!localStorage.token) {
                return (<Redirect to="/login" />)
              }
              return (<Dashboard />)
            }} />

            <Route exact path="/" render={() => {
              return ((localStorage.token) ? <Redirect to="/dashboard" /> : <Redirect to="/login" />)
            }} />

            <Route component={this.notFound} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default withRouter(App);
