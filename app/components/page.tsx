import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Eye, Mail, Search, User } from 'lucide-react'

const ButtonsPage = () => {
  return (
    <div className='flex gap-8 p-4'>
      <div className='flex flex-col space-y-4 min-w-[200px]'>
        <h3 className='font-semibold'>Botones</h3>
        <Button>Default</Button>
        <Button variant='primary'>Primary</Button>
        <Button variant='primaryOutline'>Primary Outline</Button>
        <Button variant='danger'>Danger</Button>
        <Button variant='dangerOutline'>Danger Outline</Button>
        <Button variant='ghost'>Ghost</Button>
        <Button variant='ghostOutline' className='justify-start'>
          <Search className='w-4 h-4 mr-2' />
          Ghost Outline
        </Button>
        <Button variant='sidebar'>Sidebar</Button>
        <Button variant='sidebarOutline'>Sidebar Outline</Button>
      </div>

      <div className='flex flex-col space-y-4 min-w-[200px]'>
        <h3 className='font-semibold'>Inputs</h3>
        <Input placeholder='Default Input' />

        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput type='email' placeholder="Email" />
          <InputGroupAddon align="inline-end">
            <Mail />
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput placeholder="User" />
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Eye />
          </InputGroupAddon>
        </InputGroup>

        <h3 className='font-semibold'>Badges</h3>
        <Badge variant='default'>Default</Badge>
        <Badge variant='user'>User</Badge>
        <Badge variant='admin'>Admin</Badge>
        <Badge variant='active'>Active</Badge>
        <Badge variant='inactive'>Inactive</Badge>
      </div>
    </div>
  )
}

export default ButtonsPage
