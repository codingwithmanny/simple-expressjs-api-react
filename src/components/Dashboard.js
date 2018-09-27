import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Config from '../config.json';
import Loader from './Loader';

class Dashboard extends Component {
    constructor (props) {
        super(props);
        this.state = {
            data: null,
            loading: true
        }

        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount () {
        fetch(
            `${Config.url}/users/me`,
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token
                },
                method: 'get'
            }
        )
        .then((response) => {
            let json = response.json();

            if (!response.ok) {
                return json.then((result) => new Promise((resolve, reject) => reject(result)));
            }

            return json;
        })
        .then((json) => {
            this.setState({
                loading: false,
                data: json
            })
        })
        .catch((errors) => {
            if (errors.hasOwnProperty('error') && errors.error.toLowerCase().indexOf('invalid') > -1) {
                localStorage.removeItem('token');
                this.props.history.push(`/login`);
            }
        })
    }

    onLogout (event) {
        localStorage.removeItem('token');
        this.props.history.push(`/login`);
    }

    render () {
        return (
            <div className="Dashboard">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link to="/" className="navbar-brand">Dashboard</Link>
                    
                    <div className="collapse navbar-collapse" id="navbarText">
                        <span className="navbar-text">
                            <button onClick={this.onLogout} className="btn btn-info">Logout</button>
                        </span>
                    </div>
                </nav>

                <div className="container">
                    <div className="row">
                        <div className="col">
                            {(this.state.loading)
                                ?   (<Loader />)
                                :   (<h1>Welcome <code>${this.state.data.email}</code></h1>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Dashboard);
