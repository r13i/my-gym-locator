"use strict";

const express       = require('express');
const bodyParser    = require('body-parser');
const favicon       = require('serve-favicon');
const path          = require('path');
const config        = require('./config/default.json');

const HOST = config["host"];
const PORT = process.env.PORT || config["port"];

// App
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'static', 'images', 'favicon', config['favicon'])));


app.get('/hello', (req, res) => res.send("Hello World!"));
// app.post('/', (req, res) => {
//     res.render('index')
//     req.body. // Name of POST json key
// });
app.get('/', (req, res) => {
    res.render('index');
});


app.listen(PORT, HOST, () => console.log(`[my-gym-locator] Server listening on PORT ${PORT}!`));
