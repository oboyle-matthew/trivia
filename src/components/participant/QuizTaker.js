import React from 'react';
import firebase from 'firebase';
import { Collapse } from 'antd';
import {
    Link,
    useParams,
    withRouter,
} from "react-router-dom";
import {getSortedRoundNames} from "../../helpers/RoundNameSorter";
import Scoreboard from "../results/Scoreboard";

class QuizTaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
        };
    }

    componentDidMount() {
        const { name } = this.props.match.params;
        const self = this;
        this.quizRef = firebase.database().ref('quizzes').child(name);
        this.quizRef.on('value', snapshot => {
            self.setState({
                quiz: snapshot.val(),
            });
        });
    }

    render() {
        const { quiz } = this.state;
        const rounds = quiz.rounds;
        return (
            <div>
                <h1>{quiz && quiz.name}</h1>
                {rounds && getSortedRoundNames(rounds).map((roundName, i) => {
                    const round = rounds[roundName];
                    return <div style={{display: 'flex', flexDirection: 'row'}}>
                        <p>{roundName}</p>
                        <div style={{marginLeft: 10, marginRight: 30}}>
                            {round.show && <Link to={`/participant/${quiz.name}/${round.name}`}>Take round</Link>}
                        </div>
                        <div>
                            {round.finished && <Link to={`/participant/${quiz.name}/${round.name}/results`}>View results</Link>}
                        </div>
                    </div>
                })}
                <Scoreboard/>
            </div>
        );
    }
}

export default withRouter(QuizTaker)