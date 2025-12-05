const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        match: [/.+@.+\..+/, 'Email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    hoLot: {
        type: String,
        required: [true, 'Họ lót là bắt buộc']
    },
    ten: {
        type: String,
        required: [true, 'Tên là bắt buộc']
    },
    ngaySinh: {
        type: Date
    },
    diaChi: {
        type: String
    },
    dienThoai: {
        type: String,
        required: [true, 'SĐT là bắt buộc']
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user"
    }
});

module.exports = mongoose.model('User', UserSchema);