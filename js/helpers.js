"use strict"

let fs          = require('fs');
let https       = require('https'); // To avoid adding dependencies, we'll use the built-in 'https' module
let timeParse   = require('./timeParse.js');

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
                        _createGeojson(jsonData, geojsonPath, url);
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


function _createGeojson(jsonData, geojsonPath, url) {
    let geojson = {
        "type": "FeatureCollection",
        "features": []
    };

    jsonData['Regions'].forEach(region => {
        region['Centers'].forEach(center => {

            
            // Setup the center name (if available)
            let name = `${(center["Name"]) ? `<h3>${center['Name']}</h3>` : ""}`;
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
            
            let description = "";
            description += name + "<p>" + location + openingHoursTable + "</p>";
            description += "</p>";

            let link = (typeof url !== "undefined")? _parseHostname(url) + center['Url'] : "";

            let dailyOpeningHours = timeParse.parseDailyOpeningHours(center);

            let feature = {
                "type": "Feature",
                "properties": {
                    // "title": "TITLE???",
                    "id": center['Id'],
                    "title": center["Name"],
                    "description": description,
                    "url": link,
                    "openingHourse": dailyOpeningHours,
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


function _parseHostname(url) {
    let hostname;

    // Trim what comes after the colon of the port number (if any)
    let protocolPos = url.indexOf('//');
    protocolPos = (protocolPos > -1) ? protocolPos : 0;

    let colonPos = url.indexOf(':', protocolPos);
    colonPos = (colonPos > -1) ? colonPos : url.length;

    url = url.substring(0, colonPos);

    // Extract the hostname
    let arr = url.split('/');

    // Verify if protocol name exists
    if (url.indexOf("//") > -1) {
        hostname = arr[0] + '\/\/' + arr[2];
    } else {
        hostname = arr[0];
    }
    
    return hostname;
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