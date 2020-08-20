const express = require('express');
const Blog = require('../models/blog');
// const articleRouter= require('./article');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('start', {
    title: 'Get started',
  });
});

router.get('/front', (req, res) => {
  Blog.find()
    .then((posts) => {
      console.log(posts);
      res.render('front', {
        title: 'Blogs',
        posts: posts
      })
    })
    .catch((err) => {
      console.log(err);
    })
})

router.get('/add', function(req, res, next) {
  res.render('add', {
    title: 'Add post',
  });
});

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

router.get('/body1', function(req, res, next) {
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
  res.render('library', {
    title: 'Library',
  });
});

router.get('/proto', function(req, res, next) {
  res.render('prototype', {
    title: 'Prototypes'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    title: 'Register'
  });
});


module.exports = router;
