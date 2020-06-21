import React from 'react';
import firebase from 'firebase';
import { Collapse, Popconfirm } from 'antd';
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

    renderPanel = (roundName) => {
        return roundName
    };

    deleteRound = (e, roundName) => {
        const { quiz } = this.state;
        e.stopPropagation();
        delete quiz.rounds[roundName];
        this.quizRef.set(quiz);
    };

    deletePanel = (roundName) => {
        return <Popconfirm
            placement="topRight"
            title="Are you sure delete this round? This will remove all questions in it permanently"
            onConfirm={(e) => this.deleteRound(e, roundName)}
            onCancel={(e) => e.stopPropagation()}
            okText="Yes"
            cancelText="No"
        >
            <button onClick={e => e.stopPropagation()}>Delete</button>
        </Popconfirm>
    };

    render() {
        const { quiz } = this.state;
        const rounds = quiz.rounds;
        return (
            <div>
                <h1>Quiz name here: {quiz && quiz.name}</h1>
                <Link to={'/register/' + quiz.name}>
                    <button>Register a new team</button>
                </Link>
                {this.renderTeams()}
                <Collapse>
                    {rounds && Object.keys(rounds).map((roundName, i) => {
                        const round = rounds[roundName];
                        return <Panel header={this.renderPanel(roundName)} key={i} extra={this.deletePanel(roundName)}>
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