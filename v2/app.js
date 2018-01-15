var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Schema Setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

var Campground = mongoose.model('Campground', campgroundSchema);

Campground.create(
  {
    name: 'Granite Hill',
    image: 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg',
    description: 'This is a huge granite hill, no bathrooms. No Water. Beautiful Granite',
  }, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      console.log('new created campground:');
      console.log(campground);
    }
  });

app.get('/', function (req, res) {
  res.render('landing');
});

// INDEX - Show all campgrounds
app.get('/campgrounds', function (req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds', { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - Add new campground to DB
app.post('/campgrounds', function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = { name: name, image: image };

  // Create a new campground and save to DB
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      // (defaults to get /campgrounds route)
      res.redirect('/campgrounds');
    }
  });

});

// NEW - Show form to create new campground
app.get('/campgrounds/new', function (req, res) {
  res.render('new');
});

app.get('/campgrounds/:id', function (req, res) {
  // find the campground with provided ID
  // render show template with that campground
  res.send('This will be the show page one day');
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
