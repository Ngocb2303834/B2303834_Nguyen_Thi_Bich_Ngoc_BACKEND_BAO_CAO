// Cần cài đặt: npm install express cors
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Tải user Routes
const staffRoutes = require('./routes/staffRoutes'); // Tải staff Routes
const bookRoutes = require('./routes/bookRoutes'); // Tải book Routes
const publisherRoutes = require('./routes/publisherRoutes'); // Tải publisher Routes
const borrowRoutes = require('./routes/borrowRoutes'); // Tải borrow Routes
const authRoutes = require('./routes/authRoutes'); // Tải borrow Routes

const auth = require('./config/auth');

// const JWT_SECRET = 'YOUR_SUPER_SECURE_KEY_FOR_JWT';

// Khởi tạo ứng dụng Express
const app = express();

// Middleware (Cấu hình chung)

// Cho phép CORS (Cross-Origin Resource Sharing) để Front-end có thể gọi API
app.use(cors());

// Body Parser: Cho phép Express đọc JSON data từ request body
app.use(express.json());


// Routes (Tải các tuyến đường)
// Định nghĩa prefix cho các tuyến đường xác thực là /api/auth
// Ví dụ: POST /api/auth/register, POST /api/auth/login
app.use('/api/user', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/publisher', auth(["admin"]), publisherRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/auth',authRoutes);

// Tuyến đường kiểm tra (Tùy chọn)
app.get('/', (req, res) => {
    res.send('API đang hoạt động...');
});

// Xử lý lỗi 404 cho các tuyến đường không tồn tại
app.use((req, res, next) => {
    res.status(404).json({ msg: 'Không tìm thấy tuyến đường (404 Not Found)' });
});


module.exports = app;