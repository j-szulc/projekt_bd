import React, {Component} from 'react';
import './Pools.css';
import axios from 'axios'
import {changeRootState} from './state-manager'
import Table from 'react-bootstrap/Table'
import 'bootstrap/dist/css/bootstrap.min.css';

class Pools extends Component {

    constructor() {
        super();
        this.state = {
            response: {rows: []},
        };
    }


    componentDidMount() {
        axios.get('/api/v1/pools').then((res) => {
            const data = res.data;
            this.setState({response: data});
        });
    }

    selectPool(payload) {
        changeRootState({page: "timetable", selectedPool: payload});
    }

    render() {
        return <div>
            <Table bordered>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nazwa</th>
                        <th>Adres</th>
                    </tr>
                </thead>
                {this.state.response.rows.map((row, rowIndex) => {
                        return <tbody onClick={(e)=>this.selectPool(rowIndex)}>
                            <tr>
                                <td>{row[0]}</td>
                                <td>{row[1]}</td>
                                <td>{row[2]}</td>
                            </tr>
                        </tbody>;
                    }
                )}
            </Table>
        </div>;
    }
}

export default Pools;