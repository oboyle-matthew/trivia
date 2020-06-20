import React from 'react';
import {Input} from "antd";

export default class SpeedClues extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answer: '',
        };
    }

    updateAnswer = (e) => {
        this.setState({
            answer: e.target.value,
        })
    };

    render() {
        const { clues } = this.props;
        const { answer } = this.state;
        return (
            <div>
                {clues.map(clue => {
                    return clue.show && <div>
                        {clue.clue}
                    </div>
                })}
                <Input value={answer} onChange={this.updateAnswer}/>
                <button onClick={() => this.props.submit(answer)}>Submit</button>
            </div>
        );
    }

}