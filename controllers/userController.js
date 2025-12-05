// Cần cài đặt: npm install bcryptjs jsonwebtoken
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User Model

// Khóa bí mật JWT - phải được thay thế bằng biến môi trường trong thực tế
const { JWT_SECRET } = require('../config/jwt');

/**
 * @desc Xử lý việc đăng ký người dùng mới
 * @route POST /api/user/register
 */
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
        // 1. Kiểm tra xem người dùng đã tồn tại chưa
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Người dùng đã tồn tại với email này.' });
        }

        // 2. Mã hóa (Hash) mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo và lưu người dùng mới vào DB
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
        
        // 4. Phản hồi thành công
        res.status(201).json({ msg: 'Đăng ký thành công.' });

    } catch (err) {
        console.error('Lỗi đăng ký:', err.message);
        res.status(500).send('Lỗi máy chủ nội bộ.');
    }
};

/**
 * @desc Xử lý việc đăng nhập người dùng
 * @route POST /api/user/login
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Tìm kiếm người dùng bằng email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ (Email).' });
        }

        // 2. So sánh mật khẩu đã nhập với mật khẩu đã băm
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ (Mật khẩu).' });
        }

        // 3. Tạo JWT Token
        const payload = {
            id: user.id, // Lưu ID của người dùng vào token
            email: user.email, // Có thể lưu thêm email
            role: "user"
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token hết hạn sau 1 giờ
            (err, token) => {
                if (err) throw err;
                // 4. Trả về token cho client
                res.json({ token, msg: 'Đăng nhập thành công.', userRole: user.role, userId: user.id });
            }
        );

    } catch (err) {
        console.error('Lỗi đăng nhập:', err.message);
        res.status(500).send('Lỗi máy chủ nội bộ.');
    }
};

/**
 * @desc Lấy user theo id
 * @route GET /api/user/:id
 */
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password'); // loại bỏ password
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });

        // Nếu là user, chỉ được xem tài khoản của mình
        if (req.user.role === 'user' && req.user.id !== id) {
            return res.status(403).json({ message: 'Không đủ quyền' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Lỗi khi tìm user:', error);
        res.status(500).json({ message: 'Lỗi khi tìm user' });
    }
};

/**
 * @desc Lấy tất cả người dùng (users)
 * @route GET /api/user
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Lấy tất cả users, loại bỏ trường password
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
    }
};