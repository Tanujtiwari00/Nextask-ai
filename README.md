# NexTask AI 🚀

A modern full-stack team task management platform with role-based access control, project management, authentication, and persistent SQLite storage.

## 🌟 Features

### Authentication
- User Signup/Login
- Protected Routes
- Logout Functionality
- Role-Based Access (Admin / Member)

### Dashboard
- Live task statistics
- Project overview
- Team performance
- Notifications panel

### Task Management
- Create tasks
- Delete tasks (Admin only)
- Persistent SQLite storage
- Real-time updates

### Project Management
- Add projects (Admin only)
- Project status tracking
- Persistent project database

### Team Management
- Add team members (Admin only)
- Member role management
- Team overview

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- TailwindCSS
- React Router DOM
- Axios
- Lucide React Icons

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)

## 🔐 Role-Based Access

### Admin
- Full access
- Add/Delete tasks
- Add projects
- Add team members

### Member
- View-only dashboard
- View tasks/projects/team

## 📦 Installation

### Backend
```bash
npm install
npm run dev