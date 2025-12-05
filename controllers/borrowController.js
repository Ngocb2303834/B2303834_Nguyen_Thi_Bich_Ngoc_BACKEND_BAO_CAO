const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const User = require('../models/User');

/**
 * Thêm phiếu mượn sách
 * @route POST /api/borrow
 */
exports.createBorrow = async (req, res) => {
    try {
        const { idSach, idUser, ngayMuon, ngayTra, soQuyenMuon } = req.body;

        const newBorrow = new Borrow({
            idSach,
            idUser,
            ngayMuon,
            ngayTra,
            soQuyenMuon,
            trangThai: 'dangMuon'
        });

        const savedBorrow = await newBorrow.save();
        res.status(201).json(savedBorrow);
    } catch (error) {
        console.error('Lỗi khi tạo phiếu mượn:', error);
        res.status(400).json({ message: 'Lỗi khi tạo phiếu mượn', error });
    }
};

/**
 * Trả sách
 * @route POST /api/borrow/return/:borrowId
 */
exports.returnBook = async (req, res) => {
    try {
        const { borrowId } = req.params;
        const { ngayTra } = req.body;

        const updatedBorrow = await Borrow.findByIdAndUpdate(
            borrowId,
            { trangThai: 'daTra', ngayTra },
            { new: true }
        );

        if (!updatedBorrow) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

        res.json({ message: 'Trả sách thành công', borrow: updatedBorrow });
    } catch (error) {
        console.error('Lỗi khi trả sách:', error);
        res.status(400).json({ message: 'Lỗi khi trả sách', error });
    }
};

/**
 * Xem tất cả sách đã và đang mượn
 * @route GET /api/borrow
 */
exports.getAllBorrows = async (req, res) => {
    try {
        const borrows = await Borrow.find()
            .populate('idSach', 'tenSach tacGia namXuatBan donGia')
            .populate('idUser', 'hoTen email')
            .sort({ ngayMuon: -1 });

        res.status(200).json(borrows);
    } catch (error) {
        console.error('Lỗi khi lấy phiếu mượn:', error);
        res.status(500).json({ message: 'Lỗi khi lấy phiếu mượn', error });
    }
};

/**
 * Xem các sách đang mượn
 * @route GET /api/borrow/active
 */
exports.getActiveBorrows = async (req, res) => {
    try {
        const borrows = await Borrow.find({ trangThai: 'dangMuon' })
            .populate('idSach', 'tenSach tacGia namXuatBan donGia')
            .populate('idUser', 'hoTen email')
            .sort({ ngayMuon: -1 });

        res.status(200).json(borrows);
    } catch (error) {
        console.error('Lỗi khi lấy sách đang mượn:', error);
        res.status(500).json({ message: 'Lỗi khi lấy sách đang mượn', error });
    }
};

/**
 * Lấy phiếu mượn theo id
 * @route GET /api/borrow/:id
 */
exports.getBorrowById = async (req, res) => {
    try {
        const { id } = req.params;

        const borrow = await Borrow.findById(id)
            .populate('idSach', 'tenSach tacGia namXuatBan donGia')
            .populate('idUser', 'hoTen email');

        if (!borrow) return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });

        res.status(200).json(borrow);
    } catch (error) {
        console.error('Lỗi khi lấy phiếu mượn:', error);
        res.status(500).json({ message: 'Lỗi khi lấy phiếu mượn', error });
    }
};

/**
 * Xem tất cả sách đã và đang mượn của 1 user
 * @route GET /api/borrow/user/:userId
 */
exports.getUserBorrows = async (req, res) => {
    try {
        const { userId } = req.params;

        // Nếu role là user, chỉ cho phép xem chính mình
        if (req.user.role === 'user' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Không đủ quyền xem phiếu mượn của user khác' });
        }

        const borrows = await Borrow.find({ idUser: userId })
            .populate('idSach', 'tenSach tacGia namXuatBan donGia')
            .sort({ ngayMuon: -1 });

        if (!borrows.length) return res.status(404).json({ message: 'User chưa mượn sách nào' });

        res.status(200).json(borrows);
    } catch (error) {
        console.error('Lỗi khi lấy sách mượn của user:', error);
        res.status(500).json({ message: 'Lỗi khi lấy sách mượn của user', error });
    }
};

/**
 * Xem các sách đang mượn của 1 user
 * @route GET /api/borrow/user/:userId/active
 */
exports.getUserActiveBorrows = async (req, res) => {
    try {
        const { userId } = req.params;

        // Nếu role là user, chỉ cho phép xem chính mình
        if (req.user.role === 'user' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Không đủ quyền xem phiếu mượn của user khác' });
        }

        const borrows = await Borrow.find({ idUser: userId, trangThai: 'dangMuon' })
            .populate('idSach', 'tenSach tacGia namXuatBan donGia')
            .sort({ ngayMuon: -1 });

        if (!borrows.length) return res.status(404).json({ message: 'User chưa mượn sách nào đang mượn' });

        res.status(200).json(borrows);
    } catch (error) {
        console.error('Lỗi khi lấy sách đang mượn của user:', error);
        res.status(500).json({ message: 'Lỗi khi lấy sách đang mượn của user', error });
    }
};
/**
 * Sửa phiếu mượn
 * @route PUT /api/borrow/:id
 */
exports.updateBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedBorrow = await Borrow.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updatedBorrow) {
            return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
        }

        res.status(200).json({
            message: "Cập nhật phiếu mượn thành công",
            borrow: updatedBorrow
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật phiếu mượn:", error);
        res.status(500).json({
            message: "Lỗi khi cập nhật phiếu mượn",
            error
        });
    }
};
/**
 * Xóa 1 phiếu mượn
 * @route DELETE /api/borrow/:id
 */
exports.deleteBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBorrow = await Borrow.findByIdAndDelete(id);

        if (!deletedBorrow) {
            return res.status(404).json({ message: "Không tìm thấy phiếu mượn để xóa" });
        }

        res.status(200).json({
            message: "Xóa phiếu mượn thành công",
            borrow: deletedBorrow
        });
    } catch (error) {
        console.error("Lỗi khi xóa phiếu mượn:", error);
        res.status(500).json({
            message: "Lỗi khi xóa phiếu mượn",
            error
        });
    }
};
/**
 * Xóa tất cả phiếu mượn
 * @route DELETE /api/borrow
 */
exports.deleteAllBorrows = async (req, res) => {
    try {
        const result = await Borrow.deleteMany({});

        res.status(200).json({
            message: "Đã xóa tất cả phiếu mượn",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Lỗi khi xóa tất cả phiếu mượn:", error);
        res.status(500).json({
            message: "Lỗi khi xóa tất cả phiếu mượn",
            error
        });
    }
};
