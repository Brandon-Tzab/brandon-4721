import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { BetsSummary } from '@/lib/storage'

const COLORS = ['#22c55e', '#ef4444']

interface BetsDonutChartProps {
  summary: BetsSummary
}

export function BetsDonutChart({ summary }: BetsDonutChartProps) {
  const data = [
    { name: 'Ganadas', value: summary.won },
    { name: 'Perdidas', value: summary.lost },
  ]

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
