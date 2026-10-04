import { useState } from 'react'
import { LogOut, Wallet } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { AppBrand } from '@/components/AppBrand'
import {
  getOrCreateBetsSummary,
  getOrCreateRaceResults,
} from '@/lib/simulatedData'
import { BetsDonutChart } from '@/components/BetsDonutChart'
import { RacesBarChart } from '@/components/RacesBarChart'
import { RechargeDialog } from '@/components/RechargeDialog'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function DashboardPage() {
  const { user, balance, logout } = useAuth()
  const [betsSummary] = useState(() => getOrCreateBetsSummary())
  const [raceResults] = useState(() => getOrCreateRaceResults())

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <AppBrand />
          <Button
            variant="outline"
            size="icon"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="border-transparent bg-accent text-accent-foreground hover:bg-accent/70"
          >
            <LogOut className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <h1 className="text-2xl font-semibold">Hola, {user?.name}</h1>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Wallet className="h-10 w-10 opacity-80" aria-hidden="true" />
              <div>
                <p className="text-sm opacity-90">Saldo actual</p>
                <p className="text-4xl font-bold">${balance.toFixed(2)}</p>
              </div>
            </div>
            <RechargeDialog />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Apuestas ganadas y perdidas</CardTitle>
            </CardHeader>
            <CardContent>
              <BetsDonutChart summary={betsSummary} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Victorias por caracol (hoy)</CardTitle>
            </CardHeader>
            <CardContent>
              <RacesBarChart results={raceResults} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
