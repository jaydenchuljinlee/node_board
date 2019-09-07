
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(app,passport) {

    passport.use(new FacebookStrategy({
        clientID : process.env.CLIENT_ID,
        clientSecret : process.env.SECRET_ID,
        callbackURL : process.env.CALLBACK_URL,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone',
        'updated_time', 'verified', 'displayName']
        },function (accessToken, refreshToken, profile, done) {
            var _profile = profile._json;
            
            console.log(_profile);
          }
        ));


    //facebook 로그인
    app.get('/auth/login/facebook',
    passport.authenticate('facebook')
    );

    //facebook callback
    app.get('/auth/login/facebook/callback',
        passport.authenticate('facebook',{
            successRedirect: '/',
            failureRedirect: '/login'
        })
    );
}