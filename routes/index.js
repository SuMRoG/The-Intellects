const express = require('express');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const Account = require('../models/account');
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

router.post('/register',async (req,res)=> {
  try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        let account= new Account({
          name: req.body.name,
          username: req.body.username,
          gender: req.body.gender,
          email: req.body.email,
          password: hashedPassword
        });
          account = await account.save()
          res.redirect('/login')
  }catch{
    res.redirect('/register')
  }
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


router.get('/hello',(req,res)=>{
    res.render('hello',{name: "Sujal"})
})


module.exports = router;
