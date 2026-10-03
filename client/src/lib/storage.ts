export interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
}

export interface Session {
  userId: string
}

const STORAGE_KEYS = {
  user: 'snailrace_user',
  session: 'snailrace_session',
  balance: 'snailrace_balance',
} as const

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(STORAGE_KEYS.user)
  return raw ? (JSON.parse(raw) as StoredUser) : null
}

export function setStoredUser(user: StoredUser): void {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEYS.session)
  return raw ? (JSON.parse(raw) as Session) : null
}

export function setSession(session: Session): void {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.session)
}

export function getBalance(): number {
  const raw = localStorage.getItem(STORAGE_KEYS.balance)
  return raw ? Number(raw) : 0
}

export function setBalance(amount: number): void {
  localStorage.setItem(STORAGE_KEYS.balance, String(amount))
}
