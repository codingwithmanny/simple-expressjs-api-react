import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Config from '../config.json';

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: null,
            submitted: false
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit (event) {
        this.setState({
            errors: null,
            submitted: true
        }, () => {
            fetch(
                `${Config.url}/auth/login`,
                {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        password: this.state.password
                    })
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
                    email: '',
                    password: '',
                    submitted: false
                }, () => {
                    localStorage.token = json.token;
                    this.props.history.push(`/dashboard`);
                });
                console.log(json);
            })
            .catch((errors) => {
                this.setState({
                    errors,
                    submitted: false
                });
            })
        });

        event.preventDefault();
    }

    onChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div className="Login">
                <div className="container">
                    <div className="row">
                        <div className="col-6 offset-3">
                            <div className="card">
                                <div className="card-header">
                                    Login
                                </div>
                                <div className="card-body">
                                    <form onSubmit={this.onSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input disabled={this.state.submitted} onChange={this.onChange} className="form-control" name="email" type="email" placeholder="Email" value={this.state.email} /> 
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input disabled={this.state.submitted} onChange={this.onChange} className="form-control" name="password" type="password" placeholder="Password" value={this.state.password} /> 
                                        </div>
                                        {(this.state.errors)
                                            ?   (
                                                <div className="form-group">
                                                    <div className="alert alert-danger">
                                                        <ul>
                                                        {Object.keys(this.state.errors).map((item, key) =>
                                                            (
                                                                <li key={key}>{this.state.errors[item]}</li>
                                                            )
                                                        )}
                                                        </ul>
                                                    </div>
                                                </div>
                                                )
                                            :   null
                                        }
                                        <div className="form-group">
                                            <button disabled={this.state.submitted} type="submit" className="btn btn-primary">{(this.state.submitted) ? 'Loading...' : 'Login'}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
