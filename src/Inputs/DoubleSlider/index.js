import React from 'react';
import D3Component from "../../Viz/D3Component"
import "./style/main.scss";
import * as d3 from "d3";

export default class extends D3Component {

    constructor(props) {
        super(props);

        this.state = {
            handles: [],
            range: [{ value: props.min }, { value: props.max }],
            labels: [{ value: props.min }, { value: props.max }]
        }

        this.scale = this.scale.bind(this);
        this.valueToX = this.valueToX.bind(this);
        this.xToValue = this.xToValue.bind(this);
        this.limitValue = this.limitValue.bind(this);
        this.limitX = this.limitX.bind(this);
        this.getHandleRange = this.getHandleRange.bind(this);
        this.updateLabels = this.updateLabels.bind(this);
        this.updateRange = this.updateRange.bind(this);

    }

    scale() {
        return d3.scaleLinear()
            .domain([this.props.min, this.props.max])
            .range([this.margin.left, this.width - this.margin.right]);
    }

    valueToX(val) {
        return this.scale()(val) - this.handleWidth / 2;
    }

    xToValue(x) {
        return this.scale().invert(x + this.handleWidth / 2);
    }

    limitValue(value) {
        return Math.max(this.props.min, Math.min(this.props.max, value));
    }

    limitX(x) {
        return this.valueToX(this.limitValue(Math.round(this.xToValue(x))));
    }

    getHandleRange() {
        let range = [];
        d3.select(this.svg)
            .select(".handle-layer")
            .selectAll("rect")
            .each(d => range.push(d))

        range = range.sort((a, b) => { return a.value < b.value ? -1 : 1 })
        return range;
    }

    updateLabels() {
        this.setState({ labels: this.getHandleRange() });
    }

    updateRange() {

        let range = this.getHandleRange();
        this.props.updateSelections(range.map(x => x.value))
        this.setState({ range })
    }

    initializeChart() {

        const svg = d3.select(this.svg),
            bbox = svg.node().getBoundingClientRect(),
            width = bbox.width,
            height = bbox.height,
            handleHeight = this.props.handleHeight || 20,
            handleWidth = this.props.handleWidth || 10,
            trackHeight = this.props.trackHeight || 4,
            yCenter = this.margin.top + (height - this.margin.bottom) / 2;

        this.width = width;
        this.height = height;
        this.handleWidth = handleWidth;

        svg.attr("height", height + "px");

        const label = svg.append("text")
            .text(this.props.label || "Double Slider")
            .attr("x", function(){return 120 - d3.select(this).node().getBBox().width - 2 * handleWidth})

        label.attr("y", function () {
            return yCenter
                + d3.select(this).node().getBBox().height * 0.25
        })

        this.margin.left = 120;
        // this.margin.left = label.node().getBBox().width
        //     + label.node().getBBox().x
        //     + handleWidth;

        svg.append("rect")
            .classed("track", true)
            .attr("x", this.margin.left)
            .attr("width", width - this.margin.left - this.margin.right)
            .attr("y", yCenter - trackHeight / 2)
            .attr("height", trackHeight);


        function dragstarted(d) {
            d3.select(this).raise().classed("active", true)
                .transition().duration(250)//.ease(d3.easeQuadIn)
            // .attr("transform","skewX(10)")
            // .attr("height",handleHeight * 0.7)
            // .attr("y", yCenter - handleHeight * 0.7 / 2)
            // .attr("width",handleWidth * 0.7);

        }

        const limitX = this.limitX,
            xToValue = this.xToValue,
            valueToX = this.valueToX,
            updateLabels = this.updateLabels;

        function dragged(d) {
            d3.select(this).attr("x", limitX(d3.event.x));
            const yr = xToValue(limitX(d3.event.x))
            d3.select(this)
                .attr("transform", x => `translate(${limitX(d3.event.x)},${yCenter - handleHeight / 2})`)
            d3.select(this).attr("data-value", d.value = yr);
            d3.select(this).select(".year-label").text(yr)
            updateLabels();
        }

        const updateRange = this.updateRange;

        function dragended(d) {
            d3.select(this).classed("active", false)
            // .transition().duration(250)//.ease(d3.easeQuadOut)
            // .attr("transform","skewX(0)")
            // .attr("y", yCenter - handleHeight / 2)
            // .attr("height",handleHeight)
            // .attr("width",handleWidth)

            updateRange();

        }

        const handleLayer = svg.append("g")
            .classed("handle-layer", true)

        const handleGroups = handleLayer
            // .append("g")
            // .classed("handle", true)
            .selectAll("g")
            .data(this.state.range)
            .enter()
            .append("g")
            .classed("handle", true)
            .attr("transform", x => `translate(${this.valueToX(x.value)},${yCenter - handleHeight / 2})`)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))

        handleGroups.append("rect")
            .attr("width", handleWidth)
            .attr("height", handleHeight)
        // .attr("transform", x => `translate(${this.valueToX(x.value)},0)`)
        // .attr("y", yCenter - handleHeight / 2)

        // .attr("x", x => this.valueToX(x.value))
        // .attr("y", yCenter - handleHeight / 2)

        handleGroups.append("text")
            .classed("year-label", true)
            .text(d => d.value)
            .attr("transform", function () {
                return `translate(${
                    handleWidth / 2 - d3.select(this).node().getBBox().width / 2
                },${
                    yCenter
                    + handleHeight / 2
                    + 1})`
            })



        // this.setState({ handles });





    }

    updateChart() {

    }

    render() {
        return (
            <div className="DoubleSlider">
                {D3Component.prototype.render.call(this)}
                {/* <div className="label-container">
                    <div className="label min">{this.state.labels[0].value}</div>
                    <div className="label max">{this.state.labels[1].value}</div>
                </div> */}
            </div>)
    }
}