const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = `SELECT a.*, p.name as project_name 
              FROM achievements a
              LEFT JOIN projects p ON a.project_id = p.id
              ORDER BY a.id DESC`;
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取成果列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { project_id, name, type, description, publish_date } = req.body;
  if (!name) return res.json({ success: false, message: '成果名称不能为空' });
  const connection = getConnection();
  const sql = 'INSERT INTO achievements (project_id, name, type, description, publish_date) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [project_id, name, type, description, publish_date], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加成果失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM achievements WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除成果失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
