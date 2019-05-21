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

    getHandleRange(){
        let range = [];
        d3.select(this.svg)
            .select(".handle-layer")
            .selectAll("rect")
            .each(d => range.push(d))

        range = range.sort((a, b) => { return a.value < b.value ? -1 : 1 })
        return range;
    }

    updateLabels(){
        this.setState({labels:this.getHandleRange()});
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
            d3.select(this).raise().classed("active", true)
            .transition().duration(250)//.ease(d3.easeQuadIn)
            // .attr("transform","skewX(10)")
            .attr("height",handleHeight * 0.7)
            .attr("y", yCenter - handleHeight * 0.7 / 2)
            // .attr("width",handleWidth * 0.7);

        }

        const limitX = this.limitX,
            xToValue = this.xToValue,
            updateLabels = this.updateLabels;
        function dragged(d) {
            d3.select(this).attr("x", limitX(d3.event.x));
            d3.select(this).attr("data-value", d.value = xToValue(limitX(d3.event.x)));
            updateLabels();
        }

        const updateRange = this.updateRange;

        function dragended(d) {
            d3.select(this).classed("active", false)
            // .transition().duration(250)//.ease(d3.easeQuadOut)
            // .attr("transform","skewX(0)")
            .attr("y", yCenter - handleHeight / 2)
            .attr("height",handleHeight)
            // .attr("width",handleWidth)

            updateRange();

        }

        this.setState({
            handles: svg.append("g").classed("handle-layer", true)
                .selectAll("rect")
                .data(this.state.range)
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
        return (
            <div className="DoubleSlider">
                {D3Component.prototype.render.call(this)}
                <div className="label-container">
                    <div className="label min">{this.state.labels[0].value}</div>
                    <div className="label max">{this.state.labels[1].value}</div>
                </div>
            </div>)
    }
}