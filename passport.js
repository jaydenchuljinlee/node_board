const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const FacebookStrategy  = require('passport-facebook').Strategy;
const Users             = require('./models/user');

function loginByThirdparty(info, done) {
    console.log('process : ' + info.auth_type);

    Users.find({user_id:info.auth_id},function(err,result) {
        if (err) return done(err);
        
        if (result === null) {
            // 신규 유저는 회원 가입 이후 로그인 처리

            var user = new Users();

            user.user_id    = info.auth_id;
            user.name       = info.auth_name;
            user.auth_type  = info.auth_type;
            user.auth_email = info.auth_email;
            user.user_state = 'alive';

            user.save(function(err) {
                if(err) return done(err);
                done(null, {
                    'user_id': info.auth_id,
                    'nickname': info.auth_name
                  });
            });
        } else {
            //기존유저 로그인 처리
            done(null, {
                'user_id': result.user_id,
                'nickname': result.nickname
              });
        }
    });
  }

module.exports = () => {
    passport.serializeUser((user,done) => {
        done(null,user);
    });

    passport.deserializeUser((user,done) => {
        done(null,user);
    });

    passport.use(new LocalStrategy({
        usernameField       : 'id',
        passwordField       : 'pw',
        session             : true,
        passReqToCallback   : false
        }, (id,password,done) => {
            Users.find({user_id:id},(findErr,user) => {
                if (findErr) return done(findErr);

                if(!user) return done(null,false,{message:'존재하지 않는 아이디 입니다.'});

                return user.comparePassword(password, (passError, isMatch) => {
                    if (isMatch) {
                      return done(null, user); // 검증 성공
                    }
                    return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
                });
            });
        }));

    passport.use(new FacebookStrategy({
        clientID : process.env.CLIENT_ID,
        clientSecret : process.env.SECRET_ID,
        callbackURL : process.env.CALLBACK_URL,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
        'updated_time', 'verified', 'displayName']
        },function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;
            
            loginByThirdparty({
                'auth_type'     : 'facebook',
                'auth_id'       :  _profile.id,
                'auth_name'     : _profile.name,
                'auth_email'    : _profile.id
            },done);
            }
        ));
}