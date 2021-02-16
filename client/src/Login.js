import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tabs";
import './Login.css';
import axios from 'axios'
import sha1 from 'sha1'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import {cookies} from './cookie-manager'
import {changeRootState} from './state-manager'
import {isDefined} from './helpers'

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            tel: "",
            level: "",
            errorMsg: "⠀",
            name: "",
            surname: ""
        };
    }

    validateLogin() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    validateRegister() {
        return this.state.email.length > 0 && this.state.password.length > 0 && this.state.name.length > 0 && this.state.surname.length>0 && isDefined(this.state.tel) && this.state.tel.length > 0 && this.state.level.length > 0 && this.state.level != "Wybierz";
    }

    error(errorMsg){
        this.setState({errorMsg: errorMsg, password: ""});
    }

    resetError(){
        this.setState({errorMsg:"⠀"});
    }

    componentWillMount(){
        this.error = this.error.bind(this);
        this.resetError = this.resetError.bind(this);
    }

    handleLogin(event) {
        const errorFun = this.error.bind(this);

        event.preventDefault();
        axios.post("/api/v1/login", {
            email: this.state.email,
            password: sha1(this.state.password)
        }).then((response) => {
            console.log("Success!");
            cookies.set('token', response.data.token, {path: '/'});
            changeRootState({page: "dashboard"});
            console.log(cookies.get('token'));
        }).catch(function (error) {
            console.log("Error!");
            console.log(error.response.data);
            errorFun(JSON.stringify(error.response.data));
        });
    }

    handleRegister(event) {
        const errorFun = this.error.bind(this);

        event.preventDefault();
        axios.post("/api/v1/register", {
            email: this.state.email,
            name: this.state.name,
            surname: this.state.surname,
            password: sha1(this.state.password),
            tel: this.state.tel,
            level: this.state.level
        }).then((response) => {
            console.log("Success!");
            cookies.set('token', response.data.token, {path: '/'});
            changeRootState({page: "dashboard"});
            console.log(cookies.get('token'));
        }).catch((error) => {
            console.log("Error!");
            console.log(error);
            errorFun(JSON.stringify(error.response.data));
        });
    }

    render() {
        return (
            <div className="Login">
                <Tabs onSelect={this.resetError} >
                    <Tab eventKey="LoginTab" title="Login" onClick={this.resetError} tabClassName="noborder">
                        <div className="error"> {this.state.errorMsg}</div>
                        <Form onSubmit={(e) => this.handleLogin(e)}>
                            <Form.Group size="lg" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="email"
                                    value={this.state.email}
                                    onChange={(e) => this.setState({email: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group size="lg" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={this.state.password}
                                    onChange={(e) => this.setState({password: e.target.value})}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={!this.validateLogin()}>
                                Login
                            </Button>
                            <div className="error">⠀</div>
                        </Form>
                    </Tab>
                    <Tab eventKey="Register" title="Register" onClick={this.resetError}>
                        <div className="error"> {this.state.errorMsg}</div>
                        <Form onSubmit={(e) => this.handleRegister(e)}>
                            <Form.Group size="lg" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="email"
                                    value={this.email}
                                    onChange={(e) => this.setState({email: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group size="lg" controlId="name">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="text"
                                    value={this.state.name}
                                    onChange={(e) => this.setState({name: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group size="lg" controlId="surname">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="text"
                                    value={this.state.surname}
                                    onChange={(e) => this.setState({surname: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group size="lg" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={this.state.password}
                                    onChange={(e) => this.setState({password: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <PhoneInput
                                    placeholder="Enter your phone number"
                                    defaultCountry="PL"
                                    value={this.state.tel}
                                    onChange={(e) => {
                                        this.setState({tel: e})
                                    }}/>
                            </Form.Group>
                            <Form.Group controlId="level">
                                <Form.Label>Level</Form.Label>
                                <Form.Control as="select" defaultValue="Choose"
                                              onChange={(e) => this.setState({level: e.target.value})}>
                                    <option>Choose</option>
                                    <option>beginner</option>
                                    <option>intermediate</option>
                                    <option>advanced</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={!this.validateRegister()}>
                                Register
                            </Button>
                            <div className="error">⠀</div>
                        </Form>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default Login;