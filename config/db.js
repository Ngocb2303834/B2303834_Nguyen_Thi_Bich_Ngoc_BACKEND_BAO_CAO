const mongoose = require('mongoose');
const createAdmin = require('./createAdmin');
const MONGO_URI = 'mongodb://localhost:27017/mevn-auth-db';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB đã kết nối thành công!');
        await createAdmin();
    } catch (err) {
        console.error('Lỗi kết nối MongoDB:', err.message);
        process.exit(1);
    }
};


module.exports = connectDB;

