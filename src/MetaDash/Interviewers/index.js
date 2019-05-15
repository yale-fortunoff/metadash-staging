import React from 'react';
import "./style/main.scss";
// import TagFilter from "../../Inputs/TagFilter";
import {CountListWithBars, objectToArray} from "../Common";


export default class extends React.Component {

    render() {

        const listProps = {
            ...this.props,
            items: objectToArray(this.props.interviewers)
        }
        return (
            <div className="Interviewers">
            <h3>Interviewers</h3>
                {/* <TagFilter {...this.props}></TagFilter> */}
                <CountListWithBars
                    {...listProps}></CountListWithBars>
            </div>);

    }
}