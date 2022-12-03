const express = require('express');
const router = express.Router();
const Account = require('../models/account');

/* GET users listing. */
router.get('/logout', function(req, res, next) {
  req.session.user=null
  req.logOut();
  res.redirect("/")
});

router.get('/getProfileImage/:id', function(req, res){
  Account.find({username: req.params.id})
  .then(user=> {
    // console.log(user);
    res.json({image: user[0].image})
  })
  .catch(err=> {
    console.log(err)
     res.status(501).message({error: error.message })
  })
})

module.exports = router;
