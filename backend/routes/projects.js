const express = require('express');
const router = express.Router();
const { getConnection } = require('../middleware/auth');

router.get('/', (req, res) => {
  const connection = getConnection();
  const sql = 'SELECT * FROM projects ORDER BY id DESC';
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取项目列表失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { name, description, leader, budget, start_date, end_date, status } = req.body;
  if (!name) return res.json({ success: false, message: '项目名称不能为空' });
  const connection = getConnection();
  const sql = 'INSERT INTO projects (name, description, leader, budget, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [name, description, leader, budget, start_date, end_date, status || '待审批'], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加项目失败' });
    res.json({ success: true, message: '添加成功' });
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, leader, budget, start_date, end_date, status } = req.body;
  const connection = getConnection();
  const sql = 'UPDATE projects SET name = ?, description = ?, leader = ?, budget = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?';
  connection.query(sql, [name, description, leader, budget, start_date, end_date, status, id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '更新项目失败' });
    res.json({ success: true, message: '更新成功' });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM projects WHERE id = ?';
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除项目失败' });
    res.json({ success: true, message: '删除成功' });
  });
});

module.exports = router;
