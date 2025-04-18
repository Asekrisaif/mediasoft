"use client"

import { useState } from 'react'
import { useUserStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Package, Search, Filter, ChevronRight, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

const orders = [
  {
    id: 'ORD-2024-001',
    date: '2024-03-15',
    status: 'Processing',
    total: 2499.99,
    items: [
      {
        id: 1,
        name: 'Quantum X Pro Gaming Laptop',
        price: 2499.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
      }
    ],
    tracking: {
      number: 'TRK123456789',
      carrier: 'FedEx',
      estimatedDelivery: '2024-03-20',
      status: 'In Transit',
      location: 'Distribution Center',
    }
  },
  {
    id: 'ORD-2024-002',
    date: '2024-03-10',
    status: 'Delivered',
    total: 1999.99,
    items: [
      {
        id: 2,
        name: 'Neural GPU 32GB',
        price: 1999.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800',
      }
    ],
    tracking: {
      number: 'TRK987654321',
      carrier: 'UPS',
      deliveredDate: '2024-03-12',
      status: 'Delivered',
      location: 'Front Door',
    }
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useUserStore()

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />

          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage your orders
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="flex items-center gap-4 bg-card p-4 rounded-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{order.id}</h3>
                            <Badge variant={
                              order.status === 'Delivered' ? 'default' :
                              order.status === 'Processing' ? 'secondary' : 'outline'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Ordered on {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Button variant="outline" className="gap-2">
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="font-medium mt-1">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                          <h4 className="font-medium mb-4">Shipping Information</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Carrier</span>
                              <span className="font-medium">{order.tracking.carrier}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Tracking Number</span>
                              <Button variant="link" className="h-auto p-0 gap-2">
                                {order.tracking.number}
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Status</span>
                              <span className="font-medium">{order.tracking.status}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {order.status === 'Delivered' ? 'Delivered On' : 'Estimated Delivery'}
                              </span>
                              <span className="font-medium">
                                {order.status === 'Delivered' 
                                  ? new Date(order.tracking.deliveredDate).toLocaleDateString()
                                  : new Date(order.tracking.estimatedDelivery).toLocaleDateString()
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-6 pt-6 border-t">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {order.tracking.location}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}