import React from 'react';
import GenericInput from "../GenericInput";
import TextInput from "../TextInput";

import SelectionPool from "./SelectionPool";
import TagPool from "./TagPool";

export default class extends GenericInput {

    constructor(props) {

        super(props);

        this.state = {
            searchTerm: '',
        }

        this.updateSearchTerm = this.updateSearchTerm.bind(this);
        this.addSelection = this.addSelection.bind(this);
        this.dropSelectionByID = this.dropSelectionByID.bind(this);
        this.dropSelection = this.dropSelection.bind(this);
        this.updateSelections = this.updateSelections.bind(this);
    }

    updateSelections(newSelections){
        this.props.updateSelections(newSelections);
        this.setState({searchTerm:""})
    }

    updateSearchTerm(t) {
        this.setState({
            searchTerm: t, 
        });
    }

    addSelection(selectionItem) {
        // don't add a duplicate
        var newSelections = [...this.props.selections];
        if (newSelections.filter(a => a.id === selectionItem.id).length > 0) { return; }

        newSelections = [...newSelections, selectionItem];

        this.updateSelections(newSelections, this.state.searchTerm);
    }

    dropSelectionByID(dropID) {
        var newSelections = [...this.props.selections];
        newSelections = newSelections.filter(a => {
            const ret = String(a.id) !== String(dropID);
            return ret;
        });

        this.updateSelections(newSelections, this.state.searchTerm);
    }

    dropSelection(item) {
        this.dropSelectionByID(item.id)
    }

    render() {
        //const items = this.props.getItems(this.props.selections, this.state.searchTerm.split(""))
        const items = this.props.filterItems(this.state.searchTerm.split(" "))
        .filter(i=>i.id in this.props.allItems)
        // .filter(i=>Object.keysthis.props.allItems.indexOf(i.id) >= 0)

        // console.log("TagFilter.render items:", this.state.searchTerm.split(" "), items )
        console.log("TagFilter.render allItems: ", this.props.placeholder, this.props.allItems)

        return (
            <div className="TagFilter">
                <TextInput
                    callback={this.updateSearchTerm}
                    placeholder={this.props.placeholder}
                    value={this.state.searchTerm}></TextInput>
                <SelectionPool
                    callback={this.dropSelection}
                    items={this.props.selections}></SelectionPool>
                <TagPool
                    callback={this.addSelection}
                    items={items || []}
                // items={this.state.poolItems || []}
                ></TagPool>
            </div>
        )
    }

}