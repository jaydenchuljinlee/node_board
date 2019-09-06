var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var fs          = require('fs');

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

var Board = require('./models/board'); 

//configure router
var router = require('./routes')(app,Board);

//connect to mongoDB server
var db = mongoose.connection;
db.on('error',console.error);
db.once('open',function() {
    //connected to mongoDB server
    console.log("Connected to mongoDB server");
});

mongoose.connect("mongodb://localhost/chuljin",{useNewUrlParser:true});





//run server
var server = app.listen(port,function() {
    console.log("Express server has started on port "+port);
});
