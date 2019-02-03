const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Order', ordersSchema);