import React from 'react';
import { Histogram } from "../../Viz/";
import { DoubleSlider } from "../../Inputs";

import "./style/main.scss";

export default class extends React.Component {

    constructor(props) {
        super(props);

        // this.state = {
        //     selections: props.selections
        // }

        this.updateRangeFactory = this.updateRangeFactory.bind(this);

    }

    updateRangeFactory(key) {
        return value => {
            var newDict = { ...this.props.selections }
            newDict[key] = value
            this.props.updateSelections(newDict)
        }
    }

    render() {
        const itemProps = {
            ...this.props,
            margin: {
                top: 20,
                left: 30,
                right: 10,
                bottom: 20
            }
        };
        const modeClass = this.props.subsetMode ? "subset-mode" : "full-mode";

        return (
            <div className={"BirthYear module-box " + modeClass}>
                <h3 className="title">Dates</h3>
                <div className="Histogram">
                    <Histogram
                        {...itemProps}
                    ></Histogram>
                </div>


                <div className="slider-container">
                    <div className="half">
                        <DoubleSlider
                            label="Birth year"
                            updateSelections={this.updateRangeFactory("birth")}
                            selections={this.props.selections.birth}
                            min={1890}
                            max={1945}
                            margin={{ top: 2, bottom: 10, left: 20, right: 40 }}
                        ></DoubleSlider>

                    </div>
                    <div className="half">
                        <DoubleSlider
                            label="Recording year"
                            selections={this.props.selections.recording}

                            updateSelections={this.updateRangeFactory("recording")}
                            min={1969}
                            max={2020}
                            margin={{ top: 2, bottom: 10, left: 20, right: 40 }}
                        ></DoubleSlider>
                    </div>

                </div>


            </div>
        )
    }
}
