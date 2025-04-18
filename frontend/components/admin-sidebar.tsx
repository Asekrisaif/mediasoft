"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  BarChart,
  MessageSquare,
  FileText,
  Tags,
  Box,
  Truck,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: BarChart 
  },
  { 
    name: 'Orders', 
    href: '/admin/orders', 
    icon: ShoppingBag 
  },
  { 
    name: 'Products', 
    href: '/admin/products', 
    icon: Box 
  },
  { 
    name: 'Categories', 
    href: '/admin/categories', 
    icon: Tags 
  },
  { 
    name: 'Inventory', 
    href: '/admin/inventory', 
    icon: Package 
  },
  { 
    name: 'Customers', 
    href: '/admin/customers', 
    icon: Users 
  },
  { 
    name: 'Messages', 
    href: '/admin/messages', 
    icon: MessageSquare 
  },
  { 
    name: 'Shipping', 
    href: '/admin/shipping', 
    icon: Truck 
  },
  { 
    name: 'Reports', 
    href: '/admin/reports', 
    icon: FileText 
  },
  { 
    name: 'Security', 
    href: '/admin/security', 
    icon: Shield 
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings 
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-card border-r flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold">Admin Panel</h3>
            <p className="text-xs text-muted-foreground">Manage your store</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                pathname === item.href 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
          onClick={() => window.location.href = '/admin/login'}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}