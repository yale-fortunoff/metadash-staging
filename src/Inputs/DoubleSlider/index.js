import React from 'react';
import D3Component from "../../Viz/D3Component"
import "./style/main.scss";
import * as d3 from "d3";

export default class extends D3Component {

    constructor(props) {
        super(props);

        this.state = {
            handles: []
        }

        this.scale = this.scale.bind(this);
        this.valueToX = this.valueToX.bind(this);
        this.xToValue = this.xToValue.bind(this);
        this.limitValue = this.limitValue.bind(this);
        this.limitX = this.limitX.bind(this);
        this.updateRange = this.updateRange.bind(this);

    }

    scale() {
        return d3.scaleLinear()
            .domain([this.props.min, this.props.max])
            .range([this.margin.left, this.width - this.margin.right]);
    }

    valueToX(val) {
        return this.scale()(val);
    }

    xToValue(x) {
        return this.scale().invert(x);
    }

    limitValue(value) {
        return Math.max(this.props.min, Math.min(this.props.max, value));
    }

    limitX(x) {
        return this.valueToX(this.limitValue(Math.round(this.xToValue(x))));
    }

    updateRange() {

        let range = [];
        // const xToValue = this.xToValue.bind(this);
        // const valueToX = this.valueToX.bind(this);

        // const limits = {
        //     min: this.props.min,
        //     max: this.props.max
        // }

        // const limitValue = this.limitValue;
        d3.select(this.svg)
            .select(".handle-layer")
            .selectAll("rect")
            .each(d => range.push(d.value))


        range = range.sort((a, b)=>{ return a < b ? -1 : 1 })
        console.log(this.props.min, this.props.max)
        console.log("new range", range)
        this.setState({ range })
    }

    initializeChart() {

        const svg = d3.select(this.svg),
            bbox = svg.node().getBoundingClientRect(),
            width = bbox.width,
            height = bbox.height,
            handleHeight = this.props.handleHeight || 20,
            handleWidth = this.props.handleWidth || 20,
            trackHeight = this.props.trackHeight || 4,
            yCenter = this.margin.top + (height - this.margin.bottom) / 2;

        this.width = width;
        this.height = height;
        this.handleWidth = handleWidth;

        svg.attr("height", height + "px");

        svg.append("rect")
            .classed("track", true)
            .attr("x", this.margin.left)
            .attr("width", width - this.margin.left - this.margin.right)
            .attr("y", yCenter - trackHeight / 2)
            .attr("height", trackHeight);


        function dragstarted(d) {
            d3.select(this).raise().classed("active", true);
        }

        const limitX = this.limitX,
        xToValue = this.xToValue;
        function dragged(d) {
            d3.select(this).attr("x", limitX(d3.event.x));
            d3.select(this).attr("data-value", d.value = xToValue(limitX(d3.event.x)));

        }

        const updateRange = this.updateRange

        function dragended(d) {
            d3.select(this).classed("active", false);
            updateRange();
        }


        const range = [{ value: this.props.min }, { value: this.props.max }]

        this.setState({ range });

        this.setState({
            handles: svg.append("g").classed("handle-layer", true)
                .selectAll("rect")
                .data(range)
                .enter()
                .append("rect")
                .classed("handle", true)
                .attr("x", x => this.valueToX(x.value))
                .attr("y", yCenter - handleHeight / 2)
                .attr("width", handleWidth)
                .attr("height", handleHeight)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))

        });





    }

    updateChart() {

    }

    render() {
        return (<div className="DoubleSlider">{D3Component.prototype.render.call(this)}</div>)
    }
}