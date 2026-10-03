import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import type { RaceResult } from '@/lib/storage'

interface RacesBarChartProps {
  results: RaceResult[]
}

export function RacesBarChart({ results }: RacesBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={results} margin={{ bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          interval={0}
          angle={-35}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="wins" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
