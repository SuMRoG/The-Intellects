var callbackURL = "https://theintellects.herokuapp.com/auth/google/front"

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  callbackURL = "http://localhost:3000/auth/google/front"
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
const Account = require('./models/account');
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

var PORT = process.env.PORT || 3000;

//connect to database
const dbURI = process.env.dbconnect;
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => {
    app.listen(PORT)
  })
  .catch(err => console.log(err))

app.use(flash())
app.use(session({
  secret: "thecakeisalie",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// mongoose.set('useCreateIndex', true)
// mongoose.connect(config.dbUri, { useNewUrlParser: true })

passport.use(Account.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Account.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: callbackURL,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    Account.findOrCreate({
        googleId: profile.id,
        name: profile.displayName,
        image: profile.photos[0].value,
        email: profile.emails[0].value,
        username: profile.displayName
      },
      function(err, user) {
        if (err) {
          if (err.code == 11000 && err.keyPattern.email) {
            Account.find({
              email: profile.emails[0].value
            }).then(acc=>{
              if(acc.length){
                return cb(null, acc[0])
              }
            }).catch(err=>{
              return cb(err, {})
            })
          }
        } else {
          return cb(null, user);
        }
      })
  }
));

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
app.use('/user', usersRouter);

app.get('/add-blog', async (req, res) => {
  res.render('/add-blog')
})

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
