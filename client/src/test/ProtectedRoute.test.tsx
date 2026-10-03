import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import { setStoredUser, setSession } from '@/lib/storage'

function renderProtectedRoute() {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProvider>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Contenido protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Página de login</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe redirigir a /login cuando no hay sesión activa', () => {
    renderProtectedRoute()
    expect(screen.getByText('Página de login')).toBeInTheDocument()
  })

  it('debe mostrar el contenido cuando hay sesión activa', () => {
    setStoredUser({
      id: '1',
      name: 'Test',
      email: 'test@test.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstuv.abcdefghijklmnopqrstuvwxyz1234',
    })
    setSession({ userId: '1' })

    renderProtectedRoute()
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })
})
