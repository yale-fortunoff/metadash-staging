const all = require("./index.min.json");

let filters = {};

filters.resourceContainsAllSubjects = subjectIDs => {
    return r => {
        for(let i = 0; i < subjectIDs.length; i++){
            let subjectID = subjectIDs[i];
            if( r.subject_refs.indexOf(subjectID) < 0) return false;
        }
        return true;
    }
}

filters.getResources = options => {
    const subjectIDs = (options.subjectIDs || [])
    return r =>{

         // filter by selected subject
        if (!filters.resourceContainsAllSubjects(subjectIDs)(r)){ return false}

        // TODO - filter by gender

        // TODO - filter by year of recording

        // TODO - filter by year of birth

        // TODO - filter by place of birth

        // TODO - filter by affiliate program

        // if it passes everything, return true
        return true;

    }
}

let query = options => all.filter(filters.getResources(options))

module.exports = { all, query }