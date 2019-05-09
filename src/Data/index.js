
import { filterSubjectsOld, listSubjectsInResources } from "./subjects"
import * as resources from "./resources";
import * as subjects from "./subjects";

 /**
  * 
  * getData - given a set of filtering options,
  *           return the counts of specified meta
  *           field values
  * 
  */
function getData(options) {

    console.log("Getting data with filters", options)
    
    let ret = {
        // implemented
        "subjects":{},
        "languages":{},

        // not implemented
        "birth_years":{},
        "recording_years":{},
        "interviewers":{},
        "programs":{},
        "sexes":{}
    }

    let subj = [];

    function incr(retKey, itemKey){
        if(!(itemKey in ret[retKey])){ ret[retKey][itemKey] = 0; }
        ret[retKey][itemKey] += 1;
    }

    const res = resources.query(options || {});
    // const res = resources.all;

    
    res.forEach(r=>{

        // count occurrences of each subject
        r.subject_refs.forEach(s=>{
            incr("subjects",s)
        });

        // count occurrences of each birth year

        // count occurrences of each language
        incr("languages", r.language || "missing");

        // count occurrences of each birth country

        // count occurrences of each recording year

        // count occurrences of each affiliate program

        // count occurences of each interviewer
        (r.interviewers || []).forEach(i=>{ incr("interviewers",i)})

    });


    const returnValue = {"resources":res, subjects:subj, "summaryData":ret};
    console.log("return from getData",returnValue); 
    return returnValue;

}


export {
    filterSubjectsOld,

    getData, 
    subjects,
    resources
};