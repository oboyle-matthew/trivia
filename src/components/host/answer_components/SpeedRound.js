import React from 'react';
import { Input, Select, List} from 'antd';
import TextAnswer from "./TextAnswer";

const { Option } = Select;

export default class SpeedRound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clues: [''],
            scoreType: 'clues_revealed',
            cluesRevealedScore: [1],
            positionScores: [3,2,1,0,0,0],
        };
        this.textAnswerRef = React.createRef();
    }

    getInfoForPosting = () => {
        const { clues, scoreType, cluesRevealedScore, positionScores } = this.state;
        const infoForPosting = this.textAnswerRef.current.getInfoForPosting();
        infoForPosting.clues = clues;
        infoForPosting.scoreType = scoreType;
        infoForPosting.positionScoring = scoreType === 'clues_revealed' ? cluesRevealedScore : positionScores;
        return infoForPosting;
    };

    updateClue = (e, i) => {
        const { clues } = this.state;
        clues[i] = e.target.value;
        this.setState({
            clues: clues,
        })
    };

    removeClue = (i) => {
        const { clues, cluesRevealedScore } = this.state;
        clues.splice(i,1);
        cluesRevealedScore.splice(0,1);
        this.setState({
            clues: clues,
            cluesRevealedScore: cluesRevealedScore,
        })
    };

    addClue = () => {
        const { clues, cluesRevealedScore } = this.state;
        this.setState({
            clues: [...clues, ''],
            cluesRevealedScore: [parseFloat(cluesRevealedScore[0])+1, ...cluesRevealedScore],
        })
    };

    renderClues = () => {
        const { clues } = this.state;
        return (
            <div>
                {clues.map((clue, i) => {
                    return (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            Clue {i+1}: <Input style={{width: 800}} value={clue} onChange={e => this.updateClue(e, i)} />
                            {i > 0 && <button onClick={() => this.removeClue(i)}>X</button>}
                        </div>
                    )
                })}
                <button onClick={this.addClue}>Add Clue</button>
            </div>
        )
    };

    changeScoreType = (e) => {
        this.setState({
            scoreType: e
        })
    };

    updatePositionScore = (e, i) => {
        const { positionScores } = this.state;
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            positionScores[i] = value;
            this.setState({positionScores: positionScores})
        }
    };

    removePositionScore = (i) => {
        const { positionScores } = this.state;
        positionScores.splice(i, 1);
        this.setState({
            positionScores: positionScores,
        })
    };

    addPositionScore = () => {
        const { positionScores } = this.state;
        this.setState({
            positionScores: [... positionScores, 0]
        })
    };

    renderPositionScores = () => {
        const { positionScores } = this.state;
        return <div>
            {positionScores.map((score, i) => {
                return <div>
                    Position {i+1}:
                    <Input style={{width: 50}} value={score} onChange={e => this.updatePositionScore(e, i)} />
                    <button onClick={() => this.removePositionScore(i)}>X</button>
                </div>
            })}
            <button onClick={this.addPositionScore}>Add position</button>
        </div>
    };

    renderScoring = () => {
        const { scoreType } = this.state;
        return (
            <div>
                <div>Scores determined by:</div>
                <Select value={scoreType} style={{width: 200, height: 40}} onChange={this.changeScoreType}>
                    <Option value="clues_revealed">Clues Revealed</Option>
                    <Option value="position">Position</Option>
                </Select>
                {scoreType === 'clues_revealed' ? this.renderCluesRevealedScores() : this.renderPositionScores()}
            </div>
        )
    };

    updateCluesRevealedScore = (e,i) => {
        const {cluesRevealedScore} = this.state;
        const value = e.target.value;
        if (value === '' || !isNaN(value)) {
            cluesRevealedScore[i] = value;
            this.setState({cluesRevealedScore: cluesRevealedScore})
        }
    };

    renderCluesRevealedScores = () => {
        const { cluesRevealedScore } = this.state;
        return <div>
            {cluesRevealedScore.map((score, i) => {
                return <div>
                    Guessing after clue {i+1} =
                    <Input style={{width: 50}} value={score} onChange={e => this.updateCluesRevealedScore(e, i)} />
                    points
                </div>
            })}
        </div>
    };

    render() {
        return (
            <div>
                {this.renderClues()}
                <TextAnswer ref={this.textAnswerRef} />
                {this.renderScoring()}

            </div>
        );
    }

}