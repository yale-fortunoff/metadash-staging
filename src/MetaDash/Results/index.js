import React from 'react';
import "./style/main.scss";
import numeral from "numeral";
import { getRecordingYear } from "../../Data";


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
            <a 
            target="_blank" 
            rel="noopener noreferrer"
            href={result.link} 
            key={i}>
                <div 
                className="result-item">
                    <div className="testimony-name">
                        {result.title}
                    </div>

                    <div className="birth-year">
                        {result.birth_years.map(yr => (<li className="sub-item" key={i}>{yr}</li>))}
                        {/* </div>

                    <div className="birth-place"> */}
                        {result.birth_place_cities.map((city, i) => (<li className="sub-item" key={i}>{city}{city && result.birth_place_countries[i] ? ", " : ""}{result.birth_place_countries[i]}</li>))}

                    </div>
                    <div className="affiliate">
                        {result.programs.map((ref, i) => (<li className="sub-item" key={i}>{this.props.programs[ref].label}</li>))}
                    </div>
                    <div className="recording-year">
                        {getRecordingYear(result)}
                    </div>

                    <div className="big-button-container">
                        <div className="big-button">View</div>
                    </div>
                </div>
            </a>
        )
    }

    trackScrolling() {
        const scrollBottom = window.pageYOffset + window.innerHeight;
        const distanceFromBottom = window.document.body.offsetHeight - scrollBottom;

        if (this.props.results.length > this.state.limit
            && distanceFromBottom < 100) {
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
                <div className="headers">
                    <div className="testimony-name">
                        Testimony title
                    </div>
                    <div className="birth-year">
                        Birth year / place
                        </div>
                    <div className="affiliate">
                        Affiliate
                    </div>
                    <div className="recording-year">
                        Recording year
                    </div>

                    <div className="big-button-container">
                        &nbsp;
                    </div>
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