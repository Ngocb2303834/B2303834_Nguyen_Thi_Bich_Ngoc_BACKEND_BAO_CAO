const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const staffRoutes = require('./routes/staffRoutes');
const bookRoutes = require('./routes/bookRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const authRoutes = require('./routes/authRoutes');
const auth = require('./config/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/publisher', auth(["admin"]), publisherRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/auth',authRoutes);
app.get('/', (req, res) => {
    res.send('API đang hoạt động...');
});
app.use((req, res, next) => {
    res.status(404).json({ msg: 'Không tìm thấy tuyến đường (404 Not Found)' });
});


module.exports = app;