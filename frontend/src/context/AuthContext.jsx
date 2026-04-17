import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasPurchase, setHasPurchase] = useState(false)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('ca_token')
    if (!token) { setLoading(false); return }
    try {
      const data = await authService.getMe()
      setUser(data.user)
      setHasPurchase(data.hasPurchase || false)
    } catch {
      localStorage.removeItem('ca_token')
      localStorage.removeItem('ca_user')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem('ca_token', data.token)
    localStorage.setItem('ca_user', JSON.stringify(data.user))
    setUser(data.user)
    setHasPurchase(data.hasPurchase || false)
    return data
  }

  const signup = async (credentials) => {
    const data = await authService.signup(credentials)
    localStorage.setItem('ca_token', data.token)
    localStorage.setItem('ca_user', JSON.stringify(data.user))
    setUser(data.user)
    setHasPurchase(false)
    return data
  }

  const logout = async () => {
    try { await authService.logout() } catch {}
    localStorage.removeItem('ca_token')
    localStorage.removeItem('ca_user')
    setUser(null)
    setHasPurchase(false)
  }

  const refreshUser = () => loadUser()

  return (
    <AuthContext.Provider value={{ user, loading, hasPurchase, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
