import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  state = {
    response: {}
  };

  componentDidMount() {
    axios.get('/api/v1/say-something').then((res) => {
      const response = res.data;
      console.log(res);
      console.log(response);
      this.setState({response});
    });
  }

  render() {
    return (
        <div className="App">
          <h1>HELLO from the frontend!</h1>
          <h1>{this.state.response.body}</h1>
        </div>
    );
  }
}

export default App;