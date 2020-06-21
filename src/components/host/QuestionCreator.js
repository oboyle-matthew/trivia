import React from 'react';
import app from 'firebase/app';
import firebase from 'firebase';
import Questions from "../old_stuff/Questions";
import LevenshteinDistance from "../old_stuff/LevenshteinDistance";
import {Table, Modal, Alert} from "antd";
import { storage } from "firebase";
import Question from "./question_components/Question";
import QuestionType from "./question_components/QuestionType";
import TextAnswer from "./answer_components/TextAnswer";
import NumberAnswer from "./answer_components/NumberAnswer";
import ClosestNumber from "./answer_components/ClosestNumber";
import MultipleChoice from "./answer_components/MultipleChoice";
import SpeedRound from "./answer_components/SpeedRound";
import MultipleAnswers from "./answer_components/MultipleAnswers";
import SingleScore from "./score_components/SingleScore";

export default class QuestionCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionType: 'text',
            modalOpen: false,
        };
        this.questionRef = React.createRef();
        this.questionTypeRef = React.createRef();
        this.possibleAnswersRef = React.createRef();
        this.scoreRef = React.createRef();
    }

    updateQuestionType = (e) => {
        this.setState({
            questionType: e,
        })
    };

    displayPossibleAnswers = () => {
        const { questionType } = this.state;
        if (questionType === 'text') {
            return <TextAnswer ref={this.possibleAnswersRef} />
        } else if (questionType === 'number') {
            return <NumberAnswer ref={this.possibleAnswersRef}/>
        } else if (questionType === 'closest') {
            return <ClosestNumber ref={this.possibleAnswersRef}/>
        } else if (questionType === 'multiple_choice') {
            return <MultipleChoice ref={this.possibleAnswersRef}/>
        } else if (questionType === 'speed') {
            return <SpeedRound ref={this.possibleAnswersRef}/>
        } else if (questionType === 'multiple_answers') {
            return <MultipleAnswers ref={this.possibleAnswersRef}/>
        }
    };

    getInfoForPosting = () => {
        const { questionType } = this.state;
        const question = this.questionRef.current.state.questionString;
        const infoForPosting = {question: question, questionType};
        const info = this.possibleAnswersRef.current.getInfoForPosting();
        Object.keys(info).forEach(key => infoForPosting[key] = info[key]);
        if (this.scoreRef.current) {
            infoForPosting.score = this.scoreRef.current.state.score;
        }
        console.log(infoForPosting);
        return infoForPosting;
    };

    displayScores = () => {
        const { questionType } = this.state;
        if (questionType === 'text' || questionType === 'number' || questionType === 'multiple_choice') {
            return <SingleScore ref={this.scoreRef}/>
        }
    };

    render() {
        const { error } = this.props;
        const { questionType } = this.state;
        return (
            <div>
                {error && <Alert message={error} type="error" />}
                <Question ref={this.questionRef}/>
                <QuestionType ref={this.questionTypeRef} questionType={questionType} update={this.updateQuestionType}/>
                {this.displayPossibleAnswers()}
                {this.displayScores()}
            </div>
        );
    }

}