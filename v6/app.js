var Campground = require('./models/campground');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local');
var Comment = require('./models/comment');
var bodyParser = require('body-parser');
var User = require('./models/user');
var mongoose = require('mongoose');
var passport = require('passport');
var express = require('express');
var seedDB = require('./seeds');
var app = express();

mongoose.connect('mongodb://localhost/yelp_camp_v3', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

seedDB();

// PASSPORT CONFIG
app.use(expressSession({
  secret: 'Moose is a dog!!',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =========================================
// ROUTES
// =========================================
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
      res.render('campgrounds/index', { campgrounds: allCampgrounds, currentUser: req.user });
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
  res.render('campgrounds/new');
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
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
});

// =========================================
// COMMENTS ROUTES
// =========================================

app.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
  // Find campground by id
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { campground: campground });
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
  // Lookup campground using ID
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });

  // Create new comments
  // Connect new comment to campgrounds
  // Redirect to campground show page
});

// =========================================
// AUTH ROUTES
// =========================================

// Show register form
app.get('/register', function (req, res) {
  res.render('register');
});

// Handle sign up logic
app.post('/register', function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/campgrounds');
    });
  });
});

// Show login form
app.get('/login', function (req, res) {
  res.render('login');
});

// Handling login logic
app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}), function (req, res) {});

// Logout route
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/campgrounds');
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

// =========================================
// SERVER CONFIG
// =========================================

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
