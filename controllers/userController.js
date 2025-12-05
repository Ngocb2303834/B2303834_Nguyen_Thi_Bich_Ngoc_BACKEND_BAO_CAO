const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');
exports.register = async (req, res) => {
    const {
        email,
        password,
        dienThoai,
        hoLot,
        ten,
        ngaySinh,
        diaChi
    } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Người dùng đã tồn tại với email này.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            email,
            password: hashedPassword,
            dienThoai,
            hoLot,
            ten,
            ngaySinh,
            diaChi
        });
        await user.save();
        res.status(201).json({ msg: 'Đăng ký thành công.' });
    } catch (err) {
        console.error('Lỗi đăng ký:', err.message);
        res.status(500).send('Lỗi máy chủ nội bộ.');
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ (Email).' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ (Mật khẩu).' });
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: "user"
        };
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, msg: 'Đăng nhập thành công.', userRole: user.role, userId: user.id });
            }
        );
    } catch (err) {
        console.error('Lỗi đăng nhập:', err.message);
        res.status(500).send('Lỗi máy chủ nội bộ.');
    }
};
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        if (req.user.role === 'user' && req.user.id !== id) {
            return res.status(403).json({ message: 'Không đủ quyền' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Lỗi khi tìm user:', error);
        res.status(500).json({ message: 'Lỗi khi tìm user' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
    }
};