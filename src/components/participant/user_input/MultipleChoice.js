import React from 'react';
import { Input, Select, Radio} from 'antd';

const { Option } = Select;

export default class MultipleChoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: null,
        };
    }

    onChange = e => {
        this.setState({
            answer: e.target.value,
        });
    };

    render() {
        const { choices } = this.props;
        const { answer } = this.state;
        return (
            <div>
                <Radio.Group onChange={this.onChange} value={answer}>
                    {choices.map((choice, i) => {
                        return <div>
                            <Radio value={choice}>{choice}</Radio>
                        </div>
                    })}
                </Radio.Group>

            </div>
        );
    }

}