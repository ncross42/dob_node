var express = require('express');
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login1', { title: 'Express' });
});

router.post('/',
  passport.authenticate( 'local',
    { failureRedirect: '/error', failureFlash: true }
  ), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
  function (req, res) {
    console.log('in post("/") : ');
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
      if(username === 'user' && password === 'pass'){
        return done(null, {'user_id': username} );
      } else {
        return done(false, null)
      }
    }
  )
);

/*로그인 성공시 사용자 정보를 Session에 저장한다*/
passport.serializeUser(function (user, done) {
  console.log('serializeUser : ',user)
  done(null, user)
});

/*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
passport.deserializeUser(function (user, done) {
  console.log('deserializeUser : ',user)
  done(null, user);
});

module.exports = router;
