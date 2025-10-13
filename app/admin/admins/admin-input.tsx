import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  title: string
  id: string
  type: string
  placeholder?: string
}

const AdminInput = ({
  title,
  id,
  type,
  placeholder
}: Props) => {
  return (
    <div className='w-full max-w-sm items-center space-y-2 py-2'>
      <Label htmlFor={id}>{title}</Label>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        className='h-10 w-full'
      />
    </div>
  )
}

export default AdminInput;
