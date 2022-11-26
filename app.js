//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { response } = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/WikiDB" , {useNewUrlParser: true});
const articlesSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articlesSchema);

// Routes (CRUD) 
// Request Targeting all articles
// Post - Create // Get - Read // Put - Update // Delete - Delete
app.route("/articles")

.get(function (req, res) {
    Article.find(function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function (req, res) {
    console.log();

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function (err) {
        if (!err) {
            res.send("Successfully added the new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Successfully deleted all articles!");
        } else {
            res.send(err);
        }
    })
});

// Request Targeting a specific article
// Post - Create // Get - Read // Put - Update // Delete - Delete
app.route("/articles/:articleTitle")

.get(function(req,res){
    
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if(foundArticle){
            res.send(foundArticle)
        } else {
            res.send("No articles matching with that title was found")
        }
    })
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.articleTitle , content: req.body.content},
        {overwrite: true},
        function(err){
            if (!err){
                res.send("Successfully updated article.");
            }
        }
    );
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (!err){
                res.send("Successfully updated article.")
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function (err) {
            if (!err) {
                res.send("Successfully deleted article.")
            } else {
                res.send(err);
            }
        }
    );
});

// Server Running
app.listen(3000, function () {
    console.log("Server started on port 3000");
});