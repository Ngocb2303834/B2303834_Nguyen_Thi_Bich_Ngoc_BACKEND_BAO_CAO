const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    idSach: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ngayMuon: { type: Date, required: true },
    ngayTra: { type: Date, required: true },
    soQuyenMuon: { type: Number, required: true },
    trangThai: { type: String, enum: ['dangMuon', 'daTra'], default: 'dangMuon' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Borrow', borrowSchema);
