import React from 'react';
import "./style/main.scss";
import TagFilter from "../../Inputs/TagFilter";


export default class extends React.Component {

    render() {
        return (
            <div className="Interviewers">
                <TagFilter {...this.props}></TagFilter>
            </div>);

    }
}