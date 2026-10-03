import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from '@/routes/LoginPage'
import { AuthProvider } from '@/context/AuthContext'
import { setStoredUser } from '@/lib/storage'
import * as api from '@/lib/api'

vi.mock('@/lib/api')

function renderLoginPage() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<div>Página del dashboard</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    setStoredUser({
      id: '1',
      name: 'Usuario',
      email: 'usuario@test.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstuv.abcdefghijklmnopqrstuvwxyz1234',
    })
  })

  it('debe navegar al dashboard cuando las credenciales son correctas', async () => {
    vi.mocked(api.verifyPassword).mockResolvedValue(true)
    const user = userEvent.setup()

    renderLoginPage()

    await user.type(screen.getByLabelText('Correo electrónico'), 'usuario@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Página del dashboard')).toBeInTheDocument()
  })

  it('debe mostrar un error cuando las credenciales son incorrectas', async () => {
    vi.mocked(api.verifyPassword).mockResolvedValue(false)
    const user = userEvent.setup()

    renderLoginPage()

    await user.type(screen.getByLabelText('Correo electrónico'), 'usuario@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument()
  })
})
