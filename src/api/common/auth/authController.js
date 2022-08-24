
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');
var notification_function = require('./../../../utils/function');
var mongoose = require('mongoose');
var userSchema = require('./../../../app/models/user');
var userModel = mongoose.model('User');
let moment = require('moment')


const AuthService = require('./authService');

const authService = new AuthService();

router.post('/login', (req, res) => {
  console.log("/login---",req.body)
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).send({
        error: err ? err.message : 'Login or password is wrong',
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      else{
          userModel.updateOne({email: req.body.email}, {
          lastLoginDate: moment().utcOffset("+05:30").format('YYYY-MM-DD'),
          lastLoginTime: moment().utcOffset("+05:30").format('hh:mm:ss')
        })
        .then( data => console.log(data))
        .catch( err => console.log(`\n\n Error ${err}`))

      }
      const token = jwt.sign(user, config.get('auth.jwt.secret'));
      console.log("token",token)
      res.send({ user, token });
    });
    
  })(req, res);
});

router.post('/sign-up', (req, res) => {
  authService
    .register(req.body)
    .then(() =>{
      var action = "Registeration";
      var notification_data = req.body.firstName+" "+req.body.lastName+" has registered with email id "+req.body.email;
      userModel.find ({
            "role" : 'admin'
      }).then(function(users){
          users.forEach(function(user){
            notification_function.notification(action,notification_data,user._id,'pages/userList','')
          })
      });
      res.send({ message: 'ok' })
    }).catch(err => res.status(400).send({ error: err.message }));
});

router.post('/reset-pass', (req, res) => {
  const { password, confirmPassword, reset_password_token: resetPasswordToken } = req.body;
  authService
    .resetPassword(password, confirmPassword, resetPasswordToken)
    .then(() => res.send({ message: 'ok' }))
    .catch(err => res.status(400).send({ error: err.message }));
});

router.post('/request-pass', (req, res) => {
  const { email } = req.body;
  authService
    .requestPassword(email)
    .then(() => res.send({ message: `Email with reset password instructions was sent to email ${email}.` }));
});

router.post('/sign-out', (req, res) => {
  res.send({ message: 'ok' });
});

// router.post('/refresh-token', (req, res) => {
//
// });

module.exports = router;
