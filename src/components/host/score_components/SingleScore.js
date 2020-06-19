import React from 'react';
import { Input } from "antd";

export default class SingleScore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 1,
        };
    }

    updateScore = (e) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            this.setState({score: value})
        }
    };

    render() {
        const { score } = this.state;
        return (
            <div>
                Correct answer: <Input style={{width: 50}} placeHolder={'score...'} value={score} onChange={this.updateScore} /> points
            </div>
        );
    }

}