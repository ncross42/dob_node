var express = require('express');
var router = express.Router();
var pool = require('../config/mysql_pool');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var NaverStrategy = require('passport-naver').Strategy;

function loginByThirdparty(info, done) {
  console.log('process : ' + info.auth_type);
  let sql_duplicated = 'SELECT * FROM `user` WHERE `user_id` = ?';
  pool.query(sql_duplicated, [info.auth_id], function (err, result) {
    if (err) {
      return done(err);
    } else {
      if (result.length === 0) {
        // 신규 유저는 회원 가입 이후 로그인 처리
        let sql_thridparty_signup = 'INSERT INTO `user` SET `user_id`= ?, `nickname`= ?';
        pool.query(sql_thridparty_signup, [info.auth_id, info.auth_name], function (err, result) {
          if (err) {
            return done(err);
          } else {
            done(null, {
              'user_id': info.auth_id,
              'nickname': info.auth_name
            });
          }
        });
      } else {
        //기존유저 로그인 처리
        console.log('Old User');
        done(null, {
          'user_id': result[0].user_id,
          'nickname': result[0].nickname
        });
      }
    }
  });
}

// facebook 로그인
router.get('/login/facebook',
  passport.authenticate('facebook')
);
// facebook 로그인 연동 콜백
router.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);
/*
// 페이스북으로 로그인 처리
passport.use(new FacebookStrategy({
  clientID: secret_config.federation.facebook.client_id,
  clientSecret: secret_config.federation.facebook.secret_id,
  callbackURL: secret_config.federation.facebook.callback_url,
  profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
    'updated_time', 'verified', 'displayName']
}, function (accessToken, refreshToken, profile, done) {
  var _profile = profile._json;

  console.log('Facebook login info');
  console.info(_profile);

  loginByThirdparty({
    'auth_type': 'facebook',
    'auth_id': _profile.id,
    'auth_name': _profile.name,
    'auth_email': _profile.id
  }, done);
}
));


// naver 로그인
router.get('/login/naver',
  passport.authenticate('naver')
);
// naver 로그인 연동 콜백
router.get('/login/naver/callback',
  passport.authenticate('naver', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);
passport.use(new NaverStrategy({
  clientID: secret_config.federation.naver.client_id,
  clientSecret: secret_config.federation.naver.secret_id,
  callbackURL: secret_config.federation.naver.callback_url
},
  function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;
    loginByThirdparty({
      'auth_type': 'naver',
      'auth_id': _profile.id,
      'auth_name': _profile.nickname,
      'auth_email': _profile.email
    }, done);
  }
));

// kakao 로그인
router.get('/login/kakao',
  passport.authenticate('kakao')
);
// kakao 로그인 연동 콜백
router.get('/login/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);
passport.use(new KakaoStrategy({
  clientID: secret_config.federation.kakao.client_id,
  callbackURL: secret_config.federation.kakao.callback_url
},
  function (accessToken, refreshToken, profile, done) {
    var _profile = profile._json;
    loginByThirdparty({
      'auth_type': 'kakao',
      'auth_id': _profile.id,
      'auth_name': _profile.properties.nickname,
      'auth_email': _profile.id
    }, done);
  }
));
*/
module.exports = router;
