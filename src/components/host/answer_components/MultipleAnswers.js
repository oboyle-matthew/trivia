import React from 'react';
import { Input, Select, List} from 'antd';
import TextAnswer from "./TextAnswer";

const { Option } = Select;

export default class MultipleAnswers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scores: [1],
        };
        this.scoresRefs = [React.createRef()];
    }

    getInfoForPosting = () => {
        const { scores } = this.state;
        const multipleAnswers = this.scoresRefs.map(ref => ref.current.getInfoForPosting());
        return { multipleScores: scores, multipleAnswers }
    };

    addAnswer = () => {
        const { scores } = this.state;
        this.setState({
            scores: [...scores, parseFloat(scores[scores.length-1])+1]
        });
        this.scoresRefs.push(React.createRef());
    };

    removeLastAnswer = () => {
        const { scores } = this.state;
        scores.pop();
        this.setState({
            scores: scores
        });
        this.scoresRefs.pop();
    };

    updateScore = (e, i) => {
        const { scores } = this.state;
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            scores[i] = value;
            this.setState({scores: scores})
        }
    };

    render() {
        const { scores } = this.state;
        return (
            <div>
                {scores.map((elem, i) => {
                    return (
                        <div>
                            <hr/>
                            <h3>Answer {i+1}:</h3>
                            <TextAnswer ref={this.scoresRefs[i]}/>
                        </div>
                    )
                })}
                <hr/>
                <button onClick={this.addAnswer}>Add another answer</button>
                {scores.length > 1 && <button onClick={this.removeLastAnswer}>Remove last answer</button>}

                {scores.map((score, i) => {
                    return (
                        <div>
                            {i+1} correct = <Input style={{width: 50}} value={score} onChange={e => this.updateScore(e, i)} /> points
                        </div>
                    )
                })}

            </div>
        );
    }

}