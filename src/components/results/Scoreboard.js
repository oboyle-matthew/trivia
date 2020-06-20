import React from 'react';
import firebase from 'firebase';
import { Select, Table } from 'antd';
import {
    Link,
    useParams,
    withRouter,
} from "react-router-dom";

const { Option } = Select;

const teamNameColumn = {
    title: 'Team Name',
    dataIndex: 'teamName',
    key: 'teamName',
};

const totalColumn = {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
};

class Scoreboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
        };
    }

    componentDidMount() {
        const { name } = this.props.match.params;
        console.log(name);
        const self = this;
        this.quizRef = firebase.database().ref('quizzes').child(name);
        this.quizRef.on('value', snapshot => {
            const quiz = snapshot.val();
            self.setState({
                quiz,
            });
        });
    }

    createTotalTeamScores = (teamScores) => {
        teamScores.forEach(teamScore => {
            let total = 0;
            Object.keys(teamScore).filter(key => key !== 'teamName' && key !== 'total').forEach(key => {
                total += parseFloat(teamScore[key]);
            });
            teamScore.total = total;
        })
    };

    render() {
        const { quiz } = this.state;
        const { teams, rounds } = quiz;
        let teamScores;
        if (teams) {
            teamScores = Object.keys(teams).map(teamName => {
                return {teamName: teamName}
            });
        }
        let roundNames = [];
        if (rounds) {
            roundNames = Object.keys(rounds);
            Object.keys(rounds).forEach(roundName => {
                const round = rounds[roundName];
                if (round.questions) {
                    round.questions.forEach(question => {
                        if (question.scores) {
                            Object.keys(question.scores).forEach(teamName => {
                                let teamScore = teamScores.filter(elem => elem.teamName === teamName)[0];
                                let score;
                                if (isNaN(question.scores[teamName]) || question.scores[teamName] === '') {
                                    score = 0;
                                } else {
                                    score = parseFloat(question.scores[teamName]);
                                }
                                if (teamScore.hasOwnProperty(round.name)) {
                                    teamScore[round.name] += score;
                                } else {
                                    teamScore[round.name] = score;
                                }
                            })
                        }
                    })
                }
            })
        }
        const roundColumns = roundNames.map(roundName => {
            return {
                title: roundName,
                dataIndex: roundName,
                key: roundName,
            }
        });
        if (teamScores) {
            this.createTotalTeamScores(teamScores);
            teamScores.sort((a,b) => b.total - a.total);
        }
        const columns = [teamNameColumn, ...roundColumns, totalColumn];
        return (
            <div>
                <Table columns={columns} dataSource={teamScores}/>
            </div>
        );
    }
}

export default withRouter(Scoreboard)