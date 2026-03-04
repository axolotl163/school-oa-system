const mysql = require('mysql2');
const db = require('../config/db');

function getConnection() {
  return mysql.createConnection(db);
}

function logOperation(username, operation, details) {
  const connection = getConnection();
  const sql = 'INSERT INTO operation_logs (username, operation, details, ip, created_at) VALUES (?, ?, ?, ?, NOW())';
  connection.query(sql, [username, operation, details, 'localhost'], (_err) => {
    connection.end();
  });
}

function decodeHeader(str) {
  if (!str) return '';
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

function authMiddleware(req, res, next) {
  const username = decodeHeader(req.headers['x-username']);
  if (!username) {
    return res.status(401).json({ success: false, message: '未授权访问' });
  }
  req.user = { username };
  next();
}

function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const role = decodeHeader(req.headers['x-user-role']);
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ success: false, message: '权限不足' });
    }
    next();
  };
}

module.exports = {
  logOperation,
  authMiddleware,
  roleMiddleware,
  getConnection
};
