import React from 'react';
import { Input, Select, List} from 'antd';

const { Option } = Select;

export default class QuestionCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: '',
            answerType: 'exactly',
            possibleAnswers: [],
            newAnswer: '',
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
    }

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

    render() {
        const { question, answerType, possibleAnswers, newAnswer } = this.state;
        return (
            <div style={{border: '2px solid black'}}>
                <h1>Below you can create a new question</h1>
                <div>
                    <h3>Question: </h3><Input value={question} onChange={this.changeQuestion} placeholder="Question" style={{height: 40}}/>
                    <h3>Answer Type: </h3><Select value={answerType} style={{width: 120, height: 40}} onChange={this.changeAnswerType}>
                        <Option value="exactly">Is Exactly...</Option>
                        <Option value="contains">Contains...</Option>
                    </Select>
                    <br/>
                    <h3>Possible answers: </h3><div>
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
                <button onClick={this.addQuestion}>Add</button>
            </div>
        );
    }

}