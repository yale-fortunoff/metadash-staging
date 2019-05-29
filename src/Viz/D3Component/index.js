import React from 'react';

export default class extends React.PureComponent {

    constructor(props) {
        super(props);

        this.svg = React.createRef();
        this.initializeChart = this.initializeChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.redrawChart = this.redrawChart.bind(this);

        this.margin = props.margin || {
            top:0,
            left:0,
            right:0,
            bottom:0
        }
    }

    componentDidUpdate() { 
        this.updateChart(this.props.data);
    }

    componentDidMount() {
        this.initializeChart();
        this.updateChart();

    }

    render() {
        return (<div className="Viz">
            <div></div>
            <svg ref={(elem) => { this.svg = elem; }}></svg>
        </div>);
    }

    redrawChart(){
        // throttle redrawing
        clearTimeout(this.timeout)
        this.timeout = setTimeout(()=>{
            this.initializeChart();
            this.updateChart();
    
        }, 1000)
    }

    // Override this 
    initializeChart() {
    }

    // Override this
    updateChart(data) {
    }

}