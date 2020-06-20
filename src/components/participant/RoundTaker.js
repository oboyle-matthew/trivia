import React from 'react';
import firebase from 'firebase';
import { Select } from 'antd';
import {
    Link,
    useParams,
    withRouter,
} from "react-router-dom";
import TextInput from "./user_input/TextInput";
import NumberInput from "./user_input/NumberInput";
import MultipleChoice from "./user_input/MultipleChoice";
import SpeedClues from "./speed_clues/SpeedClues";
import {submitAnswer, submitSpeedAnswer} from "../../helpers/AnswerPoster";
import MultipleAnswersInput from "./user_input/MultipleAnswersInput";

const { Option } = Select;

class RoundTaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            round: {},
            userInputRefs: [],
            selectedTeam: null,
            teams: [],
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
                userInputRefs: round.questions.map(() => React.createRef()),
            });
        });
        this.teamRef = firebase.database().ref('quizzes').child(name).child('teams');
        this.teamRef.on('value', snapshot => {
            const teams = snapshot.val();
            self.setState({
                teams,
            });
        });
    }

    userInput = (question, i) => {
        const { questionType } = question;
        const { userInputRefs } = this.state;
        if (questionType === 'text') {
            return <TextInput ref={userInputRefs[i]}/>
        }
        if (questionType === 'number' || questionType === 'closest') {
            return <NumberInput ref={userInputRefs[i]}/>
        }
        if (questionType === 'multiple_choice') {
            return <MultipleChoice choices={question.choices} ref={userInputRefs[i]}/>
        }
        if (questionType === 'speed') {
            return <SpeedClues clues={question.clues} ref={userInputRefs[i]} submit={answer => this.submitSpeedQuestion(answer, i)}/>
        }
        if (questionType === 'multiple_answers') {
            return <MultipleAnswersInput multipleAnswers={question.multipleAnswers} ref={userInputRefs[i]}/>
        }
    };

    displayQuestion = (question, i) => {
        if (question.questionType === 'speed' && !question.begin) {
            return;
        }
        return <div style={{border: '2px solid black'}}>
            <h4>Q{i+1}: {question.question} (type={question.questionType})</h4>
            {this.userInput(question, i)}
        </div>
    };

    submitSpeedQuestion = (answer, i) => {
        const { name } = this.props.match.params;
        const { round, selectedTeam } = this.state;
        if (selectedTeam === null) {
            return;
        }
        const answers = round.questions.map(() => null);
        answers[i] = {"answer": answer};
        submitAnswer(answers, name, round, this.roundRef, selectedTeam);
    };

    submitRound = () => {
        const { name } = this.props.match.params;
        const { round, userInputRefs, selectedTeam } = this.state;
        if (selectedTeam === null) {
            return;
        }
        const answers = [];
        userInputRefs.forEach(ref => {
            if (ref.current) {
                answers.push(ref.current.state)
            } else {
                answers.push(null);
            }
        });
        submitAnswer(answers, name, round, this.roundRef, selectedTeam);
    };

    changeSelectedTeam = (e) => {
        this.setState({
            selectedTeam: e,
        })
    };

    selectTeam = () => {
        const { selectedTeam, teams } = this.state;
        return <Select value={selectedTeam} style={{width: 200, height: 40}} onChange={this.changeSelectedTeam}>
            {Object.keys(teams).map(teamName => <Option value={teamName}>{teamName}</Option>)}
        </Select>
    };

    render() {
        const { round } = this.state;
        this.userInputRefs = [];
        return (
            <div>
                Select your team: {this.selectTeam()}
                <h1>Round name here: {round && round.name}</h1>
                {round && round.questions && round.questions.map((q, i) => this.displayQuestion(q,i))}
                <button onClick={this.submitRound}>Submit all answers for this round</button>
            </div>
        );
    }
}

export default withRouter(RoundTaker)