import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './Reservations.css'
import axios from 'axios'

class Reservations extends Component {

    constructor() {
        super();
        this.state = {
            response: {rows: []},
        };
    }


    componentDidMount() {
        axios.get('/api/v1/reservations').then((res) => {
            //const data = res.data;
            //this.setState({response: data});
        });
    }

    render() {
        return <div>
            <table>
                <thead>
                    <tr>
                        <th>Basen</th>
                        <th>Data</th>
                        <th>Od</th>
                        <th>Do</th>
                    </tr>
                </thead>
                {this.state.response.rows.map((row, rowIndex) => {
                        return <tbody onClick={(e)=>this.selectPool(rowIndex)}>
                            <tr>
                                <td>{row[0]}</td>
                                <td>{row[1]}</td>
                                <td>{row[2]}</td>
                                <td>{row[3]}</td>
                            </tr>
                        </tbody>;
                    }
                )}
            </table>
        </div>;
    }
}

export default Reservations;
