import React from 'react';
import ResponsiveOrdinalFrame from "semiotic/lib/ResponsiveOrdinalFrame";
import "./style/main.scss";

import preprocess from "./preprocess";

import { scaleOrdinal } from "d3-scale";

export default class extends React.Component {

    render() {
        const data = preprocess(this.props.data, this.props.maxItems);

        const frameProps = {
            /* --- Data --- */
            //   data: [{ user: "Jason", tweets: 10, retweets: 5, favorites: 15 },
            //     { user: "Susie", tweets: 5, retweets: 100, favorites: 100 }],
            data: data,
            backgroundGraphics:(null),
            responsiveWidth: true,
            hoverAnnotation: true,

            axes: [{ orient: "left"}],

            /* --- Size --- */
            size: [200, 200],

            /* --- Layout --- */
            type: "bar",

            /* --- Process --- */
            oAccessor: "label",
            rAccessor: "value",

            /* --- Customize --- */
            style: { fill: "gray", stroke: "white" },
            title: "top subjects",

            /* --- Annotate --- */
            // oLabel: true
        }

        return (
            <div className="BarChart">
                <ResponsiveOrdinalFrame {...frameProps} />
            </div>
        );
    }
}
