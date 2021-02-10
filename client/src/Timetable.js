import React, {Component} from 'react';
import './Timetable.css';
import axios from 'axios'

class Timetable extends Component {

    constructor(props) {
        super();
        let now = new Date();
        this.state = {
            time : new Date(now.getFullYear(),now.getMonth(),now.getDate()),
            headers: ["6:00", "6:15", "6:30", "6:45", "7:00", "7:15"],
            data: [
                [1, 2, 3, 4, 5,6],
                [7,8,9,10,11,12]
            ],
            selected: new Proxy({}, {
                get: (target, name) => name in target ? target[name] : (new Proxy({}, {
                    get: (target, name) => name in target ? target[name] : false
                }))
            }),
            currentlySelected : 0
        }
        this.global = props.global;
    }


    componentDidMount() {
        /*        axios.get('/api/v1//pools').then((res) => {
                    const data = res.data;
                    this.setState({response: data});
                });*/
    }

    getClicked(rowIndex, columnIndex, value) {
        return (this.state.selected[rowIndex])[columnIndex];
    }


    toggle(rowIndex, columnIndex) {
        let left = this.getClicked(rowIndex,columnIndex-1);
        let middle = this.getClicked(rowIndex, columnIndex);
        let right = this.getClicked(rowIndex,columnIndex+1);

        if(this.state.currentlySelected == 0 || (!middle && (left || right)) || (middle && (!left || !right))) {
            this.setState((prevState) => {
                    let copy = Object.assign({}, prevState);
                    let rowCopy = Object.assign({}, copy.selected[rowIndex]);
                    rowCopy[columnIndex] = !middle;
                    copy.selected[rowIndex] = rowCopy;
                    copy.currentlySelected += !middle ? 1 : -1;
                    return copy;
                }
            );
        }
    }

    changeTime(numOfDays){
        let newDate = (this.state.time.getDate())+numOfDays;
        console.log(newDate);
        this.setState((prevState)=>{
            let copy = Object.assign({},prevState);
            copy.time.setDate(newDate);
            return copy;
        })
    }


    render() {
        return <div>
            <table>
                <thead>
                    <tr>
                        <td colSpan="100%">
                            <center>
                            <button onClick={((e)=>this.changeTime(-1))}>Prev</button>
                            {this.state.time.toLocaleDateString("pl-PL")}
                            <button onClick={((e)=>this.changeTime(1))}>Next</button>
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
                                let color =  clicked ? "green" : "blue";
                                let style = {
                                    "background-color": color
                                };
                                console.log(this.state.currentlySelected)
                                return <td style={style} onClick={(e) => this.toggle(rowIndex, columnIndex)}>{n}</td>;
                            })}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>;
    }


}

export default Timetable;