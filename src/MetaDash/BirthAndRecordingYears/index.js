import React from 'react';
import { Histogram } from "../../Viz/";
import { DoubleSlider } from "../../Inputs";

import "./style/main.scss";

export default class extends React.Component {

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
                <DoubleSlider
                    min={1890}
                    max={1945}
                    margin={{ top: 2, bottom: 2, left: 20, right: 20 }}
                ></DoubleSlider>
                <DoubleSlider
                    min={1969}
                    max={2020}
                    margin={{ top: 2, bottom: 2, left: 20, right: 20 }}
                ></DoubleSlider>

            </div>
        )
    }
}
