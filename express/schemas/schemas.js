const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    }
}, {
    versionKey: false
});

const userModel = mongoose.model('users', userSchema);

module.exports = {userSchema, userModel};