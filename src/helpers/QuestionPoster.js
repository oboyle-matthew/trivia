export function submitQuestion(data, round, roundRef) {
    validateInput(data);
    const questions = round.questions;
    if (questions) {
        round.questions = [...round.questions, data]
    } else {
        round.questions = [data];
    }
    console.log(round);
    roundRef.set(round);
}

function validateInput(data) {
    const { question, possibleAnswers, numberAnswer, score, positionScoring, clues } = data;
    if (question === '') {
        throw "Must have a question string";
    }
    if (possibleAnswers && possibleAnswers.length === 0) {
        throw "Must have at least one correct answer";
    }
    if (data.hasOwnProperty('numberAnswer') && invalidNumber(numberAnswer)) {
        throw "Must be a valid number";
    }
    if (data.hasOwnProperty('score') && invalidNumber(score)) {
        throw "Must have a score for the question";
    }
    if (data.hasOwnProperty('positionScoring') && invalidScoringArray(positionScoring)) {
        throw "Must have at least one team scoring";
    }
    if (data.hasOwnProperty('clues') && invalidClues(clues)) {
        throw "Must have at least one clue for speed round";
    }
    if (data.hasOwnProperty('choices')) {
        const { choices, correctChoice } = data;
        if (choices.length <= 1) {
            throw "Must have at least 2 options";
        }
        if (correctChoice === null) {
            throw "Must select a correct option for multiple choice";
        }
    }
    if (data.hasOwnProperty('multipleAnswers')) {
        const { multipleAnswers, multipleScores } = data;
        if (invalidAnswers(multipleAnswers)) {
            throw "All options for answers must have a possible answer";
        }
        if (invalidScoringArray(multipleScores)) {
            throw "Must be possible to score points";
        }
    }
}

function invalidNumber(num) {
    return num === '' || num === null || isNaN(num);
}

function invalidScoringArray(arr) {
    const filteredArray = arr.filter(elem => {
        return !(elem === '' || isNaN(elem) || elem === null || parseFloat(elem) === 0)
    });
    return filteredArray.length === 0;
}

function invalidClues(clues) {
    return clues.filter(clue => clue !== '').length === 0
}

function invalidAnswers(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].possibleAnswers.length === 0) {
            return true;
        }
    }
    return false;
}