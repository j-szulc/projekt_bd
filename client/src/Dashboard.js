import React, {Component} from 'react';
import './Dashboard.css';
import './Login.css'
import axios from 'axios'
import {changeRootState, send} from './state-manager'
import {cookies} from './cookie-manager'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import {isDefined} from './helpers'

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            waitForServer: true,
            rows: [],
            errorMsg: ""
        };
    }


    componentDidMount() {
        changeRootState({});
        let token = cookies.get("token");
        axios.get('/api/v1/list', {params: {token: token}}).then((res) => {
            const data = res.data;
            console.log(data);
            this.setState({rows: data.rows, waitForServer: false});
        }).catch((err) => {
            this.setState({errorMsg: "Error downloading reservation data: \n" + err});
        });
    }

    render() {
        return <div className="dashboard">
            <div className="error">{this.state.errorMsg}</div>
            <Table bordered className="dashboardTable">
                <thead>
                    <tr>
                        <th className="id">Id</th>
                        <th className="name=">Nazwa</th>
                        <th className="address">Adres</th>
                        <th className="date">Data</th>
                        <th className="from">Od</th>
                        <th className="to">Do</th>
                    </tr>
                </thead>
                {this.state.waitForServer ?
                    (
                        <tbody>
                        <tr>
                            <th colSpan="100%">Proszę czekać</th>
                        </tr>
                    </tbody>
                    )
                    : (this.state.rows.length == 0 ?
                        (<tbody>
                            <tr>
                                <th colSpan="100%">Nie masz żadnych rezerwacji</th>
                            </tr>
                        </tbody>
                        )
                        :
                        (this.state.rows.map((row, rowIndex) => {
                            return <tbody>
                                <tr className="poolsRow" onClick={(e) => this.selectPool(rowIndex)}>
                                    <td className="id">{row.id}</td>
                                    <td className="name"> {row.name}</td>
                                    <td className="address">{row.address}</td>
                                    <td className="date">{row.date}</td>
                                    <td className="from">{row.from}</td>
                                    <td className="to">{row.to}</td>
                                </tr>
                            </tbody>;
                        }))
                    )
                }
            </Table>
            <div className="buttons">
                <Button className="newButton" onClick={(e) => changeRootState({page: "pools"})}>New reservation</Button>
                <Button className="newButton" onClick={(e) => send("logout", {detail: e})}>Logout</Button>
            </div>
        </div>;
    }
}

export default Dashboard;