var express = require('express');
var router = express.Router();

let isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
};

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = { title: 'Express', user: req.user };
  res.render('index', data);
});

/* GET home page. */
router.get('/error', function(req, res, next) {
  res.render('error', { message: 'Failed to login', error:{status:'error',stack:null} });
});

router.get('/myinfo', isAuthenticated, function (req, res) {
  let data = {title: 'My Info',user_info: req.user}
  res.render('myinfo',data)
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
