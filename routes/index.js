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
const imgModel = require('../models/image');
const fs = require('fs');
const multer= require('multer');
const path = require('path');
const { authUser,notauthUser }= require('../basicAuth')
require('dotenv/config');

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

var storage= multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'uploads')
  },
  filename: (req,file,cb)=>{
    cb(null,file.fieldname + '-' + Date.now())
  }
})

var upload = multer({storage: storage});

/* GET home page. */
router.get('/',notauthUser, function(req, res, next) {
  res.render('start', {
    title: 'Get started',
    user: req.session.user
  });
});

router.get('/pic',(req,res)=>{
  imgModel.find()
    .then((items) => {
      res.render('/pic', {
        title: 'Images',
        items: items,
        user: req.session.user
      })
    })
    .catch((err) => {
      console.log(err);
    })

    imgModel.find({},(err,items)=>{
      if(err){
        console.log(err);
      } else{
        res.render('/pic',{
          title: 'Images',
          items: items,
        });
      }
    });
});

router.post('/pic',upload.single('image'),async (req,res)=>{
  try {
    let imgModel = new Image({
      name: req.body.name,
      desc: req.body.desc,
      img:{
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }
  });
    image = await imgModel.save()
    res.redirect('/pic')
  } catch {
    res.redirect('/')
  }
  // imgModel.create(obj,(err,item)={
  //   if(err){
  //     console.log(err);
  //   } else{
  //       //item.save();
  //       res.redirect('/image');
  //   }
  // })
})

router.get('/front', (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
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

router.post("/addbook", (req, res) => {
  console.log(req.body);
  const book = new Book(req.body)
  book.save()
    .then(result => res.redirect("/library"))
    .catch(err => console.log(err))
})


router.get('/add', authUser,function(req, res, next) {
  res.render('add', {
    title: 'Add Blog',
    user: req.session.user
  });
});

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
  Book.find()
    .then((rawbooks) => {
      var books = []
      for (var book of rawbooks) {
        if(book.year==req.query.year || req.query.year==null){
          if(book.type==req.query.type || req.query.type==null){
            var i = 0;
            var expl = 0;
            if(req.query.department!=null){
              var department = req.query.department.split(",")
              expl=department.length
            }
            for (; i < expl; i++) {
              var dept = department[i]
              if(book.department.includes(dept)==false){
                break
              }
            }
            if(i==expl){
              books.push(book)
            }
          }
        }
      }
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

router.get('/connect', function(req, res, next) {
  res.render('connect', {
    title: 'Connect',
    user: req.session.user
  });
});

module.exports = router;
