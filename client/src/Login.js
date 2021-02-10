import React, { Component } from 'react';
import axios from 'axios'

class Login extends Component {

    state = {
        email: "",
        password: ""
    };

    function validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="Login">
                <Form onSubmit={handleSubmit}>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!validateForm()}>
                        Login
                    </Button>
                </Form>
            </div>
        );
    }
}

export default Login;