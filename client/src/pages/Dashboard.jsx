import { useEffect, useState } from "react"
import axios from "axios"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FolderKanban
} from "lucide-react"

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"))

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])

  const fetchData = async () => {
    try {
      if (!user?.email) return

      const taskRes = await axios.get(
        `nextask-ai-production.up.railway.app/tasks?email=${user.email}`
      )

      const projectRes = await axios.get(
        `nextask-ai-production.up.railway.app/projects?email=${user.email}`
      )

      setTasks(taskRes.data)
      setProjects(projectRes.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length
  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length
  const totalProjects = projects.length

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-5xl font-bold mb-2">
          Dashboard
        </h1>

        <p className="text-slate-400">
          Live overview of your projects, tasks and progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Total Tasks</p>
              <h2 className="text-5xl font-bold mt-2 text-cyan-400">
                {totalTasks}
              </h2>
            </div>

            <Clock size={42} className="text-cyan-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Completed</p>
              <h2 className="text-5xl font-bold mt-2 text-green-400">
                {completedTasks}
              </h2>
            </div>

            <CheckCircle size={42} className="text-green-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Pending</p>
              <h2 className="text-5xl font-bold mt-2 text-yellow-400">
                {pendingTasks}
              </h2>
            </div>

            <AlertTriangle size={42} className="text-yellow-400" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Projects</p>
              <h2 className="text-5xl font-bold mt-2 text-purple-400">
                {totalProjects}
              </h2>
            </div>

            <FolderKanban size={42} className="text-purple-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-5">
          Recent Tasks
        </h2>

        {tasks.length === 0 ? (
          <p className="text-slate-400">
            No tasks created yet.
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-sm text-slate-400">
                    Status: {task.status}
                  </p>
                </div>

                <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-xl text-sm">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}