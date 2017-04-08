var checker = require('pokemon-legality-checker');
// var pk6Parse = require('pk6parse');
var pkparse = require('pkparse');
var express = require('express');
var app = express();

app.use(express.static('public'));
app.set('view engine','ejs');

// Create route for the root
app.get('/', function(req, res){
   res.render("index", {
       pageId:'home'
   })
})

app.post('/upload', function(req, res) {
  console.log(req.files);
  res.send(200);
})

app.listen(3000, function(req, res){
    console.log('Listening at port 3000');
})
