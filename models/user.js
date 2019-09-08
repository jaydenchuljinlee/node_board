var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var UserSchema  = new Schema({
    user_id     : String,
    name        : String,
    nickname    : String,
    auth_type   : String,
    auth_email  : String,
    join_date   : {type:Date,default:Date.now},
    user_state  : String
});

module.exports = mongoose.model('user',UserSchema);