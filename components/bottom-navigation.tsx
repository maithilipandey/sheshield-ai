'use client'

import { Home, Map, Mic, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/map', icon: Map, label: 'Map' },
  { href: '/dashboard/voice', icon: Mic, label: 'Voice' },
  { href: '/dashboard/chat', icon: MessageCircle, label: 'Chat' },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass mx-4 mb-4 rounded-2xl shadow-lg border border-white/20">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300',
                  isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'drop-shadow-sm')} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
