const express = require('express');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const Book = require('../models/book');
const Question = require('../models/question');
const router = express.Router();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const Account = require('../models/account');
const fs = require('fs');
const path = require('path');
const {
  authUser,
  notauthUser
} = require('../basicAuth')
require('dotenv/config');

router.use(express.static(__dirname + "../public/"));

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
router.get('/', notauthUser, function(req, res, next) {
  res.render('start', {
    title: 'Get started',
    user: req.session.user
  });
});

router.get('/register', notauthUser, function(req, res, next) {
  res.render('register', {
    title: 'Register',
    user: req.session.user
  });
});

router.post('/register', notauthUser, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const image = "img/default.png"
    if (req.body.filename != "") image = req.body.filename

    let account = new Account({
      name: req.body.name,
      username: req.body.username,
      gender: req.body.gender,
      email: req.body.email,
      image: image,
      password: hashedPassword
    });
    account = await account.save()
    res.redirect('/login')
  } catch (err) {
    console.log(err);
    console.log(req.body);
    res.redirect('/register')
  }
})

router.get('/front', (req, res) => {
  Blog.find()
    .sort({
      createdAt: -1
    })
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

router.get('/addbook', authUser, function(req, res, next) {
  res.render('addbook', {
    title: 'Add book',
    user: req.session.user
  });
});

router.post("/addbook", (req, res) => {
  console.log(req.body);
  const book = new Book(req.body)
  book.save()
    .then(result => res.redirect("/library"))
    .catch(err => console.log(err))
})


router.get('/add', authUser, function(req, res, next) {
  res.render('add', {
    title: 'Add Blog',
    user: req.session.user
  });
});

router.post("/add", authUser, (req, res) => {
  const blog = new Blog(req.body)
  blog.save()
    .then(result => res.redirect("/front"))
    .catch(err => console.log(err))
})

router.get("/delete/:id", authUser, (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(res => {
      console.log(res);
      res.redirect('/front')
    })
    .catch(err => res.redirect("/front"))
})

router.get('/login', notauthUser, function(req, res, next) {
  res.render('login', {
    title: 'Login',
    user: req.session.user
  });
});


router.post('/login', notauthUser, (req, res) => {
  Account.find({
    email: req.body.email
  }).then(async (acc) => {
    if (acc.length) {
      // console.log(acc);
      if (await bcrypt.compare(req.body.password, acc[0].password)) {
        console.log("Correct");
        req.session.user = acc[0]
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
    console.log(err);
    res.redirect("/login")
  })
})

router.get('/terms', function(req, res, next) {
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
  // console.log(req.query);
  if (req.query.type != "ques") {
    Book.find()
      .then((rawbooks) => {
        var books = []
        for (var book of rawbooks) {
          if (book.year == req.query.year || req.query.year == null) {
            var i = 0;
            var expl = 0;
            if (req.query.department != null) {
              var department = req.query.department.split(",")
              expl = department.length
            }
            for (; i < expl; i++) {
              var dept = department[i]
              if (book.department.includes(dept) == false) {
                break
              }
            }
            if (i == expl) {
              books.push(book)
            }
          }
        }
        res.render('library', {
          title: 'Library',
          books: books,
          papers: [],
          user: req.session.user
        });
      })
      .catch((err) => {
        console.log(err)
        res.render('library', {
          title: 'Library',
          user: req.session.user,
          err: "Error 505"
        });
      })
  }else{
    Question.find()
      .then((rawpapers) => {
        var papers = []
        for (var paper of rawpapers) {
          if (paper.sessionyear == req.query.sessionyear || req.query.sessionyear == null) {
            if (paper.semester == req.query.semester || req.query.semester == null) {
              var i = 0;
              var expl = 0;
              if (req.query.department != null) {
                var department = req.query.department.split(",")
                expl = department.length
              }
              for (; i < expl; i++) {
                var dept = department[i]
                if (paper.department.includes(dept) == false) {
                  break
                }
              }
              if (i == expl){
                papers.push(paper)
              }
            }
          }
        }
        res.render('library', {
          title: 'Library',
          books: [],
          papers: papers,
          user: req.session.user
        });
      })
      .catch((err) => {
        console.log(err)
        res.render('library', {
          title: 'Library',
          user: req.session.user,
          err: "Error 505"
        })
      })
  }
});

router.get('/proto', function(req, res, next) {
  res.render('prototype', {
    title: 'Prototypes'
  });
});

router.get('/connect', function(req, res, next) {
  res.render('connect', {
    title: 'Connect',
    user: req.session.user
  });
});

module.exports = router;
