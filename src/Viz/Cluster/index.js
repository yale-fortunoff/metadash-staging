import React from 'react';
import "./style/main.scss";
import D3Component from "../D3Component";
import numeral from "numeral";
import * as d3 from "d3";

export default class extends D3Component {

    constructor(props) {
        super(props);

        this.initializeChart = this.initializeChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    initializeChart() {

        const items = this.props.items

        const svg = d3.select(this.svg).html("");

        const width = svg.node().getBoundingClientRect().width,
            height = this.props.height || svg.node().getBoundingClientRect().height;
        
            //svg.attr("height", height + "px");

        d3.select(window).on("resize", this.redrawChart)

        const root = d3.stratify()
        .id(d=>d.label.split("|")[0])
        .parentId(d=>d.label.split("|")[1])(items)

        var packLayout = d3.pack()
        .padding(0.725)
        .size([width, height]);

        root.sum(d=>d.count);

        packLayout(root);

        let nodes = svg.append("g")
        .selectAll('circle')
        .data(root.descendants().filter(d=>d.data.label.indexOf("root")<0))
        .enter()
        .append('circle')
        .attr("data-city", d=>d.data.label)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('r', function(d) { return d.r; })
        .on("mouseover", d=>this.props.onMouseOver(d.data))
        .on("mouseout", d=>this.props.onMouseOut(d.data))

    }

    updateChart() {

        // highlight the selected subset
        const svg = d3.select(this.svg);
        svg.selectAll("circle")
        .classed("highlighted", d=>{
            return d.data.label in this.props.itemDict
        })
        .transition().duration(1500).ease(d3.easeQuad)
        .style("opacity",d=>d.data.label in this.props.itemDict ? 1 : 0.25 )


        // // resize to show only the appropriate area
        // // represented by the subset items
        // .transition(d3.transition().duration(3000))
        // .attr('r', d =>{
        //     if (!(d.data.id in this.props.itemDict)) return d.r;
        
        //     // resize in place
        //     const oldCount = d.data.count,
        //     newCount = this.props.itemDict[d.data.id].count,
        //     ratio = newCount / oldCount,
        //     newRadius = d.r * ratio;

        //     return newRadius
        // })

    }

}