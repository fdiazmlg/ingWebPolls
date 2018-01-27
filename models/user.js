var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = mongoose.Schema({
    email: String,
    password: String
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);