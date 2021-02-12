var express = require('express');
/* An instance of Express Router is created */
var router = express.Router();

/* GET signup page. */
router.get('/', function(req, res, next) {
  res.render('signup')
});

module.exports = router;
