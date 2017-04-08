var checker = require('pokemon-legality-checker');
// const pk6Parse = require('pk6parse');
var pkparse = require('pkparse');
var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

app.use(express.static('public'));
app.use(fileUpload());
app.set('view engine','ejs');

// Create route for the root
app.get('/', function(req, res){
   res.render("index", {
       pageId:'home'
   })
})

app.post('/upload', function(req, res) {
  if (!req.files) {
    res.sendStatus(400).send('No files were uploaded.');
  }
  console.log(req.files);
  res.sendStatus(200);
})

app.listen(3000, function(req, res){
    console.log('Listening at port 3000');
})
