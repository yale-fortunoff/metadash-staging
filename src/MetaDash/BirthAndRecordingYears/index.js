import React from 'react';
import { Histogram } from "../../Viz/";
import { DoubleSlider } from "../../Inputs";

import "./style/main.scss";

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selections: props.selections
        }

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
        return (
            <div className="BirthYear module-box">
                <h3 className="title">Dates</h3>
                <Histogram
                    {...itemProps}
                ></Histogram>

                <div className="slider-container">
                    <div className="half">
                        <DoubleSlider
                            updateSelections={this.updateRangeFactory("birth")}
                            min={1890}
                            max={1945}
                            margin={{ top: 2, bottom: 2, left: 20, right: 20 }}
                        ></DoubleSlider>

                    </div>
                    <div className="half">
                        <DoubleSlider
                            updateSelections={this.updateRangeFactory("recording")}
                            min={1969}
                            max={2020}
                            margin={{ top: 2, bottom: 2, left: 20, right: 20 }}
                        ></DoubleSlider>
                    </div>

                </div>


            </div>
        )
    }
}
