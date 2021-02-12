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
            errorMsg: ""
        };
    }

    validateLogin() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    validateRegister() {
        return this.state.email.length > 0 && this.state.password.length > 0 && isDefined(this.state.tel) && this.state.tel.length > 0 && this.state.level.length > 0 && this.state.level != "Wybierz";
    }

    error(){
        this.setState({errorMsg: "Error", password: ""});
    }

    resetError(){
        this.setState({errorMsg:""});
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
            console.log(response);
            console.log("Success!");
            cookies.set('token', '123456789', {path: '/'});
            changeRootState({page: "dashboard"});
            console.log(response);
        }).catch(function (error) {
            console.log("Error!");
            console.log(error);
            errorFun();
        });
    }

    handleRegister(event) {
        event.preventDefault();
        axios.post("/api/v1/register", {
            email: this.state.email,
            password: sha1(this.state.password),
            tel: this.state.tel,
            level: this.state.level
        }).then((response) => {
            console.log("Success!");
            cookies.set('token', '123456789', {path: '/'});
            changeRootState({page: "dashboard"});
            console.log(response);
        }).catch((error) => {
            console.log("Error!");
            console.log(error);
            this.error();
        });
    }

    render() {
        return (
            <div className="Login">
                <Tabs onSelect={this.resetError} >
                    <Tab eventKey="Login" title="Login" onClick={this.resetError}>
                        <div className="error"> {this.state.errorMsg}</div>
                        <Form onSubmit={(e) => this.handleLogin(e)}>
                            <Form.Group size="lg" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    autoFocus
                                    type="email"
                                    value={this.email}
                                    onChange={(e) => this.setState({email: e.target.value})}
                                />
                            </Form.Group>
                            <Form.Group size="lg" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={this.password}
                                    onChange={(e) => this.setState({password: e.target.value})}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={!this.validateLogin()}>
                                Login
                            </Button>
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
                                    placeholder="Wprowadź nr telefonu"
                                    defaultCountry="PL"
                                    value={this.state.tel}
                                    onChange={(e) => {
                                        this.setState({tel: e})
                                    }}/>
                            </Form.Group>
                            <Form.Group controlId="level">
                                <Form.Label>Poziom zaawansowania</Form.Label>
                                <Form.Control as="select" defaultValue="Wybierz"
                                              onChange={(e) => this.setState({level: e.target.value})}>
                                    <option>Wybierz</option>
                                    <option>początkujący</option>
                                    <option>średniozaawansowany</option>
                                    <option>zaawansowany</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={!this.validateRegister()}>
                                Register
                            </Button>
                        </Form>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default Login;