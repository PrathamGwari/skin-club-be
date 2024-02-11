const mongoose = require('mongoose');

const saveCardSchema = new mongoose.Schema({
    id: { type: String},
    cardBrand: { type: String},
    last4: { type: String},
    expMonth: { type: String},
    expYear: { type: String},
    billingAddress: { postalCode: { type: String}},
    fingerprint: { type: String},
    customerId: { type: String},
    merchantId: { type: String},
    enabled: { type: Boolean},
    cardType: { type: String},
    prepaidType: { type: String},
    bin: { type: String},
    version: { type: String},
    user_email: { type: String},
});

module.exports = mongoose.model('SavedCards', saveCardSchema);
