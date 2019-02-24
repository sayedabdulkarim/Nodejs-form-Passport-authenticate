const express = require('express')
const app = express()

//passport
const passport = (require('passport'))
require('./config/passport')(passport)

//bodyparser
app.use(express.urlencoded({ extended: false}))

//flash message
const flash = require('connect-flash')
const session = require('express-session')

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//GLOBAL VAR for flash message
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next()
})

//mongodb
const mongoose = require('mongoose')
const db = require('./config/keys').MongoUrl

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('mongodb connected'))
  .catch(err => console.log(err))

//express layout
const expressLayouts = require('express-ejs-layouts') //by using this we can pass all our file <%-body%> in layout.ejs
app.use(expressLayouts)

//ejs
app.set('view engine', 'ejs')


//routes
const routes =  require('./routes/index')
const users =  require('./routes/users')
app.use(routes)
app.use('/users/',users)

const PORT = process.env.PORT || 4747

app.listen(PORT)
