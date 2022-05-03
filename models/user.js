const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNum: {
        type: Number
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });

const User = mongoose.model('user', userSchema);
module.exports = User;