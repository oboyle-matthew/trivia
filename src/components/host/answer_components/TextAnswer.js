import React from 'react';
import { Input, Select, List} from 'antd';

const { Option } = Select;

export default class TextAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answerType: 'exactly',
            possibleAnswers: [],
            newAnswer: '',
        };
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
    };

    addPossibleAnswer = (e) => {
        const { possibleAnswers } = this.state;
        this.setState({
            possibleAnswers: [...possibleAnswers, e.target.value.toLowerCase()],
            newAnswer: '',
        })
    };

    removePossibleAnswer = (i) => {
        let { possibleAnswers } = this.state;
        possibleAnswers.splice(i, 1);
        this.setState({
            possibleAnswers: possibleAnswers,
        })
    };

    getInfoForPosting = () => {
        const { answerType, possibleAnswers, newAnswer } = this.state;
        if (newAnswer.length > 0 && possibleAnswers.indexOf(newAnswer) === -1) {
            possibleAnswers.push(newAnswer.toLowerCase());
            this.setState({
                possibleAnswers: possibleAnswers,
                newAnswer: '',
            })
        }
        return {answerType, possibleAnswers};
    };

    render() {
        const { newAnswer, answerType, possibleAnswers } = this.state;
        return (
            <div>
                <div>
                    <div>Answer Type: </div>
                    <Select value={answerType} style={{width: 200, height: 40}} onChange={this.changeAnswerType}>
                        <Option value="exactly">Is Exactly...</Option>
                        <Option value="contains">Contains...</Option>
                        {/*<Option value="regex">Matches regex...</Option>*/}
                    </Select>
                    <br/>
                </div>
                <h4>Possible answers: </h4>
                <div>
                    {possibleAnswers.length === 0 ? "No answer options yet..." : <List grid={{column: 5}}
                        dataSource={possibleAnswers}
                        renderItem={(item, i) => (
                            <List.Item>{item}
                            <button onClick={() => this.removePossibleAnswer(i)}>X</button>
                            </List.Item>
                        )}
                    />}
                    <div>
                        Input an answer (Enter to add it to the list):
                        <Input style={{width: 400}} onPressEnter={this.addPossibleAnswer} value={newAnswer} onChange={this.changeNewAnswer} placeholder="Answer" />
                    </div>
                </div>
            </div>
        );
    }

}