const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');

// GET /api/dashboard - aggregated stats for current user
router.get('/', authenticate, (req, res) => {
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // Projects accessible
  const projects = isAdmin
    ? db.prepare('SELECT COUNT(*) as count FROM projects').get()
    : db.prepare(`
        SELECT COUNT(*) as count FROM projects
        WHERE owner_id = ? OR id IN (SELECT project_id FROM project_members WHERE user_id = ?)
      `).get(userId, userId);

  // Tasks overview
  const taskStats = isAdmin
    ? db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done,
          SUM(CASE WHEN due_date < DATE('now') AND status != 'done' THEN 1 ELSE 0 END) as overdue
        FROM tasks
      `).get()
    : db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
          SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
          SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done,
          SUM(CASE WHEN due_date < DATE('now') AND status != 'done' THEN 1 ELSE 0 END) as overdue
        FROM tasks
        WHERE project_id IN (
          SELECT id FROM projects WHERE owner_id = ?
          UNION SELECT project_id FROM project_members WHERE user_id = ?
        )
      `).get(userId, userId);

  // My tasks (assigned to me)
  const myTasks = db.prepare(`
    SELECT t.*, p.name as project_name, u.name as assignee_name
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE t.assignee_id = ? AND t.status != 'done'
    ORDER BY
      CASE WHEN t.due_date < DATE('now') THEN 0 ELSE 1 END,
      t.due_date ASC NULLS LAST,
      CASE t.priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END
    LIMIT 10
  `).all(userId);

  // Overdue tasks (for admin: all; for member: in their projects)
  const overdueTasks = isAdmin
    ? db.prepare(`
        SELECT t.*, p.name as project_name, u.name as assignee_name
        FROM tasks t JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assignee_id = u.id
        WHERE t.due_date < DATE('now') AND t.status != 'done'
        ORDER BY t.due_date ASC LIMIT 10
      `).all()
    : db.prepare(`
        SELECT t.*, p.name as project_name, u.name as assignee_name
        FROM tasks t JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assignee_id = u.id
        WHERE t.due_date < DATE('now') AND t.status != 'done'
          AND t.project_id IN (
            SELECT id FROM projects WHERE owner_id = ?
            UNION SELECT project_id FROM project_members WHERE user_id = ?
          )
        ORDER BY t.due_date ASC LIMIT 10
      `).all(userId, userId);

  // Recent activity (latest tasks updated)
  const recentActivity = db.prepare(`
    SELECT t.*, p.name as project_name, u.name as assignee_name
    FROM tasks t JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assignee_id = u.id
    WHERE t.project_id IN (
      SELECT id FROM projects WHERE owner_id = ?
      UNION SELECT project_id FROM project_members WHERE user_id = ?
    )
    ORDER BY t.updated_at DESC LIMIT 5
  `).all(userId, userId);

  res.json({
    projects: projects.count,
    tasks: taskStats,
    myTasks,
    overdueTasks,
    recentActivity
  });
});

module.exports = router;
