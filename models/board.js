var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var boardSchema  = new Schema({
    title       : String,
    sub_title   : String,
    contents    : String,
    board_type  : String,
    created_date: {type:Date,default:Date.now},
    updated_date: {type:Date}

});

module.exports = mongoose.model('board',boardSchema); 