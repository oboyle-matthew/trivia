import React from 'react';
import firebase from 'firebase';
import {Collapse, Input, Popconfirm} from 'antd';
import {
    Link,
    useParams,
    withRouter,
} from "react-router-dom";
import RoundCreator from "./RoundCreator";
import {getSortedRoundNames} from "../../helpers/RoundNameSorter";

const { Panel } = Collapse;


class QuizCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
            editRoundNames: false,
            newRoundNames: [],
        };
    }

    componentDidMount() {
        const { name } = this.props.match.params;
        const self = this;
        this.quizRef = firebase.database().ref('quizzes').child(name);
        this.quizRef.on('value', snapshot => {
            const quiz = snapshot.val();
            let newRoundNames = [];
            if (quiz.rounds) {
                if (Object.keys(quiz.rounds).length !== newRoundNames.length) {
                    newRoundNames = getSortedRoundNames(quiz.rounds)
                }
            }
            self.setState({
                quiz,
                newRoundNames
            });
        });
    }

    addNewRound = () => {
        const { quiz } = this.state;
        const rounds = quiz.rounds;
        if (rounds) {
            const roundIndex = Object.keys(rounds).length;
            quiz.rounds['Round ' + (roundIndex+1)] = {'name': 'Round ' + (roundIndex+1), 'position': roundIndex};
        } else {
            quiz.rounds = {'Round 1': {'name': 'Round 1', 'position': 0}};
        }
        this.quizRef.set(quiz);
    };

    removeTeam = (teamName) => {
        //TODO: Should prob remove all their results to avoid errors, but that won't really happen in real uses
        const { quiz } = this.state;
        delete quiz.teams[teamName];
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
                        <button onClick={() => this.removeTeam(teamName)}>X</button>
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
        const pos = quiz.rounds[roundName].position;
        delete quiz.rounds[roundName];
        Object.keys(quiz.rounds).forEach(roundName => {
            const round = quiz.rounds[roundName];
            if (pos < round.position) {
                round.position = round.position-1;
            }
        });
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

    updateNewRoundName = (e,i) => {
        const { newRoundNames } = this.state;
        newRoundNames[i] = e.target.value;
        this.setState({
            newRoundNames
        })
    };

    changeRoundName = (i) => {
        const { newRoundNames, quiz } = this.state;
        const newRoundName = newRoundNames[i];
        const oldRoundName = getSortedRoundNames(quiz.rounds)[i];
        if (oldRoundName !== newRoundName) {
            quiz.rounds[newRoundName] = quiz.rounds[oldRoundName];
            quiz.rounds[newRoundName].name = newRoundName;
            delete quiz.rounds[oldRoundName];
            this.quizRef.set(quiz);
        }
    };

    moveRoundUp = (i) => {
        const { quiz } = this.state;
        const sortedRounds = getSortedRoundNames(quiz.rounds);
        const roundAbove = quiz.rounds[sortedRounds[i-1]];
        const currRound = quiz.rounds[sortedRounds[i]];
        const posAbove = roundAbove.position;
        const currPosition = currRound.position;
        roundAbove.position = currPosition;
        currRound.position = posAbove;
        this.quizRef.set(quiz);
    }

    moveRoundDown = (i) => {
        const { quiz } = this.state;
        const sortedRounds = getSortedRoundNames(quiz.rounds);
        const roundBelow = quiz.rounds[sortedRounds[i+1]];
        const currRound = quiz.rounds[sortedRounds[i]];
        const posBelow = roundBelow.position;
        const currPosition = currRound.position;
        roundBelow.position = currPosition;
        currRound.position = posBelow;
        this.quizRef.set(quiz);
    }

    renderEditFileNames = () => {
        const { newRoundNames, editRoundNames } = this.state;
        return <div>
            <button onClick={() => this.setState({editRoundNames: !editRoundNames})}>{(editRoundNames ? "Hide " : "Show ") + " edit round names/positions"}</button>
            {editRoundNames && newRoundNames.map((roundName, i) => {
                return <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Input style={{width: 300}} value={roundName} onChange={e => this.updateNewRoundName(e,i)} />
                    {i > 0 && <button onClick={() => this.moveRoundUp(i)}>Move Up</button>}
                    {i < newRoundNames.length-1 && <button onClick={() => this.moveRoundDown(i)}>Move Down</button>}
                    <button onClick={() => this.changeRoundName(i)}>Update</button>
                </div>
            })}
        </div>
    };

    viewResults = (roundName) => {
        const { name } = this.props.match.params;
        return <Link to={`/participant/${name}/${roundName}/results`}>
            <button>View Results</button>
        </Link>
    };

    viewParticipantView = (roundName) => {
        const { name } = this.props.match.params;
        return <Link to={`/participant/${name}/${roundName}`}>
            <button>Take this round</button>
        </Link>
    };

    extra = (roundName) => {
        return <div style={{display: 'flex', flexDirection: 'row'}}>
            {this.viewParticipantView(roundName)}
            {this.viewResults(roundName)}
            {this.deletePanel(roundName)}
        </div>
    };

    render() {
        const { quiz, newRoundNames } = this.state;
        const rounds = quiz.rounds;
        return (
            <div>
                <h1>{quiz && quiz.name}</h1>
                <Link to={'/register/' + quiz.name}>
                    <button>Register a new team</button>
                </Link>
                {this.renderTeams()}
                <Collapse>
                    {rounds && getSortedRoundNames(rounds).map((roundName, i) => {
                        const round = rounds[roundName];
                        return <Panel header={this.renderPanel(roundName)} key={i} extra={this.extra(roundName)}>
                            <RoundCreator round={round} roundRef={this.quizRef.child('rounds').child(roundName)} />
                        </Panel>
                    })}
                </Collapse>
                <button onClick={this.addNewRound}>Add New Round</button>
                {this.renderEditFileNames()}
            </div>
        );
    }
}

export default withRouter(QuizCreator)