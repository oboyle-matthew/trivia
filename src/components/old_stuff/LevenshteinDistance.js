import React from 'react';
import { Input, Select, List} from 'antd';

const { Option } = Select;

export default class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            s1: '',
            s2: '',
            score: 0,
            similar: false,
        };
    }

    calculate = () => {
        const { s1, s2 } = this.state;
        const a = s1;
        const b = s2;
        if (a.length == 0) return b.length;
        if (b.length == 0) return a.length;

        var matrix = [];

        // increment along the first column of each row
        var i;
        for (i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // increment each column in the first row
        var j;
        for (j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1)); // deletion
                }
            }
        }

        const ans = matrix[b.length][a.length] / a.length;
        if (ans < 0.4) {
            this.setState({
                similar: true,
                score: ans,
            })
        } else {
            this.setState({
                similar: false,
                score: ans,
            })
        }
    }

    updates1 = (e) => {
        this.setState({
            s1: e.target.value.toLowerCase().trim(),
        })
    };

    updates2 = (e) => {
        this.setState({
            s2: e.target.value.toLowerCase().trim(),
        })
    };

    render() {
        const { s1, s2, score, similar } = this.state;
        return (
            <div>
                <h1>This is a test view of the (Levenshtein Distance / length of first string) to test similarity of strings. Threshold set at 0.4 currently.</h1>
                s1: <Input value={s1} id={0} onChange={this.updates1} />
                s2: <Input value={s2} id={1} onChange={this.updates2} />
                <button onClick={this.calculate}>Calculate</button>
                {score}: {similar ? "similar" : "NOT similar"}
            </div>
        );
    }

}