"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingBag,
  Clock,
  MessageSquare,
  Heart,
  Package,
  TrendingUp,
  Bell,
  Settings,
  Gift
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ProfileSidebar } from '@/components/profile-sidebar'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  // Format the name from nom and prenom
  const fullName = `${user.prenom} ${user.nom}`

  const stats = [
    {
      title: 'Total Orders',
      value: user.ordersCount?.toString() || '0',
      icon: <ShoppingBag className="h-5 w-5" />,
      change: 'All time',
      trend: 'neutral',
    },
    {
      title: 'Points Balance',
      value: user.soldePoints?.toString() || '0',
      icon: <Gift className="h-5 w-5" />,
      change: `≈ ${((user.soldePoints || 0) * 0.01).toFixed(2)}€ value`,
      trend: 'up',
    },
    {
      title: 'Messages',
      value: '0',
      icon: <MessageSquare className="h-5 w-5" />,
      change: 'Check inbox',
      trend: 'neutral',
    },
    {
      title: 'Wishlist Items',
      value: '0',
      icon: <Heart className="h-5 w-5" />,
      change: 'Add products',
      trend: 'neutral',
    },
  ]

  // This would come from your API in the future
  const recentOrders: any[] = []

  // This would come from your API in the future
  const recentActivity = [
    {
      id: 1,
      type: 'account',
      message: 'Welcome to your new account!',
      time: 'Just now',
      icon: <Package className="h-4 w-4" />,
    },
  ]

  return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProfileSidebar />

            <div className="flex-1 space-y-8">
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {fullName}!</h1>
                  <p className="text-muted-foreground mt-1">
                    Here's what's happening with your account today.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            {stat.icon}
                          </div>
                          <TrendingUp className={`h-4 w-4 ${
                              stat.trend === 'up' ? 'text-green-500' : 'text-gray-400'
                          }`} />
                        </div>
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <p className="text-muted-foreground text-sm">{stat.title}</p>
                        <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
                      </Card>
                    </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/profile/orders">View All</Link>
                    </Button>
                  </div>
                  {recentOrders.length > 0 ? (
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div>
                                <p className="font-medium">{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{order.total}</p>
                                <Badge variant={
                                  order.status === 'Delivered' ? 'default' :
                                      order.status === 'Processing' ? 'secondary' : 'outline'
                                }>
                                  {order.status}
                                </Badge>
                              </div>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-3" />
                        <h3 className="font-medium text-lg">No orders yet</h3>
                        <p className="text-muted-foreground text-sm mt-1">Start shopping to see your orders here.</p>
                        <Button className="mt-4" asChild>
                          <Link href="/products">Browse Products</Link>
                        </Button>
                      </div>
                  )}
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            {activity.icon}
                          </div>
                          <div>
                            <p className="font-medium">{activity.message}</p>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* User Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Your Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.telephone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="font-medium">{user.ville || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Postal Code</p>
                      <p className="font-medium">{user.codePostal || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Governorate</p>
                      <p className="font-medium">{user.gouvernorat || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                <Button className="mt-6" variant="outline" asChild>
                  <Link href="/profile/settings">Edit Information</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}