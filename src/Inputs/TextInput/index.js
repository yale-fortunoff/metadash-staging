import React from 'react';
import GenericInput from "../GenericInput";

export default class extends GenericInput {

    constructor(props) {
        super(props);

        this.callback = this.props.callback || function () { };

        this.updateValue = this.updateValue.bind(this);
    }

    updateValue(e) {
        this.callback(e.target.value);
    }

    render() {
        const value = this.props.value || "";
        return (
            <div className="TextInput">
                <input 
                onChange={this.updateValue} 
                value={value} 
                placeholder={this.props.placeholder} 
                type="text"></input>
            </div>
        )
    }
}