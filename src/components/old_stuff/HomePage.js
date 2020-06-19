import React from 'react';
import 'antd/dist/antd.css'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import HostHomePage from "../host/HostHomePage";
import QuizCreator from "../host/QuizCreator";

export default class HomePage extends React.Component {

    render() {
        return (
            <Router>
                <Route path="/participant">
                    participant
                </Route>
                <Route exact path="/">
                    participant
                </Route>
                <Route exact path="/host">
                    <HostHomePage firebase />
                </Route>
                <Route exact path="/host/:name">
                    <QuizCreator/>
                </Route>

            </Router>
        );
    }
}


function Child() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { name } = useParams();

    return (
        <div>
            <h3>Quiz name: {name}</h3>
        </div>
    );
}