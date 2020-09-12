const express = require('express');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const Book = require('../models/book');
const Question = require('../models/question');
const Connect = require('../models/conn');
const router = express.Router();
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const Account = require('../models/account');
const fs = require('fs');
const path = require('path');
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const {
  authUser,
  notauthUser
} = require('../basicAuth')

router.use(express.static(__dirname + "../public/"));

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/auth/google/front',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  async (req, res)=>{
    console.log("Logged In");
    req.session.user = await req.user
    res.redirect('/front');
  }
);

router.get('/', function(req, res, next) {
  res.render('start', {
    title: 'Get started',
    user: req.session.user
  });
});

router.get('/register', notauthUser, function(req, res, next) {
  var error = ""
  if (req.query.error) {
    error = req.query.error
  }

  res.render('register', {
    title: 'Register',
    user: req.session.user,
    error: error
  });
});

router.get('/front', (req, res) => {
  if (req.isAuthenticated()) {
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
  } else {
    res.redirect('/login');
  }
})

router.get('/connect', (req, res) => {
  Connect.find()
    .then((allstudents) => {
      var students = []
      for (var student of allstudents) {
        if (student.year == req.query.year || req.query.year == null) {
          if (student.department == req.query.department || req.query.department == null) {
            if (student.state == req.query.state || req.query.state == null) {
              students.push(student)
            }
          }
        }
      }
      res.render('connect', {
        title: 'Connect',
        students: students,
        user: req.session.user
      })
    })
    .catch((err) => {
      console.log(err)
      res.render('connect', {
        title: 'Connect',
        user: req.session.user,
        err: "Error 505"
      });
    })
})

router.get('/addcon', function(req, res, next) {
  res.render('addcon', {
    title: 'Add connect',
    user: req.session.user
  });
})

router.post("/addcon", authUser, (req, res) => {
  console.log(req.body);
  const connect = new Connect(req.body)
  connect.save()
    .then(result => res.redirect("/connect"))
    .catch(err => console.log(err))
})

router.get('/addbook', authUser, (req, res, next) => { //
  res.render('addbook', {
    title: 'Add book',
    user: req.session.user
  });
});

router.post("/addbook", authUser, (req, res) => { //
  // console.log(req.body);
  var doc = {}
  if (req.body.type == "book" || req.body.type == "other") {
    doc.title = req.body.title
    doc.author = req.body.author
    doc.year = req.body.year
    doc.type = req.body.type
    doc.department = req.body.department
    if (typeof(doc.department) == "string") {
      doc.department = [doc.department]
    }
    doc.subject = req.body.subject
    doc.url = req.body.url
    doc.cover = Math.floor(Math.random() * 8)
    const book = new Book(doc)
    book.save()
      .then(result => res.redirect("/library"))
      .catch(err => {
        console.log(err)
        res.redirect("/library")
      })
  } else if (req.body.type == "ques") {
    doc.sessionyear = req.body.sessionyear
    doc.semester = req.body.semester
    doc.department = req.body.department
    if (typeof(doc.department) == "string") {
      doc.department = [doc.department]
    }
    doc.subject = req.body.subject
    doc.url = req.body.url
    console.log(doc);
    const ques = new Question(doc)
    ques.save()
      .then(result => res.redirect("/library"))
      .catch(err => {
        console.log(err)
        res.redirect("/library")
      })
  } else {
    res.redirect("/addbook")
  }
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

router.get('/terms', function(req, res, next) {
  res.render('terms', {
    title: 'Terms',
    user: req.session.user
  });
});

router.get('/profile', authUser, function(req, res, next) {
  res.render('profile', {
    title: 'Profile',
    user: req.session.user
  });
});

router.get('/team', function(req, res, next) {
  res.render('team', {
    title: 'Team',
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
  } else {
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
              if (i == expl) {
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
