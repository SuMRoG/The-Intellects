if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const Book = require('../models/book');
// const Account = require('../models/account');
const router = express.Router();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('../passport-config')
const account = require('../models/account');

router.use(flash())
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('start', {
    title: 'Get started',
  });
});

router.get('/front', (req, res) => {
  Blog.find()
    .then((posts) => {
      res.render('front', {
        title: 'Blogs',
        posts: posts,
      })
    })
    .catch((err) => {
      console.log(err);
    })
})

router.get('/addbook', function(req, res, next) {
  res.render('addbook', {
    title: 'Add book',
  });
});

router.post("/addbook", (req, res) => {
  console.log(req.body);
  const book = new Book(req.body)
  book.save()
    .then(result => res.redirect("/library"))
    .catch(err => console.log(err))
})

router.post("/add", (req, res) => {
  const blog = new Blog(req.body)
  blog.save()
    .then(result => res.redirect("/front"))
    .catch(err => console.log(err))
})

router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(res => {
      console.log(res);
      res.redirect('/front')
    })
    .catch(err => res.redirect("/front"))
})

router.get('/login',function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});


router.post('/login', (req, res) => {
  initializePassport(
    passport,
    email=> account.find({
      email: req.body.email
    }).then(acc=> acc.json()).catch(err=> false),
    id=> account.findById(id).then(acc=> true).catch(err=> false)
  )
  // account.find({
  //   email: req.body.email
  // }).then(async (acc) => {
  //   if (acc.length) {
  //     // console.log(acc);
  //     if (await bcrypt.compare(req.body.password, acc[0].password)) {
  //       res.redirect("/front")
  //     } else {
  //       console.log("Wrong");
  //       res.redirect("/login")
  //     }
  //   } else {
  //     console.log("No user");
  //     res.redirect("/login")
  //   }
  // }).catch(err => {
  //   res.redirect("/login")
  // })
})

router.post('/login', passport.authenticate('local',{
  successRedirect: '/front',
  failureRedirect: '/login',
  // failureFlash: true
}))

router.get('/register',function(req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let account = new Account({
      // id: date.now().toString(),
      name: req.body.name,
      username: req.body.username,
      gender: req.body.gender,
      email: req.body.email,
      password: hashedPassword
    });
    account = await account.save()
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})


router.get('/add', function(req, res, next) {
  res.render('body1', {
    title: 'Add Blog',
  });
});

router.get('/terms', function(req, res, next) {
  res.render('terms', {
    title: 'Terms',
  });
});

router.get('/team', function(req, res, next) {
  res.render('team', {
    title: 'Our Team',
  });
});

router.get('/library', function(req, res, next) {
  Book.find()
    .then((books) => {
      res.render('library', {
        title: 'Library',
        books: books
      });
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/proto', function(req, res, next) {
  res.render('prototype', {
    title: 'Prototypes'
  });
});

// function checkAuthenticated(req,res,next){
//   if(req.isAuthenticated()){
//     return next()
//   }
//   res.redirect('/login')
// }
//
// function checkNotAuthenticated(req,res,next){
//   if(req.isAuthenticated()){
//     res.redirect('/front')
//   }
//   next()
// }

module.exports = router;
