var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp_v3', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

seedDB();

// ROUTES
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
      res.render('index', { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - Add new campground to DB
app.post('/campgrounds', function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc, };

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

// SHOW - shows more info about one campground
app.get('/campgrounds/:id', function (req, res) {
  // find the campground with provided ID
  Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);

      // render show template with that campground
      res.render('show', { campground: foundCampground });
    }
  });
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
