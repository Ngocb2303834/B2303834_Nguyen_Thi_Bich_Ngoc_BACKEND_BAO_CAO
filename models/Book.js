const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    tenSach: {type: String, required: true},
    donGia: {type: Number},
    soQuyen: { type: Number, default: 1 },
    namXuatBan: {type: Number},
    tacGia: {type: String, required: true},
    maNXB: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher', required: true},
    hinhAnh: { type: String, default: '' }
});

module.exports = mongoose.model('Book', BookSchema);