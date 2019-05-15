import React from 'react';

import { TagFilter, RangeSlider } from '../Inputs';
import { BarChart, DonutChart } from "../Viz";

import OverviewBillboard from "./OverviewBillboard";
import Gender from "./Gender";
import Languages from "./Languages";
import BirthYear from "./BirthYear";
import SubjectHeadings from "./SubjectHeadings";
import Programs from "./Programs";
import Interviewers from "./Interviewers";


import "./style/main.scss";
import { Subject } from 'rxjs';

const data = require("../Data");

export default class extends React.Component {

    constructor(props) {
        super(props);

        // const { resources, _, summaryData } = data.getData();

        this.state = {
            ...data.getData(),
            // resources: data.resources.query(),
            // summaryData: summaryData,
            filters: {
                "gender": ["Men","Women"],
                "birthYear": [],
                "birthCountry": [],
                "language": [],
                "yearRecorded": [],
                "subjects": [],
                "interviewers": [],
                "programs": [],
            },
        }

        this.updateFilterFactory = this.updateFilterFactory.bind(this);
    }

    updateFilterFactory(key) {
        return val => {
            var filters = { ...this.state.filters }
            filters[key] = val;
            const { resources, subjects, summaryData } = data.getData(filters);

            this.setState({
                filters: filters,
                resources,
                subjects,
                summaryData
            });
        }
    }

    render() {

        /** remove items (such as subject headings) that are common to all resources (videos) */
        // const dropUniversal = s => (s.count < this.state.resources.length) || (this.state.resources.length === 1)

        console.log("MetaDash.render state", this.state);
        let genderSubjects = [];
        Object.keys(this.state.summaryData.subjects).filter(s => {

            if (["Men","Women"].indexOf(this.state.summaryData.subjects[s].label) >= 0){
                genderSubjects.push(this.state.summaryData.subjects[s]);
            }
        })
        console.log("genderSubjects", genderSubjects)

        function objectToArray(obj){
            obj = obj || [];
            return Object.keys(obj).map(k=>obj[k]);
        }
        return (
            <div className="MetaDash">

                <OverviewBillboard
                    testimonyCount={this.state.resources.length}
                ></OverviewBillboard>

                <Gender
                    updateSelections={this.updateFilterFactory("gender")}
                    men={this.state.summaryData.gender.men.count}
                    women={this.state.summaryData.gender.women.count}
                ></Gender>

                <Languages
                    updateSelections={this.updateFilterFactory("language")}
                    languages={objectToArray(this.state.summaryData.languages)}
                ></Languages>

                <BirthYear
                    height={200}
                    minYear={1890}
                    maxYear={1950}
                    data={Object.keys(
                        this.state.summaryData.birthYears)
                        .map(k => this.state.summaryData.birthYears[k])
                        .filter(yrs => yrs.label >= 1890 && yrs.label < 1950)
                    }
                ></BirthYear>

                {/* <BarChart
                    maxItems={35}
                    valueField="count"
                    data={Object.keys(this.state.summaryData.subjects)
                        .map(k => {
                            return {
                                ...this.state.summaryData.subjects[k],
                            }
                        })
                        .filter(dropUniversal)}></BarChart>

                <DonutChart
                    maxItems={5}
                    valueField="count"
                    data={Object.keys(this.state.summaryData.languages).map(k => {
                        return {
                            ...this.state.summaryData.languages[k],
                        }
                    })}></DonutChart>

                <DonutChart
                    maxItems={5}
                    valueField="count"
                    // data={subjectChartData}
                    data={Object.keys(this.state.summaryData.programs)
                        .map(k => {
                            return {
                                ...this.state.summaryData.programs[k],
                                // value: this.state.summaryData.programs[k].count
                            }
                        })
                        .filter(dropUniversal)}></DonutChart>
 */}

                {/* subject picker allows you to choose subjects,
                which narrows down the subjects list and the testimonies list
                 */}
                <SubjectHeadings
                    updateSelections={this.updateFilterFactory("subjects")}
                    selections={this.state.filters.subjects}
                    allItems={this.state.summaryData.subjects}
                    filterItems={data.subjects.search}
                    placeholder="Begin searching subjects...">
                </SubjectHeadings>

                <Interviewers
                    updateSelections={this.updateFilterFactory("interviewers")}
                    selections={this.state.filters.interviewers}
                    allItems={this.state.summaryData.interviewers}
                    filterItems={data.interviewers.search}
                    placeholder="Begin searching interviewers...">
                </Interviewers>

                <Programs
                    updateSelections={this.updateFilterFactory("programs")}
                    selections={this.state.filters.programs}
                    allItems={this.state.summaryData.programs}
                    filterItems={data.programs.search}
                    placeholder="Begin searching programs...">
                </Programs>
            </div >
        );
    }

}
