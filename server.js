"use strict";

const express       = require('express');
const bodyParser    = require('body-parser');
const favicon       = require('serve-favicon');
const path          = require('path');
const helpers       = require('./js/helpers.js');
const config        = require('./config/default.json');

const HOST = config["host"];
const PORT = process.env.PORT || config["port"];
const MAPBOX_API_KEY = config["mapbox_api_key"];
// const MARKER_ICON = config["marker_icons"]["dumbell_circle"];

// App
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon', config['favicon'])));
app.locals.mapbox_api_key = JSON.stringify(MAPBOX_API_KEY);
// app.locals.marker_icon = MARKER_ICON;

helpers.fetchData(config['gym_centers']['sweden'], './static/data/sweden.geojson');

app.get('/hello', (req, res) => res.send("Hello World!"));
// app.post('/', (req, res) => {
//     res.render('index')
//     req.body. // Name of POST json key
// });
app.get('/', (req, res) => {
    res.render('index', {
        // Any json data
    });
});


app.listen(PORT, HOST, () => console.log(`[my-gym-locator] Server listening on PORT ${PORT}!`));
