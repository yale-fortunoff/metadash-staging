import React from 'react';
import "./style/main.scss";
// import TagFilter from "../../Inputs/TagFilter";
import { CountListWithBars, objectToArray } from "../Common";
import { TextInput, SelectionPool } from "../../Inputs";


export default class extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            searchTerm: '',
        }
        this.updateSelections = this.updateSelections.bind(this);
        this.updateSearchTerm = this.updateSearchTerm.bind(this);
        this.dropSelection = this.dropSelection.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);

    }

    dropSelection(item){
        this.props.updateSelections(this.props.selections.filter(i=>i.id !== item.id))
    }

    updateSearchTerm(searchTerm){

        this.setState({
            searchTerm,
            // filteredItems: this.props.filterItems(searchTerm)
        })
        
    }

    updateSelections(){

        this.updateSearchTerm(this.state.searchTerm);
        this.props.updateSelections.apply(null, arguments);
        
    }

    handleItemClick(item){
        this.updateSelections(this.props.selections.filter(i=>i.id !== item.id).concat([item]))
    }

    render() {

        const listProps = {
            showBars: this.props.showBars,
            updateSelections: this.updateSelections,
            items: this.props.filterItems(this.state.searchTerm),
            handleItemClick: this.handleItemClick
            //allowMultipleSelections: true,
            // items: this.state.filteredItems
            // items: objectToArray(this.props.interviewers)
        }

        return (
            <div className="Interviewers module-box">
                <h3 className="title">Interviewers</h3>
                <div>
                    <TextInput
                    placeholder="Search by name"
                    callback={this.updateSearchTerm}
                    value={this.state.searchTerm}>
                    ></TextInput>
                </div>
                <div>
                    <SelectionPool
                    callback={(this.dropSelection)}
                    items={this.props.selections}></SelectionPool>
                </div>
                    <CountListWithBars {...listProps}></CountListWithBars>
            </div>);

    }
}