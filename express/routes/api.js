var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var pool = require('../config/mysql_pool');

router.get('/login', function(req, res, next) {
  let
    user_id = req.query.username,
    password = req.query.password;
  pool.query('select * from `user` where `user_id` = ?', [user_id], function(err, rows, fields) {
    if (err) {
      console.log('err :' + err);
    } else {
      if (rows.length === 0) {
        res.json( {success: false,msg: '해당 유저가 존재하지 않습니다.'} )
      } else {
        if (!bcrypt.compareSync(password, rows[0].password)) {
          res.json( {success: false,msg: '비밀번호가 일치하지 않습니다.'} )
        } else {
          res.json( {success: true} )
        }
      }
    }
  });
});

module.exports = router;