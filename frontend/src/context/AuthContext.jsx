import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchUser,
  login as apiLogin,
  logout as apiLogout,
  registerAdmin as apiRegisterAdmin,
  clientLogin as apiClientLogin,
  clientRegister as apiClientRegister,
} from '@api/cms'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const next = await fetchUser()
      setUser(next)
      return next
    } catch {
      setUser(null)
      return null
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isClient: user?.role === 'client',
      isAdmin: Boolean(user && user.role !== 'client'),
      refreshUser,
      async login(email, password) {
        const result = await apiLogin(email, password)
        setUser(result.user)
        return result.user
      },
      async registerAdmin(payload) {
        const result = await apiRegisterAdmin(payload)
        setUser(result.user)
        return result.user
      },
      async clientLogin(email, password) {
        const result = await apiClientLogin(email, password)
        setUser(result.user)
        return result.user
      },
      async clientRegister(payload) {
        const result = await apiClientRegister(payload)
        setUser(result.user)
        return result.user
      },
      async logout() {
        await apiLogout()
        setUser(null)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
