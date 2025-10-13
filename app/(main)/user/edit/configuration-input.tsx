import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  title: string
  id: string
  type: string
  placeholder?: string
  defaultValue?: string
}

const ConfigurationInput = ({
  title,
  id,
  type,
  placeholder,
  defaultValue,
}: Props) => {
  return (
    <div className='w-full max-w-sm items-center space-y-2 py-2'>
      <Label htmlFor={id}>{title}</Label>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className='h-10 w-full'
      />
    </div>
  )
}

export default ConfigurationInput
