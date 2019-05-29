import React from 'react';
import D3Component from "../../Viz/D3Component"
import "./style/main.scss";
import * as d3 from "d3";

import sliderHandleIcon from "./style/graphics/slider.svg";

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
        this.updateTrackHighlight = this.updateTrackHighlight.bind(this);

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
            .selectAll("image.handle-icon")
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
        // this.setState({ range })

    }

    updateTrackHighlight() {

        let xValues = [];


        d3.select(this.svg).selectAll(".handle")
            .each(function () {
                // console.log("Double slider handle iter", this)
                xValues.push(Number(d3.select(this).attr("x")));
            });

            console.log("Double slider Updating track highlight", xValues)


        d3.select(this.svg).select(".highlight")
            .attr("x", d3.min(xValues) + this.handleWidth / 2)
            .attr("width", d3.max(xValues) - d3.min(xValues))

    }

    initializeChart() {

        const svg = d3.select(this.svg).html(""),
            bbox = svg.node().getBoundingClientRect(),
            width = bbox.width,
            height = bbox.height,
            handleHeight = this.props.handleHeight || 17.151,
            handleWidth = this.props.handleWidth || 13,
            trackHeight = this.props.trackHeight || 6,
            yCenter = this.margin.top + (height - this.margin.bottom) / 2;

        this.width = width;
        this.height = height;
        this.handleWidth = handleWidth;
        this.yCenter = yCenter;
        this.handleHeight = handleHeight;

        svg.attr("height", height + "px");

        const label = svg.append("text")
            .text(this.props.label || "Double Slider")
            .attr("x", function () { return 120 - d3.select(this).node().getBBox().width - 2 * handleWidth })

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


        // add selected tract
        const trackHighlight = svg.append("rect")
            .classed("highlight", true)
            .attr("y", yCenter - trackHeight / 2)
            .attr("height", trackHeight)


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
            // valueToX = this.valueToX,
            updateLabels = this.updateLabels;
                    // range = this.state.range;

        const updateTrackHighlight = this.updateTrackHighlight;
        function dragged(d) {
            d3.select(this).attr("x", limitX(d3.event.x));
            const yr = xToValue(limitX(d3.event.x))
            d3.select(this)
                .attr("transform", x => `translate(${limitX(d3.event.x)},${yCenter - handleHeight / 2})`)
            d3.select(this).attr("data-value", d.value = yr);
            d3.select(this).select(".year-label").text(yr)
            updateLabels();

            // 
            // let xValues = [];
            // svg.selectAll(".handle")
            //     .each(function () {
            //         xValues.push(Number(d3.select(this).attr("x")));
            //     });

            // trackHighlight
            //     .attr("x", d3.min(xValues) + handleWidth / 2)
            //     .attr("width", d3.max(xValues) - d3.min(xValues))
            updateTrackHighlight();
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
            // .data(this.props.selections.map(x=>{return{value:x}}))
            // .data(this.state.range)
            .data([{ value: this.props.min }, { value: this.props.max }])
            .enter()
            .append("g")
            .classed("handle", true)
            .attr("x", x => this.valueToX(x.value))
            .attr("transform", x => `translate(${this.valueToX(x.value)},${yCenter - handleHeight / 2})`)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))


        const svgString = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxNy4xNTEiIHZpZXdCb3g9IjAgMCAxMyAxNy4xNTEiPjxwYXRoIGQ9Ik0yNDAsNDQwVjQyOWgxMnYxMWwtNiw1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIzOS41IC00MjguNSkiIGZpbGw9IiNmZmYiIHN0cm9rZT0iI2FhYSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+"
        handleGroups.append("image")
            .classed("handle-icon", true)
            .attr("xlink:href", `data:image/svg+xml;base64,${svgString}`)
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", handleWidth)
            .attr("height", handleHeight)
        // .attr("xlink:href", { sliderHandleIcon })

        // handleGroups.append("rect")
        //     .attr("width", handleWidth)
        //     .attr("height", handleHeight)
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

        d3.select(window).on("resize.doubleslider" + this.props.label, this.redrawChart.bind(this))


        // this.setState({ handles });


    }

    updateChart() {
        // const svg = d3.select(this.svg),
        //     bbox = svg.node().getBoundingClientRect(),
        //     width = bbox.width,
        //     height = bbox.height,
            // handleHeight = this.props.handleHeight || 17.151,
            // handleWidth = this.props.handleWidth || 13,
            // trackHeight = this.props.trackHeight || 6,
            // yCenter = this.margin.top + (height - this.margin.bottom) / 2;



        if (this.props.selections && this.props.selections.length === 2){ 
            console.log("Double slider update skipped", this.props)
            return 
        }

        console.log("Double slider thinks it should reset", this.props)

//        this.initializeChart();
        // let data = ([this.props.min, this.props.max]).map(x => { return { value: x } });
        // const handleLayer = d3.select(this.svg).select(".handle-layer")

        // console.log("Double slider updating handle positions", data, handleLayer.node(), this.handleHeight, this.yCenter)
        // handleLayer
        //     // .append("g")
        //     // .classed("handle", true)
        //     .selectAll("g.handle")
        //     // .data(this.state.range)
        //     .data(data)
        //     .attr("x", x => this.valueToX(x.value))
        //     .attr("transform", x => `translate(${this.valueToX(x.value)},${this.yCenter - this.handleHeight / 2})`);

        // this.updateTrackHighlight();

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