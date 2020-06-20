import React from 'react';
import firebase from 'firebase';
import { Input } from "antd";
import {
    Link
} from "react-router-dom";

export default class ParticipantHomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizzes: {},
        };
    }

    componentDidMount() {
        const self = this;
        this.quizzesRef = firebase.database().ref('quizzes');
        this.quizzesRef.on('value', snapshot => {
            self.setState({
                quizzes: snapshot.val(),
            });
        });
    }

    displayQuiz = (quiz, i) => {
        return <div style={{display: 'flex', flexDirection: 'row'}}>
            <p>{quiz.name}</p>
            <p>{quiz.date}</p>
            <Link to={process.env.PUBLIC_URL + '/participant/' + quiz.name}>View</Link>
        </div>
    };

    render() {
        const { quizzes } = this.state;
        return (
            <div>
                <h1>Participant home page</h1>
                {Object.keys(quizzes).map((quizName, i) => this.displayQuiz(quizzes[quizName], i))}
            </div>
        );
    }

}