const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/logout', function(req, res, next) {
  req.session.user=null
  res.redirect("/front")
});

module.exports = router;
