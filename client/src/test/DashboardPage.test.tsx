import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from '@/routes/DashboardPage'
import { AuthProvider } from '@/context/AuthContext'
import { setStoredUser, setSession, setBalance } from '@/lib/storage'

function renderDashboard() {
  render(
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    localStorage.clear()
    setStoredUser({
      id: '1',
      name: 'Usuario',
      email: 'usuario@test.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstuv.abcdefghijklmnopqrstuvwxyz1234',
    })
    setSession({ userId: '1' })
    setBalance(150)
  })

  it('debe mostrar el nombre del usuario', () => {
    renderDashboard()
    expect(screen.getByText('Hola, Usuario')).toBeInTheDocument()
  })

  it('debe mostrar el saldo guardado en localStorage', () => {
    renderDashboard()
    expect(screen.getByText('Saldo actual: $150.00')).toBeInTheDocument()
  })
})
