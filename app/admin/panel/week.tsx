'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartData = [
  { day: 'Lunes', consulta: 186 },
  { day: 'Martes', consulta: 305 },
  { day: 'Miércoles', consulta: 237 },
  { day: 'Jueves', consulta: 73 },
  { day: 'Viernes', consulta: 209 },
  { day: 'Sábado', consulta: 214 },
  { day: 'Domingo', consulta: 152 },
]

const chartConfig = {
  consulta: {
    label: 'Consultas',
    color: '#3b82f6',
  },
} satisfies ChartConfig

const Week = () => {
  return (
    <div className='h-[200px] sm:h-[240px] md:h-[280px] w-full max-w-full overflow-hidden'>
      <ChartContainer config={chartConfig} className='w-full h-full'>
        <BarChart
          accessibilityLayer
          data={chartData}
          width={undefined}
          height={undefined}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray='3 3'
            stroke='#374151'
          />
          <XAxis
            dataKey='day'
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: '#1f2937' }}
          />
          <Bar
            dataKey='consulta'
            fill='var(--color-consulta)'
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default Week
