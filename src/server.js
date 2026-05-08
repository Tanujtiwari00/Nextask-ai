const express = require("express")
const cors = require("cors")
const Database = require("better-sqlite3")

const app = express()
const db = new Database("taskflow.db")

app.use(cors())
app.use(express.json())

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS team (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  role TEXT
);
`)

try {
  db.prepare("ALTER TABLE tasks ADD COLUMN owner_email TEXT").run()
} catch {}

try {
  db.prepare("ALTER TABLE projects ADD COLUMN owner_email TEXT").run()
} catch {}

try {
  db.prepare("ALTER TABLE team ADD COLUMN owner_email TEXT").run()
} catch {}

// HEALTHCHECK
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "NexTask AI backend is healthy"
  })
})

// SIGNUP
app.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body

  try {
    db.prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
    ).run(name, email, password, role || "Admin")

    res.json({
      message: "Signup successful"
    })
  } catch {
    res.status(400).json({
      message: "User already exists"
    })
  }
})

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body

  const user = db
    .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
    .get(email, password)

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    })
  }

  res.json({
    message: "Login successful",
    user
  })
})

// TASKS
app.get("/tasks", (req, res) => {
  const { email } = req.query

  const tasks = db
    .prepare("SELECT * FROM tasks WHERE owner_email = ? ORDER BY id DESC")
    .all(email)

  res.json(tasks)
})

app.post("/tasks", (req, res) => {
  const { title, status, owner_email } = req.body

  const result = db
    .prepare("INSERT INTO tasks (title, status, owner_email) VALUES (?, ?, ?)")
    .run(title, status || "Pending", owner_email)

  res.json({
    id: result.lastInsertRowid,
    title,
    status: status || "Pending",
    owner_email
  })
})

app.delete("/tasks/:id", (req, res) => {
  db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id)

  res.json({
    message: "Task deleted"
  })
})

// PROJECTS
app.get("/projects", (req, res) => {
  const { email } = req.query

  const projects = db
    .prepare("SELECT * FROM projects WHERE owner_email = ? ORDER BY id DESC")
    .all(email)

  res.json(projects)
})

app.post("/projects", (req, res) => {
  const { name, owner_email } = req.body

  const result = db
    .prepare("INSERT INTO projects (name, status, owner_email) VALUES (?, ?, ?)")
    .run(name, "Active", owner_email)

  res.json({
    id: result.lastInsertRowid,
    name,
    status: "Active",
    owner_email
  })
})

// TEAM
app.get("/team", (req, res) => {
  const { email } = req.query

  const team = db
    .prepare("SELECT * FROM team WHERE owner_email = ? ORDER BY id DESC")
    .all(email)

  res.json(team)
})

app.post("/team", (req, res) => {
  const { name, role, owner_email } = req.body

  const result = db
    .prepare("INSERT INTO team (name, role, owner_email) VALUES (?, ?, ?)")
    .run(name, role || "Member", owner_email)

  res.json({
    id: result.lastInsertRowid,
    name,
    role: role || "Member",
    owner_email
  })
})

app.get("/", (req, res) => {
  res.json({
    message: "NexTask AI backend is running"
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`NexTask AI backend running on port ${PORT}`)
})