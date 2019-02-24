const express = require('express')
const router = express.Router();

const bcrypt =  require('bcryptjs')

const User = require('../models/User')

const passport = require('passport')

//login page
router.get('/login', (req,res) => {
  res.render('login')
})

//register page
router.get('/register', (req,res) => {
  res.render('register')
})

router.post('/register', (req,res) => {
  const { name, email, password, password2} = req.body
  let errors = []

  //validation

  //required
  if(!name || !email || !password || !password2){
    errors.push({ msg: 'All fields are required.'})
  }
  //check password match
  if(password !== password2){
    errors.push({ msg: 'Password do not match'})
  }
  //check password 6 characters
  if(password.length < 6){
    errors.push({ msg: 'Password must be atleast 6 characters.'})
  }
  if(errors.length > 0) {
    res.render('register', {errors, name, email, password, password2})
  }
  else{
    //validation passed and add to db
    User.findOne({email})
      .then(user => {
        if(user){
          errors.push({ msg: 'Email already exist'})
          res.render('register', {errors, name, email, password, password2})
        } else{
          const newUser = new User({ name, email, password})
          // console.log(newUser)
          //hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err){
                console.log(err)
              }
              else{
                //set password to hash
                newUser.password = hash
                newUser.save()
                  .then(req.flash('success_msg', 'You r now registered nd can log in'),res.redirect('/users/login'))
                  .catch(err => console.log(err))
              }
            })
          })
          // res.send('hello world')
        }
      })
  }
  console.log(errors)
})

//logon handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})



module.exports = router