const express = require('express');
const router = express.Router();
const { logOperation, getConnection } = require('../middleware/auth');

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

router.get('/', authMiddleware, roleMiddleware(['管理员']), (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT id, username, role, created_at FROM users ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '获取用户列表失败' });
    }
    res.json({ success: true, data: results });
  });
});

router.post('/', authMiddleware, roleMiddleware(['管理员']), (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: '用户名和密码不能为空' });
  }
  const connection = getConnection();
  const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  connection.query(sql, [username, password, role || '学生'], (err, _results) => {
    if (err) {
      connection.end();
      return res.status(500).json({ success: false, message: '添加用户失败，用户名可能已存在' });
    }
    logOperation(req.user.username, '添加用户', `添加用户: ${username}`);
    connection.end();
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', authMiddleware, roleMiddleware(['管理员']), (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  const connection = getConnection();
  
  if (password) {
    const sql = 'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?';
    connection.query(sql, [username, password, role, id], (err, _results) => {
      connection.end();
      if (err) {
        return res.status(500).json({ success: false, message: '更新用户失败' });
      }
      logOperation(req.user.username, '更新用户', `更新用户ID: ${id}`);
      res.json({ success: true, message: '更新成功' });
    });
  } else {
    const sql = 'UPDATE users SET username = ?, role = ? WHERE id = ?';
    connection.query(sql, [username, role, id], (err, _results) => {
      connection.end();
      if (err) {
        return res.status(500).json({ success: false, message: '更新用户失败' });
      }
      logOperation(req.user.username, '更新用户', `更新用户ID: ${id}`);
      res.json({ success: true, message: '更新成功' });
    });
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(['管理员']), (req, res) => {
  const { id } = req.params;
  const currentUsername = decodeHeader(req.headers['x-username']);
  
  const connection = getConnection();
  const checkSql = 'SELECT username FROM users WHERE id = ?';
  connection.query(checkSql, [id], (err, results) => {
    if (err || results.length === 0) {
      connection.end();
      return res.status(500).json({ success: false, message: '用户不存在' });
    }
    
    if (results[0].username === currentUsername) {
      connection.end();
      return res.status(400).json({ success: false, message: '不能删除自己的账号' });
    }
    
    const deleteSql = 'DELETE FROM users WHERE id = ?';
    connection.query(deleteSql, [id], (err, _results) => {
      connection.end();
      if (err) {
        return res.status(500).json({ success: false, message: '删除用户失败' });
      }
      logOperation(req.user.username, '删除用户', `删除用户ID: ${id}`);
      res.json({ success: true, message: '删除成功' });
    });
  });
});

router.post('/deactivate', authMiddleware, (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ success: false, message: '请输入密码确认' });
  }
  
  const connection = getConnection();
  const sql = 'DELETE FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (err, results) => {
    connection.end();
    if (err) {
      return res.status(500).json({ success: false, message: '注销失败' });
    }
    if (results.affectedRows === 0) {
      return res.status(400).json({ success: false, message: '密码错误' });
    }
    logOperation(username, '用户注销', '用户注销账号');
    res.json({ success: true, message: '注销成功' });
  });
});

module.exports = router;
