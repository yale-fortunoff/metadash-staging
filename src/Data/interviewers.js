const createReferenceInterface = require("./createReferenceInterface");

const data = require("./json/interviewers.min.json")
    .map(i => {

        if (i.display_names.length > 1){ throw("Interviewer with multiple names")}
        return {
            id: i.uri,
            label: i.display_names[0]
        }

    })

module.exports = createReferenceInterface(data, "interviewers" );