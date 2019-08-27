"use strict"

// let sunday      = ['söndag', 'søndag', 'sunnuntai'];
// let monday      = ['måndag', 'mandag', 'maanantai'];
// let tuesday     = ['tisdag', 'tirsdag', 'tiistai'];
// let wednesday   = ['onsdag', 'keskiviikko'];
// let thursday    = ['torsdag', 'torstai'];
// let friday      = ['fredag', 'perjantai'];
// let saturday    = ['lördag', 'lørdag', 'lauantai'];

let daysOfWeek = [
    ['måndag', 'mandag', 'maanantai'],
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

    let count = 0;

    center['OpeningHours'].forEach((elem) => {
        // In case of a range of days
        // Two separators are used in the JSON file: – or -
        if (/[–-]/.test(elem['Day'])) {
            let [startDay, endDay] = elem['Day'].split(/[–-]/);
            [startDay, endDay] = [_parseDay(startDay), _parseDay(endDay)];
            let [startDow, endDow] = [_getDayOfWeek(startDay), _getDayOfWeek(endDay)];

            for (let dow = startDow; dow <= endDow; dow++) {
                dailyOpeningHours[dow] = elem['Hours'];
                count++;
            }
        } else {
            let day = _parseDay(elem['Day']);
            let dow = _getDayOfWeek(day);
            dailyOpeningHours[dow] = elem['Hours'];
            count++;
        }
    });

    if (count !== 7) {
        console.log(center['Id'], JSON.stringify(center['OpeningHours'], null, 4));
        console.log('==============================');
    }

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

module.exports = {
    parseDailyOpeningHours
};