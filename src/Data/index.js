
import * as resources from "./resources";
import * as subjects from "./subjects";
import * as interviewers from "./interviewers";
import * as programs from "./programs";
import { MEN_SUBJECT, WOMEN_SUBJECT } from "./static";

function getRecordingYear(record) {
    return (record.recording_dates || [])
        .filter(a => a)
        .map(a => Number(a.slice(0, 4)))
        .sort()[0]
}

/**
 * 
 * getData - given an options object,
 *           return the counts of specified meta
 *           field values
 * 
 */
function getData(options) {

    let ret = {
        // implemented
        "subjects": {},
        "languages": {},
        "birthYears": {},
        "interviewers": {},
        "gender": {},
        "programs": {},

        // not implemented
        "recordingYears": {},
        "birthCities": {},
        "birthCountries": {},
        "birthPlaces": {},
    }

    // let subj = [];

    function incr(retKey, item) {
        if (!(item.id in ret[retKey])) {
            ret[retKey][item.id] = { ...item, count: 0 };
        }
        ret[retKey][item.id].count += 1;
    }

    var res = resources.query(options || {});

    function birthPlaces(r) {
        let ret = []
        const cityCount = (r.birth_place_cities || []).length;
        const countryCount = (r.birth_place_countries || []).length;
        if (cityCount < 1 || cityCount !== countryCount) { return [] }
        for (var i = 0; i < cityCount; i++) {
            const city = r.birth_place_cities[i] || "",
                country = r.birth_place_countries[i] || "";
            ret.push(`${city},${country}|${country}`);

        }
        return ret;
    }

    res = res.map(r => { return { ...r, birthPlaces: birthPlaces(r) } });

    res.forEach(r => {

        // count occurrences of each subject
        r.subject_refs.forEach(s => { incr("subjects", subjects.byID(s)) });

        // count occurrences of each birth year
        if (r.birth_years && r.birth_years.length === 1) {
            incr("birthYears", { label: r.birth_years[0], id: r.birth_years[0] })
        }

        // count occurrences of each language
        incr("languages", { label: r.language, id: r.language });

        // // count occurrences of each birth city/country pair
        r.birthPlaces.forEach(place => incr("birthPlaces", {
            label: place,
            id: place,
            city: place.split("|")[0],
            country: place.split("|")[1],
        }));

        // count occurrences of each recording year
        const ryear = getRecordingYear(r);
        incr("recordingYears", { label: ryear, id: ryear });

            // count occurrences of each affiliate program
            (r.programs || []).forEach(i => { incr("programs", programs.byID(i)) });

        // count occurences of each interviewer
        (r.interviewers || []).forEach(i => { incr("interviewers", interviewers.byID(i)) })

    });

    ret.gender.men = ret.subjects[MEN_SUBJECT] || 0;
    ret.gender.women = ret.subjects[WOMEN_SUBJECT] || 0;

    const returnValue = {
        "resources": res,
        subjects: undefined,
        "summaryData": ret
    };

    return returnValue;

}

export {
    getData,
    resources,
    interviewers,
    subjects,
    programs
};