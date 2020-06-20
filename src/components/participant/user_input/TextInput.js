import React from 'react';
import { Input } from "antd";

export default class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
        };
    }

    updateAnswer = (e) => {
        this.setState({
            answer: e.target.value,
        })
    };

    render() {
        const { answer } = this.state;
        return (
            <Input value={answer} onChange={this.updateAnswer} />
        );
    }

}