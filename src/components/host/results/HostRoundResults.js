import React from 'react';
import firebase from 'firebase';
import {withRouter} from "react-router-dom";
import RoundResults from "../../results/RoundResults";
import { Input, Popconfirm } from 'antd';

class HostRoundResults extends React.Component {

    changePoints = (e, record) => {
        const { name, round } = this.props.match.params;
        this.scoreRef = firebase.database().ref('quizzes').child(name).child('rounds').child(round).child('questions').child(record.questionIndex).child('scores').child(record.teamName);
        const score = e.target.value;
        this.scoreRef.set(score);
    };

    renderAnswers = (text, record) => {
        const { questionType } = record;
        if (questionType === 'multiple_answers') {
            if (Array.isArray(record.teamAnswer)) {
                return <div>
                    {record.teamAnswer.map(a => <div>{a}</div>)}
                </div>
            } else {
                return text;
            }
        } else {
            return text;
        }
    };

    getColumns = () => {
        return [
            {
                title: 'Team Name',
                dataIndex: 'teamName',
                key: 'teamName',
            },
            {
                title: 'Team Answer',
                dataIndex: 'teamAnswer',
                key: 'teamAnswer',
                render: this.renderAnswers,
            },
            {
                title: 'Other',
                dataIndex: 'other',
                key: 'other',
            },
            {
                title: 'Points',
                dataIndex: 'points',
                key: 'points',
            },
            {
                title: 'Update points',
                dataIndex: 'updatePoints',
                key: 'updatePoints',
                render: (text,record) => {
                    return <Input style={{width: 150}} value={record.points} onChange={e => this.changePoints(e,record)}/>
                }
            },
        ];
    };

    clearAllScores = () => {
        const { name, round } = this.props.match.params;
        firebase.database().ref('quizzes').child(name).child('rounds').child(round).child('questions').once('value').then(data => {
            const questions = data.val();
            questions.forEach(question => {
                question.guesses = null;
                question.scores = null;
                question.userAnswer = null;
            });
            console.log(questions);
            data.ref.set(questions);
        });
        // console.log(questionsRef);
    };

    renderClearButton = () => {
        return <Popconfirm
            placement="topRight"
            title="Are you sure clear all results for this round? Questions will remain, but all user answers/score will be deleted (used for removing test results)"
            onConfirm={this.clearAllScores}
            okText="Yes"
            cancelText="No"
        >
            <button onClick={e => e.stopPropagation()}>Clear all scores for this round</button>
        </Popconfirm>
    };

    render() {
        return <div>
            {this.renderClearButton()}
            <RoundResults columns={this.getColumns()}/>
        </div>
    }
}

export default withRouter(HostRoundResults)