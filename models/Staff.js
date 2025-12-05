const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
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
    hoTenNV: {
        type: String,
        required: [true, 'Họ tên là bắt buộc']
    },
    chucVu: {
        type: String,
        required: [true, 'Chức vụ là bắt buộc']
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
        enum: ["staff","admin"],
        default: "staff"
    }
});


module.exports = mongoose.model('Staff', StaffSchema);