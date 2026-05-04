const express = require('express');
const router = express.Router();
const { getConnection, logOperation } = require('../middleware/auth');

function decodeHeader(str) {
  if (!str) return '';
  try { return decodeURIComponent(str); } catch { return str; }
}

router.get('/projects', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const connection = getConnection();
  
  let sql = `SELECT * FROM funding_projects WHERE status = '开放'`;
  
  if (role === '管理员' || role === '教师') {
    sql = 'SELECT * FROM funding_projects';
  }
  
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取资助项目失败' });
    res.json({ success: true, data: results });
  });
});

router.get('/projects/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'SELECT * FROM funding_projects WHERE id = ?';
  
  connection.query(sql, [id], (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取项目详情失败' });
    if (results.length === 0) return res.status(404).json({ success: false, message: '项目不存在' });
    res.json({ success: true, data: results[0] });
  });
});

router.post('/projects', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  if (role !== '管理员') {
    return res.status(403).json({ success: false, message: '只有管理员可以添加资助项目' });
  }
  
  const { name, type, amount, quota, application_start_date, application_end_date, requirements } = req.body;
  
  if (!name || !type || !amount || !quota || !application_start_date || !application_end_date) {
    return res.json({ success: false, message: '请填写完整的项目信息' });
  }
  
  const startDate = formatDate(application_start_date);
  const endDate = formatDate(application_end_date);
  
  const connection = getConnection();
  const sql = `INSERT INTO funding_projects 
    (name, type, amount, quota, application_start_date, application_end_date, requirements) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  connection.query(sql, [name, type, amount, quota, startDate, endDate, requirements], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '添加项目失败' });
    logOperation(username, '添加资助项目', `添加项目: ${name}`);
    res.json({ success: true, message: '添加成功' });
  });
});

function formatDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  return dateStr;
}

router.put('/projects/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  if (role !== '管理员') {
    return res.status(403).json({ success: false, message: '只有管理员可以修改资助项目' });
  }
  
  const { id } = req.params;
  const { name, type, amount, quota, application_start_date, application_end_date, requirements, status } = req.body;
  
  const startDate = formatDate(application_start_date);
  const endDate = formatDate(application_end_date);
  
  const connection = getConnection();
  const sql = `UPDATE funding_projects 
    SET name = ?, type = ?, amount = ?, quota = ?, application_start_date = ?, application_end_date = ?, requirements = ?, status = ? 
    WHERE id = ?`;
  
  connection.query(sql, [name, type, amount, quota, startDate, endDate, requirements, status, id], (err, _results) => {
    connection.end();
    if (err) {
      console.error('修改项目失败:', err);
      return res.status(500).json({ success: false, message: '修改项目失败' });
    }
    logOperation(username, '修改资助项目', `修改项目ID: ${id}`);
    res.json({ success: true, message: '修改成功' });
  });
});

router.delete('/projects/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  if (role !== '管理员') {
    return res.status(403).json({ success: false, message: '只有管理员可以删除资助项目' });
  }
  
  const { id } = req.params;
  const connection = getConnection();
  const sql = 'DELETE FROM funding_projects WHERE id = ?';
  
  connection.query(sql, [id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '删除项目失败' });
    logOperation(username, '删除资助项目', `删除项目ID: ${id}`);
    res.json({ success: true, message: '删除成功' });
  });
});

router.get('/applications', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const connection = getConnection();
  
  let sql = `SELECT a.*, s.name as student_name, s.class_id, p.name as project_name, p.type as project_type, p.amount as project_amount
             FROM applications a
             LEFT JOIN students s ON a.student_id = s.id
             LEFT JOIN funding_projects p ON a.project_id = p.id`;
  let params = [];
  
  if (role === '学生') {
    const studentSql = 'SELECT id FROM students WHERE name = ?';
    connection.query(studentSql, [username], (err, stuResults) => {
      if (err || stuResults.length === 0) {
        connection.end();
        return res.json({ success: true, data: [] });
      }
      sql += ' WHERE a.student_id = ?';
      params.push(stuResults[0].id);
      sql += ' ORDER BY a.created_at DESC';
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取申请列表失败' });
        res.json({ success: true, data: results });
      });
    });
  } else if (role === '教师') {
    const classSql = 'SELECT class_id FROM users WHERE username = ? AND role = "教师"';
    connection.query(classSql, [username], (err, classResults) => {
      if (err || classResults.length === 0 || !classResults[0].class_id) {
        connection.end();
        return res.json({ success: true, data: [] });
      }
      sql += ' WHERE s.class_id = ?';
      params.push(classResults[0].class_id);
      sql += ' ORDER BY a.created_at DESC';
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取申请列表失败' });
        res.json({ success: true, data: results });
      });
    });
  } else {
    sql += ' ORDER BY a.created_at DESC';
    connection.query(sql, (err, results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '获取申请列表失败' });
      res.json({ success: true, data: results });
    });
  }
});

router.get('/applications/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  
  const sql = `SELECT a.*, s.name as student_name, s.class_id, p.name as project_name, p.type as project_type, p.amount as project_amount, p.requirements
               FROM applications a
               LEFT JOIN students s ON a.student_id = s.id
               LEFT JOIN funding_projects p ON a.project_id = p.id
               WHERE a.id = ?`;
  
  connection.query(sql, [id], (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取申请详情失败' });
    if (results.length === 0) return res.status(404).json({ success: false, message: '申请不存在' });
    res.json({ success: true, data: results[0] });
  });
});

router.post('/applications', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  if (role !== '学生') {
    return res.status(403).json({ success: false, message: '只有学生可以提交申请' });
  }
  
  const { project_id, apply_reason, materials } = req.body;
  
  if (!project_id || !apply_reason) {
    return res.json({ success: false, message: '请填写完整的申请信息' });
  }
  
  const connection = getConnection();
  
  const studentSql = 'SELECT id FROM students WHERE name = ?';
  connection.query(studentSql, [username], (err, stuResults) => {
    if (err || stuResults.length === 0) {
      connection.end();
      return res.status(500).json({ success: false, message: '获取学生信息失败' });
    }
    
    const student_id = stuResults[0].id;
    
    const projectSql = 'SELECT * FROM funding_projects WHERE id = ?';
    connection.query(projectSql, [project_id], (err, projResults) => {
      if (err || projResults.length === 0) {
        connection.end();
        return res.json({ success: false, message: '项目不存在' });
      }
      
      const project = projResults[0];
      const now = new Date().toISOString().split('T')[0];
      
      if (now < project.application_start_date || now > project.application_end_date) {
        connection.end();
        return res.json({ success: false, message: '不在申请时间范围内' });
      }
      
      const checkSql = 'SELECT id FROM applications WHERE student_id = ? AND project_id = ?';
      connection.query(checkSql, [student_id, project_id], (err, checkResults) => {
        if (err) {
          connection.end();
          return res.status(500).json({ success: false, message: '检查申请状态失败' });
        }
        
        if (checkResults.length > 0) {
          connection.end();
          return res.json({ success: false, message: '您已申请过该项目' });
        }
        
        const sql = 'INSERT INTO applications (student_id, project_id, apply_reason, materials) VALUES (?, ?, ?, ?)';
        connection.query(sql, [student_id, project_id, apply_reason, materials], (err, _results) => {
          connection.end();
          if (err) return res.status(500).json({ success: false, message: '提交申请失败' });
          logOperation(username, '提交资助申请', `申请项目ID: ${project_id}`);
          res.json({ success: true, message: '申请提交成功' });
        });
      });
    });
  });
});

router.put('/applications/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  const { apply_reason, materials } = req.body;
  
  if (role !== '学生') {
    return res.status(403).json({ success: false, message: '只有学生可以修改申请' });
  }
  
  const connection = getConnection();
  
  const studentSql = 'SELECT id FROM students WHERE name = ?';
  connection.query(studentSql, [username], (err, stuResults) => {
    if (err || stuResults.length === 0) {
      connection.end();
      return res.status(500).json({ success: false, message: '获取学生信息失败' });
    }
    
    const student_id = stuResults[0].id;
    
    const checkSql = 'SELECT status FROM applications WHERE id = ? AND student_id = ?';
    connection.query(checkSql, [id, student_id], (err, results) => {
      if (err || results.length === 0) {
        connection.end();
        return res.status(404).json({ success: false, message: '申请不存在' });
      }
      
      if (results[0].status !== '待审核') {
        connection.end();
        return res.json({ success: false, message: '申请已进入审核流程，无法修改' });
      }
      
      const sql = 'UPDATE applications SET apply_reason = ?, materials = ? WHERE id = ?';
      connection.query(sql, [apply_reason, materials, id], (err, _results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '修改申请失败' });
        res.json({ success: true, message: '修改成功' });
      });
    });
  });
});

router.delete('/applications/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  
  if (role !== '学生') {
    return res.status(403).json({ success: false, message: '只有学生可以撤回申请' });
  }
  
  const connection = getConnection();
  
  const studentSql = 'SELECT id FROM students WHERE name = ?';
  connection.query(studentSql, [username], (err, stuResults) => {
    if (err || stuResults.length === 0) {
      connection.end();
      return res.status(500).json({ success: false, message: '获取学生信息失败' });
    }
    
    const student_id = stuResults[0].id;
    
    const checkSql = 'SELECT status FROM applications WHERE id = ? AND student_id = ?';
    connection.query(checkSql, [id, student_id], (err, results) => {
      if (err || results.length === 0) {
        connection.end();
        return res.status(404).json({ success: false, message: '申请不存在' });
      }
      
      if (results[0].status !== '待审核') {
        connection.end();
        return res.json({ success: false, message: '申请已进入审核流程，无法撤回' });
      }
      
      const sql = 'DELETE FROM applications WHERE id = ?';
      connection.query(sql, [id], (err, _results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '撤回申请失败' });
        logOperation(username, '撤回资助申请', `撤回申请ID: ${id}`);
        res.json({ success: true, message: '撤回成功' });
      });
    });
  });
});

router.get('/approvals/application/:applicationId', (req, res) => {
  const { applicationId } = req.params;
  const connection = getConnection();
  
  const sql = `SELECT * FROM approvals WHERE application_id = ? ORDER BY approval_level ASC`;
  
  connection.query(sql, [applicationId], (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取审核记录失败' });
    res.json({ success: true, data: results });
  });
});

router.post('/approvals', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  const { application_id, status, comment } = req.body;
  
  if (!application_id || !status) {
    return res.json({ success: false, message: '请填写完整的审核信息' });
  }
  
  const connection = getConnection();
  
  const applicationSql = `SELECT a.*, s.class_id, p.name as project_name
                         FROM applications a
                         LEFT JOIN students s ON a.student_id = s.id
                         LEFT JOIN funding_projects p ON a.project_id = p.id
                         WHERE a.id = ?`;
  
  connection.query(applicationSql, [application_id], (err, appResults) => {
    if (err || appResults.length === 0) {
      connection.end();
      return res.status(404).json({ success: false, message: '申请不存在' });
    }
    
    const application = appResults[0];
    
    if (role === '教师') {
      const classSql = 'SELECT class_id FROM users WHERE username = ? AND role = "教师"';
      connection.query(classSql, [username], (err, classResults) => {
        if (err || classResults.length === 0 || !classResults[0].class_id) {
          connection.end();
          return res.status(403).json({ success: false, message: '教师没有绑定班级' });
        }
        
        if (application.class_id !== classResults[0].class_id) {
          connection.end();
          return res.status(403).json({ success: false, message: '只能审核本班学生的申请' });
        }
        
        approve(1, connection);
      });
    } else if (role === '辅导员') {
      approve(1, connection);
    } else if (role === '学院管理员') {
      approve(2, connection);
    } else if (role === '管理员') {
      approve(3, connection);
    } else {
      connection.end();
      return res.status(403).json({ success: false, message: '没有审核权限' });
    }
    
    function approve(level, conn) {
      const checkSql = 'SELECT COUNT(*) as count FROM approvals WHERE application_id = ? AND approval_level = ?';
      conn.query(checkSql, [application_id, level], (err, checkResults) => {
        if (err) {
          conn.end();
          return res.status(500).json({ success: false, message: '检查审核记录失败' });
        }
        
        if (checkResults[0].count > 0) {
          conn.end();
          return res.json({ success: false, message: '该审核节点已处理' });
        }
        
        const prevLevel = level - 1;
        if (prevLevel > 0) {
          const prevSql = 'SELECT status FROM approvals WHERE application_id = ? AND approval_level = ?';
          conn.query(prevSql, [application_id, prevLevel], (err, prevResults) => {
            if (err) {
              conn.end();
              return res.status(500).json({ success: false, message: '检查上一级审核失败' });
            }
            
            if (prevResults.length === 0 || prevResults[0].status !== '通过') {
              conn.end();
              return res.json({ success: false, message: '上一级审核未通过或未审核' });
            }
            
            insertApproval(conn, level);
          });
        } else {
          insertApproval(conn, level);
        }
      });
    }
    
    function insertApproval(conn, level) {
      const sql = 'INSERT INTO approvals (application_id, approver, approver_role, approval_level, status, comment) VALUES (?, ?, ?, ?, ?, ?)';
      conn.query(sql, [application_id, username, role, level, status, comment], (err, _results) => {
        if (err) {
          conn.end();
          return res.status(500).json({ success: false, message: '保存审核记录失败' });
        }
        
        let newStatus = '待审核';
        if (status === '驳回') {
          newStatus = '已驳回';
        } else if (level === 3) {
          newStatus = '已通过';
        }
        
        const updateAppSql = 'UPDATE applications SET status = ? WHERE id = ?';
        conn.query(updateAppSql, [newStatus, application_id], (err) => {
          conn.end();
          if (err) return res.status(500).json({ success: false, message: '更新申请状态失败' });
          logOperation(username, '审核资助申请', `申请ID: ${application_id}, 审核级别: ${level}, 结果: ${status}`);
          res.json({ success: true, message: '审核成功' });
        });
      });
    }
  });
});

router.get('/notices', (req, res) => {
  const connection = getConnection();
  
  const sql = `SELECT n.*, p.name as project_name, p.type as project_type
               FROM public_notices n
               LEFT JOIN funding_projects p ON n.project_id = p.id
               WHERE n.status = '公示中'
               ORDER BY n.start_date DESC`;
  
  connection.query(sql, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取公示列表失败' });
    res.json({ success: true, data: results });
  });
});

router.get('/notices/:id', (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  
  const sql = `SELECT n.*, p.name as project_name, p.type as project_type
               FROM public_notices n
               LEFT JOIN funding_projects p ON n.project_id = p.id
               WHERE n.id = ?`;
  
  connection.query(sql, [id], (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取公示详情失败' });
    if (results.length === 0) return res.status(404).json({ success: false, message: '公示不存在' });
    res.json({ success: true, data: results[0] });
  });
});

router.post('/notices', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  if (role !== '管理员' && role !== '教师') {
    return res.status(403).json({ success: false, message: '没有发布公示的权限' });
  }
  
  const { project_id, content, start_date, end_date } = req.body;
  
  if (!project_id || !content || !start_date || !end_date) {
    return res.json({ success: false, message: '请填写完整的公示信息' });
  }
  
  const connection = getConnection();
  
  const projectSql = 'SELECT * FROM funding_projects WHERE id = ?';
  connection.query(projectSql, [project_id], (err, projResults) => {
    if (err || projResults.length === 0) {
      connection.end();
      return res.json({ success: false, message: '项目不存在' });
    }
    
    const sql = 'INSERT INTO public_notices (project_id, content, start_date, end_date) VALUES (?, ?, ?, ?)';
    connection.query(sql, [project_id, content, start_date, end_date], (err, results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '发布公示失败' });
      
      const noticeId = results.insertId;
      logOperation(username, '发布公示', `公示ID: ${noticeId}, 项目ID: ${project_id}`);
      res.json({ success: true, message: '发布成功', noticeId });
    });
  });
});

router.post('/notices/:id/objections', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const { id } = req.params;
  const { content } = req.body;
  
  if (!content) {
    return res.json({ success: false, message: '请填写异议内容' });
  }
  
  const connection = getConnection();
  
  const noticeSql = 'SELECT status FROM public_notices WHERE id = ?';
  connection.query(noticeSql, [id], (err, results) => {
    if (err || results.length === 0) {
      connection.end();
      return res.status(404).json({ success: false, message: '公示不存在' });
    }
    
    if (results[0].status !== '公示中') {
      connection.end();
      return res.json({ success: false, message: '公示已结束，无法提交异议' });
    }
    
    const sql = 'INSERT INTO objections (notice_id, applicant, content) VALUES (?, ?, ?)';
    connection.query(sql, [id, username, content], (err, _results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '提交异议失败' });
      logOperation(username, '提交异议', `公示ID: ${id}`);
      res.json({ success: true, message: '异议提交成功' });
    });
  });
});

router.get('/objections', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const connection = getConnection();
  
  let sql = `SELECT o.*, n.project_id, p.name as project_name
             FROM objections o
             LEFT JOIN public_notices n ON o.notice_id = n.id
             LEFT JOIN funding_projects p ON n.project_id = p.id`;
  let params = [];
  
  if (role !== '管理员') {
    sql += ' WHERE o.applicant = ?';
    params.push(username);
  }
  
  sql += ' ORDER BY o.created_at DESC';
  
  connection.query(sql, params, (err, results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '获取异议列表失败' });
    res.json({ success: true, data: results });
  });
});

router.put('/objections/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  if (role !== '管理员') {
    return res.status(403).json({ success: false, message: '只有管理员可以处理异议' });
  }
  
  const { id } = req.params;
  const { status, reply } = req.body;
  
  const connection = getConnection();
  const sql = 'UPDATE objections SET status = ?, reply = ? WHERE id = ?';
  
  connection.query(sql, [status, reply, id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '处理异议失败' });
    logOperation(username, '处理异议', `异议ID: ${id}, 状态: ${status}`);
    res.json({ success: true, message: '处理成功' });
  });
});

router.get('/distributions', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const connection = getConnection();
  
  let sql = `SELECT d.*, a.student_id, s.name as student_name, s.class_id, p.name as project_name, p.type as project_type
             FROM distributions d
             LEFT JOIN applications a ON d.application_id = a.id
             LEFT JOIN students s ON a.student_id = s.id
             LEFT JOIN funding_projects p ON a.project_id = p.id`;
  let params = [];
  
  if (role === '学生') {
    const studentSql = 'SELECT id FROM students WHERE name = ?';
    connection.query(studentSql, [username], (err, stuResults) => {
      if (err || stuResults.length === 0) {
        connection.end();
        return res.json({ success: true, data: [] });
      }
      sql += ' WHERE a.student_id = ?';
      params.push(stuResults[0].id);
      sql += ' ORDER BY d.created_at DESC';
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取发放记录失败' });
        res.json({ success: true, data: results });
      });
    });
  } else if (role === '教师') {
    const classSql = 'SELECT class_id FROM users WHERE username = ? AND role = "教师"';
    connection.query(classSql, [username], (err, classResults) => {
      if (err || classResults.length === 0 || !classResults[0].class_id) {
        connection.end();
        return res.json({ success: true, data: [] });
      }
      sql += ' WHERE s.class_id = ?';
      params.push(classResults[0].class_id);
      sql += ' ORDER BY d.created_at DESC';
      connection.query(sql, params, (err, results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '获取发放记录失败' });
        res.json({ success: true, data: results });
      });
    });
  } else {
    sql += ' ORDER BY d.created_at DESC';
    connection.query(sql, (err, results) => {
      connection.end();
      if (err) return res.status(500).json({ success: false, message: '获取发放记录失败' });
      res.json({ success: true, data: results });
    });
  }
});

router.post('/distributions', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  
  if (role !== '管理员') {
    return res.status(403).json({ success: false, message: '只有管理员可以生成发放记录' });
  }
  
  const { application_id, amount } = req.body;
  
  if (!application_id || !amount) {
    return res.json({ success: false, message: '请填写完整的发放信息' });
  }
  
  const connection = getConnection();
  
  const appSql = 'SELECT status FROM applications WHERE id = ?';
  connection.query(appSql, [application_id], (err, appResults) => {
    if (err || appResults.length === 0) {
      connection.end();
      return res.status(404).json({ success: false, message: '申请不存在' });
    }
    
    if (appResults[0].status !== '已通过') {
      connection.end();
      return res.json({ success: false, message: '申请未通过审核，无法发放' });
    }
    
    const checkSql = 'SELECT id FROM distributions WHERE application_id = ?';
    connection.query(checkSql, [application_id], (err, checkResults) => {
      if (err) {
        connection.end();
        return res.status(500).json({ success: false, message: '检查发放记录失败' });
      }
      
      if (checkResults.length > 0) {
        connection.end();
        return res.json({ success: false, message: '该申请已有发放记录' });
      }
      
      const sql = 'INSERT INTO distributions (application_id, amount) VALUES (?, ?)';
      connection.query(sql, [application_id, amount], (err, _results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '生成发放记录失败' });
        logOperation(username, '生成发放记录', `申请ID: ${application_id}, 金额: ${amount}`);
        res.json({ success: true, message: '生成成功' });
      });
    });
  });
});

router.put('/distributions/:id', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  const { status, distribution_date, failure_reason } = req.body;
  
  if (role !== '管理员') {
    return res.status(403).json({ success: false, message: '只有管理员可以更新发放状态' });
  }
  
  const connection = getConnection();
  const sql = 'UPDATE distributions SET status = ?, distribution_date = ?, failure_reason = ? WHERE id = ?';
  
  connection.query(sql, [status, distribution_date, failure_reason, id], (err, _results) => {
    connection.end();
    if (err) return res.status(500).json({ success: false, message: '更新发放状态失败' });
    logOperation(username, '更新发放状态', `发放ID: ${id}, 状态: ${status}`);
    res.json({ success: true, message: '更新成功' });
  });
});

router.post('/distributions/:id/confirm', (req, res) => {
  const username = decodeHeader(req.headers['x-username']);
  const role = decodeHeader(req.headers['x-user-role']);
  const { id } = req.params;
  
  if (role !== '学生') {
    return res.status(403).json({ success: false, message: '只有学生可以确认到账' });
  }
  
  const connection = getConnection();
  
  const studentSql = 'SELECT id FROM students WHERE name = ?';
  connection.query(studentSql, [username], (err, stuResults) => {
    if (err || stuResults.length === 0) {
      connection.end();
      return res.status(500).json({ success: false, message: '获取学生信息失败' });
    }
    
    const student_id = stuResults[0].id;
    
    const checkSql = `SELECT d.*, a.student_id
                      FROM distributions d
                      LEFT JOIN applications a ON d.application_id = a.id
                      WHERE d.id = ?`;
    
    connection.query(checkSql, [id], (err, results) => {
      if (err || results.length === 0) {
        connection.end();
        return res.status(404).json({ success: false, message: '发放记录不存在' });
      }
      
      if (results[0].student_id !== student_id) {
        connection.end();
        return res.status(403).json({ success: false, message: '只能确认自己的发放记录' });
      }
      
      if (results[0].status !== '已发放') {
        connection.end();
        return res.json({ success: false, message: '发放状态不是已发放，无法确认' });
      }
      
      if (results[0].confirmed_at) {
        connection.end();
        return res.json({ success: false, message: '已确认过到账' });
      }
      
      const sql = 'UPDATE distributions SET confirmed_at = NOW() WHERE id = ?';
      connection.query(sql, [id], (err, _results) => {
        connection.end();
        if (err) return res.status(500).json({ success: false, message: '确认到账失败' });
        logOperation(username, '确认到账', `发放ID: ${id}`);
        res.json({ success: true, message: '确认成功' });
      });
    });
  });
});

module.exports = router;