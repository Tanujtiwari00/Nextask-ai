import { useEffect, useState } from "react"
import axios from "axios"

export default function Tasks() {
  const user = JSON.parse(localStorage.getItem("user"))

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")

  const fetchTasks = async () => {
    const res = await axios.get(`nextask-ai-production.up.railway.app/tasks?email=${user.email}`)
    setTasks(res.data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async () => {
    if (!title) return

   await axios.post("nextask-ai-production.up.railway.app/tasks", {
  title,
  status: "Pending",
  owner_email: user.email
})

    setTitle("")
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await axios.delete(`nextask-ai-production.up.railway.app/tasks/${id}`)
    fetchTasks()
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <p className="text-slate-400 mb-6">
          Create, assign and track project tasks easily.
        </p>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-semibold transition"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="grid gap-5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex justify-between items-center shadow-lg"
          >
            <div>
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-slate-400 mt-1">Status: {task.status}</p>
            </div>

            {user?.role === "Admin" && (
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-slate-700 hover:bg-red-500 px-5 py-2 rounded-xl transition"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}