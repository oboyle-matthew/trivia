import React from 'react';
import TextInput from "./TextInput";
import {Input} from "antd";

export default class MultipleAnswersInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: props.multipleAnswers.map(() => ''),
        };
    }

    updateAnswer = (e, i) => {
        const { answer } = this.state;
        answer[i] = e.target.value;
        this.setState({
            answer
        })
    };

    render() {
        const { multipleAnswers } = this.props;
        const { answer } = this.state;
        return multipleAnswers ? multipleAnswers.map((answer, i) => {
            return <div style={{display: 'flex', flexDirection: 'row'}}>
                Answer {i+1}: <Input value={answer[i]} onChange={e => this.updateAnswer(e,i)} />
            </div>
        }) : <div/>
    }

}