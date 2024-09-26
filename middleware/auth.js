const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Nếu không có token, trả về 401

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Nếu token không hợp lệ, trả về 403
    req.user = user;
    next(); // Nếu token hợp lệ, tiếp tục xử lý yêu cầu
  });
}

module.exports = authenticateToken;