const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const argon = require('argon2-ffi').argon2i;
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findOne({ where: id }).then((user) => {
    done(null, user);
  });
});

//login local
passport.use(new LocalStrategy({
  usernameField:'email',
  passReqToCallback: true 
}, (req, email, password, done) => {
  //email = sanitize(email);
  if (!email || !password) {
    return done(null, false, { message:
      'Missing credentials'
    });
  }
  User.findOne({ where: {email: email} }).then((user) => {
    if (!user) { return done(null, false); }
    //email matches
    if (user) {
      if (user.password.includes("argon")) {
        argon.verify(user.password, password).then(match => {
          if (err) { return done(null, false); }
          if (match) {
            req.session.passport.user.username = user.username;
            return done(null, user);
          }
          else {
            return done(null, false, { message:
              'Incorrect password'
            });
          }
        }).catch(error => { return done(null, false); });
      }
      else {
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) { return done(null, false); }
          if (match) {
            return done(null, user);
          }
          else {
            return done(null, false, { message:
              'Incorrect password'
            });
          }
        });
      }
    } 
    //email doesn't exist
    else {
      return done(null, false, { message:
        'Email not found'
      });
    }
  });
}));

module.exports = passport;
