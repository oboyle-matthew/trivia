import React from 'react';
import { Input, Select, List} from 'antd';
import TextAnswer from "../host/answer_components/TextAnswer";
import NumberAnswer from "../host/answer_components/NumberAnswer";
import ClosestNumber from "../host/answer_components/ClosestNumber";
import MultipleChoice from "../host/answer_components/MultipleChoice";
import SpeedRound from "../host/answer_components/SpeedRound";
import MultipleAnswers from "../host/answer_components/MultipleAnswers";

const { Option } = Select;

export default class QuestionCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answerType: 'exactly',
            possibleAnswers: [],
            newAnswer: '',
            questionType: 'number',
            points: 1,
        };
    }

    addQuestion = () => {
        let { question, answerType, possibleAnswers, newAnswer } = this.state;
        if (newAnswer.length > 0) {
            possibleAnswers.push(newAnswer);
        }
        this.props.addQuestion(question, answerType, possibleAnswers);
        this.setState({
            question: '',
            possibleAnswers: [],
            newAnswer: '',
        })
    };

    changeQuestion = (e) => {
        this.setState({
            question: e.target.value
        })
    }

    changeNewAnswer = (e) => {
        this.setState({
            newAnswer: e.target.value
        })
    };

    changeAnswerType = (e) => {
        this.setState({
            answerType: e
        })
    }

    addPossibleAnswer = (e) => {
        const { possibleAnswers } = this.state;
        this.setState({
            possibleAnswers: [...possibleAnswers, e.target.value.toLowerCase()],
            newAnswer: '',
        })
    };

    changeQuestionType = (e) => {
        this.setState({
            questionType: e
        })
    };

    question = () => {
        const { question, answerType, possibleAnswers, newAnswer } = this.state;
        return (
            <div>
                <h3>Question: </h3>
                <Input value={question} onChange={this.changeQuestion} placeholder="Question" style={{height: 40}}/>
            </div>
        )

    }

    questionType = () => {
        const { question, answerType, possibleAnswers, newAnswer, questionType } = this.state;
        return (
            <div>
                <h3>Answer Type: </h3>
                <Select value={questionType} style={{width: 200, height: 40}} onChange={this.changeQuestionType}>
                    <Option value="text">Text</Option>
                    <Option value="number">Number</Option>
                    <Option value="closest">Closest Number</Option>
                    <Option value="multiple_choice">Multiple Choice</Option>
                    <Option value="multiple_answers">Multiple Answers</Option>
                    <Option value="speed">Speed round</Option>
                </Select>
            </div>
        )

    }

    textQuestion = () => {
        const { question, answerType, possibleAnswers, newAnswer } = this.state;
        return (
            <div>
                <h3>Possible answers: </h3>
                <div>
                    {possibleAnswers.length === 0 ? "No answer options yet..." : <List
                        dataSource={possibleAnswers}
                        renderItem={item => (
                            <List.Item>{item}
                            </List.Item>
                        )}
                    />}
                    <div>
                        Input an answer (Enter to add it to the list):
                        <Input style={{width: 400}} onPressEnter={this.addPossibleAnswer} value={newAnswer} onChange={this.changeNewAnswer} placeholder="Answer" />
                    </div>
                </div>
            </div>
        )
    };

    displayAnswer = () => {
        const { questionType } = this.state;
        if (questionType === 'text') {
            return <TextAnswer />
        } else if (questionType === 'number') {
            return <NumberAnswer/>
        } else if (questionType === 'closest') {
            return <ClosestNumber/>
        } else if (questionType === 'multiple_choice') {
            return <MultipleChoice/>
        } else if (questionType === 'speed') {
            return <SpeedRound/>
        } else if (questionType === 'multiple_answers') {
            return <MultipleAnswers/>
        }
    };

    changePoints = (e) => {
        const value = e.target.value;
        if (value === '-' || value === '' || !isNaN(value) || value.indexOf('e') === value.length-1) {
            this.setState({points: e.target.value})
        }
    };

    displayPoints = () => {
        const { questionType, points } = this.state;
        if (questionType === 'text' || questionType === 'number' || questionType === 'multiple_choice') {
            return <div>
                Number of points: <Input style={{width: 150}} value={points} onChange={this.changePoints}/>
            </div>
        }
    };

    render() {
        const { question, answerType, possibleAnswers, newAnswer } = this.state;
        return (
            <div>
                <h1>Below you can create a new question</h1>
                {this.question()}
                {this.questionType()}
                {this.displayAnswer()}
                {this.displayPoints()}
            </div>
        );
    }

    // render() {
    //     const { question, answerType, possibleAnswers, newAnswer } = this.state;
    //     return (
    //         <div>
    //             <h1>Below you can create a new question</h1>
    //             <div>
    //                 <h3>Question: </h3><Input value={question} onChange={this.changeQuestion} placeholder="Question" style={{height: 40}}/>
    //                 {this.questionType()}
    //                 <h3>Answer Type: </h3><Select value={answerType} style={{width: 120, height: 40}} onChange={this.changeAnswerType}>
    //                     <Option value="exactly">Is Exactly...</Option>
    //                     <Option value="contains">Contains...</Option>
    //                 </Select>
    //                 <br/>
    //                 {this.textQuestion()}
    //                 <Input type={'number'} />
    //
    //
    //             </div>
    //             <button onClick={this.addQuestion}>Add</button>
    //         </div>
    //     );
    // }

}