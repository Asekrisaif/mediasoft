"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Gift, ArrowRight, Clock, ShoppingBag, ArrowUpRight, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PointsPage() {
    const router = useRouter()
    const { isAuthenticated, user } = useUserStore()



    const pointsHistory = [
        {
            id: 1,
            type: 'earned',
            points: 500,
            description: 'Purchase: Quantum X Pro Gaming Laptop',
            date: '2024-03-15',
        },
        {
            id: 2,
            type: 'redeemed',
            points: -200,
            description: 'Discount applied to order #ORD-2024-002',
            date: '2024-03-10',
        },
        {
            id: 3,
            type: 'earned',
            points: 300,
            description: 'Purchase: Neural GPU 32GB',
            date: '2024-03-05',
        },
        {
            id: 4,
            type: 'bonus',
            points: 100,
            description: 'Welcome bonus points',
            date: '2024-03-01',
        },
    ]

    const upcomingPoints = [
        {
            id: 1,
            points: 250,
            description: 'Pending from order #ORD-2024-003',
            date: '2024-03-20',
        },
        {
            id: 2,
            points: 150,
            description: 'Review bonus pending',
            date: '2024-03-18',
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar />

                    <div className="flex-1 space-y-8">
                        {/* Points Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white/20 rounded-lg">
                                        <Gift className="h-6 w-6" />
                                    </div>
                                    <ArrowUpRight className="h-5 w-5" />
                                </div>
                                <h3 className="text-3xl font-bold mb-1">{user.points || 0}</h3>
                                <p className="text-white/80">Available Points</p>
                                <p className="text-sm mt-2 text-white/60">
                                    ≈ ${((user.points || 0) * 0.01).toFixed(2)} value
                                </p>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                        <ShoppingBag className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <Badge variant="secondary">This Month</Badge>
                                </div>
                                <h3 className="text-3xl font-bold mb-1">850</h3>
                                <p className="text-muted-foreground">Points Earned</p>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                                        <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <Badge variant="secondary">Pending</Badge>
                                </div>
                                <h3 className="text-3xl font-bold mb-1">400</h3>
                                <p className="text-muted-foreground">Points Coming Soon</p>
                            </Card>
                        </div>

                        {/* Points History */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Points History</h2>
                                <Button variant="outline" size="sm">
                                    View All
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {pointsHistory.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${
                                                item.type === 'earned' ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' :
                                                    item.type === 'redeemed' ? 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400' :
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                                            }`}>
                                                <Gift className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.description}</p>
                                                <p className="text-sm text-muted-foreground">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${
                                            item.points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {item.points > 0 ? '+' : ''}{item.points} points
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>

                        {/* Upcoming Points */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Upcoming Points</h2>
                                <Badge variant="secondary">Pending Approval</Badge>
                            </div>
                            <div className="space-y-4">
                                {upcomingPoints.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.description}</p>
                                                <p className="text-sm text-muted-foreground">Expected by {item.date}</p>
                                            </div>
                                        </div>
                                        <div className="font-bold text-purple-600 dark:text-purple-400">
                                            +{item.points} points
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>

                        {/* How Points Work */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-6">How Points Work</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 w-fit rounded-lg">
                                        <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-medium">Earn Points</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Earn points on every purchase. The more you shop, the more you earn!
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/50 w-fit rounded-lg">
                                        <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="font-medium">Redeem Points</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Use your points for discounts on future purchases. 100 points = $1 off!
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 w-fit rounded-lg">
                                        <ArrowUpRight className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="font-medium">Level Up</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Earn bonus points and exclusive rewards as you reach new membership tiers.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}