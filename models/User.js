const mongoose = require('mongoose');

// Định nghĩa Schema cho User
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        match: [/.+@.+\..+/, 'Email không hợp lệ'] // Regex kiểm tra định dạng email cơ bản
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc']
    },
    // Bạn có thể thêm các trường khác như name, role, v.v.
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
        enum: ["user"],  // role chỉ có thể là "user"
        default: "user"
    }
});

// Tạo và export Model
module.exports = mongoose.model('User', UserSchema);