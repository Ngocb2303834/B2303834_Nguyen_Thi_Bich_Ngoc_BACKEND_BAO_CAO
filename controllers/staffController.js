// Cần cài đặt: npm install bcryptjs jsonwebtoken
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff'); // Import Staff Model

// Khóa bí mật JWT - phải được thay thế bằng biến môi trường trong thực tế
const { JWT_SECRET } = require('../config/jwt');


/**
 * @desc Xử lý việc đăng ký người dùng mới
 * @route POST /api/staff/register
 */
exports.register = async (req, res) => {
    const {
        email,
        password,
        dienThoai,
        chucVu,
        hoTenNV,
        diaChi
    } = req.body;

    try {
        // 1. Kiểm tra xem người dùng đã tồn tại chưa
        let staff = await Staff.findOne({ email });
        if (staff) {
            return res.status(400).json({ msg: 'Người dùng đã tồn tại với email này.' });
        }

        // 2. Mã hóa (Hash) mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo và lưu người dùng mới vào DB
        staff = new Staff({
            email,
            password: hashedPassword,
            dienThoai,
            chucVu,
            hoTenNV,
            diaChi
        });

        await staff.save();
        
        // 4. Phản hồi thành công
        res.status(201).json({ msg: 'Đăng ký thành công.' });

    } catch (err) {
        console.error('Lỗi đăng ký:', err.message);
        res.status(500).send('Lỗi máy chủ nội bộ.');
    }
};

/**
 * @desc Xử lý việc đăng nhập người dùng
 * @route POST /api/staff/login
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Tìm kiếm người dùng bằng email
        const staff = await Staff.findOne({ email });
        if (!staff) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ (Email).' });
        }

        // 2. So sánh mật khẩu đã nhập với mật khẩu đã băm
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ (Mật khẩu).' });
        }

        // 3. Tạo JWT Token
        const payload = {
            id: staff.id, // Lưu ID của người dùng vào token
            email: staff.email, // Có thể lưu thêm email
            role: staff.role
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token hết hạn sau 1 giờ
            (err, token) => {
                if (err) throw err;
                // 4. Trả về token cho client
                res.json({ token, msg: 'Đăng nhập thành công.',userRole: staff.role,userId: staff.id});
            }
        );

    } catch (err) {
        console.error('Lỗi đăng nhập:', err.message);
        res.status(500).send('Lỗi máy chủ nội bộ.');
    }
};

/**
 * @desc Lấy staff theo id
 * @route GET /api/staff/:id
 */
// exports.getStaffById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const staff = await Staff.findById(id).select('-password'); // loại bỏ password
//         if (!staff) return res.status(404).json({ message: 'Không tìm thấy staff' });

//         res.status(200).json(staff);
//     } catch (error) {
//         console.error('Lỗi khi tìm staff:', error);
//         res.status(500).json({ message: 'Lỗi khi tìm staff' });
//     }
// };

/**
 * @desc Lấy tất cả nhân viên (staff)
 * @route GET /api/staff
 */
// exports.getAllStaff = async (req, res) => {
//     try {
//         const staffList = await Staff.find().select('-password'); // loại bỏ trường password
//         res.status(200).json(staffList);
//     } catch (error) {
//         console.error('Lỗi khi lấy danh sách nhân viên:', error);
//         res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên' });
//     }
// };


/**
 * Tạo Staff mới
 * @route POST /api/staff
 */
exports.createStaff = async (req, res) => {
    try {
        const { email, password, hoTenNV, chucVu, diaChi, dienThoai } = req.body;

        // Kiểm tra email tồn tại
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaff = new Staff({
            email,
            password: hashedPassword,
            hoTenNV,
            chucVu,
            diaChi,
            dienThoai,
            role: "staff"
        });

        const savedStaff = await newStaff.save();
        res.status(201).json(savedStaff);
    } catch (error) {
        console.error('Lỗi tạo staff:', error);
        res.status(500).json({ message: 'Lỗi khi tạo staff', error });
    }
};

/**
 * Sửa Staff theo ID
 * @route PUT /api/staff/:id
 */
exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;

        // Staff bình thường chỉ được update chính mình
        if (req.user.role === 'staff' && req.user.id !== id) {
            return res.status(403).json({ message: 'Không đủ quyền cập nhật tài khoản này' });
        }

        const updateData = { ...req.body };

        // Nếu có password mới, hash trước khi lưu
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedStaff) return res.status(404).json({ message: 'Không tìm thấy staff' });

        res.status(200).json(updatedStaff);
    } catch (error) {
        console.error('Lỗi sửa staff:', error);
        res.status(500).json({ message: 'Lỗi khi sửa staff', error });
    }
};

/**
 * Xoá Staff theo ID
 * @route DELETE /api/staff/:id
 */
exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) return res.status(404).json({ message: 'Không tìm thấy staff' });

        res.status(200).json({ message: 'Xoá staff thành công', deletedStaff });
    } catch (error) {
        console.error('Lỗi xoá staff:', error);
        res.status(500).json({ message: 'Lỗi khi xoá staff', error });
    }
};

/**
 * Xoá tất cả Staff
 * @route DELETE /api/staff
 */
exports.deleteAllStaff = async (req, res) => {
    try {
        const result = await Staff.deleteMany({});
        res.status(200).json({ message: 'Đã xoá tất cả staff', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Lỗi xoá tất cả staff:', error);
        res.status(500).json({ message: 'Lỗi khi xoá tất cả staff', error });
    }
};

/**
 * Lấy tất cả Staff
 * @route GET /api/staff
 */
exports.getAllStaff = async (req, res) => {
    try {
        const staffs = await Staff.find();
        res.status(200).json(staffs);
    } catch (error) {
        console.error('Lỗi lấy danh sách staff:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách staff', error });
    }
};

/**
 * Lấy Staff theo ID
 * @route GET /api/staff/:id
 */
exports.getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        if (!staff) return res.status(404).json({ message: 'Không tìm thấy staff' });

        // Nếu là staff bình thường, chỉ được xem tài khoản của mình
        if (req.user.role === 'staff' && req.user.id !== id) {
            return res.status(403).json({ message: 'Không đủ quyền' });
        }

        res.status(200).json(staff);
    } catch (error) {
        console.error('Lỗi lấy staff theo ID:', error);
        res.status(500).json({ message: 'Lỗi khi lấy staff theo ID', error });
    }
};
