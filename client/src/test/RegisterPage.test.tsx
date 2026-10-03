import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RegisterPage } from '@/routes/RegisterPage'
import { AuthProvider } from '@/context/AuthContext'

function renderRegisterPage() {
  render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe mostrar un error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText('Nombre completo'), 'Usuario')
    await user.type(screen.getByLabelText('Correo electrónico'), 'usuario@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(
      screen.getByLabelText('Confirmar contraseña'),
      'otrapassword'
    )
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(
      await screen.findByText('Las contraseñas no coinciden')
    ).toBeInTheDocument()
  })

  it('debe mostrar un error si el nombre está vacío', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    await user.type(screen.getByLabelText('Correo electrónico'), 'usuario@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(await screen.findByText('El nombre es requerido')).toBeInTheDocument()
  })
})
