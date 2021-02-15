import React, {Component} from 'react';
import './Timetable.css';
import axios from 'axios'
import {isDefined} from './helpers'
import {changeRootState,checkCookies} from './state-manager'
import {cookies} from './cookie-manager'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Prev, Next} from './icons'
import Spinner from 'react-bootstrap/Spinner'

class Timetable extends Component {

    resetSelection() {
        this.setState({
            selectedRow: undefined,
            selectedColumnStart: undefined,
            selectedColumnStop: undefined
        });
    }

    constructor(props) {
        super();
        let now = new Date();
        this.state = {
            time: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            headers: [],
            data: [],
            waitForServer: true,
            selectedRow: undefined,
            selectedColumnStart: undefined,
            selectedColumnStop: undefined,
            errorMsg: ""
        }
        this.selectedPool = props.selectedPool;
    }


    request() {
        console.log("Sending request");
        axios.get('/api/v1/timetable', {
            params: {
                basenId: this.selectedPool,
                date: this.state.time
            }
        }).then((res) => {
            const data = res.data;
            this.setState({headers: data.headers, data: data.data, waitForServer:false});
        }).catch((err)=>{
            this.setState({errorMsg:JSON.stringify(err.response.data)});
        });
    }

    componentDidMount() {
        this.request();
    }

    getClicked(rowIndex, columnIndex) {
        let result = isDefined(rowIndex) && (rowIndex == this.state.selectedRow) && (this.state.selectedColumnStart <= columnIndex) && (columnIndex <= this.state.selectedColumnStop);
        return result;
    }

    makeReservation() {
        const errorFun = ((error)=>{
            console.log("Error!");
            this.setState({errorMsg:error});
        }).bind(this);

        axios.post('/api/v1/reserve', {
            basenId: this.selectedPool,
            token: cookies.get("token"),
            selectedPool: this.selectedPool,
            selectedRow: this.state.selectedRow,
            date: this.state.time,
            start: this.state.selectedColumnStart,
            stop: this.state.selectedColumnStop,
        }).then((response) => {
            console.log("Success!");
            changeRootState({page: "dashboard"});
        }).catch((error) =>{
            errorFun(JSON.stringify(error.response.data));
        });
    }

    valid() {
        return isDefined(this.state.selectedRow) && isDefined(this.state.selectedColumnStart) && isDefined(this.state.selectedColumnStop);
    }


    toggle(rowIndex, columnIndex) {
        let left = this.getClicked(rowIndex, columnIndex - 1);
        let middle = this.getClicked(rowIndex, columnIndex);
        let right = this.getClicked(rowIndex, columnIndex + 1);


        if (!isDefined(this.state.selectedRow) || (!middle && (left || right)) || (middle && (!left || !right))) {
            console.log("Toggling", rowIndex, columnIndex);
            this.setState((prevState) => {
                    let copy = Object.assign({}, prevState);
                    copy.selectedRow = rowIndex;
                    if (middle) {
                        if (copy.selectedColumnStart == copy.selectedColumnStop)
                            this.resetSelection();
                        else {
                            if (copy.selectedColumnStart == columnIndex)
                                copy.selectedColumnStart++;
                            if (copy.selectedColumnStop == columnIndex)
                                copy.selectedColumnStop--;
                        }
                    } else {
                        if (!isDefined(copy.selectedColumnStart) || columnIndex < copy.selectedColumnStart)
                            copy.selectedColumnStart = columnIndex;
                        if (!isDefined(copy.selectedColumnStop) || copy.selectedColumnStop < columnIndex)
                            copy.selectedColumnStop = columnIndex;
                    }
                    return copy;
                }
            );
        }
    }

    changeTime(numOfDays) {
        let now = new Date();
        let newTime = new Date(this.state.time);
        let newDate = (newTime.getDate()) + numOfDays;
        newTime.setDate(newDate);
        if (newTime >= new Date(now.getFullYear(),now.getMonth(),now.getDate())) {
            console.log(newDate);
            this.setState((prevState) => {
                let copy = Object.assign({}, prevState);
                copy.time = newTime;
                copy.headers = [];
                copy.data = [];
                copy.waitForServer = true;
                return copy;
            });
            this.resetSelection();
            this.request();
        }
    }


    render() {
        checkCookies();
        return (
        <div>
            <center>
                <div className="timetableRootDiv">
                <center>
                    <Prev onClick={((e) => this.changeTime(-1))}>Prev</Prev>
                    <div className="timetableHeaderDate">
                        {this.state.time.toLocaleDateString("pl-PL")}
                    </div>
                    <Next onClick={((e) => this.changeTime(1))}>Next</Next>
                </center>
                {this.state.waitForServer ?
                    <center>
                        <tbody>
                            <tr>
                                <th colSpan="100%"><Spinner animation="border" role="status"/></th>
                            </tr>
                        </tbody>
                    </center> : <div/>
                }
                <div className="flipper zero">
                    <div className="div zero">
                        <div className="flipper zero inline">

                            <Table bordered size="sm" className="timetable table-responsive zero inline">
                                <thead>
                                    <tr>
                                        {this.state.headers.map((hour) =>
                                            <td className="header">{hour}</td>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map((row, rowIndex) => {
                                        return <tr>
                                            {row.map((n, columnIndex) => {
                                                let clicked = this.getClicked(rowIndex, columnIndex);
                                                let cellClass = (n || n==0) ? (clicked ? "selected" : "free") : "busy";
                                                let callback = (n || n==0) ? ((e)=>this.toggle(rowIndex, columnIndex)) : null;
                                                return <td className={cellClass + " data"} onClick={callback}>{n}</td>;
                                            })}
                                        </tr>;
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                <center>
                <div className="error"> {this.state.errorMsg}</div>
                </center>
                <Button onClick={(e) => changeRootState({page: "dashboard"})} className="leftButton">Dashboard</Button>
                <Button onClick={(e) => this.makeReservation()} disabled={!this.valid()} className="rightButton">
                    Reserve
                </Button>
                </div>

            </center>
            </div>
        );
    }


}

export default Timetable;