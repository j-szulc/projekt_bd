import React, {Component} from 'react';
import './Pools.css';
import './Login.css';
import axios from 'axios'
import {changeRootState,checkCookies} from './state-manager'
import Table from 'react-bootstrap/Table'
import 'bootstrap/dist/css/bootstrap.min.css';

class Pools extends Component {

    constructor() {
        super();
        this.state = {
            rows:[],
            errorMsg: ""
        };
    }


    componentDidMount() {
        axios.get('/api/v1/pools').then((res) => {
            const data = res.data;
            console.log(data);
            this.setState({rows: data});
        }).catch((err) => {
            this.setState({errorMsg:"Error downloading pool data: \n"+err});
        });
    }

    selectPool(payload) {
        changeRootState({page: "timetable", selectedPool: payload});
    }

    render() {
        checkCookies();
        return <div className="pools">
            <h1>Available pools</h1>
            <div className="error">{this.state.errorMsg}</div>
            <Table bordered className="poolsTable">
                <thead>
                    <tr>
                        <th className="id">Id</th>
                        <th className="name">Name</th>
                        <th className="address">Adress</th>
                    </tr>
                </thead>
                {this.state.errorMsg}
                {this.state.rows.map((row, rowIndex) => {
                        return <tbody>
                            <tr className="poolsRow" onClick={(e)=>this.selectPool(this.state.rows[rowIndex].id)}>
                                <td className="id">{row.id}</td>
                                <td className="name"> {row.nazwa}</td>
                                <td className="address">{row.adres}</td>
                            </tr>
                        </tbody>;
                    }
                )}
            </Table>
        </div>;
    }
}

export default Pools;