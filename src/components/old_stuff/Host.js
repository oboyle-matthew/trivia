import React from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import QuestionCreator from "./QuestionCreator";
import Questions from "./Questions";
import LevenshteinDistance from "./LevenshteinDistance";
import { Table } from "antd";
import { storage } from "firebase";

var config = {
    apiKey: "AIzaSyBfCWC3nO4Dm6t_Mdi023zABHHKzrOdQkI",
    authDomain: "trivia-7b47d.firebaseapp.com",
    databaseURL: "https://trivia-7b47d.firebaseio.com",
    projectId: "trivia-7b47d",
    storageBucket: "trivia-7b47d.appspot.com",
    messagingSenderId: "1017757056711",
};

let firstTime = true;

const columns = [
    {
        title: 'Question',
        dataIndex: 'question',
        key: 'question',
    },
    {
        title: 'Answer Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Answers',
        dataIndex: 'answers',
        key: 'answers',
        render: (text, record) => {
            return <p>[{record.answers.join(", ")}]</p>
        },
    },
];

export default class Host extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            image: null,
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

    handleImageAsFile = (e) => {
        const image = e.target.files[0];
        this.setState({
            image: image,
        });
    };

    handleFireBaseUpload = (e) => {
        const { image } = this.state;
        e.preventDefault();
        firebase.storage().ref(`/images/${image.name}`).put(image)
    };

    imageUpload = () => {
        return (
            <div>
                <form onSubmit={this.handleFireBaseUpload}>
                    <input
                        type="file"
                        onChange={this.handleImageAsFile}
                    />
                    <button>upload to firebase</button>
                </form>
            </div>
        )
    };

    render() {
        const { questions } = this.state;
        return (
            <div>
                <div>
                    <h1>Below are all the question and answers</h1>
                    <Table columns={columns} dataSource={questions} />
                </div>
                <QuestionCreator addQuestion={this.addQuestion}/>
                <Questions questions={questions} />
                <LevenshteinDistance/>
                {this.imageUpload()}
            </div>
        );
    }

}