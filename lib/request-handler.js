var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  new Link.find({}, function(models){
    res.send(200, models);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({url: uri}, function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.generateCode();

        link.save(function(err){
          if (err) {
            console.log(err);
            throw err;
          }
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  console.log(username);

  // Maybe extra param to init????
  User.find({ username: username }, function(err, user){
    console.log(user);
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, user) {
    /// WOOOOOOt
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });

        console.log("NEW USER   1 ", newUser);

        newUser.hashPassword(function() {
          newUser.save(function() {
            util.createSession(req, res, newUser);
            console.log("NEW USER   2 ", newUser);
          });  
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    })
};

exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }, function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err){
        if (err) {
          console.log(err);
          throw err;
        }
      });


      // set({ visits: link.get('visits') + 1 })
      //   .save()
      //   .then(function() {
      //     return res.redirect(link.get('url'));
      //   });
    }
  });
};