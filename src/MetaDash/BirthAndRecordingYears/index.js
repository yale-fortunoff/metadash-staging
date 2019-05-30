import React from 'react';
import { Histogram } from "../../Viz/";
import { DoubleSlider } from "../../Inputs";

import "./style/main.scss";

const BIRTH_MIN = 1890;
const BIRTH_MAX = 1945;
const RECORDING_MIN = 1970;
const RECORDING_MAX = 2020;

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

        console.log("Rendering dates module")
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
                            min={BIRTH_MIN}
                            max={BIRTH_MAX}
                            margin={{ top: 2, bottom: 10, left: 20, right: 40 }}
                        ></DoubleSlider>

                    </div>
                    <div className="half">
                        <DoubleSlider
                            label="Recording year"
                            selections={this.props.selections.recording}
                            updateSelections={this.updateRangeFactory("recording")}
                            min={RECORDING_MIN}
                            max={RECORDING_MAX}
                            margin={{ top: 2, bottom: 10, left: 20, right: 40 }}
                        ></DoubleSlider>
                    </div>

                </div>


            </div>
        )
    }
}
