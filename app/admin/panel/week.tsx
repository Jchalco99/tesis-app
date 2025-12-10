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

const Week = ({ data }: Props) => {
  // Transformar los datos del backend al formato del gráfico
  const chartData = data.map((item) => ({
    day: item.period,
    messages: item.messages,
  }))

  // Si no hay datos, mostrar datos de ejemplo
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          { day: 'Lunes', messages: 0 },
          { day: 'Martes', messages: 0 },
          { day: 'Miércoles', messages: 0 },
          { day: 'Jueves', messages: 0 },
          { day: 'Viernes', messages: 0 },
          { day: 'Sábado', messages: 0 },
          { day: 'Domingo', messages: 0 },
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
            dataKey='messages'
            fill='var(--color-messages)'
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default Week
