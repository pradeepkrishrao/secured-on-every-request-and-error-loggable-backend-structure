var express = require('express');
/* An instance of Express Router is created */
var router = express.Router();

/* GET login page */
router.get('/login', function(req, res, next) {
  res.render('login')
});

module.exports = router;