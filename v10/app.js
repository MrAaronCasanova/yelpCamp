var Campground = require('./models/campground');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var LocalStrategy = require('passport-local');
var Comment = require('./models/comment');
var bodyParser = require('body-parser');
var User = require('./models/user');
var mongoose = require('mongoose');
var passport = require('passport');
var express = require('express');
var seedDB = require('./seeds');
var app = express();

// Requiring Routes
var campgroundRoutes = require('./routes/campgrounds');
var commentRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/yelp_camp_v3', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
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

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/', indexRoutes);

// =========================================
// SERVER CONFIG
// =========================================

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
