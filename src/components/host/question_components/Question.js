import React from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import { Input, Table, Modal } from "antd";
import { storage } from "firebase";

export default class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionString: '',
        };
    }

    updateQuestionString = (e) => {
        this.setState({
            questionString: e.target.value,
        })
    };

    render() {
        return (
            <div>
                <div>Question:</div>
                <Input onChange={this.updateQuestionString} />
            </div>
        );
    }

}