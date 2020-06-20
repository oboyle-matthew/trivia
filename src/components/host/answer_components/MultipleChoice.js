import React from 'react';
import { Input, Select, List, Radio} from 'antd';

const { Option } = Select;

export default class MultipleChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choices: [],
            newOption: '',
            correctChoice: null,
        };
    }

    getInfoForPosting = () => {
        const { choices, correctChoice } = this.state;
        return { choices, correctChoice };
    };

    changeNewOption = (e) => {
        this.setState({
            newOption: e.target.value
        });
    };

    addChoice = () => {
        const { choices, newOption } = this.state;
        this.setState({
            choices: [...choices, newOption],
            newOption: '',
        })
    };

    removeOption = (i) => {
        const { choices } = this.state;
        choices.splice(i, 1);
        this.setState({
            choices: choices,
        })
    };

    onChange = e => {
        this.setState({
            correctChoice: e.target.value,
        });
    };

    render() {
        const { choices, newOption, correctChoice } = this.state;
        return (
            <div>
                <Radio.Group onChange={this.onChange} value={correctChoice}>
                    {choices.map((choice, i) => {
                        return <div>
                            <Radio value={choice}>{choice}</Radio>
                            <button onClick={() => this.removeOption(i)}>X</button>
                        </div>
                    })}
                </Radio.Group>
                <div>
                    <Input onPressEnter={this.addChoice} style={{width: 200}} value={newOption} onChange={this.changeNewOption} />
                    <button onClick={this.addChoice}>Add</button>
                </div>

            </div>
        );
    }

}