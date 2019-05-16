import React from 'react';

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.svg = React.createRef();
        this.initializeChart = this.initializeChart.bind(this);
        this.updateChart = this.updateChart.bind(this);
        this.redrawChart = this.redrawChart.bind(this);
    }

    componentDidUpdate() { 
        this.updateChart(this.props.data) 
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
    
        }, 100)
    }

    // Override this 
    initializeChart() {
    }

    // Override this
    updateChart(data) {
    }

}