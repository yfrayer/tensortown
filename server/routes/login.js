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
  res.json({success: true, id: req.user.id, username: req.user.username});
  next();
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
      const url = process.env.BASEURL + '/token/resetPass?token=' + token;
      mail(email, 'Reset Password for Tensor Town', 'Click the following link to change your password for Tensor Town: ' + url, (err, info) => {
        if (err) {
          res.json({result: 'error'});
        } else {
          res.json({result: 'mail sent'});
        }
      });
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
  res.json({result: 'success'});
  const destroyed = await Token.destroy({ where: {token: token} });
});

router.post('/signup', async(req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.json({success: false}); return;
  }
  const userExists = await User.findOne({where: {email: req.body.email}});
  if (userExists) {
    res.json({success: false, result: 'email already exists'});
    return;
  }
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    regdate: new Date(),
    active: false
  }).then((user) => {
    require('crypto').randomBytes(48, (ex, buf) => {
      let token = buf.toString('hex');
      Token.create({
        token: token,
        user_id: user.id,
        date: new Date()
      });
      const url = process.env.BASEURL + '/token/verifyEmail?token=' + token;
      mail(user.email, 'Verify email for Tensor Town', 'Click the following link to verify your email for Tensor Town: ' + url, (err, info) => {
        console.log('Token url for ' + user.email + ': ' + url);
        if (err) {
          console.log(err);
        } else {
          console.log('sent email');
        }
      });
    });
    const text = '\nnew signup: ' + user.id;
    console.log(text);
    fs.appendFile('log.txt', text, (err) => {
      if (err) console.log(err);
    });
    req.login(user, (err) => {
      res.json({success: true});
    });
  });
});

router.post('/verifyEmail', async(req, res) => {
  let token = req.body.token;
  if (!token) {
    res.json({success: false}); return;
  }
  const userToken = await Token.findOne({ where: {token: token} });
  if (!userToken) {
    res.json({success: false}); return;
  }
  const user = await User.findOne({ where: {id: userToken.user_id} });
  if (!user) {
    res.json({success: false}); return;
    return;
  }
  user.update({active: true});
  res.json({success: true});
  const destroyed = await Token.destroy({ where: {token: token} });
});

router.get('/logout', function(req, res){
  req.logout((err) => {
    if (err) { res.json({logout: 'error'}); }
    else { res.json({logout: 'success'}); }
  });
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
