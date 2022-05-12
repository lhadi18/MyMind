const mongoose = require("mongoose");
const User = require('./BBY_31_users')

const cartSchema = new mongoose.Schema({
    therapist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    numOfSessions: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ["completed", "active", "deleted"],
        required: true
    }
    
}, { timestamps: true, versionKey: false });

const Cart = mongoose.model('shoppingCart', cartSchema);
module.exports = Cart;

// On the user Schema, add field:

// shoppingCarts: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "shoppingCart"
// }]
