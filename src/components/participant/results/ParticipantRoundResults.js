import React from 'react';
import {withRouter} from "react-router-dom";
import RoundResults from "../../results/RoundResults";

const columns = [
    {
        title: 'Team Name',
        dataIndex: 'teamName',
        key: 'teamName',
    },
    {
        title: 'Points',
        dataIndex: 'points',
        key: 'points',
    },
];

class ParticipantRoundResults extends React.Component {
    render() {
        return <RoundResults columns={columns}/>
    }
}

export default withRouter(ParticipantRoundResults)