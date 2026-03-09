// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const VALID_USER = "deepak"
  const VALID_PASS = "deepak123"

  const handleSubmit = (e) => {
    e.preventDefault()
    if (userId === VALID_USER && password === VALID_PASS) {
      localStorage.setItem('auth', 'true')
      navigate('/dashboard')
    } else {
      setError("Invalid credentials!")
    }
  }

  return (
    <div className="login-page">
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Please sign in to continue</p>

        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-msg">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  )
}