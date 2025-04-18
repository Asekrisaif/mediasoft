"use client"

import { useState } from 'react'
import { useUserStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { CreditCard, Plus, Trash2, Shield, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function PaymentMethodsPage() {
    const { user } = useUserStore()
    const [showAddCard, setShowAddCard] = useState(false)
    const [newCard, setNewCard] = useState({
        number: '',
        name: '',
        expMonth: '',
        expYear: '',
        cvc: ''
    })

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle card addition logic here
        setShowAddCard(false)
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar />

                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">Payment Methods</h1>
                                <p className="text-muted-foreground mt-1">
                                    Manage your payment methods and billing information
                                </p>
                            </div>
                            <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Payment Method
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Payment Method</DialogTitle>
                                        <DialogDescription>
                                            Add a new credit or debit card to your account
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddCard} className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cardNumber">Card Number</Label>
                                            <Input
                                                id="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={newCard.number}
                                                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cardName">Name on Card</Label>
                                            <Input
                                                id="cardName"
                                                placeholder="John Doe"
                                                value={newCard.name}
                                                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expMonth">Month</Label>
                                                <Select
                                                    value={newCard.expMonth}
                                                    onValueChange={(value) => setNewCard({ ...newCard, expMonth: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="MM" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                            <SelectItem
                                                                key={month}
                                                                value={month.toString().padStart(2, '0')}
                                                            >
                                                                {month.toString().padStart(2, '0')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="expYear">Year</Label>
                                                <Select
                                                    value={newCard.expYear}
                                                    onValueChange={(value) => setNewCard({ ...newCard, expYear: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="YYYY" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                                                            <SelectItem
                                                                key={year}
                                                                value={year.toString()}
                                                            >
                                                                {year}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvc">CVC</Label>
                                                <Input
                                                    id="cvc"
                                                    placeholder="123"
                                                    value={newCard.cvc}
                                                    onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Button type="submit" className="w-full">Add Card</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user?.paymentMethods?.map((method, index) => (
                                <motion.div
                                    key={method.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <Card className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg">
                                                    <CreditCard className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium capitalize">{method.brand}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        •••• {method.last4}
                                                    </p>
                                                </div>
                                            </div>
                                            {method.isDefault && (
                                                <Badge variant="secondary">Default</Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <p className="text-sm text-muted-foreground">
                                                Expires {method.expiryMonth}/{method.expiryYear}
                                            </p>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Secure Payment Processing</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your payment information is encrypted and secure
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-1 shrink-0" />
                                    <p>We never store your full card details</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-1 shrink-0" />
                                    <p>All transactions are processed through secure payment gateways</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-1 shrink-0" />
                                    <p>Your card information is encrypted using industry-standard SSL/TLS encryption</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}