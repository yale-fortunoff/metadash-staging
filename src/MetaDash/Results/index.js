import React from 'react';
import "./style/main.scss";
import numeral from "numeral";


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.renderResult = this.renderResult.bind(this);

    }
    renderResult(result, i) {
        return (
            <div key={i} className="result-item">
                <div className="testimony-name">
                    Name of testimony
                </div>
                <div className="birth-year">
                    19XX
                </div>
                <div className="birth-place">
                    City, Country
                </div>
                <div className="affiliate">
                    Affiliate name
                </div>
                <div className="recording-year">
                    19XX
                </div>
            </div>
        )
    }
    render() {
        return (
            <div className="Results">
                <div className="prose">
                    There are <span className="stat">{numeral(this.props.results.length).format("0,0")}</span> testimonies with matching criteria.
                </div>
                <div className="results-container">
                    {this.props.results.slice(0, 10).map(this.renderResult)}
                </div>
            </div>
        );
    }
}