import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './Login.css';
import axios from 'axios'
import sha1 from 'sha1'

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email : "",
            password : ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(event) {
        console.log("Logging...");
        console.log(event);
        axios.post("/login",{
            email: this.state.email,
            password: sha1(this.state.password)
        }).then((response)=>{
            console.log("Success!");
            console.log(response);
        }).catch(function (error) {
            console.log("Error!");
            console.log(error);
        });
        event.preventDefault();
    }

    render() {
        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
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
                    <Button block size="lg" type="submit" disabled={!this.validateForm()}>
                        Login
                    </Button>
                </Form>
                {this.validateForm()}
            </div>
        );
    }
}

export default Login;