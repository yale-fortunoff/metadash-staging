import React from 'react';
import "./style/main.scss";
import TagFilter from "../../Inputs/TagFilter";


export default class extends React.Component {

    render() {
        return (
            <div className="SubjectHeadings">
                <TagFilter {...this.props}></TagFilter>
            </div>);

    }
}