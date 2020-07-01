import React from 'react';
import firebase from 'firebase';
import { Input } from "antd";
import {
    Link
} from "react-router-dom";

export default class Host extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizzes: {},
            newQuizName: '',
            error: false,
        };
    }

    componentDidMount() {
        const self = this;
        this.quizzesRef = firebase.database().ref('quizzes');
        this.quizzesRef.on('value', snapshot => {
            self.setState({
                quizzes: snapshot.val(),
                newQuizName: '',
            });
        });
    }

    removeQuiz = (quizName) => {
        const { quizzes } = this.state;
        const toDelete = quizzes[quizName];
        delete quizzes[quizName];
        this.quizzesRef.set(quizzes);
        this.deletedRef = firebase.database().ref('deleted');
        this.deletedRef.once("value", snapshot => {
            let toAdd = {};
            if (snapshot.exists()) {
                toAdd = snapshot.val();
            }
            toAdd[toDelete.name] = toDelete;
            this.deletedRef.set(toAdd);
        });
    };

    displayQuiz = (quiz, i) => {
        return <div style={{display: 'flex', flexDirection: 'row'}}>
            <p>{quiz.name}</p>
            <p>{quiz.date}</p>
            &nbsp; &nbsp;
            <Link to={'/host/' + quiz.name}>View</Link>
            {/*{quiz.name !== 'Example quiz' && <button onClick={() => this.removeQuiz(quiz.name)}>X</button>}*/}
        </div>
    };

    addNewQuiz = () => {
        const { quizzes, newQuizName } = this.state;
        if (quizzes.hasOwnProperty(newQuizName)) {
            this.setState({
                error: true,
            })
        } else {
            quizzes[newQuizName] = {'name': newQuizName, 'rounds': []};
            this.quizzesRef.set(quizzes);
        }
    };

    changeNewQuizName = (e) => {
        this.setState({
            newQuizName: e.target.value,
            error: false,
        })
    };

    displayErrorMessage = () => {
        return <div>
            A quiz with this name already exists
        </div>
    };

    render() {
        const { quizzes, newQuizName, error } = this.state;
        return (
            <div>
                <h1>Host home page</h1>
                {Object.keys(quizzes).map((quizName, i) => this.displayQuiz(quizzes[quizName], i))}
                New Quiz Name: <Input value={newQuizName} onPressEnter={this.addNewQuiz} onChange={this.changeNewQuizName} style={{width: 300}} />
                <button onClick={this.addNewQuiz}>Add</button>
                {error && this.displayErrorMessage()}
            </div>
        );
    }

}