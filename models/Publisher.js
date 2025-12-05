const mongoose = require('mongoose');

const PublisherSchema = new mongoose.Schema({
    tenNXB: {type: String, required: true},
    diaChi: {type: String}
});


module.exports = mongoose.model('Publisher', PublisherSchema);