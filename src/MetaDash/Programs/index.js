import React from 'react';
import "./style/main.scss";
import { TagFilter, ItemSelector } from "../../Inputs";
import { TreeMap } from "../../Viz";
import { objectToArray } from "../Common"

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state = { hoverText: " " }
        this.setText = this.setText.bind(this);
        this.handleMouseIn = this.handleMouseIn.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    setText(hoverText) {
        this.setState({ hoverText })
    }

    handleMouseIn(item) {
        this.setText(item.data.label)
    }

    handleClick(item) {
        // if (item.id in this.props.programs) {
            this.props.updateSelections([item.data])
        //};

    }

    handleMouseOut() {
        this.setText(" ");
    }

    render() {
        return (
            <div className="Programs module-box">

                <h3 className="title">Affiliate programs</h3>
                <div className="hover-text">
                    {this.state.hoverText}
                </div>

                <TreeMap
                    items={objectToArray(this.props.programs)}
                    itemDict={this.props.programs}

                    mouseInCallback={this.handleMouseIn}
                    mouseOutCallback={this.handleMouseOut}
                    selections={this.props.selections}
                    clickCallback={this.handleClick}
                ></TreeMap>

                <ItemSelector
                    updateSelections={this.props.updateSelections}
                    items={objectToArray(this.props.programs)}
                    selections={this.props.selections}
                    placeholder={"All affiliate programs"}
                ></ItemSelector>
                {/* <ItemSelection></ItemSelection> */}
                {/* <TagFilter {...this.props}></TagFilter> */}
            </div>
        );
    }
}