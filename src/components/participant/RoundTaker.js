import React from 'react';
import firebase from 'firebase';
import {Alert, Select} from 'antd';
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
import ImageDisplay from "../media_display/ImageDisplay";
import {ResizableBox} from "react-resizable";

const { Option } = Select;

class RoundTaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            round: {},
            userInputRefs: [],
            selectedTeam: null,
            teams: [],
            customScores: [],
            customScoresError: null,
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
                customScores: round.questions.map(() => undefined),
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

    changeCustomScore = (e,i) => {
        const { customScores, round } = this.state;
        customScores[i] = e;
        let customScoresError = false;
        let numbers = [0,0,0];
        customScores.forEach(score => {
            if (score === '1') {
                numbers[0]++;
            } else if (score === '2') {
                numbers[1]++;
            } else if (score === '3') {
                numbers[2]++;
            }
        });
        numbers.forEach((number, i) => {
            if (number > parseInt(round.customScores[i])) {
                customScoresError = "Too many " + (i+1) + " points";
            }
        });
        this.setState({
            customScores,
            customScoresError
        })
    };

    selectCustomScore = (i) => {
        const { customScores, customScoresError } = this.state;
        return <div style={{display: 'flex', flexDirection: 'row'}}>
            <Select placeholder="points..." value={customScores[i]} style={{width: 100, height: 40}} onChange={e => this.changeCustomScore(e,i)}>
                <Option value={'0'}>0</Option>
                <Option value={'1'}>1</Option>
                <Option value={'2'}>2</Option>
                <Option value={'3'}>3</Option>
            </Select>
            {customScoresError && <p style={{color: 'red'}}>{customScoresError}</p>}
        </div>
    };

    displayQuestion = (question, i, customScoringEnabled) => {
        if (question.questionType === 'speed' && !question.begin) {
            return;
        }
        return <div style={{border: '2px solid black', width: question.imageId ? "" : "100%"}}>
            {/*If the question doesn't have media, it should take up the whole row*/}
            <div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <h4>Q{i+1}: {question.question} (type={question.questionType})</h4>
                    {customScoringEnabled && this.selectCustomScore(i)}
                </div>
                {question.imageId && <ImageDisplay width={600} height={300} imageId={question.imageId}/>}
            </div>
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
        const { round, userInputRefs, selectedTeam, customScores } = this.state;
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
        submitAnswer(answers, name, round, this.roundRef, selectedTeam, customScores);
    };

    changeSelectedTeam = (e) => {
        this.setState({
            selectedTeam: e,
        })
    };

    selectTeam = () => {
        const { selectedTeam, teams } = this.state;
        return <Select value={selectedTeam} style={{width: 200, height: 40}} onChange={this.changeSelectedTeam}>
            {teams && Object.keys(teams).map(teamName => <Option value={teamName}>{teamName}</Option>)}
        </Select>
    };

    render() {
        const { round, selectedTeam } = this.state;
        const { name } = this.props.match.params;
        this.userInputRefs = [];
        return (
            <div>
                <Link to={'/participant/' + name}>
                    <button>Home screen</button>
                </Link>
                <br/>
                {round.description && <div style={{border: '2px solid black'}}>
                    <h3>Round description:</h3>
                    {round.description.split("\n").map(line => <div>{line}</div>)}
                </div>}
                <br/>
                Select your team: {this.selectTeam()}
                {!selectedTeam && <Alert message={"You must select a team before submitting"} type="warning" />}
                <h1>{round && round.name}</h1>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {round && round.questions && round.questions.map((q, i) => this.displayQuestion(q,i,round.customScoringEnabled))}
                </div>
                {!selectedTeam && <Alert message={"You must select a team before submitting"} type="warning" />}
                {selectedTeam && <Link to={'/participant/' + name + '/' + round.name + '/results/' + selectedTeam} >
                    <button onClick={this.submitRound}>Submit all answers for this round</button>
                </Link>}
            </div>
        );
    }
}

export default withRouter(RoundTaker)