var mongoose = require('mongoose'),
    config = require('../config');

mongoose.connect('mongodb://' + config.dbPath);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('connect mongo  yet!')
});

// models
require('./user');
require('./topic');

exports.User = mongoose.model('User');
exports.Topic = mongoose.model('Topic');
