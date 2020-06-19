import React from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import Questions from "../old_stuff/Questions";
import LevenshteinDistance from "../old_stuff/LevenshteinDistance";
import { Table, Modal } from "antd";
import { storage } from "firebase";
import QuestionCreator from "./QuestionCreator";
import {submitQuestion} from "../../helpers/QuestionPoster";

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
        return <div>
            {record.numberAnswer}
            {record.margin && (' +- ' + record.margin)}
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
};

const renderClues = (text, record) => {
    const { questionType } = record;
    if (questionType === 'multiple_choice') {
        return record.choices.map(choice => <div>{choice}</div>);
    }
    if (questionType === 'speed') {
        return record.clues.map((choice, i) => <div>Clue {i+1}: {choice}</div>);
    }
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
};

const columns = [
    {
        title: 'Question',
        dataIndex: 'question',
        key: 'question',
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
        render: renderClues,
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

];

export default class RoundCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
        };
        this.questionCreatorRef = React.createRef();
    }

    addQuestion = () => {
        this.setState({
            modalOpen: true,
        })
    };

    handleOk = (e) => {
        const { round } = this.props;
        const { roundRef } = this.props;
        try {
            const infoForPosting = this.questionCreatorRef.current.getInfoForPosting();
            submitQuestion(infoForPosting, round, roundRef);
            this.setState({
                modalOpen: false,
            })
        } catch(err) {
            console.log(err);
        }

    };

    handleCancel = () => {
        this.setState({
            modalOpen: false,
        })
    };

    render() {
        const { round } = this.props;
        const { modalOpen } = this.state;
        return (
            <div>
                <div>
                    {round.questions && <Table columns={columns} dataSource={round.questions} />}
                    <button onClick={this.addQuestion}>Add question</button>
                    <Modal
                        title="Create a question"
                        visible={modalOpen}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <QuestionCreator ref={this.questionCreatorRef}/>
                    </Modal>
                </div>
            </div>
        );
    }

}