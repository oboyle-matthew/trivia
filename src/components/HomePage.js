import React from 'react';
import 'antd/dist/antd.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    HashRouter,
} from "react-router-dom";
import HostHomePage from "./host/HostHomePage";
import QuizCreator from "./host/QuizCreator";
import ParticipantHomePage from "./participant/ParticipantHomePage";
import QuizTaker from "./participant/QuizTaker";
import RoundTaker from "./participant/RoundTaker";
import Register from "./register/Register";
import HostRoundResults from "./host/results/HostRoundResults";
import ParticipantRoundResults from "./participant/results/ParticipantRoundResults";
import ParticipantRoundTeamResults from "./participant/results/ParticipantRoundTeamResults";


export default class HomePage extends React.Component {

    render() {
        return (
            <HashRouter basename={'/'}>
                <Route exact path={'/'}>
                    <ParticipantHomePage/>
                </Route>
                <Route exact path={'/participant'}>
                    <ParticipantHomePage/>
                </Route>
                <Route exact path={'/host'}>
                    <HostHomePage firebase />
                </Route>
                <Route exact path={'/host/:name'}>
                    <QuizCreator/>
                </Route>
                <Route exact path={'/participant/:name'}>
                    <QuizTaker/>
                </Route>
                <Route exact path={'/participant/:name/:round'}>
                    <RoundTaker/>
                </Route>
                <Route exact path={'/participant/:name/:round/results'}>
                    <ParticipantRoundResults/>
                </Route>
                <Route exact path={'/host/:name/:round/results'}>
                    <HostRoundResults/>
                </Route>
                <Route exact path={'/participant/:name/:round/results/:teamName'}>
                    <ParticipantRoundTeamResults/>
                </Route>
                <Route exact path={'/register/:name'}>
                    <Register/>
                </Route>
                {/*<img src={'https://firebasestorage.googleapis.com/v0/b/trivia-7b47d.appspot.com/o/images%2F1592760080949?alt=media&token=3b7faec9-07e1-4e41-afdf-06b8d408fbee.png'}/>*/}

            </HashRouter>
        );
    }
}