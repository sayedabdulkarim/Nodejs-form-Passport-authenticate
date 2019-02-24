const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

//welcome page
router.get('/', (req,res) => {
  res.render('welcome')
})

//dasboard
router.get('/dashboard',ensureAuthenticated, (req,res) => {
  res.render('dashboard', {user: req.user.name})
  console.log(req.user.name)
})

//logout btn route 
router.get('/logout', (req,res) => {
  req.logout()
  req.flash('success_msg', 'You r logged out')
  res.redirect('/users/login')
})

module.exports = router