const Book = require('../models/Book'); // đường dẫn tới file Book.js

// Thêm một sách mới
const addBook = async (req, res) => {
    try {
        const { tenSach, donGia, soQuyen, namXuatBan, tacGia, maNXB, hinhAnh } = req.body;
        const newBook = new Book({ tenSach, donGia, soQuyen, namXuatBan, tacGia, maNXB, hinhAnh });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi thêm sách', error });
    }
};

// Sửa thông tin sách theo id
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật sách', error });
    }
};

// Xóa một sách theo id
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json({ message: 'Xóa sách thành công', deletedBook });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi xóa sách', error });
    }
};

// Xóa tất cả sách
const deleteAllBooks = async (req, res) => {
    try {
        const result = await Book.deleteMany({});
        res.json({ message: 'Xóa tất cả sách thành công', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi xóa tất cả sách', error });
    }
};

// Liệt kê tất cả sách
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('maNXB');
        res.json(books);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi lấy danh sách sách', error });
    }
};

// Tìm một sách theo id
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id).populate('maNXB');
        if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tìm sách', error });
    }
};

// Tìm sách theo tên (keyword search, không phân biệt hoa thường)
const getBooksByName = async (req, res) => {
    try {
        const { tenSach } = req.query; // Lấy từ query param: /api/book/search?tenSach=keyword
        if (!tenSach) return res.status(400).json({ message: 'Vui lòng cung cấp tên sách' });

        // Sử dụng regex để tìm kiếm không phân biệt hoa thường
        const books = await Book.find({ 
            tenSach: { $regex: tenSach, $options: 'i' } 
        }).populate('maNXB');

        if (books.length === 0) return res.status(404).json({ message: 'Không tìm thấy sách nào' });

        res.json(books);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tìm sách theo tên', error });
    }
};

module.exports = {
    addBook,
    updateBook,
    deleteBook,
    deleteAllBooks,
    getAllBooks,
    getBookById,
    getBooksByName
};
