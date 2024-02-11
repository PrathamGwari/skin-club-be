const mongoose = require('mongoose');

const accessSchema = new mongoose.Schema({
    accessToken: { type: String, required: true },
    expiration: { type: Number, required: true },
});

module.exports = mongoose.model('AccessToken', accessSchema)
