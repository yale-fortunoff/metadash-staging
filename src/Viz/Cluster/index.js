import "./style/main.scss";
import D3Component from "../D3Component";
// import numeral from "numeral";
import * as d3 from "d3";
import { objectToArray } from '../../MetaDash/Common';

export default class extends D3Component {

    constructor(props) {
        super(props);

        this.initializeChart = this.initializeChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
    }

    initializeChart() {
        const svg = d3.select(this.svg).html("");

        const //width = svg.node().getBoundingClientRect().width,
            height = this.props.height || svg.node().getBoundingClientRect().height;

        svg.attr("height", height + "px");
        // svg.attr("width", width + "px");

        // svg.on("resize", ()=>super.redrawChart.call(this));

    }

    componentDidUpdate(prevProps, prevState) {
        this.updateChart(prevProps, prevState);
    }

    updateChart(prevProps, prevState) {

        const svg = d3.select(this.svg)

        const width = svg.node().getBoundingClientRect().width,
            height = this.props.height || svg.node().getBoundingClientRect().height;

        const items = this.props.items;
        // change this to props.allItems if you want to preserve each node's circle element
        // which is cooler, but expensive
        // let allItems = this.props.items;

        function allItemsMatch(arr1, arr2) {
            if (arr1.length !== arr2.length) { return false }
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i].id !== arr2[i].id) { return false }
                if (arr1[i].count !== arr2[i].count) { return false }
            }
            return true;
        }

        // FIXME - this is a really naive improvement that prevents reanimating when
        // the length of the properties hasn't changed. There could be cases when
        // it should redraw but won't. really I should check that each item/count is unchanged
        // if (Object.keys((prevProps||{}).itemDict||{}).length ===  Object.keys(this.props.itemDict).length){ return }
        // this should be better
        if (allItemsMatch(
            objectToArray((prevProps || {}).itemDict || {}),
            objectToArray(this.props.itemDict))) {
            return
        }

        const root = d3.stratify()
            .id(d => d.label.split("|")[0])
            .parentId(d => d.label.split("|")[1])(items);

        var packLayout = d3.pack()
            .padding(0.725)
            .size([width, height]);

        root.sum(d => d.count);

        const data = root.descendants().filter(d => d.data.label.indexOf("root") < 0);
        packLayout(root);
        svg.selectAll("circle.city").transition();

        const t = d3.transition().duration(1400)//.ease(d3.easeQuad);
        this.allowInteraction = data.length;

        let nodes = svg
            .selectAll('circle.city')
            .data(data)
            .join(
                enter => enter
                    .append('circle')
                    .classed("city", true)
                    .on("mouseover", d => this.props.onMouseOver(d.data))
                    .on("mouseout", d => this.props.onMouseOut(d.data))
                    .on("click", d => {
                        if (this.props.selections
                            && this.props.selections.length == 1
                            && this.props.selections[0].id == d.data.id) {
                            this.props.updateSelections([])
                        } else {
                            this.props.updateSelections([d.data])
                        }
                    })
                    .attr('cx', function (d) { return d.x; })
                    .attr('cy', function (d) { return d.y; })
                    .attr('r', function (d) { return d.r; }),
                update => update
                    .call(update =>
                        update.transition(t)
                            .attr("data-city", d => d.data.label)
                            .attr('cx', d => d.x)
                            .attr('cy', d => d.y)
                            .attr('r', d => d.r)
                    ),
                // exit=>exit
                // .call(exit=>
                //     exit.transition().duration(1000)
                //     .attr('r', 0)
                // )
            )

            d3.select(window).on("resize.cluster", this.redrawChart.bind(this))


    }

}