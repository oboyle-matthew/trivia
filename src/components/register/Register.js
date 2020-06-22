import React from 'react';
import firebase from 'firebase';
import { Input} from 'antd';
import {
    withRouter,
} from "react-router-dom";

class QuizTaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
            teamName: '',
            teamMembers: [],
            newTeamMember: '',
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

    updateTeamName = (e) => {
        this.setState({
            teamName: e.target.value,
        })
    };

    updateNewTeamMember = (e) => {
        this.setState({
            newTeamMember: e.target.value,
        })
    };

    addTeamMember = () => {
        const { teamMembers, newTeamMember } = this.state;
        this.setState({
            teamMembers: [...teamMembers, newTeamMember],
            newTeamMember: '',
        })
    };

    submitTeam = () => {
        const { quiz, teamName, teamMembers} = this.state;
        const { teams } = quiz;
        if (!teams) {
            quiz.teams = {};
        }
        quiz.teams[teamName] = {name: teamName, teamMembers: teamMembers};
        this.quizRef.set(quiz);
        this.setState({
            teamMembers: [],
            teamName: '',
        })
    };

    render() {
        const { quiz, teamName, teamMembers, newTeamMember } = this.state;
        return (
            <div>
                <h1>{quiz && quiz.name}</h1>
                Team name: <Input value={teamName} onChange={this.updateTeamName} />
                {teamMembers.map(member => <div>{member}</div>)}
                Add Team Member: <Input onPressEnter={this.addTeamMember} value={newTeamMember} onChange={this.updateNewTeamMember} />
                <button onClick={this.submitTeam}>Submit Team</button>
            </div>
        );
    }
}

export default withRouter(QuizTaker)