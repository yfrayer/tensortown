const express = require('express');
const router = require('express').Router();
const User = require('../models/user');
const Token = require('../models/token');
const fs = require('fs');
const mail = require('../utils/mail');
const passport = require('../middleware/passport');
require('dotenv').config();

router.post('/', passport.authenticate('local'), (req, res, next) => {
  if (!req.user) {
    return;
  }
  res.json({success: true, user: req.user});
  next();
});

const isAuthenticated = (req, res, next) => {
  console.log(req.user);
  if (req.user) { return next(); }
  else { return res.json({result: 'no'}); }
}

router.get('/user', isAuthenticated, (req, res) => {
  res.json({result: 'yes'});
});

router.post('/resetPass', (req, res) => {
  var email = req.body.email;
  if (!email) {
    res.json({result: 'no email'});
    return;
  }
  User.findOne({ where: {email: email} }).then((user) => {
    if (!user) { res.json({result: 'no email'}); return; }
    //generate token
    require('crypto').randomBytes(48, (ex, buf) => {
      let token = buf.toString('hex');
      Token.create({
        token: token,
        user_id: user.id,
        date: new Date()
      });
      const url = process.env.BASEURL + 'login/' + token + '?route=resetPassToken';
      const mailSent = sendMail(email, 'Reset Password for Tensor Town', 'Click the following link to change your password for Tensor Town: ' + url);
      if (mailSent) {
        res.json({result: 'mail sent'});
      } else {
        console.log('Token url for ' + email + ': ' + url);
        res.json({result: 'error'});
      }
    });
  });
});

router.post('/resetPassToken', async(req, res) => {
  let token = req.body.token;
  let password = req.body.password;
  if (!token || !password) {
    res.json({result: 'error'}); return;
  }
  const userToken = await Token.findOne({ where: {token: token} });
  if (!userToken) {
    res.json({result: 'token not found'});
    return;
  }
  const user = await User.findOne({ where: {id: userToken.user_id} });
  if (!user) {
    res.json({result: 'token not found'});
    return;
  }
  user.update({ password: password });
  res.json({result: 'reset success'});
  //remove token
});

router.post('/signup', async(req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.json({result: 'error'}); return;
  }
  const userExists = await User.findOne({where: {email: req.body.email}});
  if (userExists) {
    res.json({result: 'email already exists'});
    return;
  }
  const user = User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    regdate: new Date(),
    active: false
  });
  res.json({result: 'create success'});
  require('crypto').randomBytes(48, (ex, buf) => {
    let token = buf.toString('hex');
    Token.create({
      token: token,
      user_id: user.id,
      date: new Date()
    });
    const url = process.env.BASEURL + 'login/' + token + '?route=verifyEmail';
    const mailSent = sendMail(email, 'Verify email for Tensor Town', 'Click the following link to verify your email for Tensor Town: ' + url);
    if (mailSent) {
      res.json({result: 'mail sent'});
    } else {
      console.log('Token url for ' + email + ': ' + url);
      res.json({result: 'error'});
    }
  });
});

router.post('/verifyEmail', async(req, res) => {
  let token = req.body.token;
  if (!token) {
    res.json({result: 'error'}); return;
  }
  const userToken = await Token.findOne({ where: {token: token} });
  if (!userToken) {
    res.json({result: 'token not found'});
    return;
  }
  const user = await User.findOne({ where: {id: userToken.user_id} });
  if (!user) {
    res.json({result: 'token not found'});
    return;
  }
  user.update({ active: true});
  res.json({result: 'verified'});
  //remove token
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/account', function(req, res) {
  if (req.isAuthenticated() ) {
    res.render('account.pug', { email: req.user.email });
  }
  else {
    return res.redirect('/login')
  }
});

router.get('/uploadavi', function(req, res) {
  if (req.isAuthenticated() ) {
    res.render('uploadavi.pug');
  }
  else {
    return res.redirect('/login')
  }
});

router.post('/yaboopay', function(req, res) {
  var passNew = req.body.passNew;
  User.findOne(req.user, function (err, user) {
    if (err) { res.send("User not found"); }
    user.password = passNew;
    user.save(function(err) {
      if (err) throw err;
      res.setHeader('Content-type','text/html');
      res.send("Password successfully changed"
        + "<br><a href='/'>Back to home</a>");
    });
  });
});

router.post('/setEmail', function(req, res) {
  var email = req.body.email;
  if (!email) {
    res.send("Email is invalid");
  }
  else {
    User.findOne({email: email}, function (err, user) {
      if (err) { throw(err); }
      if (user) {
        res.send("email already registered");
        return;
      }
      else {
        require('crypto').randomBytes(48, function(ex, buf) {
          var token = buf.toString('hex');
          User.findOne(req.user, function (err, user) {
            if (err) { throw(err); }
            user.token = token;
            user.tempEmail = email;
            user.save(function(err) {
              if (err) throw err;
            });
            let url = 'https://tensortown.com/verify/' + user.token;
            mail(user.tempEmail, 'Confirm Your Email Address for Tensor Town', 'Click the following link to verify your email for Tensor Town: ' + url);
            console.log(user);
            res.send("Email confirmation sent to " + email);
          });
        });
      }
    });
  }
});

router.post('/setPass', function(req, res) {
  var passCurrent = req.body.passCurrent;
  var passNew = req.body.passNew;
  if (passCurrent == passNew) {
    res.send("New password must be different than current password");
    return;
  }
  else {
    User.findOne(req.user, function (err, user) {
      if (err) { res.send("User not found"); }
      user.comparePassword(passCurrent, function(err, match) {
        if (err) throw err;
        if (match) {
          user.password = passNew;
          user.save(function(err) {
            if (err) throw err;
          });
          res.send("Password successfully changed");
        }
        else {
          res.send("Current password field is incorrect");
        }
      });
    });
  }
});

module.exports = router;
