// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

const isAuthenticated = () => {
  // Simple check: token or flag in localStorage
  return localStorage.getItem('auth') === 'true'
}

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}