const express = require('express');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const Book = require('../models/book');
const router = express.Router();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('../passport-config')
const account = require('../models/account');
const { authUser,notauthUser }= require('../basicAuth')

router.use(flash())
router.use(session({
  secret: "thecakeisalie",
  // secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}))
router.use(passport.initialize())
router.use(passport.session())

/* GET home page. */
router.get('/',notauthUser, function(req, res, next) {
  res.render('start', {
    title: 'Get started',
    user: req.session.user
  });
});

router.get('/front', (req, res) => {
  Blog.find()
    .then((posts) => {
      res.render('front', {
        title: 'Blogs',
        posts: posts,
        user: req.session.user
      })
    })
    .catch((err) => {
      console.log(err);
    })
})

router.get('/addbook',authUser, function(req, res, next) {
  res.render('addbook', {
    title: 'Add book',
    user: req.session.user
  });
});

router.post("/addbook",authUser, (req, res) => {
  console.log(req.body);
  const book = new Book(req.body)
  book.save()
    .then(result => res.redirect("/library"))
    .catch(err => console.log(err))
})

router.post("/add",authUser, (req, res) => {
  const blog = new Blog(req.body)
  blog.save()
    .then(result => res.redirect("/front"))
    .catch(err => console.log(err))
})

router.get("/delete/:id",authUser, (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(res => {
      console.log(res);
      res.redirect('/front')
    })
    .catch(err => res.redirect("/front"))
})

router.get('/login',notauthUser, function(req, res, next) {
  res.render('login', {
    title: 'Login',
    user: req.session.user
  });
});


router.post('/login',notauthUser, (req, res) => {
  account.find({
    email: req.body.email
  }).then(async (acc) => {
    if (acc.length) {
      // console.log(acc);
      if (await bcrypt.compare(req.body.password, acc[0].password)) {
        console.log("Correct");
        req.session.user = acc[0]
        res.redirect("/front")
        }else {
        console.log("Wrong");
        res.redirect("/login")
      }
    } else {
      console.log("No user");
      res.redirect("/login")
    }
  }).catch(err => {
    console.log(err);
    res.redirect("/login")
  })
})

router.get('/register',notauthUser, function(req, res, next) {
  res.render('register', {
    title: 'Register',
    user: req.session.user
  });
});

router.post('/register',notauthUser, async (req, res) => {
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


router.get('/add', authUser,function(req, res, next) {
  res.render('body1', {
    title: 'Add Blog',
    user: req.session.user
  });
});

router.get('/terms',authUser, function(req, res, next) {
  res.render('terms', {
    title: 'Terms',
    user: req.session.user
  });
});

router.get('/team', function(req, res, next) {
  res.render('team', {
    title: 'Our Team',
    user: req.session.user
  });
});

router.get('/library', function(req, res, next) {
  Book.find()
    .then((books) => {
      res.render('library', {
        title: 'Library',
        books: books,
        user: req.session.user
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

module.exports = router;
