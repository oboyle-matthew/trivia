import React from 'react';
import { Input, Select, List} from 'antd';

const { Option } = Select;

export default class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            score: null,
            results: [],
        };
    }

    componentDidMount() {
        const { questions } = this.props;
        this.setState({
            answers: questions.map(elem => ''),
            results: questions.map(elem => ''),
        })
    }

    updateAnswer = (e, i) => {
        let { answers } = this.state;
        answers[i] = e.target.value.toLowerCase();
        this.setState({
            answers: answers,
        })
    };

    submit = () => {
        const { questions } = this.props;
        let { answers, results } = this.state;
        let score = 0;
        questions.forEach((question, index) => {
            const answer = answers[index];
            if (answer === undefined) {
                results[index] = "Answer should have " +(question.type === 'exactly' ? 'exactly matched' : 'matched one of') + " answer choices ([" + question.answers.join(", ") + "])"
                return;
            }
            if (question.type === 'exactly') {
                const i = question.answers.indexOf(answer);
                if (i >= 0) {
                    score += 1;
                    results[index] = "CORRECT! " + answer + " exactly matches " + "index " + i + " of answer choices ([" + question.answers.join(", ") + "])";
                } else {
                    results[index] = "INCORRECT! Answer should have exactly matched one of answer choices ([" + question.answers.join(", ") + "])"
                }
            } else if (question.type === 'contains') {
                const filteredAnswers = question.answers.filter(a => answer.includes(a));
                if (filteredAnswers.length > 0) {
                    score += 1;
                    results[index] = "CORRECT! " + answer + "contains \"" + filteredAnswers[0] + "\" from index " + index + " of answer choices ([" + question.answers.join(", ") + "])";
                } else {
                    results[index] = "INCORRECT! Answer should have contained one of answer choices ([" + question.answers.join(", ") + "])"
                }
            }
        });
        this.setState({
            score: score,
            results: results,
        })
    };

    render() {
        const { questions } = this.props;
        const { answers, score, results } = this.state;
        return (
            <div style={{border: '2px solid black'}}>
                <h1>Below is the example quiz, based on the questions created above</h1>
                {questions.map((question, i) => {
                    return <div style={{marginBottom: 50}}>
                        <p>Question {i+1}: {question.question}</p>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            Your answer for q{i+1}: <Input style={{width: 500}} value={answers[i]} onChange={e => this.updateAnswer(e, i)} />
                            {results[i]}
                        </div>
                    </div>
                })}
                <button onClick={this.submit}>Submit</button>
                <div>
                    Your score: {score}/{questions.length}
                </div>
            </div>
        );
    }

}