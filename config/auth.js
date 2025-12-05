const { JWT_SECRET } = require('./jwt');
const jwt = require('jsonwebtoken');

function auth(roles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        console.log(role.length);
        console.log(decoded.role);
        return res.status(403).json({ msg: "Không đủ quyền" });
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(403).json({ msg: "Token không hợp lệ" });
    }
  };
}

module.exports = auth;