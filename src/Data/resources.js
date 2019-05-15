const { MEN_SUBJECT, WOMEN_SUBJECT } = require("./static");
/**
 * all - return an array containing all records.
 *       This can be accomplished by calling .query
 *       without any parameters
 *         
 */
const all = () => require("./index.2.min.json");

let filters = {};

filters.resourceContainsAllItems = (itemField, itemFilters) => {
    return r => {
        for(let i = 0; i < itemFilters.length; i++){
            let item = itemFilters[i];
            if( r[itemField].indexOf(item.id) < 0) return false;
        }
        return true;
    }

}

filters.resourceContainsAllSubjects = subjects => { return filters.resourceContainsAllItems ("subject_refs", subjects) }

filters.resourceContainsAllInterviewers = interviewers => { return filters.resourceContainsAllItems("interviewers", interviewers)}

filters.resourceContainsAllPrograms = programs => { return filters.resourceContainsAllItems("programs", programs)}

filters.getResources = options => {

    // just skip the iteration if no args are passed
    if (!options) {return all;}

    return r => {

        // filter by selected subject
        if (!filters.resourceContainsAllSubjects(options.subjects||[])(r)){ return false }

        // TODO - filter by gender
        if ((options.gender||[]).length == 1 && options.gender[0] === "Men"){
            console.log("Filtering to only men", MEN_SUBJECT)
            if (!filters.resourceContainsAllSubjects([{id:MEN_SUBJECT}])(r)){ return false }
        }
        if ((options.gender||[]).length == 1 && options.gender[0] === "Women"){
            console.log("Filtering to only women", WOMEN_SUBJECT)

            if (!filters.resourceContainsAllSubjects([{id:WOMEN_SUBJECT}])(r)){ return false }
        }


        // TODO - filter by year of recordingd

        // TODO - filter by year of birth

        // TODO - filter by place of birth

        // TODO - filter by affiliate program
        if (!filters.resourceContainsAllPrograms(options.programs||[])(r)){ return false }

        // TODO - filter by interviewer
        if (!filters.resourceContainsAllInterviewers(options.interviewers||[])(r)){ return false }

        // TODO - in future, support multiple languages
        if (options.language 
            && options.language.length == 1 
            && r.language !== options.language[0].id){ return false}

        // if it passes everything, return true
        return true;

    }
}

/**
 * 
 * query - filter resources based on options object. All options elements
 *         are represented as string arrays. All filters are ANDed together,
 *         so filtering by Men + Women would only (ideally) return testimony
 *         with at least two subjects, a man and a woman.
 * 
 * @param {object} options - {
 *                     subjectIDs:Array<String> - ArchivesSpace subject refs to include,
 *                         gender:Array<String> - genders ("Women","Men") to include,
 *                  recordingYear:Array<String> - [minYear, maxYear]
 *                      birthYear:Array<String> - [minYear, maxYear]
 *              affiliatePrograms:Array<String> - ArchivesSpace agent refs of programs
 *                   interviewers:Array<String> - ArchivesSpace agent refs of interviewers
 *                      languages:Array<String> - list of languages to include
 * 
 * }
 */
let query = options => all().filter(filters.getResources(options))

module.exports = { all, query }