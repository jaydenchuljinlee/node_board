
module.exports = function(app,passport) {

    //facebook 로그인
    app.get('/auth/login/facebook',
    passport.authenticate('facebook')
    );

    //facebook callback
    app.get('/auth/login/facebook/callback',
        passport.authenticate('facebook',{
            successRedirect: '/board',
            failureRedirect: '/login'
        })
    );
}