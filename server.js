const app = require('./app'); // Import ứng dụng Express đã cấu hình
const connectDB = require('./config/db'); // Import hàm kết nối DB

const PORT = process.env.PORT || 3000;

// 1. Kết nối với Cơ sở dữ liệu
connectDB();

// 2. Khởi động máy chủ Express
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
    console.log(`(Mở: http://localhost:${PORT})`);
});