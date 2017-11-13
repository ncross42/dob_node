var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var pool = require('../config/mysql_pool');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/',
  passport.authenticate( 'local',
    { failureRedirect: '/error', failureFlash: true }
  ), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
  function (req, res) {
    res.redirect('/myinfo');
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
    }, function (req, username, password, done) {
      pool.query('select * from `user` where `user_id` = ?', [username], function (err, result) {
        if (err) {
          console.log('passport(LocalStrategy) ERROR :' + err);
          return done(false, null);
        } else {
          if (result.length === 0) {
            console.log('해당 유저가 없습니다');
            return done(false, null);
          } else {
            if (!bcrypt.compareSync(password, result[0].password)) {
              console.log('패스워드가 일치하지 않습니다');
              return done(false, null);
            } else {
              console.log('로그인 성공');
              return done(null, {
                user_id: result[0].user_id,
                nickname: result[0].nickname
              });
            }
          }
        }
      })
    }   
  )
);

/*로그인 성공시 사용자 정보를 Session에 저장한다*/
passport.serializeUser(function (user, done) {
  console.log('serializeUser')
  done(null, user)
});

/*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
passport.deserializeUser(function (user, done) {
  console.log('deserializeUser')
  done(null, user);
});

module.exports = router;
