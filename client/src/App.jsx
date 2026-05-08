import { useState } from "react"
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Bell,
  Search
} from "lucide-react"

import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Tasks from "./pages/Tasks"
import Team from "./pages/Team"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function SidebarLink({ to, icon, text }) {
  const location = useLocation()
  const active = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 border ${
        active
          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10"
          : "bg-slate-800/70 border-slate-700 hover:border-cyan-400 hover:bg-cyan-500/10 text-slate-300"
      }`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </Link>
  )
}

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user")

  if (!user) {
    window.location.href = "/login"
    return null
  }

  return children
}

function Layout() {
  const user = JSON.parse(localStorage.getItem("user"))
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="w-72 border-r border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              NexTask AI
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Smart Team Productivity Platform
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-3 mb-8">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-4">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} text="Dashboard" />
            <SidebarLink to="/projects" icon={<FolderKanban size={20} />} text="Projects" />
            <SidebarLink to="/tasks" icon={<CheckSquare size={20} />} text="Tasks" />
            <SidebarLink to="/team" icon={<Users size={20} />} text="Team" />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-4 mt-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h3 className="font-semibold">{user?.name || "User"}</h3>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <p className="text-xs text-cyan-400 mt-1">{user?.role || "Member"}</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("user")
              window.location.href = "/login"
            }}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 py-2 rounded-2xl transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-10 py-6 border-b border-slate-800 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
          <div>
            <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
            <p className="text-slate-400 text-sm">
              Manage projects and monitor team performance.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-slate-800 border border-slate-700 p-3 rounded-2xl hover:border-cyan-400 transition"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-4 z-50">
                <h3 className="font-bold text-lg mb-4">
                  Notifications
                </h3>

                <div className="space-y-3">
                  <div className="bg-slate-800 p-4 rounded-2xl">
                    <p className="font-medium">New task created</p>
                    <p className="text-sm text-slate-400">
                      A task was recently added.
                    </p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-2xl">
                    <p className="font-medium">Project updated</p>
                    <p className="text-sm text-slate-400">
                      Project status is active.
                    </p>
                  </div>

                  <div className="bg-slate-800 p-4 rounded-2xl">
                    <p className="font-medium">Team member added</p>
                    <p className="text-sm text-slate-400">
                      A new member joined the team.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}