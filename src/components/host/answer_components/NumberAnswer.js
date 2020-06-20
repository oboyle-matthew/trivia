import React from 'react';
import { Input, Select, List} from 'antd';

const { Option } = Select;

export default class NumberAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberAnswer: null,
            margin: 0,
            answerType: 'plusMinus',
            minInput: null,
            maxInput: null,
        };
    }

    getInfoForPosting = () => {
        return this.state;
    };

    changeAnswer = (e) => {
        const value = e.target.value;
        if (value === '-' || value === '' || !isNaN(value) || value.indexOf('e') === value.length-1) {
            this.setState({numberAnswer: value})
        }
    };

    changeMargin = (e) => {
        const value = e.target.value;
        if (value === '-' || value === '' || !isNaN(value) || value.indexOf('e') === value.length-1) {
            this.setState({margin: value})
        }
    };

    changeMinInput = (e) => {
        const { maxInput } = this.state;
        const value = e.target.value;
        if (value === '-' || value === '' || !isNaN(value) || value.indexOf('e') === value.length-1) {
            let newNumberAnswer = null;
            let newMargin = 0;
            if (!this.invalidNumber(value) && !this.invalidNumber(maxInput)) {
                newNumberAnswer = ((parseFloat(maxInput) + parseFloat(value)) / 2);
                newMargin = ((parseFloat(maxInput) - parseFloat(value)) / 2);
            }
            this.setState({
                numberAnswer: newNumberAnswer,
                margin: Math.abs(newMargin),
                minInput: value,
            })
        }
    };

    changeMaxInput = (e) => {
        const { minInput } = this.state;
        const value = e.target.value;
        if (value === '-' || value === '' || !isNaN(value) || value.indexOf('e') === value.length-1) {
            let newNumberAnswer = null;
            let newMargin = 0;
            if (!this.invalidNumber(minInput) && !this.invalidNumber(value)) {
                newNumberAnswer = ((parseFloat(value) + parseFloat(minInput)) / 2);
                newMargin = ((parseFloat(value) - parseFloat(minInput)) / 2);
            }
            this.setState({
                numberAnswer: newNumberAnswer,
                margin: Math.abs(newMargin),
                maxInput: value,
            })
        }
    };

    invalidNumber = (num) => {
        return num === '' || num === null || isNaN(num);
    };

    changeAnswerType = (e) => {
        this.setState({
            answerType: e
        })
    };

    renderAnswerInput = () => {
        const { numberAnswer, margin, answerType, minInput, maxInput } = this.state;
        return (
            answerType === 'plusMinus' ? <div>
                Answer: <Input style={{width: 200}} value={numberAnswer} onChange={this.changeAnswer} />
                +- <Input style={{width: 200}} value={margin} onChange={this.changeMargin} />
            </div> : <div>
                Min: <Input style={{width: 200}} value={minInput} onChange={this.changeMinInput} />
                Max: <Input style={{width: 200}} value={maxInput} onChange={this.changeMaxInput} />
            </div>
        )
    }

    render() {
        const { numberAnswer, margin, answerType } = this.state;
        return (
            <div >
                <div>
                    <div>Answer Type: </div>
                    <Select value={answerType} style={{width: 200, height: 40}} onChange={this.changeAnswerType}>
                        <Option value="plusMinus">Plus/Minus</Option>
                        <Option value="minMax">Min/Max</Option>
                    </Select>
                </div>
                {this.renderAnswerInput()}
                (Answers accepted between: {parseFloat(numberAnswer) - parseFloat(margin)} and {parseFloat(numberAnswer) + parseFloat(margin)})
            </div>
        );
    }

}