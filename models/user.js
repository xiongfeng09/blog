var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    name: { type: String},
    password: { type: String },
    email: { type: String},

    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now }
});

mongoose.model('User', UserSchema);
