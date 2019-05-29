import React from 'react';
import "./style/main.scss";
import numeral from "numeral";


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            limit: 1,
            increment: 1

        }

        this.renderResult = this.renderResult.bind(this);
        this.trackScrolling = this.trackScrolling.bind(this);
        // this.maybeLoadMore = this.maybeLoadMore.bind(this);
        this.resultsRef = React.createRef()
    }

    // maybeLoadMore(el){
    //     return this.state.limit < props.items.length && el.getBoundClientRect().bottom <= window.innerHeight - 100;
    // }


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

    trackScrolling() {
        const scrollBottom = window.pageYOffset + window.innerHeight;
        const distanceFromBottom = window.document.body.offsetHeight - scrollBottom;

        if (this.props.results.length > this.state.limit
            && distanceFromBottom < 100){
            this.setState({ limit: this.state.limit + this.state.increment })
        }
    }

    componentDidMount() {
        document.addEventListener("scroll", this.trackScrolling);
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.trackScrolling);
    }

    render() {
        return (
            <div
                className="Results">
                <div className="prose">
                    There are <span className="stat">{numeral(this.props.results.length).format("0,0")}</span> testimonies with matching criteria.
                </div>
                <div
                    ref={this.resultsRef}
                    className="results-container">
                    {this.props.results.slice(0, this.state.limit).map(this.renderResult)}
                </div>
            </div>
        );
    }
}