var legalityCheck = require('pokemon-legality-checker');
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
  if (!req.files) { /* if no files sent */
    res.sendStatus(400).send('No files were uploaded.');
  }

  var files = req.files["files[]"];
  var jsonResponse = {"status": "success"};
  var pokemon = {};
  var legality = {};
  // console.log(files);

  if (files instanceof Array) { // if files is an Array (multiple files uploaded)
    for (var i=0; i<files.length; i++) {
      var gen = parseInt(files[i].name.slice(-1));
      var parsed = pkparse.parseBuffer(files[i].data, {parseNames: true, gen: gen});
      pokemon[files[i].name] = parsed;
    }
  }
  else {  // single file
    var gen = parseInt(files.name.slice(-1));
    var parsed = pkparse.parseBuffer(files.data, {parseNames: true, gen: gen});
    pokemon[files.name] = parsed;
  }

  /* check parsed pokemon */
  for (var key in pokemon) {
    // console.log("Checking legality of", entry);
    var entry = pokemon[key];
    // console.log(entry);
    legality[key] = legalityCheck(entry);
  }

  jsonResponse.legality = legality; // add to response
  jsonResponse.parsed = pokemon;

  res.json(jsonResponse)
})

app.listen(3000, function(req, res){
    console.log('Listening at port 3000');
})
