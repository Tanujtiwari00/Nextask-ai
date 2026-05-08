import { useEffect, useState } from "react"
import axios from "axios"

export default function Projects() {
  const user = JSON.parse(localStorage.getItem("user"))

  const [projects, setProjects] = useState([])
  const [name, setName] = useState("")

  const fetchProjects = async () => {
    const res = await axios.get(`https://nextask-ai-production.up.railway.app/projects?email=${user.email}`)
    setProjects(res.data)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const addProject = async () => {
    if (!name) return

    await await axios.post("https://nextask-ai-production.up.railway.app/projects", {
  name,
  owner_email: user.email
})

    setName("")
    fetchProjects()
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <h1 className="text-3xl font-bold mb-2">Project Management</h1>
        <p className="text-slate-400 mb-6">
          Create and manage team projects.
        </p>

        {user?.role === "Admin" ? (
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Project name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none"
            />

            <button
              onClick={addProject}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-2xl"
            >
              Add Project
            </button>
          </div>
        ) : (
          <p className="text-yellow-400">
            Only Admin users can create projects.
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-slate-900 border border-slate-800 p-6 rounded-3xl"
          >
            <h2 className="text-2xl font-semibold mb-2">{project.name}</h2>
            <p className="text-green-400">{project.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}