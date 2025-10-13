import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type Props = {
  name: string
  email: string
  src: string
  alt: string
  fallback: string
}

const UserProfile = ({ name, email, src, alt, fallback }: Props) => {
  return (
    <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center'>
      <Avatar className='h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32'>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col justify-center'>
        <p className='text-white text-lg sm:text-xl lg:text-[22px] font-bold'>
          {name}
        </p>
        <p className='text-slate-400 text-sm sm:text-base'>
          {email}
        </p>
      </div>
    </div>
  )
}

export default UserProfile;
