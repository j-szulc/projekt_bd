import React, {Component} from 'react';
import './Pools.css';
import axios from 'axios'

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

    render() {
        return <div>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nazwa</th>
                        <th>Adres</th>
                    </tr>
                </thead>
                {this.state.response.rows.map((row) => {
                        return <tbody>
                            <tr>
                                <td>{row[0]}</td>
                                <td>{row[1]}</td>
                                <td>{row[2]}</td>
                            </tr>
                        </tbody>;
                    }
                )}
            </table>
        </div>;
    }
}

export default Pools;