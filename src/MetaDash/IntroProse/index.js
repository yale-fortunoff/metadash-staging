import React from 'react';
import "./style/main.scss";
import numeral from "numeral";


export default class extends React.Component {

    constructor(props) {
        super(props);

        this.genderString = this.genderString.bind(this);
        this.yearRangeString = this.yearRangeString.bind(this);

    }

    genderString() {
        return "GENDER"
    }

    yearRangeString() {
        return "YEAR RANGE"
    }



    render() {

        // This data dashboard visualizes 
        // {this.propse.items.length} testimonies 
        // by {men/women/men and women}
        // born in {yearmin, yearmax}

        return (
            <div className="IntroProse">
                This data dashboard visualizes 
                &nbsp; <span className="stat">{numeral(this.props.items.length).format("0,0")} testimonies</span> 
                &nbsp; by <span className="stat">{this.genderString()}</span> 
                &nbsp; born in <span className="stat">{this.yearRangeString(this.props.birthYearRange)}</span>
                &nbsp; from <span className="stat">{this.props.cityCount}</span> cities
                &nbsp; who were interviewed from <span className="stat">{this.yearRangeString(this.props.recordingYearRange)}</span>
                &nbsp; across <span className="stat">{this.props.languageCount} languages</span>
                &nbsp; by <span className="stat">{this.props.programCount} affiliate programs</span>.
            </div>
        );
    }
}