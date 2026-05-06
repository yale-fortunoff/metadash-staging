// @ts-nocheck

import { normalizeString } from '~/utils/common';

import { getRecordingYear } from '~/utils/data';
import { getGender } from './getGender';

/**
 * all - return an array containing all records.
 *       This can be accomplished by calling .query
 *       without any parameters
 *
 */
import __all from './json/Index.json' assert { type: 'json' };

export const all = () => __all;

let filters = {};

filters.resourceContainsAllItems = (itemField, itemFilters) => {
  return (r) => {
    for (let i = 0; i < itemFilters.length; i++) {
      let item = itemFilters[i];
      if (!r || !r[itemField] || r[itemField].indexOf(item.id) < 0)
        return false;
    }
    return true;
  };
};

filters.resourceContainsAllSubjects = (subjects) => {
  return filters.resourceContainsAllItems('subject_refs', subjects);
};

filters.resourceContainsAllInterviewers = (interviewers) => {
  return filters.resourceContainsAllItems('interviewers', interviewers);
};

filters.resourceContainsAllPrograms = (programs) => {
  return filters.resourceContainsAllItems('programs', programs);
};

// TODO - eventually, I should just make all of the filters into factories
//        like this one, so the function is declared once per query
let filterBirthPlacesFactory = (options) => {
  if (
    !options ||
    !options.birthplaces ||
    (options.birthplaces || []).length < 1
  ) {
    return () => true;
  }

  return (r) => {
    let place = options.birthplaces[0];

    // these two should always match
    if (r.birth_place_cities?.length !== r.birth_place_countries?.length) {
      return false;
    }

    for (let j = 0; j < (r.birth_place_cities || []).length; j++) {
      let city = (r.birth_place_cities || [])[j],
        country = (r.birth_place_countries || [])[j];
      if (normalizeString(country) !== normalizeString(place.country))
        return false;

      if (place.city) {
        // if there's a city, limit by that as well
        if (normalizeString(city) !== normalizeString(place.city.split(',')[0]))
          return false;
      }

      return true;
    }

    return false;
  };
};

filters.getResources = (options) => {
  let filterBirthPlaces = filterBirthPlacesFactory(options);
  // just skip the iteration if no args are passed
  if (!options) {
    return all;
  }

  return (r) => {
    // filter by selected subject
    if (!filters.resourceContainsAllSubjects(options.subjects || [])(r)) {
      return false;
    }

    // filter by gender
    if (
      (options.gender || []).length > 0 &&
      (options.gender || []).length < 3
    ) {
      if (options.gender.indexOf(getGender(r)) < 0) {
        return;
      }
    }

    // filter by year of recording
    if (options.dateRanges && options.dateRanges.recording) {
      const recordingYear = getRecordingYear(r);
      if (
        recordingYear < options.dateRanges.recording[0] ||
        recordingYear > options.dateRanges.recording[1] ||
        !recordingYear
      ) {
        return false;
      }
    }

    // filter by year of birth
    if (options.dateRanges && options.dateRanges.birth) {
      const birthYears = r.birth_years || [];
      if (
        !birthYears.reduce((curr, next) => {
          if (!curr) {
            return false;
          }
          if (!options) {
            return true;
          }
          if (!options.dateRanges) {
            return true;
          }
          if (!options.dateRanges.birth) {
            return true;
          }
          if (
            next < options.dateRanges.birth[0] ||
            next > options.dateRanges.birth[1]
          ) {
            return false;
          }
          return true;
        }, true)
      ) {
        return false;
      }
    }

    if (!filterBirthPlaces(r)) {
      return false;
    }

    // filter by affiliate program
    if (!filters.resourceContainsAllPrograms(options.programs || [])(r)) {
      return false;
    }

    // filter by interviewer
    if (
      !filters.resourceContainsAllInterviewers(options.interviewers || [])(r)
    ) {
      return false;
    }

    // filter by languages
    if (
      options.language?.length > 0 &&
      !options.language.some((o) => o.id === r.language)
    ) {
      return false;
    }

    // if it passes everything, return true
    return true;
  };
};

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

export function query(options) {
  if (!options) {
    return all();
  }
  return all().filter(filters.getResources(options));
}
