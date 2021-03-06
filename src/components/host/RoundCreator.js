import React from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import Questions from "../old_stuff/Questions";
import LevenshteinDistance from "../old_stuff/LevenshteinDistance";
import {Table, Modal, Switch, Input} from "antd";
import { storage } from "firebase";
import QuestionCreator from "./QuestionCreator";
import {submitQuestion} from "../../helpers/QuestionPoster";
import ImageDisplay from "../media_display/ImageDisplay";

const { TextArea } = Input;

const ordinalSuffix = (i) => {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
};

const renderAnswers = (text, record) => {
    const { questionType } = record;
    if (questionType === 'text' || questionType === 'speed') {
        return <div>
            {record.answerType.toUpperCase()} [{record.possibleAnswers.join(', ')}]
        </div>
    }
    if (questionType === 'number' || questionType === 'closest') {
        const num = parseFloat(record.numberAnswer);
        const margin = parseFloat(record.margin);
        return <div>
            {record.margin ? (num - margin) + " - " + (num + margin) : num}
        </div>
    }
    if (questionType === 'multiple_answers') {
        return <div>
            {record.multipleAnswers.map((answer, i) => {
                return <div>
                    {i+1}: {answer.answerType.toUpperCase()} [{answer.possibleAnswers.join(', ')}]
                </div>
            })}
        </div>
    }
    if (questionType === 'multiple_choice') {
        return <div>
            {record.correctChoice.toUpperCase()} from [{record.choices.join(', ')}]
        </div>
    }
    return text;
};

const renderScores = (text, record) => {
    const { questionType } = record;
    if (questionType === 'text' || questionType === 'number' || questionType === 'multiple_choice') {
        return <div>
            {record.score} point(s)
        </div>
    }
    if (questionType === 'closest') {
        return record.positionScoring.map((score, i) => <div>{ordinalSuffix(i+1)} closest: {score} point(s)</div>)
    }
    if (questionType === 'multiple_answers') {
        return record.multipleScores.map((score, i) => <div>{i+1} Correct: {score} point(s)</div>)
    }
    if (questionType === 'speed') {
        if (record.scoreType === 'clues_revealed') {
            return record.positionScoring.map((score, i) => <div>{i+1} clue(s) revealed: {score} point(s)</div>)
        }
        if (record.scoreType === 'position') {
            return record.positionScoring.map((score, i) => <div>{ordinalSuffix(i+1)}: {score} point(s)</div>)
        }
    }
    return text;
};

const renderMedia = (text, record) => {
    return <ImageDisplay width={100} height={100} imageId={record.imageId}/>
}

export default class RoundCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            questionError: null,
            description: props.round.description,
        };
        this.questionCreatorRef = React.createRef();
        this.columns = [
            {
                title: 'Position',
                dataIndex: 'pos',
                key: 'question',
                render: this.renderPosition,
            },
            {
                title: 'Question',
                dataIndex: 'question',
                key: 'question',
                render: this.renderQuestions,
            },
            {
                title: 'Media',
                dataIndex: 'media',
                key: 'media',
                render: renderMedia,
            },
            {
                title: 'Question Type',
                dataIndex: 'questionType',
                key: 'question_type',
            },
            {
                title: 'Clues/Options',
                dataIndex: 'clues',
                key: 'clues',
                render: this.renderClues,
            },
            {
                title: 'Answers',
                dataIndex: 'answers',
                key: 'answers',
                render: renderAnswers,
            },
            {
                title: 'Scoring',
                dataIndex: 'scoring',
                key: 'scoring',
                render: renderScores,
            },
            {
                title: 'Delete',
                dataIndex: 'delete',
                key: 'delete',
                render: this.renderDeleteRow,
            }
        ];
    }

    moveUp = (i) => {
        const { round, roundRef } = this.props;
        const oldAbove = round.questions[i-1];
        round.questions[i-1] = round.questions[i];
        round.questions[i] = oldAbove;
        roundRef.set(round);
    };

    moveDown = (i) => {
        const { round, roundRef } = this.props;
        const oldBelow = round.questions[i+1];
        round.questions[i+1] = round.questions[i];
        round.questions[i] = oldBelow;
        roundRef.set(round);
    };

    renderPosition = (text, record, i) => {
        const { round } = this.props;
        return <div>
            {i > 0 && <button onClick={() => this.moveUp(i)}>Move up</button>}
            {i < round.questions.length-1 && <button onClick={() => this.moveDown(i)}>Move down</button>}
        </div>
    };

    deleteQuestion = (i) => {
        const { round, roundRef } = this.props;
        round.questions.splice(i,1);
        roundRef.set(round);
    };

    renderDeleteRow = (text,record,i) => {
        return <button onClick={() => this.deleteQuestion(i)}>X</button>
    };

    beginSpeedRound = (record, i) => {
        const { roundRef } = this.props;
        const qRef = roundRef.child('questions').child(i);
        record.begin = true;
        qRef.set(record);
    };

    endSpeedRound = (record, i) => {
        const { roundRef } = this.props;
        const qRef = roundRef.child('questions').child(i);
        record.begin = false;
        record.clues.forEach(clue => clue.show = false);
        qRef.set(record);
    };

    showClue = (clue, i, clueIndex) => {
        const { roundRef } = this.props;
        const clueRef = roundRef.child('questions').child(i).child('clues').child(clueIndex);
        clue.show = true;
        clueRef.set(clue);
    };

    hideClue = (clue, i, clueIndex) => {
        const { roundRef } = this.props;
        const clueRef = roundRef.child('questions').child(i).child('clues').child(clueIndex);
        clue.show = false;
        clueRef.set(clue);
    };

    renderSpeedClues = (record, i) => {
        return record.clues.map((clue, clueIndex) => {
            let clueButton;
            if (clue.show) {
                clueButton = <button onClick={() => this.hideClue(clue, i, clueIndex)}>Hide</button>
            } else {
                clueButton = <button onClick={() => this.showClue(clue, i, clueIndex)}>Show</button>
            }
            return <div>
                Clue {clueIndex+1}: {clue.clue}
                {record.begin && clueButton}
            </div>
        })
    };

    renderClues = (text, record, i) => {
        const { questionType } = record;
        if (questionType === 'multiple_choice') {
            return record.choices.map(choice => <div>{choice}</div>);
        }
        if (questionType === 'speed') {
            return this.renderSpeedClues(record, i);
        }
        return text;
    };

    renderQuestions = (text, record, index) => {
        const { questionType } = record;
        if (questionType === 'speed') {
            return <div>
                {text}
                {record.begin ? <button
                    onClick={() => this.endSpeedRound(record, index)}>
                    End
                </button> : <button
                    onClick={() => this.beginSpeedRound(record, index)}>
                    Begin
                </button>
                }
            </div>
        }
        return text;
    };

    addQuestion = () => {
        this.setState({
            modalOpen: true,
        })
    };

    uploadImageToFirebase = (image, imageId) => {
        firebase.storage().ref(`/images/${imageId}`).put(image)
    };

    handleOk = () => {
        const { round, roundRef } = this.props;
        const infoForPosting = this.questionCreatorRef.current.getInfoForPosting();
        try {
            submitQuestion(infoForPosting, round, roundRef);
            if (infoForPosting.imageId) {
                this.uploadImageToFirebase(this.questionCreatorRef.current.getImage(), infoForPosting.imageId);
            }
            this.setState({
                questionError: null,
                modalOpen: false,
            })
        } catch(err) {
            this.setState({
                questionError: err,
            })
        }
    };

    handleCancel = () => {
        this.setState({
            modalOpen: false,
        })
    };

    toggleShowRound = (e, round) => {
        const { roundRef } = this.props;
        round.show = e;
        round.questions.forEach((question, i) => {
            if (question.questionType === 'speed') {
                question.begin = false;
                question.clues.forEach(clue => clue.show = false);
            }
        });
        roundRef.set(round);
    };

    toggleFinishedRound = (e, round) => {
        const { roundRef } = this.props;
        round.finished = e;
        roundRef.set(round);
    };

    setCustomScoring = (val) => {
        const { round, roundRef } = this.props;
        round.customScoringEnabled = val;
        if (val && !round.customScores) {
            round.customScores = [0,0,0];
        }
        roundRef.set(round);
    };

    updateCustomScore = (e, i) => {
        const { round, roundRef } = this.props;
        const value = e.target.value;
        if (value === '' || (!isNaN(value) && Number.isInteger(parseInt(value)))) {
            round.customScores[i] = value;
            roundRef.set(round);
        }
    };

    renderCustomScoring = () => {
        const { round } = this.props;
        const { customScoringEnabled, customScores } = round;
        return <div style={{marginTop: 20, marginBottom: 20}}>
            <button onClick={() => this.setCustomScoring(!customScoringEnabled)}>{customScoringEnabled ? "Disable " : "Enable "} custom scoring</button>
            (Overrides all basic scores)
            {customScoringEnabled && customScores && <div>
                {customScores.map((score, i) => {
                    return <div style={{display: 'flex', flexDirection: 'row'}}>
                        {i+1} points: <Input style={{width: 200}} value={score} onChange={e => this.updateCustomScore(e, i)} />
                    </div>
                })}
            </div>}
        </div>
    };

    updateDescription = () => {
        const { round, roundRef } = this.props;
        const { description } = this.state;
        round.description = description;
        roundRef.set(round);
    };

    renderDescription = () => {
        const { description } = this.state;
        return <div>
            <TextArea
                value={description}
                onChange={e => this.setState({description: e.target.value})}
                placeholder="Description...."
                autoSize={{ minRows: 1 }}
            />
            <button onClick={this.updateDescription}>Update description</button>
        </div>
    };

    render() {
        const { round } = this.props;
        const { modalOpen, questionError } = this.state;
        return (
            <div>
                <div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div>
                            Show round: <Switch checked={round.show} onChange={e => this.toggleShowRound(e,round)} />
                        </div>
                        <div style={{marginLeft: 30}}>
                            Show results: <Switch checked={round.finished} onChange={e => this.toggleFinishedRound(e,round)} />
                        </div>
                    </div>
                    {this.renderCustomScoring()}
                    {this.renderDescription()}
                    {round.questions && <Table columns={this.columns} dataSource={round.questions} pagination={false} />}
                    <button onClick={this.addQuestion}>Add question</button>
                    <Modal
                        title="Create a question"
                        visible={modalOpen}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <QuestionCreator error={questionError} ref={this.questionCreatorRef}/>
                    </Modal>
                </div>
            </div>
        );
    }
}