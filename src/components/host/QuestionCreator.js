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
            image: null,
        };
        this.questionRef = React.createRef();
        this.questionTypeRef = React.createRef();
        this.possibleAnswersRef = React.createRef();
        this.scoreRef = React.createRef();
        this.imageInputRef = React.createRef();
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

    getImage = () => {
        return this.state.image;
    };

    getInfoForPosting = () => {
        const { questionType, image } = this.state;
        const question = this.questionRef.current.state.questionString;
        const infoForPosting = {question: question, questionType};
        const currentTime = new Date().getTime();
        // Need a unique_id for uploading image -- use current time!
        if (image) {
            infoForPosting.imageId = currentTime;
        }
        const info = this.possibleAnswersRef.current.getInfoForPosting();
        Object.keys(info).forEach(key => infoForPosting[key] = info[key]);
        if (this.scoreRef.current) {
            infoForPosting.score = this.scoreRef.current.state.score;
        }
        return infoForPosting;
    };

    displayScores = () => {
        const { questionType } = this.state;
        if (questionType === 'text' || questionType === 'number' || questionType === 'multiple_choice') {
            return <SingleScore ref={this.scoreRef}/>
        }
    };

    handleImageAsFile = (e) => {
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                image: file,
                imagePreviewUrl: reader.result
            });
        };
        reader.readAsDataURL(file)
    };

    cancelImageUpload = () => {
        this.imageInputRef.current.value = '';
        this.setState({
            imagePreviewUrl: null,
            image: null,
        });
    };

    imageUpload = () => {
        // TODO: This def should've been its own component, with a ref to get image value for upload
        const { imagePreviewUrl } = this.state;
        return (
            <div>
                <input
                    type="file"
                    onChange={this.handleImageAsFile}
                    ref={this.imageInputRef}
                />
                {imagePreviewUrl && <div>
                    <img style={{width: 200, height: 200}} src={imagePreviewUrl} />
                    <button onClick={this.cancelImageUpload}>Remove image</button>
                </div>}
            </div>
        )
    };

    render() {
        const { error } = this.props;
        const { questionType } = this.state;
        return (
            <div>
                {error && <Alert message={error} type="error" />}
                {this.imageUpload()}
                <Question ref={this.questionRef}/>
                <QuestionType ref={this.questionTypeRef} questionType={questionType} update={this.updateQuestionType}/>
                {this.displayPossibleAnswers()}
                {this.displayScores()}
            </div>
        );
    }

}