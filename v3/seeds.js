var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
  {
    name: 'Clouds Rest',
    image: 'https://images.pexels.com/photos/795722/pexels-photo-795722.jpeg?h=350&auto=compress&cs=tinysrgb',
    description: 'blah blah blah',
  },
  {
    name: 'Island Reserve',
    image: 'https://images.pexels.com/photos/787619/pexels-photo-787619.jpeg?h=350&auto=compress&cs=tinysrgb',
    description: 'blah blah blah',
  },
  {
    name: 'Winter Wonder',
    image: 'https://images.pexels.com/photos/15382/pexels-photo.jpg?h=350&auto=compress&cs=tinysrgb',
    description: 'blah blah blah',
  },
];

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Removed campgrounds!');

      // Add a few new campgrounds
      data.forEach(function (seed) {
        Campground.create(seed, function (err, campground) {
          if (err) {
            console.log(err);
          } else {
            console.log('Added a campgroud');

            // Create a comment
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet!',
                author: 'Casy',
              }, function (err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log('Created new comment');
                }
              });
          }
        });
      });
    }
  });

  // Add a few comments
}

module.exports = seedDB;
