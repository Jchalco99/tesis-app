'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartData = [
  { month: 'Enero', consulta: 786 },
  { month: 'Febrero', consulta: 905 },
  { month: 'Marzo', consulta: 637 },
  { month: 'Abril', consulta: 473 },
  { month: 'Mayo', consulta: 589 },
  { month: 'Junio', consulta: 723 },
  { month: 'Julio', consulta: 812 },
  { month: 'Agosto', consulta: 634 },
  { month: 'Septiembre', consulta: 456 },
  { month: 'Octubre', consulta: 678 },
  { month: 'Noviembre', consulta: 789 },
  { month: 'Diciembre', consulta: 890 },
]

const chartConfig = {
  consulta: {
    label: 'Consultas',
    color: '#3b82f6',
  },
} satisfies ChartConfig

const Year = () => {
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
            right: 5,
            left: 5,
            bottom: 10,
          }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray='3 3'
            stroke='#374151'
          />
          <XAxis
            dataKey='month'
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            tick={{ fill: '#9ca3af', fontSize: 9 }}
            tickFormatter={(value) => value.slice(0, 3)}
            interval={0}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: '#1f2937' }}
          />
          <Bar
            dataKey='consulta'
            fill='var(--color-consulta)'
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default Year
