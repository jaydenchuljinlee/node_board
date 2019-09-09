const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const FacebookStrategy  = require('passport-facebook').Strategy;
const Users             = require('./models/user');

/* 
* 연동 로그인 관련 로직 메서드
* @pram : info(연동 로그인으로 받은 profile 정보), done(모든 작업을 마친 후 실행하는 콜백 함수)
*/
function loginByThirdparty(info, done) {
    
    //user document를 조회
    Users.find({user_id:info.auth_id},(err,result) => {

        //db 에러
        if (err) return done(err);
        
        var user = new Users();


        //찾으려는 user가 없을 시
        if (result == null) {

            user.user_id    = info.auth_id;
            user.name       = info.auth_name;
            user.auth_type  = info.auth_type;
            user.auth_email = info.auth_email;
            user.user_state = 'alive';
        
            //user 정보 생성
            user.save((err) => {

                //db 오류
                if(err) return done(err);
                
                done(null, {
                    'user_id': info.auth_id,
                    'nickname': info.auth_name
                    });
            });
            
        } else {

            //기존유저 로그인 처리
            user.user_id    = result.user_id;
            user.name       =  result.name;
            done(null, user);
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
        passReqToCallback   : true
        }, (id,password,done) => {

            //user 정보 조회
            Users.find({user_id:id},(findErr,user) => {

                //db 오류
                if (findErr) return done(findErr);

                // user 정보가 없을 시
                if(!user) return done(null,false,{message:'존재하지 않는 아이디 입니다.'});

                //user.js의 비번 비교
                return user.comparePassword(password, (passError, isMatch) => {
                    if (isMatch) {
                      return done(null, user); // 검증 성공
                    }
                    return done(null, false, { message: '비밀번호가 틀렸습니다' }); // 임의 에러 처리
                });
            });
        }));

    passport.use(new FacebookStrategy({
        clientID        : process.env.CLIENT_ID,
        clientSecret    : process.env.SECRET_ID,
        callbackURL     : process.env.CALLBACK_URL,
        session         : true,
        profileFields   : ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
        'updated_time', 'verified', 'displayName']
        }, (accessToken, refreshToken, profile, done) => {
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