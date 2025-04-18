"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Users,
  Package,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
]

const revenueData = [
  { name: 'Jan', revenue: 5000 },
  { name: 'Feb', revenue: 4600 },
  { name: 'Mar', revenue: 6800 },
  { name: 'Apr', revenue: 7200 },
  { name: 'May', revenue: 8900 },
  { name: 'Jun', revenue: 9100 },
]

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Fashion', value: 300 },
  { name: 'Home', value: 300 },
  { name: 'Sports', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const recentOrders = [
  {
    id: 'ORD001',
    customer: 'John Doe',
    product: 'Gaming Laptop',
    amount: 1299.99,
    status: 'Completed',
  },
  {
    id: 'ORD002',
    customer: 'Jane Smith',
    product: 'Wireless Headphones',
    amount: 199.99,
    status: 'Processing',
  },
  {
    id: 'ORD003',
    customer: 'Mike Johnson',
    product: 'Smart Watch',
    amount: 299.99,
    status: 'Pending',
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'admin est connecté
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      router.push('/admin/login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <div className="flex">
        <AdminSidebar />

        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground">
                Welcome back, Administrator
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Déconnexion
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">2,453</h3>
                <span className="text-xs text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  12%
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">1,879</h3>
                <span className="text-xs text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  8%
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">$89,432</h3>
                <span className="text-xs text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  15%
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <TrendingUp className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">23</h3>
                <span className="text-xs text-red-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3" />
                  5%
                </span>
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Sales Overview</h3>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Revenue Trends</h3>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="mb-8">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Orders</h3>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search orders..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.product}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${order.amount}</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Sales by Category</h3>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {categoryData.map((category, index) => (
                <div key={category.name} className="text-center">
                  <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: COLORS[index] }} />
                  <p className="text-sm font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.value} sales</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}