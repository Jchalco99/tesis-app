import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'

type Props = {
  id: string
  title: string
  description?: string
}

const NotificationSwitch = ({ id, title, description }: Props) => {
  return (
    <div className='w-full max-w-lg py-2'>
      <Field
        orientation='horizontal'
        className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'
      >
        <FieldContent className='flex-1'>
          <FieldLabel htmlFor={id} className='text-sm sm:text-base font-medium'>
            {title}
          </FieldLabel>
          <FieldDescription className='text-xs sm:text-sm text-slate-400'>
            {description}
          </FieldDescription>
        </FieldContent>
        <Switch id={id} className='self-start sm:self-center' />
      </Field>
    </div>
  )
}

export default NotificationSwitch
