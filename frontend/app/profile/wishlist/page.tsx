"use client"

import { useState } from 'react'
import { useUserStore } from '@/lib/store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProfileSidebar } from '@/components/profile-sidebar'
import { Heart, Trash2, ShoppingCart, Share2, Star, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Mock wishlist data
const wishlistItems = [
    {
        id: 1,
        name: "Quantum X Pro Gaming Laptop",
        price: 2499.99,
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800",
        category: "Laptops",
        rating: 4.8,
        reviews: 124,
        stock: 15,
        addedDate: "2024-03-15",
    },
    {
        id: 2,
        name: "Neural GPU 32GB",
        price: 1999.99,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
        category: "Components",
        rating: 4.9,
        reviews: 89,
        stock: 3,
        addedDate: "2024-03-10",
    },
]

export default function WishlistPage() {
    const [items, setItems] = useState(wishlistItems)
    const { user } = useUserStore()

    const removeFromWishlist = (id: number) => {
        setItems(items.filter(item => item.id !== id))
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 pt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar />

                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">My Wishlist</h1>
                                <p className="text-muted-foreground mt-1">
                                    {items.length} items saved
                                </p>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/store">
                                    Continue Shopping
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        {items.length > 0 ? (
                            <div className="space-y-6">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <Card className="p-6">
                                            <div className="flex gap-6">
                                                <div className="w-40 h-40 overflow-hidden rounded-xl bg-black/5 backdrop-blur-xl">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                                                            <Badge variant="secondary" className="mb-2">
                                                                {item.category}
                                                            </Badge>
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <div className="flex items-center">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            className={`h-4 w-4 ${
                                                                                star <= item.rating
                                                                                    ? "fill-yellow-500 text-yellow-500"
                                                                                    : "text-gray-300"
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                    <span className="ml-2 text-sm">{item.rating}</span>
                                                                </div>
                                                                <span className="text-sm text-muted-foreground">
                                  ({item.reviews} reviews)
                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-2xl font-bold">${item.price}</p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Heart className="h-4 w-4" />
                                                            Added on {new Date(item.addedDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm">
                                                                <Share2 className="h-4 w-4 mr-2" />
                                                                Share
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => removeFromWishlist(item.id)}>
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Remove
                                                            </Button>
                                                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                                Add to Cart
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 text-center">
                                <div className="mb-6 mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                                    <Heart className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                                <p className="text-muted-foreground mb-6">
                                    Start adding items to your wishlist while browsing our store
                                </p>
                                <Button asChild>
                                    <Link href="/store">
                                        Browse Products
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}