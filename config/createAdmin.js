const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Staff = require('../models/Staff'); // đường dẫn tới Staff.js

const createAdmin = async () => {
    try {
        // Kiểm tra xem đã có admin chưa
        const adminExists = await Staff.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Admin đã tồn tại:', adminExists.email);
            return;
        }

        // Nếu chưa có, tạo admin mặc định
        const defaultAdmin = {
            email: 'admin@gmail.com',
            password: 'admin123', // mật khẩu mặc định
            hoTenNV: 'Admin Quản Lý',
            chucVu: 'Quản lý',
            diaChi: 'Hà Nội',
            dienThoai: '0123456789',
            role: 'admin'
        };

        const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
        defaultAdmin.password = hashedPassword;

        const admin = new Staff(defaultAdmin);
        await admin.save();

        console.log('Admin mặc định đã được tạo:', defaultAdmin.email);
    } catch (err) {
        console.error('Lỗi khi tạo admin mặc định:', err);
    }
};

module.exports = createAdmin;

//email: admin@gmail.com,
// password: admin123,
// hoTenNV: 'Admin Quản Lý'