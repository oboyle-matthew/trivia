import React from 'react';
import firebase from 'firebase';
import {withRouter} from "react-router-dom";
import RoundResults from "../../results/RoundResults";
import { Input } from 'antd';

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
            return <div>
                {record.teamAnswer.map(a => <div>{a}</div>)}
            </div>
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

    render() {
        return <RoundResults columns={this.getColumns()}/>
    }
}

export default withRouter(HostRoundResults)