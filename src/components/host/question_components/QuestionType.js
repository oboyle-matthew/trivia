import React from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import { Input, Table, Modal, Select } from "antd";
import { storage } from "firebase";

const { Option } = Select;

export default class QuestionType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionType: 'text',
        };
    }

    render() {
        const { questionType } = this.props;
        return (
            <div>
                <div>Question Type:</div>
                <Select value={questionType} style={{width: 200, height: 40}} onChange={this.props.update}>
                    <Option value="text">Text</Option>
                    <Option value="number">Number</Option>
                    <Option value="closest">Closest Number</Option>
                    <Option value="multiple_choice">Multiple Choice</Option>
                    <Option value="multiple_answers">Multiple Answers</Option>
                    <Option value="speed">Speed round</Option>
                </Select>
            </div>
        );
    }

}