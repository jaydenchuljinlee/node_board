//ENV
require('dotenv').config();

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var fs          = require('fs');
var passport    = require('passport');



//view engine
app.set('views',__dirname + '/views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

app.use(express.static('public'));

//configure app to use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

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
