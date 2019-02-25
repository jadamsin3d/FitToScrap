const db = require('../models');

module.exports = (app) => {
    app.get("/api/articles", (req, res) => {
       db.Article.find({}).then(dbArticle => res.json(dbArticle)).catch(err => res.json(err))
    });

    
}