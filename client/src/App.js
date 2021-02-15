import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Login';
import Pools from './Pools';
import Timetable from './Timetable';
import Dashboard from './Dashboard';
import {listen} from './state-manager'
import {cookies} from './cookie-manager'
import {isDefined} from './helpers'
import axios from 'axios'
import bg from './bg.svg'
import Jumbotron from 'react-bootstrap/Jumbotron'

class App extends Component {

    constructor() {
        super();
        this.state = {
            page: "dashboard",
            response: {body: ""},
        };
    }

    componentDidMount() {
        this.receiveStateChange({});
    }

    componentWillMount() {
        this.receiveStateChange = this.receiveStateChange.bind(this);
        listen("changeState", this.receiveStateChange);
        this.logout = this.logout.bind(this);
        listen("logout", this.logout);
    }

    receiveStateChange(payload) {
        if (!isDefined(cookies.get("token")))
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
            case "dashboard":
                return <Dashboard/>;
                break;
            default:
                return <h1>404</h1>
        }
    }

    logout(payload = {}) {
        cookies.remove('token');
        this.receiveStateChange({});
    }

    render() {
        return (
            <div style={{backgroundImage: `url(${bg})`}} className="bg">
                        <div className="App">
                            {this.currentPage()}
                        </div>
                </div>
        );
    }
}

export default App;