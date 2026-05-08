import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "https://nextask-ai-production.up.railway.app/login",
        form
      )

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      )

      navigate("/")

    } catch (err) {

      alert("Invalid login")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">

      <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-md border border-slate-800">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Login
        </h1>

        <div className="space-y-4">

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
            onClick={handleLogin}
            className="w-full bg-cyan-600 hover:bg-cyan-700 p-4 rounded-2xl"
          >
            Login
          </button>
<p className="text-center text-slate-400 mt-4">
  Don't have an account?{" "}
  <a href="/signup" className="text-cyan-400 hover:underline">
    Create Account
  </a>
</p>
        </div>

      </div>

    </div>
  )
}
