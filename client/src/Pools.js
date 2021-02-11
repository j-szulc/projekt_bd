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
        return <div className="pools">
            <Table bordered className="poolsTable">
                <thead>
                    <tr>
                        <th className="id">Id</th>
                        <th className="name">Nazwa</th>
                        <th className="address">Adres</th>
                    </tr>
                </thead>
                {this.state.response.rows.map((row, rowIndex) => {
                        return <tbody>
                            <tr className="poolsRow" onClick={(e)=>this.selectPool(rowIndex)}>
                                <td className="id">{row[0]}</td>
                                <td className="name"> {row[1]}</td>
                                <td className="address">{row[2]}</td>
                            </tr>
                        </tbody>;
                    }
                )}
            </Table>
        </div>;
    }
}

export default Pools;