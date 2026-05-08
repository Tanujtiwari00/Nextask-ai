import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Signup() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "Admin"
})

  const handleSignup = async () => {

    try {

      await axios.post(
        "nextask-ai-production.up.railway.app/signup",
        form
      )

      navigate("/login")

    } catch (err) {

      alert("Signup failed")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-md border border-slate-800">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Sign Up
        </h1>

        <div className="space-y-4">

          <input
            placeholder="Name"
            className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={handleSignup}
            className="w-full bg-cyan-600 hover:bg-cyan-700 p-4 rounded-2xl"
          >
            Create Account
          </button>

        </div>

      </div>

    </div>
  )
}