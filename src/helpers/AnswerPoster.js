export function submitAnswer(answers, name, round, roundRef, teamName, customScores) {
    const { questions } = round;
    questions.forEach((question, i) => {
        if (answers[i]) {
            const questionRef = roundRef.child('questions').child(i);
            let score = parseFloat(question.score);

            // Update for custom, user-assigned scoring
            if (round.customScoringEnabled && customScores[i]) {
                score = parseFloat(customScores[i]);
                if (question.questionType === 'multiple_answers') {
                    question.customScores = [];
                    for (let j = 0; j < question.multipleScores.length; j++) {
                        if (j === question.multipleScores.length-1) {
                            question.customScores.push(score);
                        } else {
                            question.customScores.push(0);
                        }
                    }
                }
            }

            const points = gradeQuestion(question, answers[i].answer, questionRef, teamName, score);
            let userAnswer = answers[i].answer;
            if (round.customScoringEnabled && customScores[i]) {
                userAnswer += (' (for ' + customScores[i] + "point(s))");
            }
            if (question.questionType !== 'closest') {
                updateDatabase(question, questionRef, points, teamName, userAnswer);
            }
            console.log("Question " + (i+1) + ": " + points + " points");
        }
    });
}

function updateDatabase(question, questionRef, points, teamName, userAnswer) {
    questionRef.child('userAnswer').update({[teamName]: userAnswer});
    questionRef.child('scores').update({[teamName]: points})
}

function gradeQuestion(question, answer, questionRef, teamName, score) {
    if (answer === '' || answer === undefined || answer === null) {
        return 0;
    } else {
        try {
            answer = answer.toLowerCase();
        } catch(err) {
            // Numbers can't go to lower case
        }
        const { questionType } = question;
        if (questionType === 'text') {
            return gradeTextQuestion(question, answer) ? score : 0;
        }
        if (questionType === 'number') {
            return gradeNumberQuestion(question, answer) ? score : 0;
        }
        if (questionType === 'closest') {
            return gradeClosestQuestion(question, answer, questionRef, teamName);
        }
        if (questionType === 'multiple_choice') {
            return gradeMultipleChoiceQuestion(question, answer) ? score : 0;
        }
        if (questionType === 'multiple_answers') {
            let numCorrect = 0;
            question.multipleAnswers.forEach((a,i) => {
                for (let j = 0; j < answer.length; j++) {
                    if (gradeTextQuestion(a, answer[j])) {
                        numCorrect++;
                        break;
                    }
                }
            });
            if (numCorrect > 0) {
                if (question.customScores) {
                    return question.customScores[numCorrect-1]
                } else {
                    return question.multipleScores[numCorrect-1];
                }
            }
            return 0;
        }
        if (questionType === 'speed') {
            return gradeSpeedQuestion(question, answer, questionRef, teamName);
        }
    }
}

function gradeTextQuestion(question, answer) {
    const { answerType, possibleAnswers } = question;
    for (let i = 0; i < possibleAnswers.length; i++) {
        try {
            answer = answer.toLowerCase();
        } catch(err) {

        }
        let possibleAnswer = possibleAnswers[i];
        try {
            possibleAnswer = possibleAnswers[i].toLowerCase();
        } catch(err) {
            // Numbers can't go to lower case
        }
        if (answerType === 'exactly' && possibleAnswer === answer) {
            return true;
        }
        if (answerType === 'contains' && answer.includes(possibleAnswer)) {
            return true;
        }
    }
    return false;
}

function gradeNumberQuestion(question, answer) {
    let margin;
    try {
        margin = parseFloat(question.margin);
    } catch(err) {
        margin = 0;
    }
    const correctAnswer = parseFloat(question.numberAnswer);
    return (parseFloat(answer) >= (correctAnswer - margin) && parseFloat(answer) <= (correctAnswer + margin));
}

function gradeMultipleChoiceQuestion(question, answer) {
    let correctChoice = question.correctChoice;
    try {
        correctChoice = correctChoice.toLowerCase();
    } catch(err) {

    }
    return correctChoice === answer;
}

function gradeClosestQuestion(question, userAnswer, questionRef, teamName) {
    let { numberAnswer, positionScoring } = question;
    questionRef.child('userAnswer').update({[teamName]: userAnswer}).then(() => {
        // This avoids the case where 2 people submit at the same time, and so they don't know about each-other
        questionRef.child('userAnswer').once('value').then(data => {
            const userAnswers = data.val();
            const closenessOrder = getClosenessOrder(userAnswers, numberAnswer);
            const scoring = {};
            closenessOrder.forEach((team, i) => {
                if (i > 0 && parseFloat(userAnswers[closenessOrder[i-1]]) === parseFloat(userAnswers[team])) {
                    scoring[team] = scoring[closenessOrder[i-1]];
                } else {
                    if (i < positionScoring.length) {
                        scoring[team] = parseFloat(positionScoring[i]);
                    } else {
                        scoring[team] = 0;
                    }
                }
            });
            questionRef.child('scores').set(scoring);
        });
    });
}

function gradeSpeedQuestion(question, answer, questionRef, teamName) {
    let { guesses, scoreType, clues, positionScoring } = question;
    if (guesses === undefined) {
        guesses = [];
    }
    let cluesRevealed = 0;
    clues.forEach(clue => {
        if (clue.show) {
            cluesRevealed++;
        }
    });
    const correct = gradeTextQuestion(question, answer);
    guesses.push({guess: answer, teamName: teamName, cluesRevealed: cluesRevealed, correct: correct});
    question.guesses = guesses;
    questionRef.set(question);
    if (!correct) {
        // Incorrect answer
        return 0;
    }
    if (scoreType === 'clues_revealed') {
        if (cluesRevealed === 0) {
            // Guess before any clues are revealed?
            return positionScoring[0];
        } else {
            return positionScoring[cluesRevealed-1];
        }
    }
    if (scoreType === 'position') {
        const correctAnswers = guesses.filter(guess => gradeTextQuestion(question, guess.guess));
        if (correctAnswers.length > positionScoring.length) {
            return 0;
        } else {
            return positionScoring[correctAnswers.length-1];
        }
    }
}

function getClosenessOrder(userAnswers, numberAnswer) {
    return Object.keys(userAnswers).sort((a,b) => {
        return Math.abs(parseFloat(userAnswers[a]) - parseFloat(numberAnswer)) - Math.abs(parseFloat(userAnswers[b]) - parseFloat(numberAnswer));
    })
}