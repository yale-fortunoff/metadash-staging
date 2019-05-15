import React from 'react';
import "./style/main.scss";
import numeral from "numeral";

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            item: false
        }

        this.toggleItem = this.toggleItem.bind(this);
    }

    toggleItem(item) {
        if (!this.state.item) {
            this.setState({ item });
            this.props.updateSelections([item]);
        } else {
            this.setState({ item: false });
            this.props.updateSelections([]);
        }
    }

    renderBar(width) {
        if (!this.props.showBars) { return }
        return (
            <div className="pct-bar-container">
                <div style={{ "width": width }} className="pct-bar"></div>
            </div>

        )
    }

    render() {
        const total = this.props.items.reduce((subtotal, nextItem) => subtotal + nextItem.count, 0);
        const width = val => `${val * 100 / total}%`

        console.log("Rendering count list ", this.props)

        return (
            <div className="count-list">
                {(this.props.items || [])
                    .sort((a, b) => a.count < b.count ? 1 : -1)
                    .filter(a => a.label && a.label.length > 0)
                    .map((item, i) => {
                        return (
                            <div onClick={() => this.toggleItem(item)} key={i}
                                className="list-item">

                                <div className="list-item-name">
                                    {item.label}
                                </div>

                                {this.renderBar(width(item.count))}

                                <div className="list-item-value">
                                    {numeral(item.count).format("0,0")}
                                </div>
                            </div>
                        )
                    })}
            </div>
        )
    }
}
