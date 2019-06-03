import React from 'react';
import "./style/main.scss";
import numeral from "numeral";

export default class extends React.Component {

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

        const items = this.props.showAll ? this.props.allItems : this.props.items;
        return (
            <div className="count-list">
                {(items || [])
                    .sort((a, b) => a.count < b.count ? 1 : -1)
                    .filter(a => a.label && a.label.length > 0)
                    .map((item, i) => {

                        let itemCount,
                            barWidth,
                            className


                        if (item.id in this.props.itemDict) {
                            className = "list-item";
                            itemCount = numeral(this.props.itemDict[item.id].count).format("0,0");
                            barWidth = width(this.props.itemDict[item.id].count);

                        } else {
                            className = "list-item disabled";
                            barWidth = 0;
                            itemCount = "--"
                        }

                        if (item.id in this.props.selections) {
                            className = "list-item selected";
                        }


                        return (
                            <div onClick={() => (this.props.handleItemClick || (() => { }))(item)} key={i}
                                className={className}>

                                <div className="x-circle-icon"></div>

                                <div className="list-item-name">
                                    {item.label}
                                </div>

                                {this.renderBar(barWidth)}

                                <div className="list-item-value">
                                    {itemCount}
                                </div>
                            </div>
                        )
                    })}
            </div>
        )
    }
}
