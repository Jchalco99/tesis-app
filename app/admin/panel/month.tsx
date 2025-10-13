'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartData = [
  { week: 'Semana 1', consulta: 786 },
  { week: 'Semana 2', consulta: 905 },
  { week: 'Semana 3', consulta: 637 },
  { week: 'Semana 4', consulta: 473 },
]

const chartConfig = {
  consulta: {
    label: 'Consultas',
    color: '#3b82f6',
  },
} satisfies ChartConfig

const Month = () => {
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
            dataKey='week'
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickFormatter={(value) => value.replace('Semana ', 'S')}
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

export default Month
