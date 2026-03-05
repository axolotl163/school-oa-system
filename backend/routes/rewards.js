const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

function decodeHeader(str) {
  if (!str) return '';
  try { return decodeURIComponent(str); } catch { return str; }
}

function getTeacherClassId(username, connection, callback) {
  const sql = 'SELECT class_id FROM users WHERE username = ? AND role = "教师"';
  connection.query(sql, [username], (err, results) => {
    if (err || results.length === 0 || !results[0].class_id) {
      callback(null);
    } else {
      callback(results[0].class_id);
    }
  });
}

function getStudentIdByName(username, classId, connection, callback) {
  let sql = 'SELECT id FROM students WHERE name = ?';
  let params = [username];
  if (classId) {
    sql += ' AND class_id = ?';
    params.push(classId);
  }
  connection.query(sql, params, (err, results) => {
    if (err || results.length === 0) {
      callback(null);
    } else {
      callback(results[0].id);
    }
  });
}

router.get('/', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const connection = getConnection();
  
  let sql = `SELECT r.*, s.name as student_name, s.class_id
              FROM rewards_punishments r
              LEFT JOIN students s ON r.student_id = s.id`;
  let params = [];
  
  if (role === '学生') {
    getStudentIdByName(username, null, connection, (studentId) => {
      if (!studentId) {
        connection.end();
        return res.json({ success: true, data: [] });
      }
      sql += ' WHERE r.student_id = ?';
      params.push(studentId);
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取奖惩列表失败' });
        res.json({ success: true, data: results });
      });
    });
  } else if (role === '教师') {
    getTeacherClassId(username, connection, (classId) => {
      if (classId) {
        sql += ' WHERE s.class_id = ?';
        params.push(classId);
      }
      sql += ' ORDER BY r.id DESC';
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取奖惩列表失败' });
        res.json({ success: true, data: results });
      });
    });
  } else {
    sql += ' ORDER BY r.id DESC';
    connection.query(sql, (err, results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '获取奖惩列表失败' });
      res.json({ success: true, data: results });
    });
  }
});

router.post('/', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { student_id, type, reason, amount, date, status } = req.body;
  
  if (role === '学生') {
    return res.status(403).json({ success: false, message: '学生不能添加奖惩' });
  }
  
  if (!student_id || !type || !date) return res.json({ success: false, message: '学生、类型、日期不能为空' });
  const connection = getConnection();
  
  if (role === '教师') {
    getTeacherClassId(username, connection, (classId) => {
      if (!classId) {
        connection.end();
        return res.status(403).json({ success: false, message: '教师没有绑定班级' });
      }
      const checkSql = 'SELECT class_id FROM students WHERE id = ?';
      connection.query(checkSql, [student_id], (err, results) => {
        if (err || results.length === 0 || results[0].class_id !== classId) {
          connection.end();
          return res.status(403).json({ success: false, message: '只能管理本班学生' });
        }
        insertReward(connection);
      });
    });
  } else {
    insertReward(connection);
  }
  
  function insertReward(connection) {
    const sql = 'INSERT INTO rewards_punishments (student_id, type, reason, amount, date, status) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [student_id, type, reason, amount, date, status || '待审批'], (err, _results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '添加奖惩失败' });
      res.json({ success: true, message: '添加成功' });
    });
  }
});

router.put('/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  const { student_id, type, reason, amount, date, status } = req.body;
  
  if (role === '学生') {
    return res.status(403).json({ success: false, message: '学生不能修改奖惩' });
  }
  
  const connection = getConnection();
  
  if (role === '教师') {
    getTeacherClassId(username, connection, (classId) => {
      if (!classId) {
        connection.end();
        return res.status(403).json({ success: false, message: '教师没有绑定班级' });
      }
      const checkSql = 'SELECT r.id, s.class_id FROM rewards_punishments r LEFT JOIN students s ON r.student_id = s.id WHERE r.id = ?';
      connection.query(checkSql, [id], (err, results) => {
        if (err || results.length === 0) {
          connection.end();
          return res.status(404).json({ success: false, message: '奖惩记录不存在' });
        }
        if (results[0].class_id !== classId) {
          connection.end();
          return res.status(403).json({ success: false, message: '只能管理本班学生' });
        }
        updateReward(connection);
      });
    });
  } else {
    updateReward(connection);
  }
  
  function updateReward(connection) {
    const sql = 'UPDATE rewards_punishments SET student_id = ?, type = ?, reason = ?, amount = ?, date = ?, status = ? WHERE id = ?';
    connection.query(sql, [student_id, type, reason, amount, date, status, id], (err, _results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '更新奖惩失败' });
      res.json({ success: true, message: '更新成功' });
    });
  }
});

router.delete('/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  
  if (role === '学生') {
    return res.status(403).json({ success: false, message: '学生不能删除奖惩' });
  }
  
  const connection = getConnection();
  
  if (role === '教师') {
    getTeacherClassId(username, connection, (classId) => {
      if (!classId) {
        connection.end();
        return res.status(403).json({ success: false, message: '教师没有绑定班级' });
      }
      const checkSql = 'SELECT r.id, s.class_id FROM rewards_punishments r LEFT JOIN students s ON r.student_id = s.id WHERE r.id = ?';
      connection.query(checkSql, [id], (err, results) => {
        if (err || results.length === 0) {
          connection.end();
          return res.status(404).json({ success: false, message: '奖惩记录不存在' });
        }
        if (results[0].class_id !== classId) {
          connection.end();
          return res.status(403).json({ success: false, message: '只能管理本班学生' });
        }
        deleteReward(connection);
      });
    });
  } else {
    deleteReward(connection);
  }
  
  function deleteReward(connection) {
    const sql = 'DELETE FROM rewards_punishments WHERE id = ?';
    connection.query(sql, [id], (err, _results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '删除奖惩失败' });
      res.json({ success: true, message: '删除成功' });
    });
  }
});

module.exports = router;
