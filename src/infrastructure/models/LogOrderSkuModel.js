const mongoose = require('mongoose');

const LogOrderSkuSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true
    },
    order: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('LogOrderSku', LogOrderSkuSchema);
