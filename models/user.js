const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const profileImagePath = 'uploads/profileCover'

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
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNum: {
        type: String,
        required: true,
        unique: true
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
module.exports.profileImagePath = profileImagePath;