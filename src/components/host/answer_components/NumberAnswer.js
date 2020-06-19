import React from 'react';
import { Input, Select, List} from 'antd';

const { Option } = Select;

export default class NumberAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberAnswer: null,
            margin: 0,
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

    render() {
        const { numberAnswer, margin } = this.state;
        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                Answer: <Input style={{width: 200}} value={numberAnswer} onChange={this.changeAnswer} />
                +- <Input style={{width: 200}} value={margin} onChange={this.changeMargin} />
                (Answers accepted between: {parseFloat(numberAnswer) - parseFloat(margin)} and {parseFloat(numberAnswer) + parseFloat(margin)})
            </div>
        );
    }

}