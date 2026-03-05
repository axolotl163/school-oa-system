const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');
const authMiddleware = require('../middleware/auth').authMiddleware;

function decodeHeader(str) {
  if (!str) return '';
  try { return decodeURIComponent(str); } catch { return str; }
}

function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const role = decodeHeader(req.headers['x-user-role']);
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ success: false, message: '没有权限' });
    }
    next();
  };
}

function logOperation(username, operation, details) {
  const connection = getConnection();
  const sql = 'INSERT INTO operation_logs (username, operation, details, ip) VALUES (?, ?, ?, ?)';
  connection.query(sql, [username, operation, details, 'localhost'], (err) => {
    if (err) console.error('记录操作日志失败:', err);
    connection.end();
  });
}

function syncUserToStudentOrTeacher(username, role, class_id, connection) {
  return new Promise((resolve) => {
    if (role === '教师') {
      const checkSql = 'SELECT id FROM teachers WHERE name = ?';
      connection.query(checkSql, [username], (err, results) => {
        if (err) { resolve(); return; }
        if (results.length === 0) {
          const insertSql = 'INSERT INTO teachers (name, gender, title, department, phone, class_id) VALUES (?, ?, ?, ?, ?, ?)';
          connection.query(insertSql, [username, '', '', '', '', class_id], () => resolve());
        } else {
          const updateSql = 'UPDATE teachers SET class_id = ? WHERE name = ?';
          connection.query(updateSql, [class_id, username], () => resolve());
        }
      });
    } else if (role === '学生' && class_id) {
      const checkSql = 'SELECT id FROM students WHERE name = ?';
      connection.query(checkSql, [username], (err, results) => {
        if (err) { resolve(); return; }
        if (results.length === 0) {
          const insertSql = 'INSERT INTO students (name, age, class_id, phone) VALUES (?, ?, ?, ?)';
          connection.query(insertSql, [username, 18, class_id, ''], () => resolve());
        } else {
          const updateSql = 'UPDATE students SET class_id = ? WHERE name = ?';
          connection.query(updateSql, [class_id, username], () => resolve());
        }
      });
    } else {
      resolve();
    }
  });
}

function syncUsernameInStudentOrTeacher(oldUsername, newUsername, role, connection) {
  return new Promise((resolve) => {
    if (role === '教师') {
      const updateSql = 'UPDATE teachers SET name = ? WHERE name = ?';
      connection.query(updateSql, [newUsername, oldUsername], () => resolve());
    } else if (role === '学生') {
      const updateSql = 'UPDATE students SET name = ? WHERE name = ?';
      connection.query(updateSql, [newUsername, oldUsername], () => resolve());
    } else {
      resolve();
    }
  });
}

function deleteUserFromStudentOrTeacher(username, role, connection) {
  return new Promise((resolve) => {
    if (role === '教师') {
      const deleteSql = 'DELETE FROM teachers WHERE name = ?';
      connection.query(deleteSql, [username], () => resolve());
    } else if (role === '学生') {
      const deleteSql = 'DELETE FROM students WHERE name = ?';
      connection.query(deleteSql, [username], () => resolve());
    } else {
      resolve();
    }
  });
}

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT id, username, role, class_id FROM users ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取用户列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', authMiddleware, roleMiddleware(['管理员']), async (req, res) => {
  const { username, password, role, class_id } = req.body;
  
  if (role === '管理员') {
    return res.status(400).json({ success: false, message: '不能添加管理员账号' });
  }
  
  if (role === '教师' && !class_id) {
    return res.status(400).json({ success: false, message: '请选择教师所属班级' });
  }
  
  if (!username || !password) return res.json({ success: false, message: '用户名和密码不能为空' });
  
  const connection = getConnection();
  const sql = 'INSERT INTO users (username, password, role, class_id) VALUES (?, ?, ?, ?)';
  
  try {
    await new Promise((resolve, reject) => {
      connection.query(sql, [username, password, role || '学生', class_id || null], (err, results) => {
        if (err) { reject(err); return; }
        resolve(results);
      });
    });
    
    await syncUserToStudentOrTeacher(username, role, class_id, connection);
    
    logOperation(req.user.username, '添加用户', `添加用户: ${username}`);
    connection.end();
    res.json({ success: true, message: '添加成功' });
  } catch (err) {
    connection.end();
    res.status(500).json({ success: false, message: '添加用户失败，用户名可能已存在' });
  }
});

router.put('/:id', authMiddleware, roleMiddleware(['管理员']), async (req, res) => {
  const { id } = req.params;
  const { username, password, role, class_id } = req.body;
  const connection = getConnection();
  
  try {
    const oldResults = await new Promise((resolve, reject) => {
      const oldSql = 'SELECT username, role, class_id FROM users WHERE id = ?';
      connection.query(oldSql, [id], (err, results) => {
        if (err || results.length === 0) { reject(err || new Error('用户不存在')); return; }
        resolve(results);
      });
    });
    
    const oldUser = oldResults[0];
    
    if (role === '管理员') {
      connection.end();
      return res.status(400).json({ success: false, message: '不能设置管理员角色' });
    }
    
    if (role === '教师' && !class_id) {
      connection.end();
      return res.status(400).json({ success: false, message: '请选择教师所属班级' });
    }
    
    let updateSql, params;
    if (password) {
      updateSql = 'UPDATE users SET username = ?, password = ?, role = ?, class_id = ? WHERE id = ?';
      params = [username, password, role, class_id || null, id];
    } else {
      updateSql = 'UPDATE users SET username = ?, role = ?, class_id = ? WHERE id = ?';
      params = [username, role, class_id || null, id];
    }
    
    await new Promise((resolve, reject) => {
      connection.query(updateSql, params, (err) => {
        if (err) { reject(err); return; }
        resolve();
      });
    });
    
    if (oldUser.username !== username) {
      await syncUsernameInStudentOrTeacher(oldUser.username, username, oldUser.role, connection);
    }
    
    if (oldUser.role !== role || oldUser.class_id !== class_id || oldUser.username !== username) {
      await syncUserToStudentOrTeacher(username, role, class_id, connection);
    }
    
    logOperation(req.user.username, '修改用户', `修改用户ID: ${id}`);
    connection.end();
    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    connection.end();
    res.status(500).json({ success: false, message: '更新用户失败' });
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(['管理员']), async (req, res) => {
  const { id } = req.params;
  const username = decodeHeader(req.headers['x-username']);
  const connection = getConnection();
  
  try {
    const results = await new Promise((resolve, reject) => {
      const checkSql = 'SELECT username, role FROM users WHERE id = ?';
      connection.query(checkSql, [id], (err, results) => {
        if (err || results.length === 0) { reject(err || new Error('用户不存在')); return; }
        resolve(results);
      });
    });
    
    const userRole = results[0].role;
    const userToDelete = results[0].username;
    
    if (userRole === '管理员') {
      connection.end();
      return res.status(400).json({ success: false, message: '不能删除管理员账号' });
    }
    if (userToDelete === username) {
      connection.end();
      return res.status(400).json({ success: false, message: '不能删除自己的账号' });
    }
    
    await deleteUserFromStudentOrTeacher(userToDelete, userRole, connection);
    
    await new Promise((resolve, reject) => {
      const deleteSql = 'DELETE FROM users WHERE id = ?';
      connection.query(deleteSql, [id], (err) => {
        if (err) { reject(err); return; }
        resolve();
      });
    });
    
    logOperation(req.user.username, '删除用户', `删除用户ID: ${id}`);
    connection.end();
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    connection.end();
    res.status(500).json({ success: false, message: '删除用户失败' });
  }
});

router.post('/deactivate', authMiddleware, async (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { password } = req.body;
  
  if (role === '管理员') {
    return res.status(400).json({ success: false, message: '管理员不能注销账号' });
  }
  
  if (!password) return res.status(400).json({ success: false, message: '请输入密码确认' });
  const connection = getConnection();
  
  try {
    await deleteUserFromStudentOrTeacher(username, role, connection);
    
    const results = await new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE username = ? AND password = ?';
      connection.query(sql, [username, password], (err, results) => {
        if (err) { reject(err); return; }
        resolve(results);
      });
    });
    
    connection.end();
    
    if (results.affectedRows === 0) {
      return res.status(400).json({ success: false, message: '密码错误' });
    }
    
    logOperation(username, '用户注销', '用户注销账号');
    res.json({ success: true, message: '注销成功' });
  } catch (err) {
    connection.end();
    res.status(500).json({ success: false, message: '注销失败' });
  }
});

module.exports = router;
