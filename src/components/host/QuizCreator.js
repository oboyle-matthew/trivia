import React from 'react';
import firebase from 'firebase';
import { Collapse } from 'antd';
import {
    Link,
    useParams,
    withRouter,
} from "react-router-dom";
import RoundCreator from "./RoundCreator";

const { Panel } = Collapse;


class QuizCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
        };
    }

    componentDidMount() {
        const { name } = this.props.match.params;
        const self = this;
        this.quizRef = firebase.database().ref('quizzes').child(name);
        this.quizRef.on('value', snapshot => {
            self.setState({
                quiz: snapshot.val(),
            });
        });
    }

    addNewRound = () => {
        const { quiz } = this.state;
        const rounds = quiz.rounds;
        if (rounds) {
            const roundName = Object.keys(rounds).length + 1;
            quiz.rounds['Round ' + roundName] = {'name': 'Round ' + roundName};
        } else {
            quiz.rounds = {'Round 1': {'name': 'Round 1'}};
        }
        this.quizRef.set(quiz);
    };

    renderTeams = () => {
        const { quiz } = this.state;
        const teams = quiz.teams;
        return teams && (
            <div>
                <h3>Teams registered:</h3>
                {Object.keys(teams).map(teamName => {
                    return <div>
                        {teamName}
                    </div>
                })}
            </div>
        )
    };

    render() {
        const { quiz } = this.state;
        const rounds = quiz.rounds;
        return (
            <div>
                <h1>Quiz name here: {quiz && quiz.name}</h1>
                {this.renderTeams()}
                <Collapse>
                    {rounds && Object.keys(rounds).map((roundName, i) => {
                        const round = rounds[roundName];
                        return <Panel header={roundName} key={i}>
                            <RoundCreator round={round} roundRef={this.quizRef.child('rounds').child(roundName)} />
                        </Panel>
                    })}
                </Collapse>
                <button onClick={this.addNewRound}>Add New Round</button>
            </div>
        );
    }
}

export default withRouter(QuizCreator)