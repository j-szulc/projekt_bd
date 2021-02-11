import React, {Component} from 'react';
import './App.css';
import Login from './Login';
import Pools from './Pools';
import Timetable from './Timetable';
import Reservations from './Reservations';
import {listen} from './state-manager'
import {cookies} from './cookie-manager'
import {isDefined} from './helpers'
import axios from 'axios'

class App extends Component {

    constructor() {
        super();
        this.state = {
            page: "pools",
            response: {body: ""},
        };
    }

    componentDidMount() {
        this.receiveStateChange({});
        axios.get('/api/v1/say-something').then((res) => {
            const response = res.data;
            console.log(res);
            console.log(response);
            this.setState({response});
        });
    }

    componentWillMount() {
        this.receiveStateChange = this.receiveStateChange.bind(this);
        listen("changeState", this.receiveStateChange);
    }

    receiveStateChange(payload) {
        if(!isDefined(cookies.get("token")))
            payload.page = "login";
        this.setState(payload);
    }

    currentPage() {
        switch (this.state.page) {
            case "login":
                return <Login/>;
                break;
            case "pools":
                return <Pools/>;
                break;
            case "timetable":
                return <Timetable selectedPool={this.state.selectedPool}/>;
                break;
            case "reservations":
                return <Reservations/>;
                break;
            case "end":
                return <div>
                    <h1>Reservation successful!</h1>
                    <button onClick={(e) => this.receiveStateChange({page: "pools"})}>Make another</button>
                </div>;
                break;
            default:
                return <h1>404</h1>
        }
    }

    logout() {
        cookies.remove('token');
        this.receiveStateChange({});
    }

    render() {
        return (
            <div className="App">
                <h1>HELLO from the frontend!</h1>
                <button onClick={(e) => this.logout()}>Logout</button>
                <button onClick={(e) => this.receiveStateChange({page: "pools"})}>Make a reservation</button>
                <button onClick={(e) => this.receiveStateChange({page: "reservations"})}>List reservations</button>
                <h1>{this.state.response.body}</h1>
                {this.state.page}
                {this.currentPage()}
            </div>
        );
    }
}

export default App;