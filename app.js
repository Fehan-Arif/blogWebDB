//jshint esversion:6
// 
// Required Packages
// 
const express = require("express"),
      bodyParser = require("body-parser"),
      ejs = require("ejs"),
      _ = require("lodash"),
      mongoose = require("mongoose");
// 
// Mongoose Connect
// 
mongoose.connect("mongodb://localhost:27017/webDevBlogDB", { useNewUrlParser: true });
// 
// Generic Initial Data
// 

const homeStartingContent = "Just a basic web application on using Node.js delivering content via MongoDB.";
const aboutContent = "Hi, I am Fehan Arif. A web Developer. I love making apps such as these for fun. Feel free to contact me about them.";
const contactContent = "You can contact me by sending me a message below!";
// 
// Initialize express
//

const app = express();
// 
// View Settings
//

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// 
// Mongoose Schema
//

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
// 
// Mongoose model
//

const Post = mongoose.model("Post", postSchema);
// 
// Home Route
//

app.route("/")
.get(function(req, res){
  Post.find({}, function(err, posts){
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    } else {
      console.log("Somethings wrong in the home route!")
    }
  })
});
// 
// About Route
//
app.route("/about")
.get(function(req, res){
  res.render("about", {aboutContent: aboutContent});
});
// 
// Contact Route
//

app.route("/contact")
.get(function(req, res){
  res.render("contact", {contactContent: contactContent});
});
// 
// Compose Route
//
app.route("/compose")
.get(function(req, res){
  res.render("compose");
})
.post(function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err) {
      res.redirect("/");
    }
  });
});
// 
// Posts Route
//

app.route("/posts/:postId")
.get(function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    if (!err) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  })
});
// 
// Listen Port
//

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
