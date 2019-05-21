import React from 'react';
import "./style/main.scss";
import numeral from "numeral";
import * as d3 from "d3";

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "Men": true,
            "Women": true,
            "Both": true
        }

        this.menRef = React.createRef();
        this.bothRef = React.createRef();
        this.womenRef = React.createRef();

        this.genderToggle = this.genderToggle.bind(this);
        this.animate = this.animate.bind(this);

    }

    genderToggle(gender) {


        let val = this.state[gender],
            newVal = !val,
            otherVal = gender === "Men" ? this.state.Women : this.state.Men

        // prevent turning off both genders
        if (!otherVal && !newVal) { return }

        const newState = { ...this.state }
        newState[gender] = newVal;
        this.setState(newState);

        let selections = [];
        if (newState.Men) selections.push("Men");
        if (newState.Women) selections.push("Women");

        this.props.updateSelections(selections);

    }

    animate() {
        // animate the width

        const vals = {
            men: this.props.men || 0,
            women: this.props.women || 0,
            both: this.props.both || 0
        },
            total = vals.men + vals.women + vals.both;

        const animate = (label, ref) =>
            d3.select(ref)
                .transition()
                .duration(1000)
                .ease(d3.easeSinOut)
                .style("width", () => (vals[label] * 100 / total) + "%");

        animate("both", this.bothRef)
        animate("men", this.menRef)
        animate("women", this.womenRef)

    }

    componentDidMount() { this.animate() }
    componentDidUpdate() { this.animate() }

    render() {
        const men = this.props.men || 0,
            women = this.props.women || 0,
            both = this.props.both || 0,
            total = men + both + women;

        const toggleState = label => this.state[label] ? "on" : "off";

        return (
            <div className="Gender module-box">
                <h3 className="title">Gender</h3>
                <div className="label-container">
                    <div className="big">{numeral(men / total).format("0%")}</div>
                    <div className="big">{numeral(both/ total).format("0%")}</div>

                    <div className="big">{numeral(women / total).format("0%")}</div>

                    {/* <div className="big">{numeral(men).format("0,0")}</div>
                    <div className="big">{numeral(women).format("0,0")}</div> */}
                </div>
                <div className="split-bar-container">
                    <div
                        ref={(elem) => { this.menRef = elem; }}
                        // style={{ width: `${men * 100 / total}%` }} 
                        className="men gender-bar"></div>
                    <div
                        ref={(elem) => { this.bothRef = elem; }}
                        // style={{ width: `${women * 100 / total}%` }} 
                        className="both gender-bar"></div>
                    <div
                        ref={(elem) => { this.womenRef = elem; }}
                        // style={{ width: `${women * 100 / total}%` }} 
                        className="women gender-bar"></div>
                </div>
                <div className="label-container">
                    <div className="label-area men"
                    // className={"toggle-area men " + toggleState("Men")}
                    //     onClick={() => this.genderToggle("Men")}
                        >
                        {/* <div className={"toggle-light"}></div> */}
                        <div>Men</div>
                        <div>{numeral(men).format("0,0")}</div>

                    </div>
                    <div 
                    className="label-area both"
                    // className={"toggle-area both " + toggleState("Both")}
                        // onClick={() => this.genderToggle("Both")}
                        >
                        {/* <div className={"toggle-light"}></div> */}
                        <div>Both</div>
                        <div>{numeral(both).format("0,0")}</div>

                    </div>

                    <div className="label-area women"
                        // onClick={() => this.genderToggle("Women")}
                        // className={"toggle-area women " + toggleState("Women")}
                        >
                        {/* <div className={"toggle-light"}></div> */}
                        <div>Women</div>
                        <div>{numeral(women).format("0,0")}</div>

                    </div>
                </div>
            </div >
        );
    }
}