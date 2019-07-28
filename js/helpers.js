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
            let feature = {
                "type": "Feature",
                "properties": {
                    "title": "TITLE???",    //////////////////////////////////////////////////////////
                    "description": "<strong>Make it Mount Pleasant</strong><p><a href=\"http://www.mtpleasantdc.com/makeitmtpleasant\" target=\"_blank\" title=\"Opens in a new window\">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
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


module.exports = {
    fetchData,
}