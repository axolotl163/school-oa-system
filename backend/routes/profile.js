const express = require('express');
const router = express.Router();
const { logOperation, getConnection } = require('../middleware/auth');

function decodeHeader(str) {
  if (!str) return '';
  try { return decodeURIComponent(str); } catch { return str; }
}

router.post('/update-profile', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const { phone, oldPassword, newPassword } = req.body;
  
  const connection = getConnection();
  
  if (newPassword) {
    if (!oldPassword) {
      connection.end();
      return res.status(400).json({ success: false, message: '请输入原密码' });
    }
    const checkSql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    connection.query(checkSql, [username, oldPassword], (err, results) => {
      if (err || results.length === 0) {
        connection.end();
        return res.status(400).json({ success: false, message: '原密码错误' });
      }
      
      const updateSql = 'UPDATE users SET password = ? WHERE username = ?';
      connection.query(updateSql, [newPassword, username], (err) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '更新密码失败' });
        logOperation(username, '修改密码', '用户修改密码成功');
        res.json({ success: true, message: '密码修改成功' });
      });
    });
  } else {
    if (phone !== undefined) {
      // 更新users表中的手机号（适用于管理员和其他角色）
      const userSql = 'UPDATE users SET phone = ? WHERE username = ?';
      connection.query(userSql, [phone, username], (err) => {
        if (err) console.error('更新用户电话失败:', err);
      });
      // 更新students表中的手机号
      const studentSql = 'UPDATE students SET phone = ? WHERE name = ?';
      connection.query(studentSql, [phone, username], (err) => {
        if (err) console.error('更新学生电话失败:', err);
      });
      // 更新teachers表中的手机号
      const teacherSql = 'UPDATE teachers SET phone = ? WHERE name = ?';
      connection.query(teacherSql, [phone, username], (err) => {
        if (err) console.error('更新教师电话失败:', err);
      });
    }
    logOperation(username, '更新个人信息', '用户更新个人信息');
    connection.end();
    res.json({ success: true, message: '个人信息更新成功' });
  }
});

module.exports = router;
