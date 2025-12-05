const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff'); 
const { JWT_SECRET } = require('../config/jwt');
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
        let staff = await Staff.findOne({ email });
        if (staff) {
            return res.status(400).json({ msg: 'Người dùng đã tồn tại với email này.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        staff = new Staff({
            email,
            password: hashedPassword,
            dienThoai,
            chucVu,
            hoTenNV,
            diaChi
        });
        await staff.save();
        res.status(201).json({ msg: 'Đăng ký thành công.' });
    } catch (err) {
        console.error('Lỗi đăng ký:', err.message);
        res.status(500).send('Lỗi máy chủ nội bộ.');
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const staff = await Staff.findOne({ email });
        if (!staff) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ (Email).' });
        }
        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không hợp lệ (Mật khẩu).' });
        }
        const payload = {
            id: staff.id,
            email: staff.email,
            role: staff.role
        };
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, msg: 'Đăng nhập thành công.',userRole: staff.role,userId: staff.id});
            }
        );

    } catch (err) {
        console.error('Lỗi đăng nhập:', err.message);
        res.status(500).send('Lỗi máy chủ nội bộ.');
    }
};
exports.createStaff = async (req, res) => {
    try {
        const { email, password, hoTenNV, chucVu, diaChi, dienThoai } = req.body;
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
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
exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role === 'staff' && req.user.id !== id) {
            return res.status(403).json({ message: 'Không đủ quyền cập nhật tài khoản này' });
        }
        const updateData = { ...req.body };
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
exports.deleteAllStaff = async (req, res) => {
    try {
        const result = await Staff.deleteMany({});
        res.status(200).json({ message: 'Đã xoá tất cả staff', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Lỗi xoá tất cả staff:', error);
        res.status(500).json({ message: 'Lỗi khi xoá tất cả staff', error });
    }
};
exports.getAllStaff = async (req, res) => {
    try {
        const staffs = await Staff.find();
        res.status(200).json(staffs);
    } catch (error) {
        console.error('Lỗi lấy danh sách staff:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách staff', error });
    }
};
exports.getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        if (!staff) return res.status(404).json({ message: 'Không tìm thấy staff' });
        if (req.user.role === 'staff' && req.user.id !== id) {
            return res.status(403).json({ message: 'Không đủ quyền' });
        }
        res.status(200).json(staff);
    } catch (error) {
        console.error('Lỗi lấy staff theo ID:', error);
        res.status(500).json({ message: 'Lỗi khi lấy staff theo ID', error });
    }
};
