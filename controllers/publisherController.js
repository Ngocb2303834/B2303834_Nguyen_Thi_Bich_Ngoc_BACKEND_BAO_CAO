const Publisher = require('../models/Publisher');
exports.createPublisher = async (req, res) => {
    try {
        const { tenNXB, diaChi } = req.body;

        if (!tenNXB) {
            return res.status(400).json({ msg: "Tên NXB là bắt buộc" });
        }

        const newPublisher = await Publisher.create({ tenNXB, diaChi });
        res.status(201).json(newPublisher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Lỗi server khi tạo NXB" });
    }
};
exports.getAllPublishers = async (req, res) => {
    try {
        const publishers = await Publisher.find();
        res.status(200).json(publishers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Lỗi server khi lấy danh sách NXB." });
    }
};
exports.getPublisherById = async (req, res) => {
    try {
        const { id } = req.params;
        const publisher = await Publisher.findById(id);
        if (!publisher) return res.status(404).json({ msg: "Không tìm thấy NXB." });

        res.status(200).json(publisher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Lỗi server khi tìm NXB." });
    }
};
exports.updatePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPublisher = await Publisher.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPublisher) return res.status(404).json({ msg: "Không tìm thấy NXB để cập nhật." });

        res.status(200).json({ msg: "Cập nhật NXB thành công.", publisher: updatedPublisher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Lỗi server khi cập nhật NXB." });
    }
};
exports.deletePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPublisher = await Publisher.findByIdAndDelete(id);
        if (!deletedPublisher) return res.status(404).json({ msg: "Không tìm thấy NXB để xoá." });

        res.status(200).json({ msg: "Xoá NXB thành công.", publisher: deletedPublisher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Lỗi server khi xoá NXB." });
    }
};
exports.deleteAllPublishers = async (req, res) => {
    try {
        await Publisher.deleteMany();
        res.status(200).json({ msg: "Đã xoá tất cả NXB." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Lỗi server khi xoá tất cả NXB." });
    }
};
