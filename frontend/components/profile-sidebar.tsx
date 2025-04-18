"use client"

import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  MessageSquare,
  Heart,
  Settings,
  LogOut,
  Bell,
  CreditCard,
  HelpCircle,
  Gift,
  Clock,
  Shield,
} from 'lucide-react'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const navigation = [
  {
    name: 'Dashboard',
    href: '/profile/dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    name: 'Orders',
    href: '/profile/orders',
    icon: ShoppingBag,
    badge: null
  },
  {
    name: 'Points & Rewards',
    href: '/profile/points',
    icon: Gift,
    badge: null
  },
  {
    name: 'Messages',
    href: '/profile/messages',
    icon: MessageSquare,
    badge: null
  },
  {
    name: 'Notifications',
    href: '/profile/notifications',
    icon: Bell,
    badge: null
  },
  {
    name: 'Wishlist',
    href: '/profile/wishlist',
    icon: Heart,
    badge: null
  },
  {
    name: 'Payment Methods',
    href: '/profile/payment',
    icon: CreditCard,
    badge: null
  },
  {
    name: 'Order History',
    href: '/profile/history',
    icon: Clock,
    badge: null
  },
  {
    name: 'Security',
    href: '/profile/security',
    icon: Shield,
    badge: null
  },
  {
    name: 'Help & Support',
    href: '/profile/support',
    icon: HelpCircle,
    badge: null
  },
  {
    name: 'Settings',
    href: '/profile/settings',
    icon: Settings,
    badge: null
  },
]

export function ProfileSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const router = useRouter()

  // Format the name from nom and prenom
  const fullName = user ? `${user.prenom} ${user.nom}` : ''
  const initials = user ? `${user.prenom?.[0]}${user.nom?.[0]}` : ''

  return (
      <div className="w-64 shrink-0">
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0"> {/* Added to contain text overflow */}
                <h3 className="font-semibold truncate">{fullName}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user?.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{user?.soldePoints || 0}</p>
                <p className="text-xs text-muted-foreground">Points</p>
                <p className="text-xs text-muted-foreground">
                  ≈ ${((user?.soldePoints || 0) * 0.01).toFixed(2)} value
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{user?.ordersCount || 0}</p>
                <p className="text-xs text-muted-foreground">Orders</p>
                <p className="text-xs text-muted-foreground">
                  Track your orders
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="p-2">
              {navigation.map((item) => (
                  <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                          'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          pathname === item.href
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'hover:bg-muted'
                      )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                        <Badge variant={pathname === item.href ? "outline" : "secondary"}>
                          {item.badge}
                        </Badge>
                    )}
                  </Link>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                onClick={() => {
                  logout();
                  router.push('/auth/signin');
                }}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </Button>
          </div>
        </div>
      </div>
  )
}