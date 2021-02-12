import React, {Component} from 'react';
import './Dashboard.css';
import axios from 'axios'
import {changeRootState, send} from './state-manager'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            response: {rows: []},
        };
    }


    componentDidMount() {
        // axios.get('/api/v1/list').then((res) => {
        //     const data = res.data;
        //     this.setState({response: data});
        // });
    }

    render() {
        return <div className="dashboard">

            <Table bordered className="dashboardTable">
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
            <Button className="newButton" onClick={(e)=>changeRootState({page: "pools"})}>New reservation</Button>
            <Button className="newButton" onClick={(e)=>send("logout",{detail:e})}>Logout</Button>
        </div>;
    }
}

export default Dashboard;