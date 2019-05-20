import React from 'react';
import "./style/main.scss";
import D3Component from "../../Viz/D3Component";
import numeral from "numeral";
import * as d3 from "d3";

export default class extends D3Component {

    constructor(props) {
        super(props);

        this.initializeChart = this.initializeChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
        // this.setRange = this.setRange.bind(this);
    }

    // setRange(start, stop) {
    //     // TODO - implement this!
    //     console.log("Updating filter values", start, stop)
    // }

    initializeChart() {
        const svg = d3.select(this.svg).html("");

        this.xAxisG = svg.append("g")
            .classed("axis", true)
            .classed("x", true);

        this.yAxisG = svg.append("g")
            .classed("axis", true)
            .classed("y", true);

        this.barG = svg.append("g");
    }

    updateChart(data) {

        console.log("Chart - updating histogram chart with data", this.props.data);

        data = data || this.props.data;
        const svg = d3.select(this.svg);

        // get width and height
        const width = svg.node().getBoundingClientRect().width,
            height = this.props.height || svg.node().getBoundingClientRect().height;

        // svg.attr("height", height + "px")
            // .attr("width", width + "px");

        // const yearRange = d3.extent(this.props.data.map(x => x.label))
        const yearRange = [this.props.minYear, this.props.maxYear]
        const countRange = [0, d3.max(data.map(x => x.count)) || 1]

        // console.log("ranges", yearRange, countRange, width, height)
        const margin = this.props.margin ||  {
            bottom: 30,
            top: 20,
            left: 20,
            right: 20
        }

        // add axes
        const xScale = d3.scaleBand()
            .domain(d3.range(...yearRange))
            .rangeRound([margin.left, width - margin.right])

        const xAxis = d3.axisBottom(xScale)
        .tickFormat(e => numeral(e).format("0"))
        .tickValues(d3.range(this.props.minYear, this.props.maxYear, 10))

        this.xAxisG
            .attr("transform", `translate(${0},${height - margin.bottom})`)
            .call(xAxis)

        const yScale = d3.scaleLinear()
            .domain(countRange)
            .rangeRound([height - margin.bottom, margin.top])

        const yAxis = d3.axisLeft(yScale).tickSizeOuter(0)
        .tickFormat( e => Math.floor(e) === e ? e : undefined);

        this.yAxisG
            .attr("transform", `translate(${margin.left},${0})`)
            .call(yAxis)

        const t = i => svg.transition()
            .duration(1000)
            .ease(d3.easeCubic)

        this.barG.selectAll(".bar")
            .data(data)
            .join(
                (enter, i) => enter.append("rect")
                    .attr("class",d=>d.barClass)
                    .classed("bar", true)
                    .attr("data-enter-value", d=>d.count)
                    .attr("data-label", d=>d.label)
                    .attr("y", d => yScale(0))
                    .attr("width", xScale.bandwidth)
                    .attr("x", d => xScale(d.label))

                    .call(enter => enter.transition(t(i))
                        .attr("y", d => {
                            return yScale(d.count || 0)
                        })
                        .attr("height", d => yScale(0) - yScale(d.count || 0))
                        .attr("width", xScale.bandwidth)
                    ), 
                update => update
                    .attr("data-update-value", d=>d.count)
                    .attr("class",d=>d.barClass)
                    .classed("bar", true)
                    .each((d,i)=>console.log("Updating", d))
                    .attr("x", d => xScale(d.label))
                    .call(update => update.transition(t(100))
                        .attr("y", d => yScale(d.count || 0))
                        .attr("height", d => yScale(0) - yScale(d.count || 0))
                    ),
                exit => exit
                .attr("data-exit-value", d=>d.count)
                // .attr("class",d=>d.barClass)
                .each(d=>console.log("updating(exiting)", d))
                .attr("x", d => xScale(d.label))
                .call(exit => exit.transition(t(100))
                    .attr("height", 0)
                    .attr("y", () =>  yScale(0))
                )
            )

       d3.select(window).on("resize",this.redrawChart)
    }

}