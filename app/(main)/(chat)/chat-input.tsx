import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Send } from 'lucide-react'

const ChatInput = () => {
  return (
    <div className='w-full max-w-[600px]'>
      <form className='flex items-center gap-2 px-3 py-2 rounded-full bg-slate-700'>
        <InputGroup className='pl-4 rounded-full [&:has([data-slot=input-group-control]:focus-visible)]:border-transparent [&:has([data-slot=input-group-control]:focus-visible)]:ring-0'>
          <InputGroupTextarea
            placeholder='Escribe tu mensaje'
            className='min-h-[2.25rem] max-h-[7.5rem] py-2 resize-none overflow-y-auto focus-visible:ring-0 focus-visible:border-transparent
              scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-500
              hover:scrollbar-thumb-slate-400 scrollbar-thumb-rounded-full
              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-slate-400'
            rows={1}
          />
          <InputGroupAddon align='inline-end'>
            <Button variant='primary' size='sm' className='p-2 rounded-full'>
              <Send />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}

export default ChatInput
