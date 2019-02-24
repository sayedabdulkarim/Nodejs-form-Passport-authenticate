const LocalStratergy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//user model
const User =  require('../models/User')

module.exports = function(passport) {
  passport.use(
    new LocalStratergy({usernameField: 'email'}, (email, password, done) => {
      //match User
      User.findOne({email})
        .then(user => {
          if(!user){
            return done(null, false, {messageg: 'That email is not registered.'})
          }
          //match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err){
              console.log(err)
            }
            if(isMatch){
              return done(null, user)
            }
            else{
              return done(null, false, {message: 'Password is incorrect.'})
            }
          })
        })
        .catch(err => console.log(err))
    })
  )
  passport.serializeUser((user, done) =>  {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}


