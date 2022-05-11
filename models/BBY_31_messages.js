const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    patientId: {
        type: String,
        required: true
    },
    therapistId: {
        type: String,
        required: true
    },
    tSessionId: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: "../uploads/placeholder-profile.jpg"
    }
}, { timestamps: true});

const message = mongoose.model('message', userSchema);
module.exports = User;