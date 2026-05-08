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

// SIGNUP
app.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const stmt = db.prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
    )

    stmt.run(name, email, password, role || "Member")

    res.json({ message: "Signup successful" })
  } catch (err) {
    res.status(400).json({ message: "User already exists" })
  }
})

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body

  const user = db
    .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
    .get(email, password)

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  res.json({ message: "Login successful", user })
})

// TASKS
app.get("/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks ORDER BY id DESC").all()
  res.json(tasks)
})

app.post("/tasks", (req, res) => {
  const { title, status } = req.body

  const result = db
    .prepare("INSERT INTO tasks (title, status) VALUES (?, ?)")
    .run(title, status || "Pending")

  res.json({ id: result.lastInsertRowid, title, status: status || "Pending" })
})

app.delete("/tasks/:id", (req, res) => {
  db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id)
  res.json({ message: "Task deleted" })
})

// PROJECTS
app.get("/projects", (req, res) => {
  const projects = db.prepare("SELECT * FROM projects ORDER BY id DESC").all()
  res.json(projects)
})

app.post("/projects", (req, res) => {
  const { name } = req.body

  const result = db
    .prepare("INSERT INTO projects (name, status) VALUES (?, ?)")
    .run(name, "Active")

  res.json({ id: result.lastInsertRowid, name, status: "Active" })
})

// TEAM
app.get("/team", (req, res) => {
  const team = db.prepare("SELECT * FROM team ORDER BY id DESC").all()
  res.json(team)
})

app.post("/team", (req, res) => {
  const { name, role } = req.body

  const result = db
    .prepare("INSERT INTO team (name, role) VALUES (?, ?)")
    .run(name, role || "Member")

  res.json({ id: result.lastInsertRowid, name, role: role || "Member" })
})

app.get("/", (req, res) => {
  res.json({ message: "NexTask AI backend is running" })
})

const PORT = process.env.PORT || 3000

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "NexTask AI backend is healthy"
  })
  
})
app.listen(PORT, () => {
  console.log(`NexTask AI backend running on port ${PORT}`)
})