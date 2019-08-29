"use strict"

// let monday      = ['måndag', 'mandag', 'maanantai', 'jäsenrannekkeella maanantai'];
// let sunday      = ['söndag', 'søndag', 'sunnuntai'];
// let tuesday     = ['tisdag', 'tirsdag', 'tiistai'];
// let wednesday   = ['onsdag', 'keskiviikko'];
// let thursday    = ['torsdag', 'torstai'];
// let friday      = ['fredag', 'perjantai'];
// let saturday    = ['lördag', 'lørdag', 'lauantai'];

let daysOfWeek = [
    ['måndag', 'mandag', 'maanantai', 'jäsenrannekkeella maanantai'],
    ['tisdag', 'tirsdag', 'tiistai'],
    ['onsdag', 'keskiviikko'],
    ['torsdag', 'torstai'],
    ['fredag', 'perjantai'],
    ['lördag', 'lørdag', 'lauantai'],
    ['söndag', 'søndag', 'sunnuntai']
];

function parseDailyOpeningHours(center) {
    /*
        Parse the opening hourse for each d.o.w (dow = Day Of Week)
        e.g. JSON data for Sweden:
            "OpeningHours": [
                {
                    "Day": "Måndag - torsdag",
                    "Hours": "06:15 - 22:00",
                    "HoursSecond": null
                },
                {
                    "Day": "Fredag",
                    "Hours": "06:15 - 21:00",
                    "HoursSecond": null
                },
                {
                    "Day": "Lördag - söndag",
                    "Hours": "09:00 - 18:00",
                    "HoursSecond": null
                }
            ],
    */

    let dailyOpeningHours = {};

    // We need to use reverse because of the actual structure of the array
    // Otherwise the information we need is overwritten by information such as 'manned opening hours'
    center['OpeningHours'].reverse().forEach((elem) => {
        // In case of a range of days
        // Two separators are used in the JSON file: – or -
        if (/[–-]/.test(elem['Day'])) {
            let [startDay, endDay] = elem['Day'].split(/[–-]/);
            [startDay, endDay] = [_parseDay(startDay), _parseDay(endDay)];
            let [startDow, endDow] = [_getDayOfWeek(startDay), _getDayOfWeek(endDay)];

            for (let dow = startDow; dow <= endDow; dow++) {
                dailyOpeningHours[dow] = _parseHours(elem['Hours']);
            }
        } else {
            let day = _parseDay(elem['Day']);
            let dow = _getDayOfWeek(day);
            if (dow > -1) {
                dailyOpeningHours[dow] = _parseHours(elem['Hours']);
            }
        }
    });

    // let count = Object.keys(dailyOpeningHours).length;
    // if (count !== 7) {
    //     console.log(count);
    //     console.log(center['Id']);
    //     console.log(dailyOpeningHours);
    //     console.log('==========================================');
    // }

    return dailyOpeningHours;
}


function _parseDay(rawDay) {
    // Some days end with '\t' (e.g. 'Tisdag\t')
    // Some days have 'ar' for plural (e.g. 'Tisdagar', which means 'Tuesdays')
    // We'll use the regex '$' to mean 'end of the word' and the 'u' to use Unicode

    return rawDay.toLowerCase().trim().replace(/\t$/u, '').replace(/ar$/u, '');
}

function _getDayOfWeek(day) {
    // We'll lookup the index of the day given in a nordic language in the list of days
    return daysOfWeek.findIndex((arr) => arr.includes(day));
}

function _parseHours(rawHours) {
    // Test if we have a range of house as expected
    if (! /[–-]/.test(rawHours)) return -1;

    let [startHour, endHour] = rawHours.split(/[–-]/);
    [startHour, endHour] = [startHour.trim(), endHour.trim()];

    return [_str2time(startHour), _str2time(endHour)];
}

function _str2time(str) {
    let result = /(\d{1,2}):(\d{1,2})/.exec(str);
    if (result === null) return -1;

    let [hours, minutes] = [parseInt(result[1]), parseInt(result[2])];
    return hours * 60 + minutes;
}

module.exports = {
    parseDailyOpeningHours
};