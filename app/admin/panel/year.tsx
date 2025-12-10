'use client'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { ActivityData } from '@/services/admin.service'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  messages: {
    label: 'Mensajes',
    color: '#3b82f6',
  },
} satisfies ChartConfig

type Props = {
  data: ActivityData[]
}

const Year = ({ data }: Props) => {
  // Transformar los datos del backend al formato del gráfico
  const chartData = data.map((item) => ({
    month: item.period,
    messages: item.messages,
  }))

  // Si no hay datos, mostrar datos de ejemplo
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          { month: 'Enero', messages: 0 },
          { month: 'Febrero', messages: 0 },
          { month: 'Marzo', messages: 0 },
          { month: 'Abril', messages: 0 },
          { month: 'Mayo', messages: 0 },
          { month: 'Junio', messages: 0 },
          { month: 'Julio', messages: 0 },
          { month: 'Agosto', messages: 0 },
          { month: 'Septiembre', messages: 0 },
          { month: 'Octubre', messages: 0 },
          { month: 'Noviembre', messages: 0 },
          { month: 'Diciembre', messages: 0 },
        ]

  return (
    <div className='h-[200px] sm:h-[240px] md:h-[280px] w-full max-w-full overflow-hidden'>
      <ChartContainer config={chartConfig} className='w-full h-full'>
        <BarChart
          accessibilityLayer
          data={displayData}
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
            dataKey='messages'
            fill='var(--color-messages)'
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default Year
