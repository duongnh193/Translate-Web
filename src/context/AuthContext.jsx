import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'translate-web-auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY)
    return cached ? JSON.parse(cached) : { token: null, email: null }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  }, [auth])

  const login = (payload) => {
    setAuth({ token: payload.token, email: payload.email })
  }

  const logout = () => {
    setAuth({ token: null, email: null })
  }

  const value = useMemo(() => ({ ...auth, login, logout }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
