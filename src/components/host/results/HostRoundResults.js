import React from 'react';
import firebase from 'firebase';
import {withRouter} from "react-router-dom";
import RoundResults from "../../results/RoundResults";
import { Input } from 'antd';

class HostRoundResults extends React.Component {

    changePoints = (e, record) => {
        const { name, round } = this.props.match.params;
        console.log(name);
        this.scoreRef = firebase.database().ref('quizzes').child(name).child('rounds').child(round).child('questions').child(record.questionIndex).child('scores').child(record.teamName);
        console.log(e.target.value);
        const score = e.target.value;
        this.scoreRef.set(score);
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