if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var callbackURL = process.env.callbackURL

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
    useUnifiedTopology: true,
    useFindAndModify: false
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
    if(profile.emails[0].value.includes("@students.iiests.ac.in")){
      profile.displayName = profile.displayName.split(" ")[1].replace("_"," ")
    }

    Account.findOrCreate({
        googleId: profile.id,
        name: profile.displayName,
        image: profile.photos[0].value,
        email: profile.emails[0].value,
        username: profile.emails[0].value
      },
      function(err, user) {
        if (err) {
          // console.log("Login error", err, user);
          if (err.code == 11000 && err.keyPattern.email) {
            Account.find({
              email: profile.emails[0].value
            }).then(acc=>{
              return cb(null, acc[0])
            }).catch(err=>{
              return cb(err, {})
            })
          }
          else if (err.code == 11000 && err.keyPattern.username) {
            // console.log("Shit");
            return cb(err, {})
          }
          else{
            return cb(null, user);
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error',{
    title: "Error"
  });
});

module.exports = app;
