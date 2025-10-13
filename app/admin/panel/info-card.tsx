type Props = {
  title: string
  info: string
  icon: React.ReactNode
}

export const InfoCard = ({ title, info, icon }: Props) => {
  return (
    <div className='p-4 transition-colors duration-200 border rounded-lg md:p-6 bg-slate-700 hover:bg-slate-600 border-slate-600'>
      <div className='flex items-center justify-between mb-2 md:mb-3'>
        <p className='text-xs font-medium text-slate-300 md:text-sm line-clamp-2'>
          {title}
        </p>
        <div className='flex-shrink-0 ml-2 text-blue-400'>{icon}</div>
      </div>
      <p className='text-xl font-bold text-white md:text-2xl'>{info}</p>
    </div>
  )
}
