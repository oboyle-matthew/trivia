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
        return <Link to={'/participant/' + quiz.name}>
            <button>{quiz.name}</button>
        </Link>
    };

    render() {
        const { quizzes } = this.state;
        return (
            <div className="tt-background-outer">
                <div className="tt-background-inner">
                    <div className='quiz-container'>

                        {Object.keys(quizzes).map((quizName, i) => {
                            return <div style={{margin: 20}}>
                                    {this.displayQuiz(quizzes[quizName], i)}
                            </div>
                        })}
                    </div>
                </div>
            </div>
        );
    }

}