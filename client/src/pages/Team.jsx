import { useEffect, useState } from "react"
import axios from "axios"

export default function Team() {
  const user = JSON.parse(localStorage.getItem("user"))

  const [members, setMembers] = useState([])
  const [name, setName] = useState("")

  const fetchMembers = async () => {
    try {
      if (!user?.email) return

      const res = await axios.get(
        `https://nextask-ai-production.up.railway.app/team?email=${user.email}`
      )

      setMembers(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const addMember = async () => {
    try {
      if (!name || !user?.email) return

      await axios.post("https://nextask-ai-production.up.railway.app/team", {
        name,
        role: "Member",
        owner_email: user.email
      })

      setName("")
      fetchMembers()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <h1 className="text-3xl font-bold mb-2">Team Management</h1>

        <p className="text-slate-400 mb-6">
          Add and manage team members for your workspace.
        </p>

        {user?.role === "Admin" ? (
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Team member name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 outline-none"
            />

            <button
              onClick={addMember}
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-2xl"
            >
              Add Member
            </button>
          </div>
        ) : (
          <p className="text-yellow-400">
            Only Admin users can add team members.
          </p>
        )}
      </div>

      {members.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <p className="text-slate-400">
            No team members added yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl"
            >
              <h2 className="text-2xl font-semibold mb-2">
                {member.name}
              </h2>

              <p
                className={`font-medium ${
                  member.role === "Admin"
                    ? "text-purple-400"
                    : "text-cyan-400"
                }`}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}