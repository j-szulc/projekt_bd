import React, {Component} from 'react';
import './Timetable.css';
import axios from 'axios'
import {isDefined} from './helpers'
import {changeRootState} from './state-manager'
import Table from 'react-bootstrap/Table'
import 'bootstrap/dist/css/bootstrap.min.css';

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
            headers: ["6:00", "6:15", "6:30", "6:45", "7:00", "7:15"],
            data: [
                [1, 2, 3, 4, 5, 6],
                [7, 8, 9, 10, 11, 12]
            ],
            selectedRow: undefined,
            selectedColumnStart: undefined,
            selectedColumnStop: undefined
        }
        this.selectedPool = props.selectedPool;
    }


    componentDidMount() {
        /*        axios.get('/api/v1//pools').then((res) => {
                    const data = res.data;
                    this.setState({response: data});
                });*/
    }

    getClicked(rowIndex, columnIndex) {
        let result = isDefined(rowIndex) && (rowIndex == this.state.selectedRow) && (this.state.selectedColumnStart <= columnIndex) && (columnIndex <= this.state.selectedColumnStop);
        console.log(result);
        return result;
    }

    makeReservation() {
        axios.post('/api/v1/reserve',{
            selectedPool: this.selectedPool,
            selectedRow: this.state.selectedRow,
            date: this.state.time,
            start: this.state.headers[this.state.selectedColumnStart],
            stop: this.state.headers[this.state.selectedColumnStop]
        }).then((response)=>{
            console.log("Success!");
            changeRootState({page: "end"});
            console.log(response);
        }).catch(function (error) {
            console.log("Error!");
            console.log(error);
        });
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
                    console.log(copy)
                    console.log("def", isDefined(copy.selectedColumnStart))
                    if (middle) {
                        if(copy.selectedColumnStart == copy.selectedColumnStop)
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
        let newDate = (this.state.time.getDate()) + numOfDays;
        console.log(newDate);
        this.setState((prevState) => {
            let copy = Object.assign({}, prevState);
            copy.time.setDate(newDate);
            return copy;
        })
        this.resetSelection();
    }


    render() {
        return <div>
            <h1>Selected pool: {this.selectedPool} </h1>
            <Table bordered size="sm">
                <thead>
                    <tr>
                        <td colSpan="100%">
                            <center>
                                <button onClick={((e) => this.changeTime(-1))}>Prev</button>
                                {this.state.time.toLocaleDateString("pl-PL")}
                                <button onClick={((e) => this.changeTime(1))}>Next</button>
                            </center>
                        </td>
                    </tr>
                    <tr>
                        {this.state.headers.map((hour) =>
                            <td>{hour}</td>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map((row, rowIndex) =>
                        <tr>
                            {row.map((n, columnIndex) => {
                                let clicked = this.getClicked(rowIndex, columnIndex);
                                let color = clicked ? "green" : "blue";
                                let style = {
                                    "backgroundColor": color
                                };
                                return <td style={style} onClick={(e) => this.toggle(rowIndex, columnIndex)}>{n}</td>;
                            })}
                        </tr>
                    )}
                </tbody>
            </Table>
            <button onClick={(e)=>this.makeReservation()}>Reserve</button>
        </div>;
    }


}

export default Timetable;