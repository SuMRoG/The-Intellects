if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config')
const account = require('./models/account');

// initializePassport(
//   passport,
//   email=> account.find( account => account.email === email),
//   id=> account.find( account => account.id === id)
// )

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//connect to database
const dbURI = 'mongodb+srv://blueedge:whatisthis@blogsiiest.xe0ag.mongodb.net/blogiiest?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => app.listen(3000))
  .catch(err => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/add-blog', async (req, res) => {
  res.render('/add-blog')
})

app.post('/login', (req, res) => {
  account.find({
    email: req.body.email
  }).then(async (acc) => {
    if (acc.length) {
      // console.log(acc);
      if (await bcrypt.compare(req.body.password, acc[0].password)) {
        res.redirect("/front")
      } else {
        console.log("Wrong");
        res.redirect("/login")
      }
    } else {
      console.log("No user");
      res.redirect("/login")
    }
  }).catch(err => {
    res.redirect("/login")
  })
})


// initializePassport(
//   passport,
//   email=> account.find({email: req.body.email}).then(acc=> acc.json()).catch(err=> false),
//   id=> account.findById(id).then(acc=> true).catch(err=> false)
// )
// app.post('/login', passport.authenticate('local',{
//   successRedirect: '/front',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
