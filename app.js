//ENV 프로젝트 관련 secret 정보 파일
require('dotenv').config();

const express     = require('express');
const session     = require('express-session'); // 세션 설정
const app         = express();
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const fs          = require('fs');
const passport       = require('passport');
const passportConfig = require('./passport'); // 여기


//view engine
app.set('views',__dirname + '/views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

app.use(express.static('public'));

//configure app to use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// 세션 활성화
app.use(session({secret : process.env.SECRET,resave : true, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

//configure server port
var port = process.env.port || 8080;

//configure router
var BookRouter = require('./routes/index')(app,passport);
var LoginRouter = require('./routes/login')(app,passport);

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true})
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.log(e));

app.listen(port,() => console.log("Express server has started on port "+port));
