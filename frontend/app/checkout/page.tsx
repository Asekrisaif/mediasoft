"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, useUserStore, useCheckoutStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import {
  CreditCard,
  Truck,
  Package,
  Gift,
  ChevronRight,
  Plus,
  MapPin,
  Shield,
  AlertCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, getTotalPoints, clearCart } = useCartStore()
  const { isAuthenticated, user } = useUserStore()
  const { state, setAddress, setPaymentMethod, setPointsToRedeem, setNotes, reset } = useCheckoutStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showNewAddressDialog, setShowNewAddressDialog] = useState(false)
  const [showNewPaymentDialog, setShowNewPaymentDialog] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  })
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=/checkout')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const subtotal = getTotalPrice()
  const pointsEarned = getTotalPoints()
  const shipping = subtotal > 100 ? 0 : 5.99
  const pointsValue = state.pointsToRedeem * 0.01 // Each point is worth $0.01
  const total = subtotal + shipping - pointsValue

  const handleAddAddress = () => {
    // In a real app, this would make an API call
    const id = Math.random().toString(36).substr(2, 9)
    const address = {
      id,
      ...newAddress,
      isDefault: false,
    }
    setAddress(address)
    setShowNewAddressDialog(false)
    toast.success('Address added successfully')
  }

  const handleAddPayment = () => {
    // In a real app, this would make a Stripe API call
    const id = Math.random().toString(36).substr(2, 9)
    const paymentMethod = {
      id,
      type: 'card' as const,
      last4: newPayment.cardNumber.slice(-4),
      brand: 'visa',
      expiryMonth: parseInt(newPayment.expiryMonth),
      expiryYear: parseInt(newPayment.expiryYear),
      isDefault: false,
    }
    setPaymentMethod(paymentMethod)
    setShowNewPaymentDialog(false)
    toast.success('Payment method added successfully')
  }

  const handleCheckout = async () => {
    if (!state.address) {
      toast.error('Please select a shipping address')
      return
    }

    if (!state.paymentMethod) {
      toast.error('Please select a payment method')
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would:
      // 1. Create a Stripe payment intent
      // 2. Submit the order to your backend
      // 3. Handle points redemption
      // 4. Clear the cart on success
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success('Order placed successfully!')
      clearCart()
      reset()
      router.push('/profile/orders')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold">Shipping Address</h2>
                  </div>
                  <Dialog open={showNewAddressDialog} onOpenChange={setShowNewAddressDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                        <DialogDescription>
                          Enter your shipping address details below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={newAddress.name}
                              onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              value={newAddress.zipCode}
                              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              value={newAddress.country}
                              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddAddress}>Add Address</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <RadioGroup
                  value={state.address?.id}
                  onValueChange={(value) => {
                    const address = user.addresses?.find(addr => addr.id === value)
                    if (address) setAddress(address)
                  }}
                  className="space-y-4"
                >
                  {user.addresses?.map((address) => (
                    <div
                      key={address.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border ${
                        state.address?.id === address.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={address.id}
                            className="font-medium cursor-pointer"
                          >
                            {address.name}
                          </label>
                          {address.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {address.street}
                          <br />
                          {address.city}, {address.state} {address.zipCode}
                          <br />
                          {address.country}
                          <br />
                          {address.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold">Payment Method</h2>
                  </div>
                  <Dialog open={showNewPaymentDialog} onOpenChange={setShowNewPaymentDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                          Enter your card details below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="4242 4242 4242 4242"
                            value={newPayment.cardNumber}
                            onChange={(e) => setNewPayment({ ...newPayment, cardNumber: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryMonth">Month</Label>
                            <Select
                              value={newPayment.expiryMonth}
                              onValueChange={(value) => setNewPayment({ ...newPayment, expiryMonth: value })}
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
                            <Label htmlFor="expiryYear">Year</Label>
                            <Select
                              value={newPayment.expiryYear}
                              onValueChange={(value) => setNewPayment({ ...newPayment, expiryYear: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="YY" />
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
                              value={newPayment.cvc}
                              onChange={(e) => setNewPayment({ ...newPayment, cvc: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddPayment}>Add Card</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <RadioGroup
                  value={state.paymentMethod?.id}
                  onValueChange={(value) => {
                    const method = user.paymentMethods?.find(m => m.id === value)
                    if (method) setPaymentMethod(method)
                  }}
                  className="space-y-4"
                >
                  {user.paymentMethods?.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border ${
                        state.paymentMethod?.id === method.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={method.id}
                            className="font-medium cursor-pointer flex items-center gap-2"
                          >
                            <span className="capitalize">{method.brand}</span>
                            <span className="text-muted-foreground">
                              •••• {method.last4}
                            </span>
                          </label>
                          {method.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </Card>

              {/* Order Notes */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold">Order Notes</h2>
                </div>
                <Textarea
                  placeholder="Add any special instructions for your order..."
                  value={state.notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                />
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium line-clamp-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-medium mt-1">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        <span>${shipping.toFixed(2)}</span>
                      )}
                    </div>
                    {state.pointsToRedeem > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Points Discount</span>
                        <span>-${pointsValue.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {/* Points Section */}
                  <div className="bg-primary/5 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Reward Points</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Available Points</span>
                        <span>{user.points}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Points to Earn</span>
                        <span>+{pointsEarned}</span>
                      </div>
                      
                      <div className="pt-2">
                        <Label htmlFor="redeemPoints" className="text-xs">
                          Redeem Points (max: {Math.min(user.points || 0, total * 100)})
                        </Label>
                        <Input
                          id="redeemPoints"
                          type="number"
                          min="0"
                          max={Math.min(user.points || 0, total * 100)}
                          value={state.pointsToRedeem}
                          onChange={(e) => setPointsToRedeem(Math.min(
                            parseInt(e.target.value) || 0,
                            Math.min(user.points || 0, total * 100)
                          ))}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {state.pointsToRedeem} points = ${(state.pointsToRedeem * 0.01).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          Place Order
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </div>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Secure checkout powered by Stripe</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}