var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// var Comment = require('../models/comment');

// INDEX - Show all campgrounds
router.get('/', function (req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds });
    }
  });
});

// CREATE - Add new campground to DB
router.post('/', function (req, res) {
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
router.get('/new', function (req, res) {
  res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
  // find the campground with provided ID
  Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {

      // render show template with that campground
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});

// =========================================
// Middleware - Must be logged in to access
// =========================================

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

module.exports = router;
