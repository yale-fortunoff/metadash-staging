import React from 'react';
import Histogram from "../../Viz/Histogram";

import "./style/main.scss";

export default class extends React.Component {

    render() {
        const itemProps = {...this.props,
            margin: {
                top: 20,
                left: 30,
                right: 10,
                bottom: 20
            }};
        return (
            <div className="BirthYear module-box">
            <h3 className="title">Dates</h3>
                <Histogram
                {...itemProps}></Histogram>
            </div>
        )
    }
}
