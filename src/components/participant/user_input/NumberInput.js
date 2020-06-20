import React from 'react';
import { Input } from "antd";

export default class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
        };
    }

    updateAnswer = (e) => {
        const value = e.target.value;
        if (value === '-' || value === '' || !isNaN(value) || value.indexOf('e') === value.length-1) {
            this.setState({answer: value})
        }
    };

    render() {
        const { answer } = this.state;
        return (
            <Input value={answer} onChange={this.updateAnswer} />
        );
    }

}