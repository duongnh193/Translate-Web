import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const initialForm = { email: '', password: '' }

function AuthModal({ isOpen, mode, onClose, onSwitchMode }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form }
      const response =
        mode === 'login' ? await api.login(payload) : await api.register(payload)
      login(response)
      setForm(initialForm)
      onClose()
      navigate('/translate')
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <h3>{mode === 'login' ? 'Login' : 'Create account'}</h3>
        <p className="panel-subtitle">
          {mode === 'login'
            ? 'Access your saved translations and presets.'
            : 'Sign up to sync translations across devices.'}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              required
              minLength={4}
              value={form.password}
              onChange={handleChange}
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <button className="ghost-btn" type="button" onClick={onSwitchMode}>
          {mode === 'login' ? "Need an account? Register" : 'Already registered? Login'}
        </button>
      </div>
    </div>
  )
}

export default AuthModal
