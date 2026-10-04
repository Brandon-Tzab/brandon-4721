import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
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
    <div className="min-h-screen p-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Hola, {user?.name}</h1>
            <p className="text-muted-foreground">
              Saldo actual: ${balance.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <RechargeDialog />
            <Button variant="outline" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </div>

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
