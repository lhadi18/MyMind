const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required: true
    },
    therapist: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timeLength: {
        type: String,
        required: true,
        default: "freePlan"
    },
    status:{
        type: String,
        enum: ["completed", "active", "deleted"],
        required: true
    }
    
}, { timestamps: true, versionKey: false });

const Cart = mongoose.model('shoppingCart', cartSchema);
module.exports = Cart;

