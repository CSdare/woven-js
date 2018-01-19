const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const woven = require('../index');

app.use(bodyParser.json());
// how can we incorporate bodyParser into our woven.optimize middleware?

woven.configure(__dirname + '/woven_functions/testFunctions.js', { alwaysServer: true });

app.use(woven.optimize);

app.use(express.static(path.join(__dirname, '/dist/')));

app.listen(3000);