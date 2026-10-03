import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Hola, {user?.name}</h1>
      <Button onClick={logout}>Cerrar sesión</Button>
    </div>
  )
}
