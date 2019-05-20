import React from 'react';

import "./style/main.scss";
// import numeral from "numeral";
import {CountListWithBars} from "../Common";

export default class extends React.Component {


    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         language: false
    //     }

    //     this.toggleLanguage = this.toggleLanguage.bind(this);
    //     this.renderBar = this.renderBar.bind(this);
    // }

    // toggleLanguage(lang) {
    //     if (!this.state.language) {
    //         this.setState({ language: lang });
    //         this.props.updateSelections([lang]);
    //     } else {
    //         this.setState({ language: false });
    //         this.props.updateSelections([]);
    //     }
    // }

    // // conditionally render a bar, if we're showing all languages
    // renderBar(style) {
    //     if (this.state.language) { return (null) }
    //     return (
    //         <div style={style} className="pct-bar"></div>
    //     )
    // }

    render() {
        const listProps = {
            ...this.props,
            handleItemClick: item => {
                if (this.props.selections.length < 1){ this.props.updateSelections([item]);}
                else { this.props.updateSelections([])}
            },
            showBars:true}
        return (
            <div className="Languages module-box">
                <h3 className="title">Languages</h3>
                <CountListWithBars
                {...listProps}
                ></CountListWithBars>
            </div>

        )

    }


    // render() {

    //     const total = this.props.languages.reduce((subtotal, nextItem) => subtotal + nextItem.count, 0);
    //     const width = val => `${val * 100 / total}%`

    //     return (
    //         <div className="Languages">
    //             <h3>Languages</h3>
    //             <div className="language-list">
    //                 {(this.props.languages || [])
    //                     .sort((a, b) => a.count < b.count ? 1 : -1)
    //                     .filter(a => a.label && a.label.length > 0)
    //                     .map((lang, i) => {
    //                         return (
    //                             <div onClick={() => this.toggleLanguage(lang.label)} key={i}
    //                                 className="list-item">

    //                                 <div className="list-item-name">
    //                                     {lang.label}
    //                                 </div>

    //                                 {/* <div className="pct-bar-container">
    //                                     {this.renderBar({ "width": width(lang.count) })}

    //                                 </div> */}


    //                                 <div className="pct-bar-container">
    //                                     <div style={{ "width": width(lang.count) }} className="pct-bar"></div>
    //                                 </div>

    //                                 <div className="list-item-value">
    //                                     {numeral(lang.count).format("0,0")}
    //                                 </div>


    //                             </div>
    //                         )
    //                     })}
    //             </div>
    //         </div>
    //     );
    // }
}