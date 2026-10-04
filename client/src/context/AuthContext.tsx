import { createContext, useContext, useState, type ReactNode } from 'react'
import { hashPassword, verifyPassword } from '@/lib/api'
import {
  getStoredUser,
  setStoredUser,
  getSession,
  setSession,
  clearSession,
  getBalance,
  setBalance as setStoredBalance,
  type StoredUser,
} from '@/lib/storage'

interface AuthContextValue {
  user: StoredUser | null
  isAuthenticated: boolean
  balance: number
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  addToBalance: (amount: number) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => getSession() !== null
  )
  const [balance, setBalance] = useState<number>(() => getBalance())

  async function register(name: string, email: string, password: string) {
    if (getStoredUser()) {
      throw new Error(
        'Ya existe una cuenta registrada en este navegador, inicia sesión o borra los datos locales'
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = await hashPassword(password)
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email: normalizedEmail,
      passwordHash,
    }

    setStoredUser(newUser)
    setStoredBalance(0)
    setSession({ userId: newUser.id })

    setUser(newUser)
    setIsAuthenticated(true)
    setBalance(0)
  }

  async function login(email: string, password: string) {
    const storedUser = getStoredUser()
    const normalizedEmail = email.trim().toLowerCase()

    if (!storedUser || storedUser.email !== normalizedEmail) {
      throw new Error('Credenciales inválidas')
    }

    const match = await verifyPassword(password, storedUser.passwordHash)

    if (!match) {
      throw new Error('Credenciales inválidas')
    }

    setSession({ userId: storedUser.id })
    setUser(storedUser)
    setIsAuthenticated(true)
  }

  function logout() {
    clearSession()
    setIsAuthenticated(false)
  }

  function addToBalance(amount: number) {
    const newBalance = balance + amount
    setStoredBalance(newBalance)
    setBalance(newBalance)
  }

  return (
    <AuthContext
      value={{
        user,
        isAuthenticated,
        balance,
        register,
        login,
        logout,
        addToBalance,
      }}
    >
      {children}
    </AuthContext>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
