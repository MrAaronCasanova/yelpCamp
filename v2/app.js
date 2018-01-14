var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var campgrounds = [
  { name: 'Salmon Creek', image: 'https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg' },
  { name: 'Granite Hill', image: 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg' },
  { name: 'Mountain Goat\'s Rest', image: 'https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg' },
];

app.get('/', function (req, res) {
  res.render('landing');
});

app.get('/campgrounds', function (req, res) {
  res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image };
  campgrounds.push(newCampground);

  // redirect back to campgrounds page
  // (defaults to get /campgrounds route)
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function (req, res) {
  res.render('new');
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
