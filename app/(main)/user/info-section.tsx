type Props = {
  title: string
  items: {
    label: string
    value: string
  }[]
}

const InfoSection = ({ title, items }: Props) => {
  return (
    <div>
      <h2 className='text-white text-lg sm:text-xl lg:text-2xl font-bold px-4 mb-4'>
        {title}
      </h2>
      <div className='px-4 space-y-1'>
        {items.map((item, index) => (
          <div
            key={index}
            className='flex flex-col sm:flex-row sm:items-center border-t border-t-[#404b4f] py-4 gap-2 sm:gap-6'
          >
            <p className='text-slate-400 text-sm sm:w-32 lg:w-40'>{item.label}</p>
            <p className='text-white text-sm'>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoSection;
