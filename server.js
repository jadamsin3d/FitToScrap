const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const axios = require('axios');
const cheerio = require('cheerio');

//initialize express
const app = express();

//requiring the models
const db = require('./models')
const PORT = process.env.PORT || 3000

//middleware
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//establishing the public folder for handlebars
app.use(express.static('public'));

// setting up handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// connecting to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines'
mongoose.connect(MONGODB_URI)

// Routes
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);

// Starting Express
app.listen(PORT, () => console.log('App is running on port ', PORT, '.'));
