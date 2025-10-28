'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ label, href, icon, isCollapsed = false, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
        'hover:bg-slate-700/50 hover:text-white',
        isActive
          ? 'bg-slate-700 text-white shadow-sm'
          : 'text-slate-300',
        isCollapsed && 'justify-center px-2'
      )}
      title={isCollapsed ? label : undefined}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      {!isCollapsed && (
        <span className="truncate flex-1 text-left">
          {label}
        </span>
      )}

      {/* Indicador visual para conversaciones activas */}
      {isActive && href.startsWith('/chat/') && (
        <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
      )}
    </Link>
  );
}
