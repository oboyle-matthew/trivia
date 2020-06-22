import React from 'react';
import firebase from 'firebase';
import { Select, Table } from 'antd';
import {
    Link,
    useParams,
    withRouter,
} from "react-router-dom";
import Scoreboard from "./Scoreboard";

const { Option } = Select;

const renderAnswers = (record) => {
    const { questionType } = record;
    if (questionType === 'text' || questionType === 'speed') {
        return <div>
            {record.answerType.toUpperCase()} [{record.possibleAnswers.join(', ')}]
        </div>
    }
    if (questionType === 'number' || questionType === 'closest') {
        return <div>
            {record.numberAnswer}
            {record.margin && (' +- ' + record.margin)}
        </div>
    }
    if (questionType === 'multiple_answers') {
        return <div>
            {record.multipleAnswers.map((answer, i) => {
                return <div>
                    {i+1}: {answer.answerType.toUpperCase()} [{answer.possibleAnswers.join(', ')}]
                </div>
            })}
        </div>
    }
    if (questionType === 'multiple_choice') {
        return <div>
            {record.correctChoice.toUpperCase()} from [{record.choices.join(', ')}]
        </div>
    }
    return record.possibleAnswers;
};

class RoundResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            round: {},
        };
    }

    componentDidMount() {
        const { name, round } = this.props.match.params;
        const self = this;
        this.roundRef = firebase.database().ref('quizzes').child(name).child('rounds').child(round);
        this.roundRef.on('value', snapshot => {
            const round = snapshot.val();
            self.setState({
                round,
            });
        });
    }

    renderOtherInfo = (question, teamName) => {
        let other;
        if (question.questionType === 'speed') {
            if (question.guesses) {
                const filteredGuesses = question.guesses.filter(g => g.teamName === teamName);
                if (filteredGuesses.length > 0) {
                    const guess = filteredGuesses[0];
                    if (guess.cluesRevealed) {
                        return (guess.correct ? "CORRECT after " : "INCORRECT after ") + guess.cluesRevealed + " clue(s) revealed";
                    }
                }
            }
            return 'Testing';
        }
        if (question.questionType === 'multiple_answers') {
            return question.multipleScores.map((score, i) => {
                return <div>{`${i+1} correct: ${score} point(s)`}</div>
            });
        }
    };

    renderScores = (question, questionIndex) => {
        const { columns } = this.props;
        const { scores } = question;
        const data = scores && Object.keys(scores).map((teamName, i) => {
            const other = this.renderOtherInfo(question, teamName);
            console.log(other);
            return {
                teamName: teamName,
                teamAnswer: question.userAnswer && question.userAnswer[teamName],
                points: scores[teamName],
                questionType: question.questionType,
                questionIndex: questionIndex,
                other
            };
        });
        return <Table columns={columns} dataSource={data}/>
    };

    displayQuestion = (question, i) => {
        return <div style={{border: '2px solid black'}}>
            <h4>Q{i+1}: {question.question} (type={question.questionType})</h4>
            {renderAnswers(question)}
            {this.renderScores(question, i)}
        </div>
    };

    render() {
        const { round } = this.state;
        return (
            <div>
                <h1>Round name here: {round && round.name}</h1>
                {round && round.questions && round.questions.map((q, i) => this.displayQuestion(q,i))}
                <Scoreboard />
            </div>
        );
    }
}

export default withRouter(RoundResults)