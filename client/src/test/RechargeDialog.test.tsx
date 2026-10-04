import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RechargeDialog } from '@/components/RechargeDialog'
import { AuthProvider } from '@/context/AuthContext'
import { setStoredUser, setSession, getBalance } from '@/lib/storage'
import * as api from '@/lib/api'

vi.mock('@/lib/api')

function renderDialog() {
  render(
    <AuthProvider>
      <RechargeDialog />
    </AuthProvider>
  )
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Cargar saldo' }))
  await user.type(screen.getByLabelText('Número de tarjeta'), '1234123412341234')
  await user.type(screen.getByLabelText('Vencimiento (MM/AA)'), '12/26')
  await user.type(screen.getByLabelText('CVV'), '543')
  await user.type(screen.getByLabelText('Nombre en la tarjeta'), 'Usuario Prueba')
  await user.type(screen.getByLabelText('Monto a cargar'), '100')
  await user.click(screen.getByRole('button', { name: 'Confirmar recarga' }))
}

describe('RechargeDialog', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    setStoredUser({
      id: '1',
      name: 'Usuario',
      email: 'usuario@test.com',
      passwordHash: '$2b$10$abcdefghijklmnopqrstuv.abcdefghijklmnopqrstuvwxyz1234',
    })
    setSession({ userId: '1' })
  })

  it('debe actualizar el saldo cuando el cobro es aprobado', async () => {
    vi.mocked(api.chargeSnailPay).mockResolvedValue({
      id: '1',
      status: 'approved',
      status_detail: 'Cargo procesado exitosamente',
      transaction_amount: 100,
      date_created: new Date().toISOString(),
      authorization_code: 'ABC123',
      reference: 'ref-1',
      payer_id: '1',
      payer_email: 'usuario@test.com',
      cardNumber: '1234123412341234',
      cvv: '543',
    })

    const user = userEvent.setup()
    renderDialog()
    await fillAndSubmit(user)

    expect(
      await screen.findByText(/Recarga aprobada\. Se agregaron \$100\.00/)
    ).toBeInTheDocument()
    expect(getBalance()).toBe(100)
  })

  it('no debe modificar el saldo cuando el cobro es rechazado', async () => {
    vi.mocked(api.chargeSnailPay).mockResolvedValue({
      id: '1',
      status: 'rejected',
      status_detail: 'Tarjeta rechazada',
      transaction_amount: 100,
      date_created: new Date().toISOString(),
      authorization_code: null,
      reference: 'ref-1',
      payer_id: '1',
      payer_email: 'usuario@test.com',
      cardNumber: '1234123412341234',
      cvv: '543',
    })

    const user = userEvent.setup()
    renderDialog()
    await fillAndSubmit(user)

    expect(await screen.findByText('Tarjeta rechazada')).toBeInTheDocument()
    expect(getBalance()).toBe(0)
  })
})
