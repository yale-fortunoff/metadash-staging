const createReferenceInterface = require("./createReferenceInterface");

const data = require("./programs.min.json")
    .map(i => {

        if (i.display_names.length > 1){ throw("Program with multiple names")}
        return {
            id: i.uri,
            label: i.display_names[0]
        }

    });

console.log("programs data", data)

module.exports = createReferenceInterface(data, "programs" );