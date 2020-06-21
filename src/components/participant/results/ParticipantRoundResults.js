import React from 'react';
import {Link, withRouter} from "react-router-dom";
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
        const { name } = this.props.match.params;
        return <div>
            <Link to={'/participant/' + name}>
                <button>Home screen</button>
            </Link>
            <br/>
            <RoundResults columns={columns}/>
        </div>
    }
}

export default withRouter(ParticipantRoundResults)