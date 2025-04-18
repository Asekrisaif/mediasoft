"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfileSidebar } from '@/components/profile-sidebar'
import {Bell, Package, CreditCard, Tag, Gift, Settings, ChevronRight, Check, X, Smartphone, Mail} from 'lucide-react'
import { motion } from 'framer-motion'
import { Switch } from '@/components/ui/switch'

export default function NotificationsPage() {
    const router = useRouter()
    const { isAuthenticated, user, updatePreferences } = useUserStore()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/signin')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return null
    }

    const notifications = [
        {
            id: 1,
            type: 'order',
            title: 'Order Shipped',
            message: 'Your order #ORD-2024-001 has been shipped and is on its way.',
            time: '2 hours ago',
            read: false,
            icon: Package,
            color: 'blue',
        },
        {
            id: 2,
            type: 'payment',
            title: 'Payment Successful',
            message: 'Payment of $2,499.99 was successfully processed for your recent order.',
            time: '4 hours ago',
            read: false,
            icon: CreditCard,
            color: 'green',
        },
        {
            id: 3,
            type: 'promotion',
            title: 'Flash Sale Alert',
            message: 'Don\'t miss out! 24-hour flash sale on all gaming accessories.',
            time: '6 hours ago',
            read: false,
            icon: Tag,
            color: 'purple',
        },
        {
            id: 4,
            type: 'reward',
            title: 'Points Earned',
            message: 'You\'ve earned 500 points from your recent purchase!',
            time: '1 day ago',
            read: true,
            icon: Gift,
            color: 'amber',
        },
    ]

    const notificationPreferences = [
        {
            id: 'orders',
            title: 'Order Updates',
            description: 'Get notified about your order status and shipping updates',
            email: true,
            push: true,
            sms: false,
        },
        {
            id: 'promotions',
            title: 'Promotions & Deals',
            description: 'Receive notifications about sales, discounts, and special offers',
            email: true,
            push: false,
            sms: false,
        },
        {
            id: 'rewards',
            title: 'Points & Rewards',
            description: 'Stay updated about your points balance and rewards',
            email: true,
            push: true,
            sms: true,
        },
        {
            id: 'security',
            title: 'Security Alerts',
            description: 'Get important security notifications about your account',
            email: true,
            push: true,
            sms: true,
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar />

                    <div className="flex-1 space-y-8">
                        {/* Notifications Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                                <p className="text-muted-foreground">
                                    Manage your notifications and preferences
                                </p>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </Button>
                        </div>

                        {/* Recent Notifications */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Recent Notifications</h2>
                                <Button variant="ghost" size="sm">
                                    Mark all as read
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {notifications.map((notification, index) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className={`flex items-start gap-4 p-4 rounded-lg ${
                                            notification.read ? 'bg-muted/30' : 'bg-muted'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg bg-${notification.color}-100 dark:bg-${notification.color}-900/50`}>
                                            <notification.icon className={`h-5 w-5 text-${notification.color}-600 dark:text-${notification.color}-400`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-medium">{notification.title}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs hover:bg-transparent">
                                                    Mark as read
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <Button variant="outline" className="gap-2">
                                    View All Notifications
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>

                        {/* Notification Preferences */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                            <div className="space-y-6">
                                {notificationPreferences.map((pref) => (
                                    <div key={pref.id} className="pb-6 border-b last:border-0 last:pb-0">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-medium">{pref.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {pref.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                <div className="flex items-center gap-2">
                                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">Push</span>
                                                </div>
                                                <Switch
                                                    checked={pref.push}
                                                    onCheckedChange={(checked) => {
                                                        // Update preferences
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">Email</span>
                                                </div>
                                                <Switch
                                                    checked={pref.email}
                                                    onCheckedChange={(checked) => {
                                                        // Update preferences
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">SMS</span>
                                                </div>
                                                <Switch
                                                    checked={pref.sms}
                                                    onCheckedChange={(checked) => {
                                                        // Update preferences
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Email Preferences */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">Email Preferences</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">Newsletter Subscription</p>
                                        <p className="text-sm text-muted-foreground">
                                            Receive our weekly newsletter with latest products and tech news
                                        </p>
                                    </div>
                                    <Switch
                                        checked={user.preferences?.notifications?.email}
                                        onCheckedChange={(checked) => {
                                            updatePreferences({
                                                notifications: {
                                                    ...user.preferences?.notifications,
                                                    email: checked,
                                                },
                                            })
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">Product Updates</p>
                                        <p className="text-sm text-muted-foreground">
                                            Get notified about new features and updates
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="font-medium">Price Drop Alerts</p>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications when items in your wishlist go on sale
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}