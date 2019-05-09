import React from 'react';
import { TagFilter } from '../Inputs';
import {BarChart} from "../Viz";
import {replaceKeys} from "../Sanitization";
import numeral from "numeral";
import "./style/main.scss";


// remove this...
var { filterSubjectsOld, getData, subjects, resources } = require("../Data");
// in favor of this. using dot notation will allow for 
// a more intuitive data API
const data = require("../Data");


export default class extends React.Component {

    constructor(props) {
        super(props);

        const { resources, _, summaryData } = getData();

        this.state = {
            resources: data.resources.all,
            summaryData: summaryData,
            filters: {
                "gender": [],
                "birthYear": [],
                "birthCountry": [],
                "language": [],
                "yearRecorded": [],
                "subjectIDs": [],
                "interviewerIDs": [],
                "programIDs": [],
            },
        }

        this.updateFilterFactory = this.updateFilterFactory.bind(this);
    }

    updateFilterFactory(key) {
        return val => {
            var filters = { ...this.state.filters }
            filters[key] = val;
            const { resources, subjects, summaryData } = getData(filters);

            this.setState({
                filters: filters,
                resources,
                subjects,
                summaryData
            });
        }
    }

    render() {
        console.log("MetaDash.render state", this.state);
        const allSubjects = Object.keys(this.state.summaryData.subjects || {});
        var subjectChartData = Object.keys(allSubjects || {}).map(i=>{
            const k = allSubjects[i];
            return {
                ...subjects.byID[k],
                value:this.state.summaryData.subjects[k]
            }
        })
        .filter(s=>(s.value < this.state.resources.length) || (this.state.resources.length === 1))


        return (
            <div className="MetaDash">
                <div>
                    {numeral((this.state.resources ||[]).length).format("0,0")} 
                     {this.state.resources.length > 1 ? " testimonies" : " tesimony"}
                </div>
                <BarChart
                    maxItems={35}
                    data={subjectChartData}></BarChart>
                {/* subject picker allows you to choose subjects,
                which narrows down the subjects list and the testimonies list
                 */}
                <div className="tag-"></div>
                <TagFilter
                    updateSelections={this.updateFilterFactory("subjectIDs")}
                    selections={subjects.expandSubjectIDs(this.state.filters.subjectIDs)}
                    // updateTerms={(terms=>{})}
                    // items={subjects.expandSubjectIDs(Object.keys(this.state.summaryData.subjects))}
                    allItems={allSubjects}
                    filterItems={data.subjects.search}
                    getItems={(_, terms) => subjects.filteredSubjectList(this.state.resources, terms)}
                    //getItems={filterSubjectsOld}
                    placeholder="Begin searching subjects...">
                </TagFilter>
            </div >
        );
    }

}
