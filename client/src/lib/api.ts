const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function hashPassword(password: string): Promise<string> {
  const response = await fetch(`${API_URL}/api/auth/hash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    throw new Error('No se pudo procesar la contraseña')
  }

  const data: { passwordHash: string } = await response.json()
  return data.passwordHash
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, passwordHash }),
  })

  const data: { match: boolean } = await response.json()
  return data.match
}

export interface ChargeRequest {
  payerId: string
  payerEmail: string
  cardNumber: string
  expirationDate: string
  cvv: string
  fullName: string
  amount: number
}

export interface ChargeResponse {
  id: string
  status: 'approved' | 'rejected' | 'system_error'
  status_detail: string
  transaction_amount: number
  date_created: string
  authorization_code: string | null
  reference: string
  payer_id: string
  payer_email: string
  cardNumber: string
  cvv: string
}

const CHARGE_TIMEOUT_MS = 10_000

export async function chargeSnailPay(
  data: ChargeRequest
): Promise<ChargeResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), CHARGE_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(`${API_URL}/api/snailpay/charge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
  } catch {
    throw new Error('No se pudo conectar con SnailPay, intenta de nuevo')
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status !== 200 && response.status !== 503) {
    throw new Error('No se pudo procesar la recarga')
  }

  return (await response.json()) as ChargeResponse
}
