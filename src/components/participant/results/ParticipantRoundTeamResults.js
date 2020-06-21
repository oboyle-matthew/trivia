import React from 'react';
import firebase from 'firebase';
import { Select, Table } from 'antd';
import {
    Link,
    useParams,
    withRouter,
} from "react-router-dom";
import Scoreboard from "../../results/Scoreboard";

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

class ParticipantRoundTeamResults extends React.Component {
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

    renderUserAnswer = (answer) => {
        if (Array.isArray(answer)) {
            return "[" + answer.join(", ") + "]";
        } else {
            return answer;
        }
    };

    renderTeamAnswer = (question) => {
        const { teamName } = this.props.match.params;
        return <div>
            <div>You put: {question.userAnswer && this.renderUserAnswer(question.userAnswer[teamName])}</div>
            <div style={{display: 'flex', flexDirection: 'row'}}>Correct answer:&nbsp;{renderAnswers(question)}</div>
            <div>You got: {question.scores && question.scores[teamName]} point(s) for this question</div>
        </div>
    };

    displayQuestion = (question, i) => {
        return <div style={{border: '2px solid black'}}>
            <h4>Q{i+1}: {question.question} (type={question.questionType})</h4>
            {this.renderTeamAnswer(question)}
        </div>
    };

    render() {
        const { round } = this.state;
        const { teamName } = this.props.match.params;
        return (
            <div>
                <Link to={'/participant/Example'}>
                    <button>Home screen (for next round)</button>
                </Link>
                <Link to={'/participant/Example/' + round.name + '/results'}>
                    <button>See how everyone else did</button>
                </Link>
                <h1>{round && round.name}. Results for {teamName}</h1>
                {round && round.questions && round.questions.map((q, i) => this.displayQuestion(q,i))}
                <Scoreboard />
                <Link to={'/participant/Example'}>
                    <button>Home screen (for next round)</button>
                </Link>
                <Link to={'/participant/Example/' + round.name + '/results'}>
                    <button>See how everyone else did</button>
                </Link>
            </div>
        );
    }
}

export default withRouter(ParticipantRoundTeamResults)