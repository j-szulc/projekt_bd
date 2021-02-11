import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Pools from './Pools';
import Timetable from './Timetable';
import {listen} from './state-manager'
import axios from 'axios'

class App extends Component {

  constructor() {
    super();
    this.state = {
      page : "login",
      response: { body : ""}
    };
  }

  componentDidMount() {
    axios.get('/api/v1/say-something').then((res) => {
      const response = res.data;
      console.log(res);
      console.log(response);
      this.setState({response});
    });
  }

  componentWillMount() {
    this.redirect = this.redirect.bind(this);
    listen(this.redirect);
  }

  redirect(page) {
    this.setState({page: page});
  }

  currentPage(){
    switch(this.state.page){
      case "login":
        return <Login/>;
        break;
      default:
        return <div><Pools/>
          <Timetable /></div>;
    }
  }

  render() {
    return (
        <div className="App">
          <h1>HELLO from the frontend!</h1>
          <h1>{this.state.response.body}</h1>
          {this.state.page}
          {this.currentPage()}
        </div>
    );
  }
}

export default App;