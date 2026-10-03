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
