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
const {authUser, notauthUser} = require('../basicAuth')

router.use(express.static(__dirname + "../public/"));

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/front', passport.authenticate('google', {failureRedirect: '/register'}), async (req, res) => {
  console.log("Logged In");
  req.session.user = await req.user
  res.redirect('/front');
});

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
  console.log("Register Error : ",error);
  res.render('register', {
    title: 'Register',
    user: req.session.user,
    error: error
  });
});

router.get('/front', (req, res) => {
  if (req.isAuthenticated()) {
    Blog.find().sort({createdAt: -1}).then((posts) => {
      res.render('front', {
        title: 'Blogs',
        posts: posts,
        user: req.session.user
      })
    }).catch((err) => {
      console.log("Front error : ",err);
      res.redirect("/error")
    })
  } else {
    res.redirect('/register');
  }
})

router.get('/connect', authUser, (req, res, next) => {
  Connect.find().then((allstudents) => {
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
  }).catch((err) => {
    console.log(err)
    res.render('connect', {
      title: 'Connect',
      user: req.session.user,
      err: "Error 505"
    });
  })
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
    doc.cover = -1
    if (req.body.type == "book") {
      doc.cover = Math.floor(Math.random() * 8)
    }
    doc.sender = req.session.user.email
    const book = new Book(doc)
    book.save().then(result => res.redirect("/library")).catch(err => {
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
    doc.sender = req.session.user.email
    // console.log(doc);
    const ques = new Question(doc)
    ques.save().then(result => res.redirect("/library")).catch(err => {
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
  req.body.author = req.session.user.name
  req.body.authorId = req.session.user._id
  req.body.authorImage = req.session.user.image
  const blog = new Blog(req.body)
  blog.save().then(result => res.redirect("/front")).catch(err => console.log(err))
})

router.get("/delete/:id", authUser, (req, res) => {
  const id = req.params.id;
  Blog.deleteOne({_id: id, authorId: req.session.user._id}).then(blog=>{
    res.redirect('/front')
  }).catch(err=>{
    console.log(err);
    res.redirect("/error")
  })
});

router.get("/blog/:id", authUser, (req, res)=> {
  const id = req.params.id;
  Blog.find({_id: id}).then(blog=>{
    res.render('blog', {
      title: 'full Blog',
      blog: blog
    })
  }).catch(err=>{
      res.redirect("/error")
    })
});

router.get('/terms', function(req, res, next) {
  res.render('terms', {
    title: 'Terms',
    user: req.session.user
  });
});

router.get('/profile', authUser, function(req, res, next) {
  if(req.query.intellect){
    Account.find({_id: req.query.intellect}).then(acc=>{
      if(acc.length==0){
        res.redirect("/error");
        return
      }
      Blog.find({authorId: req.query.intellect}).sort({createdAt: -1}).then(posts=>{
        res.render('profile', {
          title: 'Profile',
          user: req.session.user,
          profileuser: acc[0],
          self: false,
          posts: posts
        });
      }).catch(err=>{
        res.redirect("/error");
      })
    }).catch(err=>{
      res.redirect("/error");
    })
  }else{
    Blog.find({authorId: req.session.user._id}).sort({createdAt: -1}).then(posts=>{
      res.render('profile', {
        title: 'Profile',
        user: req.session.user,
        profileuser: req.session.user,
        self: true,
        posts: posts
      });
    }).catch(err=>{
      res.redirect("/error");
    })
  }
});

router.get('/team', function(req, res, next) {
  res.render('team', {
    title: 'Team',
    user: req.session.user
  });
});

router.get('/library', function(req, res, next) {
  // console.log(req.query);
  if(req.query.type==null){
    req.query.type = "book"
  }
  if (req.query.type != "ques") {
    Book.find().sort({createdAt: -1}).then((rawbooks) => {
      var books = []
      for (var book of rawbooks) {
        if (book.year == req.query.year || req.query.year == null || book.year == 0) {
          if (book.type == req.query.type) {
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
      }
      res.render('library', {
        title: 'Library',
        books: books,
        papers: [],
        user: req.session.user
      });
    }).catch((err) => {
      console.log(err)
      res.render('library', {
        title: 'Library',
        user: req.session.user,
        err: "Error 505"
      });
    })
  } else {
    Question.find().sort({createdAt: -1}).then((rawpapers) => {
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
    }).catch((err) => {
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
  res.redirect("/")
  return
  res.render('prototype', {title: 'Prototypes'});
});


router.get('/error', function(req, res, next) {
  res.render('error',{
    title: "Error"
  });
})

module.exports = router;
