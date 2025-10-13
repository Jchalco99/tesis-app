'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

type Props = {
  label: string
  icon: React.ReactNode
  href: string
  isCollapsed?: boolean
}

export const SidebarItem = ({
  label,
  icon,
  href,
  isCollapsed = false,
}: Props) => {
  const pathName = usePathname()
  const isActive = pathName === href

  return (
    <Link href={href}>
      <Button
        variant={isActive ? 'sidebarOutline' : 'sidebar'}
        className={`h-12 w-full transition-all duration-300 ${
          isCollapsed ? 'justify-center px-2' : 'justify-start gap-2'
        }`}
        title={isCollapsed ? label : undefined}
      >
        {icon}
        {!isCollapsed && <span className='truncate'>{label}</span>}
      </Button>
    </Link>
  )
}
