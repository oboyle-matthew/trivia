import React from 'react';
import { Input, Select, List} from 'antd';


const { Option } = Select;

export default class ClosestNumber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberAnswer: null,
            positionScoring: [3,2,1,0,0],
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

    updateScore = (e, i) => {
        const { positionScoring } = this.state;
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            positionScoring[i] = value;
            this.setState(positionScoring);
        }
    };

    addPosition = () => {
        const { positionScoring } = this.state;
        this.setState({
            positionScoring: [... positionScoring, 0]
        })
    };

    removePosition = (i) => {
        const { positionScoring } = this.state;
        positionScoring.splice(i, 1);
        this.setState({
            positionScoring: positionScoring,
        })
    };

    renderPositionScores = () => {
        const { positionScoring } = this.state;
        return <div>
            {positionScoring.map((score, i) => {
                return <div>
                    Position {i+1}:
                    <Input style={{width: 50}} value={score} onChange={e => this.updateScore(e, i)} />
                    <button onClick={() => this.removePosition(i)}>X</button>
                </div>
            })}
            <button onClick={this.addPosition}>Add position</button>
        </div>
    };

    render() {
        const { numberAnswer } = this.state;
        return (
            <div>
                Answer: <Input style={{width: 200, height: 30}} value={numberAnswer} onChange={this.changeAnswer} />
                {this.renderPositionScores()}
            </div>
        );
    }

}