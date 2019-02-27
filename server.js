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
app.use(express.urlencoded({ extended: true }));
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

app.get('/', (req, res) => {
    axios.get('https://old.reddit.com/r/ProgrammerHumor/').then(response => {
        const $ = cheerio.load(response.data);
        $('p.title').each((i, element) => {
            let result = {};

            result.title = $(element).text();
            result.link = $(element).children().attr("href");

            db.Article.create(result)
                .then(dbArticle => console.log(dbArticle))
                // .catch(err => console.log(err))
        })
        res.render('index');
    })   
})

app.get('/redditposts', (req, res) => {
    db.Article.find({})
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});

app.get('/redditposts/:id', (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate('note')
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});

app.post('/redditposts/:id', (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => 
            db.Article.findOneAndUpdate({ _id: req.params.id}, {note: dbNote._id }, { new: true}))
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
})

// Starting Express
app.listen(PORT, () => console.log('App is running on port ', PORT, '.'));