"use strict"

let fs      = require('fs');
let https   = require('https'); // To avoid adding dependencies, we'll use the built-in 'https' module


function fetchData(url, geojsonPath) {
    https.get(
        url,
        (res) => {
            let jsonRaw = '';

            // Append new chunks when they are received
            res.on('data', (chunk) => { jsonRaw += chunk; });

            // Once the whole resonse has been received
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        let jsonData = JSON.parse(jsonRaw);
                        _updateGeojson(jsonData, geojsonPath);
                    } catch(e) {
                        console.log('Error parsing JSON: ', e);
                    }
                } else {
                    console.log('Status: ', res.statusCode);
                }
            });
        }
    ).on('error', (err) => {
        console.log('Error: ', err);
    })
}


function _updateGeojson(jsonData, geojsonPath) {
    let geojson = {
        "type": "FeatureCollection",
        "features": []
    };

    jsonData['Regions'].forEach(region => {
        region['Centers'].forEach(center => {

            let description = "<p>";

            // Setup the center name (if available)
            let name = `${(center["Name"]) ? `<strong>${center['Name']}</strong></br>` : ""}`;
            let location = "<strong>Location: </strong>"
                + center['Address'] + ", "
                + center['City'] + ', '
                + center['Zipcode'] + '.';

            // Create a table for opening hours
            let openingHoursTable = "";
            if (center['OpeningHours'].length !== 0) {
                openingHoursTable = `<table>
                    <tr>
                        <th colspan="2">Opening Hours</th>
                    </tr>
                    ${center['OpeningHours'].map(entry => `<tr><td>${entry['Day']}</td><td>${entry['Hours']}</td></tr>`).join(" ")}
                    ${(center['OpeningHoursOther'].length === 0) ? "" : `
                    <tr>
                        <th colspan="2">Special</th>
                    </tr>
                    ${center['OpeningHoursOther'].map(entry => `<tr><td>${entry['Day']}</td><td>${entry['Hours']}</td></tr>`).join(" ")}`}
                </table>`;
            }

            description += name + location + openingHoursTable;
            description += "</p>";


            let feature = {
                "type": "Feature",
                "properties": {
                    // "title": "TITLE???",
                    "id": center['Id'],
                    "description": description,
                    "icon": "volcano"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        center['Position']['Longitude'],
                        center['Position']['Latitude']
                    ]
                }
            }

            geojson['features'].push(feature);
        });
    });

    // Save the GeoJSON object to file
    let geojsonString = JSON.stringify(geojson, null, 4);   // Convert to string, with human-readable format
    fs.writeFile(geojsonPath, geojsonString, (err) => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            console.log('File "' + geojsonPath + '" successfully written');
        }
    });
}


function groupGeojson(geojsonFilesList) {
    let data = {
        "type": "FeatureCollection",
        "features": []
    };

    geojsonFilesList.forEach(elem => {
        let geojson = require(elem);
        data['features'] = data['features'].concat(geojson['features']);
    })

    return data;
}


module.exports = {
    fetchData,
    groupGeojson,
};