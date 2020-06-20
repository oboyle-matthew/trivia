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


export default class HomePage extends React.Component {

    render() {
        return (
            <HashRouter basename={'/'}>
                <div>
                    <ul>
                        <li><Link to={"/"}>Home</Link></li>
                        <li><Link to={"/about"}>About</Link></li>
                    </ul>
                    <hr/>
                    <Route exact path={'/'} component={<div>Homeeeeeee</div>}/>
                    <Route exact path={'/about'} component={<div>Abouttttt</div>}/>
                </div>
            </HashRouter>
        )
    }

    // render() {
    //     return (
    //         <Router>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/participant'}>
    //                 <ParticipantHomePage/>
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/'}>
    //                 <ParticipantHomePage/>
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/host'}>
    //                 <HostHomePage firebase />
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/host/:name'}>
    //                 <QuizCreator/>
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/participant/:name'}>
    //                 <QuizTaker/>
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/participant/:name/:round'}>
    //                 <RoundTaker/>
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/participant/:name/:round/results'}>
    //                 <ParticipantRoundResults/>
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/host/:name/:round/results'}>
    //                 <HostRoundResults/>
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/participant/:name/:round/results/:teamName'}>
    //                 {/*<RoundTeamResults/>*/}
    //             </Route>
    //             <Route exact path={process.env.PUBLIC_URL + '/#/register/:name'}>
    //                 <Register/>
    //             </Route>

    //         </Router>
    //     );
    // }
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