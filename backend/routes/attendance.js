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
  const classId = decodeHeader(req.headers['x-class-id']);
  const connection = getConnection();
  
  let sql = `SELECT a.*, s.name as student_name, s.class_id, c.name as course_name 
              FROM attendance a
              LEFT JOIN students s ON a.student_id = s.id
              LEFT JOIN courses c ON a.course_id = c.id`;
  let params = [];
  
  if (role === '学生') {
    getStudentIdByName(username, classId, connection, (studentId) => {
      if (!studentId) {
        connection.end();
        return res.json({ success: true, data: [] });
      }
      sql += ' WHERE a.student_id = ?';
      params.push(studentId);
      sql += ' ORDER BY a.id DESC';
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取考勤列表失败' });
        res.json({ success: true, data: results });
      });
    });
  } else if (role === '教师') {
    getTeacherClassId(username, connection, (classId) => {
      if (classId) {
        sql += ' WHERE s.class_id = ?';
        params.push(classId);
      }
      sql += ' ORDER BY a.id DESC';
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取考勤列表失败' });
        res.json({ success: true, data: results });
      });
    });
  } else {
    sql += ' ORDER BY a.id DESC';
    connection.query(sql, (err, results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '获取考勤列表失败' });
      res.json({ success: true, data: results });
    });
  }
});

router.post('/', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { student_id, course_id, date, status, remark } = req.body;
  
  if (role === '学生') {
    return res.status(403).json({ success: false, message: '学生不能添加考勤' });
  }
  
  if (!student_id || !date) return res.json({ success: false, message: '学生和日期不能为空' });
  
  const connection = getConnection();
  
  if (role === '教师') {
    getTeacherClassId(username, connection, (classId) => {
      const checkSql = 'SELECT class_id FROM students WHERE id = ?';
      connection.query(checkSql, [student_id], (err, results) => {
        if (err || results.length === 0 || results[0].class_id !== classId) {
          connection.end();
          return res.status(403).json({ success: false, message: '只能管理本班学生' });
        }
        insertAttendance(connection);
      });
    });
  } else {
    insertAttendance(connection);
  }
  
  function insertAttendance(connection) {
    const sql = 'INSERT INTO attendance (student_id, course_id, date, status, remark) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [student_id, course_id, date, status || '正常', remark], (err, _results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '添加考勤失败' });
      res.json({ success: true, message: '添加成功' });
    });
  }
});

router.put('/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  const { student_id, course_id, date, status, remark } = req.body;
  
  if (role === '学生') {
    return res.status(403).json({ success: false, message: '学生不能修改考勤' });
  }
  
  const connection = getConnection();
  
  if (role === '教师') {
    getTeacherClassId(username, connection, (classId) => {
      const checkSql = 'SELECT class_id FROM students WHERE id = ?';
      connection.query(checkSql, [student_id], (err, results) => {
        if (err || results.length === 0 || results[0].class_id !== classId) {
          connection.end();
          return res.status(403).json({ success: false, message: '只能管理本班学生' });
        }
        updateAttendance(connection);
      });
    });
  } else {
    updateAttendance(connection);
  }
  
  function updateAttendance(connection) {
    const sql = 'UPDATE attendance SET student_id = ?, course_id = ?, date = ?, status = ?, remark = ? WHERE id = ?';
    connection.query(sql, [student_id, course_id, date, status, remark, id], (err, _results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '更新考勤失败' });
      res.json({ success: true, message: '更新成功' });
    });
  }
});

router.delete('/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  if (role === '学生') {
    return res.status(403).json({ success: false, message: '学生不能删除考勤' });
  }
  
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM attendance WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除考勤失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
