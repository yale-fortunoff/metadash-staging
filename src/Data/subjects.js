const { normalizeString } = require("../Sanitization");
const { all:resources } = require("./resources");

let byID = {};
const excludes=["Video tapes"]
const all = require("./subjects.min.json")
// .filter(r=>{
//     return excludes.indexOf(r.title) < 0;
// })
.map(a => {
    const ret = {
        label: a.title,
        id: a.uri
    }
    byID[ret.id] = ret;
    return ret;
});


let filters = {};

filters.subjectContainsAllTerms = function(terms){ 
    return function(subject){
        for (let i = 0; i < terms.length; i++){
            let term = terms[i];
            if (normalizeString(subject.label).indexOf(term) < 0) return false;
        }
        return true;
    }
};


// get a list of subjects from a specified list of resources
function filteredSubjectList(resources, terms){
    let ret = [];
    terms = terms || [];

    (resources || []).forEach(r=>{
        r.subject_refs.forEach(s=>{
            if (!(filters.subjectContainsAllTerms(terms)(byID[s]))){ return false}
            if (ret.indexOf(byID[s]) < 0) ret.push(byID[s])
        });
    });

    return ret;
}

function search(terms){
    return filteredSubjectList(resources, terms)
}


function filterSubjectsOld(terms, selectedItems) {

    var tmpSubjects = all;

    if (selectedItems && selectedItems.length > 0) {

        // filter out subjects that don't share an edge with a resource node
        selectedItems.forEach(function (subjectItem) {
            var ret = [];
            resources.forEach(function (resourceItem) {
                if (resourceItem.subject_refs.indexOf(subjectItem.id) < 0) { return };

                resourceItem.subject_refs.forEach(function (newItem) {
                    if (ret.indexOf(newItem) < 0) { ret.push(newItem) };
                })
            });

            tmpSubjects = tmpSubjects.filter(subjectItem => ret.indexOf(subjectItem.id) >= 0);
        });

    }

    (terms || []).forEach(function (term) {

        const searchTerm = normalizeString(term);

        tmpSubjects = tmpSubjects.filter(function (a) {
            const matchTerm = normalizeString(a.label);
            return matchTerm.indexOf(searchTerm) >= 0;
        });
    });

    return tmpSubjects.sort((a, b) => a.label < b.label ? -1 : 1);
}

function expandSubjectIDs(subjectIDs){
    return (subjectIDs || []).map(subjectID=>byID[subjectID]);
}

module.exports = {
    // remove 
    filterSubjectsOld, 
    filteredSubjectList,

    // keep
    search,
    filters,
    all,
    byID,
    expandSubjectIDs,
}
