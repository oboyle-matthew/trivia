import React from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import QuestionCreator from "./QuestionCreator";
import Questions from "./Questions";
import LevenshteinDistance from "./LevenshteinDistance";

var config = {
    apiKey: "AIzaSyBfCWC3nO4Dm6t_Mdi023zABHHKzrOdQkI",
    authDomain: "trivia-7b47d.firebaseapp.com",
    databaseURL: "https://trivia-7b47d.firebaseio.com",
    projectId: "trivia-7b47d",
    storageBucket: "trivia-7b47d.appspot.com",
    messagingSenderId: "1017757056711",
};

let firstTime = true;

export default class Host extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
        };
    }

    componentDidMount() {
        const self = this;
        if (firstTime) {
            app.initializeApp(config);
            firstTime = false;
            this.questionsRef = firebase.database().ref('questions');
            this.questionsRef.on('value', snapshot => {
                const keys = Object.keys(snapshot.val());
                self.setState({
                    questions: keys.map(key => snapshot.val()[key]),
                });
            });
        }
    }

    addQuestion = (question, answerType, possibleAnswers) => {
        const { questions } = this.state;
        questions.push({"question": question, "answers": possibleAnswers, "type": answerType});
        this.questionsRef.set(questions);
    };

    render() {
        const { questions } = this.state;
        return (
            <div>
                <div style={{border: '2px solid black'}}>
                    <h1>Below are all the question and answers</h1>
                    {questions.map((q, i) => {
                        return <div>
                            {i}: {q.question} {q.type} [{q.answers && q.answers.join(', ')}]
                        </div>
                    })}
                </div>
                <QuestionCreator addQuestion={this.addQuestion}/>
                <Questions questions={questions} />
                <LevenshteinDistance/>
            </div>
        );
    }

}