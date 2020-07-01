import React from 'react';
import firebase from 'firebase';
import { Select, Table } from 'antd';
import {
    Link,
    useParams,
    withRouter,
} from "react-router-dom";
import Scoreboard from "../../results/Scoreboard";
import ImageDisplay from "../../media_display/ImageDisplay";

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
        const { teamName } = this.props.match.params;
        let score;
        if (question.questionType === 'speed') {
            if (!question.userAnswer || !question.userAnswer.hasOwnProperty(teamName)) {
                return;
            }
        }
        try {
            if (question.score) {
                score = `(${question.score} point(s))`
            }
            if (question.multipleScores && Array.isArray(question.multipleScores) && question.multipleScores.length > 0) {
                score = `(${question.multipleScores[question.multipleScores.length-1]} point(s))`
            }
        } catch(err) {
            // Trouble parsing score -- Idk why this would happen
        }
        return <div style={{border: '2px solid black'}}>
            <h4>Q{i+1}: {question.question} {score}</h4>
            {question.imageId && <ImageDisplay width={300} height={200} imageId={question.imageId}/>}
            {this.renderTeamAnswer(question)}
        </div>
    };

    renderTeamScore = () => {
        const { round } = this.state;
        const { teamName } = this.props.match.params;
        let totalScore = 0;
        let teamScore = 0;
        round.questions && round.questions.forEach(question => {
            const { questionType } = question;
            if (round.customScoringEnabled && round.customScores) {
                // Could do this outside loop, but this works
                totalScore = parseFloat(round.customScores[0]) + (parseFloat(round.customScores[1])*2) + (parseFloat(round.customScores[2])*3)
            } else {
                if (questionType === 'text' || questionType === 'number' || questionType === 'multiple_choice') {
                    totalScore += parseFloat(question.score);
                } else if (questionType === 'closest' || questionType === 'speed') {
                    totalScore += parseFloat(question.positionScoring[0])
                } else if (questionType === 'multiple_answers') {
                    totalScore += parseFloat(question.multipleScores[question.multipleScores.length - 1]);
                }
            }
            if (question.scores) {
                teamScore += parseFloat(question.scores[teamName]);
            }
        });
        teamScore = isNaN(teamScore) ? 0 : teamScore;
        return teamScore + " / " + totalScore;
    };

    render() {
        const { round } = this.state;
        const { name, teamName } = this.props.match.params;
        return (
            <div>
                <Link to={'/participant/' + name}>
                    <button>Home screen (for next round)</button>
                </Link>
                <Link to={'/participant/' + name + '/' + round.name + '/results'}>
                    <button>See how everyone else did</button>
                </Link>
                <h1>{round && round.name}. Results for {teamName}: {this.renderTeamScore()}</h1>
                {round && round.questions && round.questions.map((q, i) => this.displayQuestion(q,i))}
                <Scoreboard />
                <Link to={'/participant/' + name}>
                    <button>Home screen (for next round)</button>
                </Link>
                <Link to={'/participant/' + name + '/' + round.name + '/results'}>
                    <button>See how everyone else did</button>
                </Link>
            </div>
        );
    }
}

export default withRouter(ParticipantRoundTeamResults)