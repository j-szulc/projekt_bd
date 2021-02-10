import React, {Component} from 'react';
import './Timetable.css';
import axios from 'axios'

class Timetable extends Component {

    constructor() {
        super();
        this.state = {
            headers: {
                "01.03.21": {"6:00":, "6:15", "6:30", "6:45", "7:00", "7:15"},
                "02.03.21": ["6:00", "6:15", "6:30", "6:45", "7:00", "7:15"]
            },
            data: [[1, 2, 3, 4, 5, 6,1,3,0,4,5,67], [7, 8, 9, 0, 1, 2,12,64,87,5,1,2]]
        };
    }


    componentDidMount() {
        /*        axios.get('/api/v1//pools').then((res) => {
                    const data = res.data;
                    this.setState({response: data});
                });*/
    }

    render() {

        console.log(Object.keys(this.state.headers).map((day, index) => this.state.headers[day]));
        return <div>
            <table>
                <thead>
                    <tr>
                        {Object.keys(this.state.headers).map((day, index) =>
                            <td colspan={this.state.headers[day].length}>{day}</td>
                        )}
                    </tr>
                    <tr>
                        {Object.keys(this.state.headers).map((day, index) => {
                                return this.state.headers[day].map((hour) =>
                                    <td>{hour}</td>
                                )
                            }
                        )}
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map((row) =>
                        <tr>
                            {
                                row.map((numberOfPeople)=>
                                    <td>{numberOfPeople}</td>
                                )
                            }
                        </tr>
                    )}
                </tbody>
            </table>
        </div>;
    }
}

export default Timetable;