// Cần cài đặt thư viện mongoose: npm install mongoose
const mongoose = require('mongoose');
const createAdmin = require('./createAdmin');

// Biến môi trường, hãy thay đổi URL này
const MONGO_URI = 'mongodb://localhost:27017/mevn-auth-db';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB đã kết nối thành công!');
        // Gọi tạo admin mặc định
        await createAdmin();
    } catch (err) {
        console.error('Lỗi kết nối MongoDB:', err.message);
        // Thoát process nếu kết nối thất bại
        process.exit(1);
    }
};


module.exports = connectDB;

