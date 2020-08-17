const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('start', { title: 'Get started', layout: 'layouts/base' });
});

router.get('/terms', function(req, res, next) {
  res.render('terms', { title: 'Terms', layout: 'layouts/base' });
});

router.get('/team', function(req, res, next) {
  res.render('team', { title: 'Our Team', layout: 'layouts/base' });
});

router.get('/front', function(req, res, next) {
  res.render('front', { title: 'Home',layout: 'layouts/base'});
});

router.get('/library', function(req, res, next) {
  res.render('library', { title: 'Library', layout: 'layouts/base'});
});

router.get('/proto', function(req, res, next) {
  res.render('prototype', { title: 'Prototypes'});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login'});
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register'});
});


module.exports = router;
